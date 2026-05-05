import React, { useEffect, useRef } from 'react';
import $ from 'jquery';
import select2 from 'select2';
import 'select2/dist/css/select2.css';

if (typeof $.fn.select2 === 'undefined') {
    (select2 as any)(window, $);
}

export default function Select2({ options, value, onChange, placeholder, disabled, multiple = false }: any) {
    const selectRef = useRef<HTMLSelectElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

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
                    // Krusial: Agar dropdown tetap di dalam layer Modal Radix/Shadcn
                    dropdownParent: $(containerRef.current!)
                });

                ($el as any).val(value).trigger('change.select2');

                ($el as any).on('change.select2', (e: any) => {
                    const selectedData = $(e.target).val();
                    if (multiple) {
                        const numericValues = Array.isArray(selectedData)
                            ? selectedData.map((v: string) => parseInt(v))
                            : [];
                        onChange(numericValues);
                    } else {
                        onChange(selectedData ? parseInt(selectedData) : null);
                    }
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
    // Re-init hanya jika struktur fundamental berubah
    }, [multiple, placeholder]);

    // Sinkronisasi Prop ke DOM (Mencegah Infinite Loop)
    useEffect(() => {
        const $el = $(selectRef.current!);
        const currentValue = $el.val();
        // Hanya trigger jika benar-benar berbeda secara konten
        if (JSON.stringify(currentValue) !== JSON.stringify(value)) {
            $el.val(value).trigger('change.select2');
        }
    }, [value]);

    return (
        <div ref={containerRef} className="select2-wrapper w-full relative">
            <select ref={selectRef} disabled={disabled} multiple={multiple} className="w-full" />
        </div>
    );
}
