'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, X, AlertCircle, UploadCloud } from 'lucide-react';
import Breadcrumbs, {
  breadcrumbItemsType,
} from '@/components/navigations/Breadcrumb';
import { createNewCarAction } from '@/actions/new-cars.action';
import type { ApiNewCar } from '@/types/api.type';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 2;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Format file tidak didukung. Gunakan JPG, PNG, atau WEBP.';
  }
  if (file.size > MAX_SIZE_BYTES) {
    return `Ukuran file terlalu besar. Maksimal ${MAX_SIZE_MB}MB.`;
  }
  return null;
}

const breadcrumbItems: breadcrumbItemsType[] = [
  { label: 'New Cars Management', href: '/admin/new-cars' },
  { label: 'Add New Car' },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 2009 }, (_, i) =>
  (currentYear - i).toString(),
);

export default function AddNewCarView() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [successCar, setSuccessCar] = useState<ApiNewCar | null>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const validationError = validateImageFile(file);
    if (validationError) {
      setImageError(validationError);
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

    if (!imageFile) {
      setImageError('Foto kendaraan wajib diunggah.');
      return;
    }

    const formData = new FormData(formRef.current!);
    formData.set('imageCar', imageFile);

    startTransition(async () => {
      const result = await createNewCarAction(formData);
      if (result.success) {
        setSuccessCar(result.data);
      } else {
        setError(result.error.message);
      }
    });
  }

  function handleAddAnother() {
    setSuccessCar(null);
    setError(null);
    setImageFile(null);
    setImagePreview(null);
    setImageError(null);
    formRef.current?.reset();
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm">
        <Breadcrumbs breadcrumItems={breadcrumbItems} />
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-7xl flex-1 py-8">
        {/* Title */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Add New Car</h1>
            <p className="mt-2 text-sm text-slate-500">
              Isi form berikut untuk menambahkan data mobil baru ke inventaris.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-xl border border-slate-300 px-6 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="add-new-car-form"
              disabled={isPending}
              className="rounded-xl bg-primary px-6 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {isPending ? 'Menyimpan...' : 'Save Car'}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span className="flex-1">{error}</span>
            <button
              onClick={() => setError(null)}
              className="shrink-0 hover:opacity-70"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Form */}
        <form id="add-new-car-form" ref={formRef} onSubmit={handleSubmit}>
          <div className="grid grid-cols-12 gap-6">
            {/* LEFT */}
            <div className="col-span-12 space-y-6 lg:col-span-8">
              {/* General Information */}
              <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
                <h2 className="mb-6 text-lg font-semibold">
                  General Information
                </h2>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Field label="Brand">
                    <input
                      name="brand"
                      type="text"
                      placeholder="Toyota"
                      required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary"
                    />
                  </Field>

                  <Field label="Model">
                    <input
                      name="model"
                      type="text"
                      placeholder="Fortuner 2.4 VRZ"
                      required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary"
                    />
                  </Field>

                  <Field label="Year">
                    <select
                      name="year"
                      required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary"
                    >
                      {years.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Price (Rp)">
                    <input
                      name="price"
                      type="number"
                      placeholder="550000000"
                      min={1}
                      required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary"
                    />
                  </Field>

                  <div className="md:col-span-2">
                    <label className="mb-3 block text-sm font-medium text-slate-600">
                      Status
                    </label>
                    <div className="flex flex-wrap gap-4">
                      <RadioCard
                        label="Active"
                        name="is_active"
                        value="true"
                        defaultChecked
                      />
                      <RadioCard
                        label="Inactive"
                        name="is_active"
                        value="false"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Technical Specifications */}
              <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
                <h2 className="mb-6 text-lg font-semibold">
                  Technical Specifications
                </h2>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <Field label="Engine Capacity (CC)">
                    <input
                      name="engine_capacity"
                      type="number"
                      placeholder="2400"
                      min={1}
                      required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary"
                    />
                  </Field>

                  <Field label="Seat Capacity">
                    <input
                      name="seat_capacity"
                      type="number"
                      placeholder="7"
                      min={1}
                      required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary"
                    />
                  </Field>

                  <Field label="Fuel Efficiency (L/100km)">
                    <input
                      name="fuel_efficiency"
                      type="number"
                      placeholder="10.5"
                      step="0.1"
                      min={0.1}
                      required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary"
                    />
                  </Field>

                  <Field label="Transmission">
                    <select
                      name="transmission"
                      required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary"
                    >
                      <option value="automatic">Automatic</option>
                      <option value="manual">Manual</option>
                    </select>
                  </Field>

                  <Field label="Fuel Type">
                    <select
                      name="fuel_type"
                      required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary"
                    >
                      <option value="gasoline">Gasoline</option>
                      <option value="diesel">Diesel</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="electric">Electric</option>
                    </select>
                  </Field>

                  <Field label="Color">
                    <input
                      name="color"
                      type="text"
                      placeholder="Silver"
                      required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary"
                    />
                  </Field>
                </div>
              </section>

              {/* Description */}
              <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
                <h2 className="mb-6 text-lg font-semibold">
                  Vehicle Description
                </h2>

                <textarea
                  name="description"
                  rows={6}
                  placeholder="Deskripsikan spesifikasi dan keunggulan kendaraan..."
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-primary"
                />
              </section>
            </div>

            {/* RIGHT */}
            <div className="col-span-12 space-y-6 lg:col-span-4">
              {/* Upload Photo */}
              <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
                <h2 className="mb-1 text-lg font-semibold">Vehicle Photo</h2>
                <p className="mb-4 text-xs text-slate-500">
                  JPG, PNG, WEBP — maks. {MAX_SIZE_MB}MB
                </p>

                <label
                  htmlFor="imageCar"
                  className={`flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition hover:bg-slate-50 ${
                    imageError
                      ? 'border-red-400 bg-red-50'
                      : imageFile
                        ? 'border-green-400 bg-green-50'
                        : 'border-slate-300'
                  }`}
                >
                  <UploadCloud
                    size={32}
                    className={imageFile ? 'text-green-500' : 'text-slate-400'}
                  />
                  {imageFile ? (
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium text-slate-700 break-all">
                        {imageFile.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {(imageFile.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-600">
                        Klik untuk pilih file
                      </p>
                      <p className="text-xs text-slate-400">
                        atau seret & lepas di sini
                      </p>
                    </div>
                  )}
                  <input
                    id="imageCar"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>

                {imageError && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-red-600">
                    <AlertCircle size={14} className="shrink-0" />
                    {imageError}
                  </div>
                )}

                {imagePreview && !imageError && (
                  <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full object-cover"
                    />
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
              <h2 className="text-xl font-bold text-slate-900">
                Mobil Baru Berhasil Ditambahkan!
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                <span className="font-semibold text-slate-700">
                  {successCar.brand} {successCar.model} {successCar.year}
                </span>{' '}
                telah berhasil ditambahkan ke inventaris.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleAddAnother}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Tambah Mobil Lagi
              </button>
              <button
                onClick={() => {
                  router.push('/admin/new-cars');
                  router.refresh();
                }}
                className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                Lihat Daftar Mobil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type FieldProps = {
  label: string;
  children: React.ReactNode;
};

function Field({ label, children }: FieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-600">
        {label}
      </label>
      {children}
    </div>
  );
}

type RadioCardProps = {
  label: string;
  name: string;
  value: string;
  defaultChecked?: boolean;
};

function RadioCard({ label, name, value, defaultChecked }: RadioCardProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-300 px-4 py-3">
      <input
        type="radio"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
      />
      <span>{label}</span>
    </label>
  );
}
