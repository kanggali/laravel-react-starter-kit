<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use App\Http\Requests\Configuration\Menu\StoreMenuRequest;
use App\Http\Requests\Configuration\Menu\UpdateMenuRequest;
use App\Models\Configuration\Menu;
use App\Services\MenuService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MenuController extends Controller
{

    protected MenuService $menuService;

    public function __construct(MenuService $menuService)
    {
        $this->menuService = $menuService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('configuration/menu/index', [
            'menus' => $this->menuService->getPaginatedMenus($request),
            'filters' => $request->only(['search', 'per_page']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMenuRequest $request)
    {
        Menu::create($request->validated());

        return back()->with('success', 'Menu created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Menu $menu)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Menu $menu)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMenuRequest $request, Menu $menu)
    {
        $menu->update($request->validated());

        return back()->with('success', 'Menu updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Menu $menu)
    {
        $this->menuService->deleteMenu($menu->id);
        return back()->with('success', 'Menu deleted successfully.');
    }
}
