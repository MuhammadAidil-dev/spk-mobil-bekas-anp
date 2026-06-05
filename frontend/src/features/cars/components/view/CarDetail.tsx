'use client';

import Image from 'next/image';
import {
  ArrowRight,
  Car,
  Gauge,
  Settings,
  Users,
  Fuel,
  ShieldCheck,
  BarChart3,
  CheckCircle,
} from 'lucide-react';
import Breadcrumbs, {
  breadcrumbItemsType,
} from '@/components/navigations/Breadcrumb';
import { ApiCar, AnpRanking } from '@/types/api.type';
import { getCarImageUrl } from '@/lib/api';

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

interface CarDetailViewProps {
  car: ApiCar;
  anpRank?: AnpRanking;
}

const breadcrumbItems: breadcrumbItemsType[] = [
  { label: 'Home', href: '/' },
  { label: 'Catalog', href: '/catalog' },
  { label: 'Detail Mobil' },
];

export default function CarDetailView({ car, anpRank }: CarDetailViewProps) {
  const imageUrl = getCarImageUrl(car.image_url);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
      <Breadcrumbs breadcrumItems={breadcrumbItems} />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Gallery */}
        <div className="space-y-4 lg:col-span-7">
          <div className="relative aspect-16/10 overflow-hidden rounded-2xl bg-neutral">
            <Image
              fill
              priority
              src={imageUrl}
              alt={`${car.brand} ${car.model}`}
              className="object-cover"
            />
          </div>
        </div>

        {/* Detail */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              {car.brand}
            </span>

            <h1 className="mt-2 text-4xl font-bold text-foreground">
              {car.year} {car.brand} {car.model}
            </h1>

            <p className="mt-2 text-secondary">{car.description}</p>
          </div>

          {/* ANP Score — tampilkan jika ada data ranking */}
          {anpRank && (
            <div className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                  <BarChart3 size={22} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-secondary">
                    ANP Performance Score
                  </p>

                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-bold">
                      {anpRank.final_score.toFixed(4)}
                    </span>
                    <span className="text-sm text-secondary">/ 1</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs font-semibold uppercase text-secondary">
                  Ranking
                </p>
                <p className="font-bold text-primary">
                  #{anpRank.rank_position} Terbaik
                </p>
              </div>
            </div>
          )}

          {/* Price */}
          <div>
            <p className="text-sm font-medium text-secondary">Harga</p>
            <h2 className="mt-1 text-4xl font-bold text-foreground">
              {currencyFormatter.format(car.price)}
            </h2>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <SpecCard
              icon={<Gauge size={20} />}
              label="Kilometer"
              value={`${car.mileage.toLocaleString('id-ID')} KM`}
            />

            <SpecCard
              icon={<Settings size={20} />}
              label="Mesin"
              value={`${car.engine_capacity} cc`}
            />

            <SpecCard
              icon={<Users size={20} />}
              label="Kursi"
              value={`${car.seat_capacity} Kursi`}
            />

            <SpecCard
              icon={<Car size={20} />}
              label="Transmisi"
              value={car.transmission}
            />

            <SpecCard
              icon={<Fuel size={20} />}
              label="Bahan Bakar"
              value={car.fuel_type}
            />

            {car.color && (
              <SpecCard
                icon={<ShieldCheck size={20} />}
                label="Warna"
                value={car.color}
              />
            )}
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-4 pt-2 sm:flex-row">
            <a
              href="/recomendations"
              className="flex-1 rounded-xl bg-primary px-6 py-4 text-center font-semibold text-white transition hover:opacity-90"
            >
              Lihat Rekomendasi
            </a>

            <a
              href="/catalog"
              className="flex-1 rounded-xl border border-primary px-6 py-4 text-center font-semibold text-primary transition hover:bg-primary/5"
            >
              Kembali ke Katalog
            </a>
          </div>
        </div>
      </div>

      {/* Decision Support Analysis */}
      {anpRank && (
        <section className="mt-20 border-t pt-12">
          <h2 className="mb-8 text-3xl font-bold">Decision Support Analysis</h2>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border bg-white p-8 md:col-span-2">
              <h3 className="mb-4 text-xl font-semibold">
                Analytic Network Process — Normalized Scores
              </h3>

              <p className="mb-8 max-w-xl text-secondary">
                Skor ternormalisasi per kriteria hasil evaluasi ANP.
              </p>

              <div className="space-y-6">
                {Object.entries(anpRank.normalized_scores).map(
                  ([key, value]) => (
                    <div key={key}>
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="capitalize">
                          {key.replace('_', ' ')}
                        </span>
                        <span className="font-semibold">
                          {(value * 100).toFixed(1)}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-neutral">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${value * 100}%` }}
                        />
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-3xl bg-secondary p-8 text-white">
              <div>
                <div className="mb-4 flex items-center gap-2 text-green-400">
                  <CheckCircle size={18} />
                  <span className="text-xs font-semibold uppercase">
                    Consistency Check
                  </span>
                </div>

                <h3 className="mb-2 text-3xl font-bold">
                  Final Score: {anpRank.final_score.toFixed(4)}
                </h3>

                <p className="text-white/70">
                  Skor akhir ANP dari kombinasi semua kriteria yang telah
                  dinormalisasi dan dibobot.
                </p>
              </div>

              <a
                href="/recomendations"
                className="mt-8 flex items-center gap-2 font-medium text-blue-300 hover:underline"
              >
                Lihat Semua Ranking
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

type SpecCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function SpecCard({ icon, label, value }: SpecCardProps) {
  return (
    <div className="rounded-xl border bg-neutral p-4">
      <div className="mb-2 text-primary">{icon}</div>
      <p className="text-sm text-secondary">{label}</p>
      <p className="mt-1 font-semibold text-foreground">{value}</p>
    </div>
  );
}
