<?php

namespace App\Services;

use App\Models\Attendance;
use Illuminate\Http\Request;
use \Illuminate\Pagination\LengthAwarePaginator;
use \Carbon\Carbon;
use \Carbon\CarbonPeriod;

class AttendanceService
{
    public function getPaginatedAttendances(Request $request)
    {
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);
        $startDate = $request->input('start_date', now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->format('Y-m-d'));

        // Fallback for single date filter
        if ($request->has('date') && !$request->has('start_date')) {
            $startDate = $request->input('date');
            $endDate = $request->input('date');
        }

        // Base query for Attendances within the date range
        $attendancesBaseQuery = Attendance::query()
            ->whereBetween('attendanceCreatedAt', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);

        if ($search) {
            $attendancesBaseQuery->where('attendanceEmail', 'ILIKE', "%{$search}%");
        }

        // Paginate distinct emails properly to avoid Laravel's aggregate count issues
        $page = $request->input('page', 1);
        
        $allUniqueEmails = (clone $attendancesBaseQuery)
            ->select('attendanceEmail')
            ->distinct()
            ->pluck('attendanceEmail');
            
        $totalUniqueEmails = $allUniqueEmails->count();
        $emails = $allUniqueEmails->slice(($page - 1) * $perPage, $perPage)->values()->toArray();

        $paginatedEmails = new LengthAwarePaginator(
            $emails,
            $totalUniqueEmails,
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        // Query Attendances details for these emails
        $attendances = Attendance::query()
            ->whereIn('attendanceEmail', $emails)
            ->whereBetween('attendanceCreatedAt', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->orderBy('attendanceCreatedAt', 'asc')
            ->get();

        $data = [];

        foreach ($emails as $email) {
            $employeeAttendances = $attendances->where('attendanceEmail', $email);
            
            $groupedByDate = $employeeAttendances->groupBy(function ($item) {
                return Carbon::parse($item->attendanceCreatedAt)->format('Y-m-d');
            });

            $attendanceDetails = [];
            $totalPresent = 0;
            $totalLate = 0;
            $totalAbsent = 0;
            $totalWorkingSeconds = 0;

            $period = CarbonPeriod::create($startDate, $endDate);
            
            foreach ($period as $dateObj) {
                $isWeekend = $dateObj->isWeekend();
                $dateStr = $dateObj->format('Y-m-d');
                $dayRecords = $groupedByDate->get($dateStr);
                
                if (!$dayRecords) {
                    if (!$isWeekend) {
                        $totalAbsent++;
                    }
                    continue;
                }

                $totalPresent++;
                
                // Get checkIn and checkOut
                $checkInRecord = $dayRecords->where('attendanceDescription', 'checkin')->first();
                $checkOutRecord = $dayRecords->where('attendanceDescription', 'checkout')->last();
                
                if (!$checkInRecord) {
                    $checkInRecord = $dayRecords->first();
                }
                if (!$checkOutRecord || $checkOutRecord->id === $checkInRecord->id) {
                    $checkOutRecord = $dayRecords->count() > 1 ? $dayRecords->last() : null;
                }

                $checkInTime = \Carbon\Carbon::parse($checkInRecord->attendanceCreatedAt);
                
                $isLate = false;
                if ($checkInTime->format('H:i:s') > '08:00:00') {
                    $isLate = true;
                    $totalLate++;
                }

                $workingHoursStr = "00:00:00";
                
                if ($checkInRecord && $checkOutRecord) {
                    $checkOutTime = Carbon::parse($checkOutRecord->attendanceCreatedAt);
                    // Ensure difference is always absolute positive seconds
                    $diffSeconds = abs($checkOutTime->getTimestamp() - $checkInTime->getTimestamp());
                    $totalWorkingSeconds += $diffSeconds;
                    
                    $h = floor($diffSeconds / 3600);
                    $m = floor(($diffSeconds % 3600) / 60);
                    $s = $diffSeconds % 60;
                    $workingHoursStr = sprintf('%02d:%02d:%02d', $h, $m, $s);
                }

                $attendanceDetails[] = [
                    'date' => $dateStr,
                    'status' => 'present',
                    'isLate' => $isLate,
                    'workingHours' => $workingHoursStr,
                    'details' => [
                        'checkIn' => $checkInRecord ? [
                            'id' => $checkInRecord->id,
                            'time' => $checkInTime->toIso8601String(),
                            'location' => $checkInRecord->attendanceLocation,
                        ] : null,
                        'checkOut' => $checkOutRecord ? [
                            'id' => $checkOutRecord->id,
                            'time' => Carbon::parse($checkOutRecord->attendanceCreatedAt)->toIso8601String(),
                            'location' => $checkOutRecord->attendanceLocation,
                        ] : null,
                    ]
                ];
            }

            $totalH = floor($totalWorkingSeconds / 3600);
            $totalM = floor(($totalWorkingSeconds % 3600) / 60);
            $totalS = $totalWorkingSeconds % 60;

            $latestAttendance = $employeeAttendances->last();

            $data[] = [
                'user' => [
                    'id' => md5($email),
                    'name' => explode('@', $email)[0],
                    'email' => $email,
                    'location' => $latestAttendance ? $latestAttendance->attendanceLocation : 'N/A',
                ],
                'summary' => [
                    'totalPresent' => $totalPresent,
                    'totalLate' => $totalLate,
                    'totalAbsent' => $totalAbsent,
                    'totalWorkingHours' => sprintf('%02d:%02d:%02d', $totalH, $totalM, $totalS),
                ],
                'attendance' => $attendanceDetails,
            ];
        }

        return [
            'statusCode' => 200,
            'message' => 'Rekapitulasi data absensi berhasil dimuat.',
            'meta' => [
                'period' => [
                    'startDate' => $startDate,
                    'endDate' => $endDate,
                ],
                'totalUsersFetched' => count($data),
                'pagination' => [
                    'total' => $paginatedEmails->total(),
                    'per_page' => $paginatedEmails->perPage(),
                    'current_page' => $paginatedEmails->currentPage(),
                    'from' => $paginatedEmails->firstItem(),
                    'to' => $paginatedEmails->lastItem(),
                    'links' => $paginatedEmails->linkCollection()->toArray(),
                ],
            ],
            'data' => $data,
        ];
    }

    public function delete(Attendance $attendance)
    {
        return $attendance->delete();
    }
}
