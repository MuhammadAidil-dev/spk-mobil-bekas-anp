'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AlertCircle, SlidersHorizontal, X } from 'lucide-react';
import type { AnpPreference } from '@/types/api.type';

interface PreferenceFormProps {
  preference?: AnpPreference;
}

const formatRupiah = (value: string) => {
  const num = value.replace(/\D/g, '');
  return num ? Number(num).toLocaleString('id-ID') : '';
};

const parseRupiah = (value: string) => value.replace(/\D/g, '');

export default function PreferenceForm({ preference }: PreferenceFormProps) {
  const router = useRouter();

  const [minPrice, setMinPrice] = useState(
    preference?.minPrice ? String(preference.minPrice) : '',
  );
  const [maxPrice, setMaxPrice] = useState(
    preference?.maxPrice ? String(preference.maxPrice) : '',
  );
  const [minYear, setMinYear] = useState(
    preference?.minYear ? String(preference.minYear) : '',
  );
  const [maxYear, setMaxYear] = useState(
    preference?.maxYear ? String(preference.maxYear) : '',
  );

  const [formError, setFormError] = useState<string | null>(null);

  const hasActive = !!(preference?.minPrice || preference?.maxPrice || preference?.minYear || preference?.maxYear);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
      setFormError('Harga minimum tidak boleh lebih besar dari harga maksimum.');
      return;
    }
    if (minYear && maxYear && Number(minYear) > Number(maxYear)) {
      setFormError('Tahun minimum tidak boleh lebih besar dari tahun maksimum.');
      return;
    }
    setFormError(null);

    const params = new URLSearchParams();
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (minYear) params.set('minYear', minYear);
    if (maxYear) params.set('maxYear', maxYear);

    const query = params.size ? `?${params}` : '';
    router.push(`/recomendations${query}`);
  };

  const handleReset = () => {
    setMinPrice('');
    setMaxPrice('');
    setMinYear('');
    setMaxYear('');
    setFormError(null);
    router.push('/recomendations');
  };

  return (
    <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-primary" />
          <h2 className="font-semibold text-slate-800">Preferensi Pencarian</h2>
          {hasActive && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              Aktif
            </span>
          )}
        </div>
        {hasActive && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-500 transition"
          >
            <X size={12} />
            Reset filter
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {formError && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            <AlertCircle size={14} className="shrink-0" />
            {formError}
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Min Price */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Harga Minimum (Rp)
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Contoh: 50.000.000"
              value={formatRupiah(minPrice)}
              onChange={(e) => setMinPrice(parseRupiah(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Harga Maksimum (Rp)
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Contoh: 200.000.000"
              value={formatRupiah(maxPrice)}
              onChange={(e) => setMaxPrice(parseRupiah(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Min Year */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Tahun Minimum
            </label>
            <input
              type="number"
              min={1990}
              max={new Date().getFullYear()}
              placeholder="Contoh: 2015"
              value={minYear}
              onChange={(e) => setMinYear(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Max Year */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Tahun Maksimum
            </label>
            <input
              type="number"
              min={1990}
              max={new Date().getFullYear()}
              placeholder="Contoh: 2023"
              value={maxYear}
              onChange={(e) => setMaxYear(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="submit"
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            Terapkan Preferensi
          </button>
          {hasActive && (
            <p className="text-xs text-slate-500">
              Perhitungan ANP menggunakan data mobil yang sesuai preferensi
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
