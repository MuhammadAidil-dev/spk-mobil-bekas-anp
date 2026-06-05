'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Edit, Fuel, Gauge, Settings, Users, Droplets, Calendar, Tag, Palette } from 'lucide-react';
import { getCarImageUrl } from '@/lib/api';
import type { ApiNewCar } from '@/types/api.type';

interface AdminNewCarDetailViewProps {
  car: ApiNewCar;
}

const formatPrice = (v: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);

export default function AdminNewCarDetailView({ car }: AdminNewCarDetailViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/new-cars"
            className="rounded-lg p-2 text-secondary transition hover:bg-slate-100"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {car.brand} {car.model}
            </h1>
            <p className="text-sm text-secondary">{car.year}</p>
          </div>
        </div>

        <Link
          href={`/admin/new-cars/${car._id}/edit`}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-white transition hover:opacity-90"
        >
          <Edit size={18} />
          Edit Mobil
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* LEFT — image + status */}
        <div className="col-span-12 space-y-6 lg:col-span-4">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="relative h-64 w-full">
              <Image
                src={getCarImageUrl(car.image_url)}
                alt={`${car.brand} ${car.model}`}
                fill
                className="object-cover"
              />
              <span className="absolute left-4 top-4 rounded-lg bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                Baru
              </span>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-primary">{formatPrice(car.price)}</p>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    car.is_active
                      ? 'border border-green-200 bg-green-100 text-green-700'
                      : 'border border-red-200 bg-red-100 text-red-700'
                  }`}
                >
                  {car.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </section>

          {/* Audit info */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary">
              Informasi Audit
            </h3>
            <InfoRow label="Dibuat" value={new Date(car.created_at).toLocaleString('id-ID')} />
            <InfoRow label="Diperbarui" value={new Date(car.updated_at).toLocaleString('id-ID')} />
          </section>
        </div>

        {/* RIGHT — specs + description */}
        <div className="col-span-12 space-y-6 lg:col-span-8">
          {/* Specs */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-5 text-lg font-semibold">Spesifikasi Teknis</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <SpecCard icon={<Calendar size={18} />} label="Tahun" value={String(car.year)} />
              <SpecCard icon={<Tag size={18} />} label="Harga" value={formatPrice(car.price)} />
              <SpecCard
                icon={<Gauge size={18} />}
                label="Kapasitas Mesin"
                value={`${car.engine_capacity} cc`}
              />
              <SpecCard
                icon={<Users size={18} />}
                label="Kapasitas Kursi"
                value={`${car.seat_capacity} orang`}
              />
              <SpecCard
                icon={<Droplets size={18} />}
                label="Efisiensi BBM"
                value={`${car.fuel_efficiency} L/100km`}
              />
              <SpecCard
                icon={<Settings size={18} />}
                label="Transmisi"
                value={car.transmission.charAt(0).toUpperCase() + car.transmission.slice(1)}
              />
              <SpecCard
                icon={<Fuel size={18} />}
                label="Bahan Bakar"
                value={car.fuel_type.charAt(0).toUpperCase() + car.fuel_type.slice(1)}
              />
              <SpecCard
                icon={<Palette size={18} />}
                label="Warna"
                value={car.color}
              />
            </div>
          </section>

          {/* Description */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Deskripsi</h2>
            <p className="leading-relaxed text-slate-600 whitespace-pre-line">{car.description}</p>
          </section>
        </div>
      </div>
    </div>
  );
}

function SpecCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-secondary">{icon}<span className="text-xs">{label}</span></div>
      <p className="font-semibold text-slate-800 text-sm">{value}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-secondary">{label}</span>
      <span className="font-medium text-slate-700">{value}</span>
    </div>
  );
}
