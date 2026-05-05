// 1. Impor jQuery paling atas sesuai aturan linting
import $ from 'jquery';
import select2 from 'select2';
import 'select2/dist/css/select2.css';

// 2. Impor React setelah library pihak ketiga
import { useEffect, useRef } from 'react';

// Inisialisasi plugin
if (typeof $.fn.select2 === 'undefined') {
    (select2 as any)(window, $);
}

interface Select2Props {
    options: { id: number | string; text: string }[];
    value: any;
    onChange: (value: any) => void;
    placeholder?: string;
    disabled?: boolean;
    multiple?: boolean;
}

export default function Select2({
    options,
    value,
    onChange,
    placeholder,
    disabled,
    multiple = false
}: Select2Props) {
    const selectRef = useRef<HTMLSelectElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isProgrammaticUpdate = useRef(false);

    // Effect Utama: Inisialisasi
    useEffect(() => {
        const $el = $(selectRef.current!);

        const timeoutId = setTimeout(() => {
            if (typeof ($el as any).select2 === 'function') {
                ($el as any).select2({
                    placeholder,
                    width: '100%',
                    multiple,
                    allowClear: true,
                    data: options,
                    dropdownParent: $('body')
                });

                // Set nilai awal
                isProgrammaticUpdate.current = true;
                ($el as any).val(value).trigger('change.select2');
                isProgrammaticUpdate.current = false;

                ($el as any).on('change.select2', (e: any) => {
                    if (isProgrammaticUpdate.current) return;

                    const selectedData = $(e.target).val();
                    const result = multiple
                        ? (Array.isArray(selectedData) ? selectedData.map((v: string) => parseInt(v)) : [])
                        : (selectedData ? parseInt(selectedData) : null);

                    onChange(result);
                });
            }
        }, 0);

        return () => {
            clearTimeout(timeoutId);
            ($el as any).off('change.select2');
            if (typeof ($el as any).select2 === 'function') {
                ($el as any).select2('destroy');
            }
        };
        // Menambahkan dependensi yang diminta linter
    }, [multiple, placeholder, options, onChange]);

    // Effect Sinkronisasi: Update dari Parent
    useEffect(() => {
        const $el = $(selectRef.current!);
        if (typeof ($el as any).select2 === 'function') {
            const currentValue = ($el as any).val();

            if (JSON.stringify(currentValue) !== JSON.stringify(value)) {
                isProgrammaticUpdate.current = true;
                ($el as any).val(value).trigger('change.select2');
                isProgrammaticUpdate.current = false;
            }
        }
    }, [value]);

    return (
        <div ref={containerRef} className="select2-wrapper w-full relative">
            <select
                ref={selectRef}
                disabled={disabled}
                multiple={multiple}
                className="w-full"
            />
        </div>
    );
}
