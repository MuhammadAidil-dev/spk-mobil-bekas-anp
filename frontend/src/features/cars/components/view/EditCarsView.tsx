'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, X, AlertCircle, UploadCloud } from 'lucide-react';
import Breadcrumbs, { breadcrumbItemsType } from '@/components/navigations/Breadcrumb';
import { updateCarAction } from '@/actions/cars.action';
import { getCarImageUrl } from '@/lib/api';
import type { ApiCar } from '@/types/api.type';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 2;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type))
    return 'Format file tidak didukung. Gunakan JPG, PNG, atau WEBP.';
  if (file.size > MAX_SIZE_BYTES)
    return `Ukuran file terlalu besar. Maksimal ${MAX_SIZE_MB}MB.`;
  return null;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 2009 }, (_, i) =>
  (currentYear - i).toString(),
);

interface EditCarsViewProps {
  car: ApiCar;
}

export default function EditCarsView({ car }: EditCarsViewProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [successCar, setSuccessCar] = useState<ApiCar | null>(null);

  const breadcrumbItems: breadcrumbItemsType[] = [
    { label: 'Cars Management', href: '/admin/cars' },
    { label: `${car.brand} ${car.model}`, href: `/admin/cars/${car._id}` },
    { label: 'Edit' },
  ];

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateImageFile(file);
    if (err) {
      setImageError(err);
      setImageFile(null);
      setImagePreview(null);
      e.target.value = '';
      return;
    }
    setImageError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(formRef.current!);
    if (imageFile) {
      formData.set('imageCar', imageFile);
    } else {
      formData.set('image_url', car.image_url ?? '');
    }

    startTransition(async () => {
      const result = await updateCarAction(car._id, formData);
      if (result.success) {
        setSuccessCar(result.data);
      } else {
        setError(result.error.message);
      }
    });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex items-center gap-2 text-sm">
        <Breadcrumbs breadcrumItems={breadcrumbItems} />
      </div>

      <div className="mx-auto w-full max-w-7xl flex-1 py-8">
        {/* Title */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Edit Mobil Bekas</h1>
            <p className="mt-2 text-sm text-slate-500">
              Perbarui informasi{' '}
              <span className="font-medium">
                {car.brand} {car.model} {car.year}
              </span>
              .
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-xl border border-slate-300 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              form="edit-car-form"
              disabled={isPending}
              className="rounded-xl bg-primary px-6 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)} className="shrink-0 hover:opacity-70">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Form */}
        <form id="edit-car-form" ref={formRef} onSubmit={handleSubmit}>
          <div className="grid grid-cols-12 gap-6">
            {/* LEFT */}
            <div className="col-span-12 space-y-6 lg:col-span-8">
              {/* General Information */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="mb-6 text-lg font-semibold">General Information</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Field label="Brand">
                    <input name="brand" type="text" defaultValue={car.brand} required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary" />
                  </Field>

                  <Field label="Model">
                    <input name="model" type="text" defaultValue={car.model} required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary" />
                  </Field>

                  <Field label="Year">
                    <select name="year" defaultValue={String(car.year)} required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary">
                      {years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Price (Rp)">
                    <input name="price" type="number" defaultValue={car.price} min={0} required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary" />
                  </Field>

                  <Field label="Plate Region">
                    <input name="plate_region" type="text" defaultValue={car.plate_region ?? ''}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary" />
                  </Field>

                  <div className="md:col-span-2">
                    <label className="mb-3 block text-sm font-medium text-slate-600">Status</label>
                    <div className="flex flex-wrap gap-4">
                      <RadioCard label="Active" name="is_active" value="true" defaultChecked={car.is_active} />
                      <RadioCard label="Inactive" name="is_active" value="false" defaultChecked={!car.is_active} />
                    </div>
                  </div>
                </div>
              </section>

              {/* Technical Specifications */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="mb-6 text-lg font-semibold">Technical Specifications</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <Field label="Mileage (KM)">
                    <input name="mileage" type="number" defaultValue={car.mileage} min={0} required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary" />
                  </Field>

                  <Field label="Engine Capacity (CC)">
                    <input name="engine_capacity" type="number" defaultValue={car.engine_capacity} min={0} required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary" />
                  </Field>

                  <Field label="Seat Capacity">
                    <input name="seat_capacity" type="number" defaultValue={car.seat_capacity} min={1} required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary" />
                  </Field>

                  <Field label="Transmission">
                    <select name="transmission" defaultValue={car.transmission} required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary">
                      <option value="automatic">Automatic</option>
                      <option value="manual">Manual</option>
                    </select>
                  </Field>

                  <Field label="Fuel Type">
                    <select name="fuel_type" defaultValue={car.fuel_type} required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary">
                      <option value="gasoline">Gasoline</option>
                      <option value="diesel">Diesel</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="electric">Electric</option>
                    </select>
                  </Field>

                  <Field label="Color">
                    <input name="color" type="text" defaultValue={car.color} required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary" />
                  </Field>
                </div>
              </section>

              {/* Description */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="mb-6 text-lg font-semibold">Vehicle Description</h2>
                <textarea name="description" rows={6} defaultValue={car.description} required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary" />
              </section>
            </div>

            {/* RIGHT */}
            <div className="col-span-12 space-y-6 lg:col-span-4">
              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="mb-1 text-lg font-semibold">Vehicle Photo</h2>
                <p className="mb-4 text-xs text-slate-500">
                  Kosongkan untuk mempertahankan foto saat ini. JPG, PNG, WEBP — maks. {MAX_SIZE_MB}MB.
                </p>

                {car.image_url && !imagePreview && (
                  <div className="mb-4 overflow-hidden rounded-xl border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={getCarImageUrl(car.image_url)} alt="Current" className="w-full object-cover" />
                    <p className="bg-slate-50 px-3 py-1.5 text-center text-xs text-slate-400">Foto saat ini</p>
                  </div>
                )}

                <label htmlFor="imageCarEdit"
                  className={`flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-6 text-center transition hover:bg-slate-50 ${
                    imageError ? 'border-red-400 bg-red-50' : imageFile ? 'border-green-400 bg-green-50' : 'border-slate-300'
                  }`}>
                  <UploadCloud size={28} className={imageFile ? 'text-green-500' : 'text-slate-400'} />
                  {imageFile ? (
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium text-slate-700 break-all">{imageFile.name}</p>
                      <p className="text-xs text-slate-400">{(imageFile.size / 1024).toFixed(0)} KB</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-600">Ganti foto</p>
                      <p className="text-xs text-slate-400">Klik untuk pilih file baru</p>
                    </div>
                  )}
                  <input id="imageCarEdit" type="file" accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden" onChange={handleImageChange} />
                </label>

                {imageError && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-red-600">
                    <AlertCircle size={14} className="shrink-0" />{imageError}
                  </div>
                )}

                {imagePreview && !imageError && (
                  <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview} alt="Preview" className="w-full object-cover" />
                    <button type="button"
                      onClick={() => { setImageFile(null); setImagePreview(null); }}
                      className="flex w-full items-center justify-center gap-1 bg-slate-50 py-1.5 text-xs text-slate-500 hover:text-red-500">
                      <X size={12} /> Batalkan ganti foto
                    </button>
                  </div>
                )}
              </section>
            </div>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {successCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 size={36} className="text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Perubahan Tersimpan!</h2>
              <p className="mt-2 text-sm text-slate-500">
                <span className="font-semibold text-slate-700">
                  {successCar.brand} {successCar.model} {successCar.year}
                </span>{' '}
                berhasil diperbarui.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => router.push(`/admin/cars/${car._id}`)}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                Lihat Detail
              </button>
              <button
                onClick={() => { router.push('/admin/cars'); router.refresh(); }}
                className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white transition hover:opacity-90">
                Kembali ke Daftar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-600">{label}</label>
      {children}
    </div>
  );
}

function RadioCard({ label, name, value, defaultChecked }: {
  label: string; name: string; value: string; defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-300 px-4 py-3">
      <input type="radio" name={name} value={value} defaultChecked={defaultChecked} />
      <span>{label}</span>
    </label>
  );
}
