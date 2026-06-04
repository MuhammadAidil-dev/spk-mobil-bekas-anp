'use client';

import Image from 'next/image';
import {
  ArrowRight,
  Car,
  Gauge,
  Settings,
  Users,
  Battery,
  ShieldCheck,
  BarChart3,
  CheckCircle,
} from 'lucide-react';
import Breadcrumbs, {
  breadcrumbItemsType,
} from '@/components/navigations/Breadcrumb';

type CarDetail = {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  engineCapacity: string;
  seatCapacity: number;
  transmission: string;
  fuelType: string;
  warranty: string;
  description: string;
  anpScore: number;
  ranking: number;
  images: string[];
};

const car: CarDetail = {
  id: '1',
  brand: 'Electra',
  model: 'Vision X',
  year: 2024,
  price: 1250000000,
  mileage: 1200,
  engineCapacity: 'Dual Motor',
  seatCapacity: 5,
  transmission: 'Automatic',
  fuelType: 'Electric',
  warranty: '5 Years',
  anpScore: 0.892,
  ranking: 1,
  description:
    'Mobil ini memperoleh skor ANP tertinggi berdasarkan evaluasi harga, kilometer, kapasitas mesin, dan kapasitas kursi. Sangat cocok untuk pengguna yang mengutamakan efisiensi operasional dan kenyamanan.',
  images: [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600',
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1600',
    'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1600',
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=1600',
  ],
};

const analysis = [
  {
    label: 'Economic Efficiency',
    value: 94,
  },
  {
    label: 'Comfort & Aesthetics',
    value: 88,
  },
  {
    label: 'Resale Stability',
    value: 72,
  },
];

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

const breadcrumbItems: breadcrumbItemsType[] = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Catalog',
    href: '/catalog',
  },
  {
    label: 'Detail Mobil',
  },
];

export default function CarDetailView() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
      {/* Breadcrumb */}
      <Breadcrumbs breadcrumItems={breadcrumbItems} />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Gallery */}
        <div className="space-y-4 lg:col-span-7">
          <div className="relative aspect-16/10 overflow-hidden rounded-2xl bg-neutral">
            <Image
              fill
              priority
              src={car.images[0]}
              alt={`${car.brand} ${car.model}`}
              className="object-cover"
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            {car.images.map((image, index) => (
              <div
                key={index}
                className={`relative aspect-square overflow-hidden rounded-xl ${
                  index === 0 ? 'ring-2 ring-primary' : 'border border-gray-200'
                }`}
              >
                <Image
                  fill
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Detail */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Luxury EV Sedan
            </span>

            <h1 className="mt-2 text-4xl font-bold text-foreground">
              {car.year} {car.brand} {car.model}
            </h1>

            <p className="mt-2 text-secondary">
              Precision engineered for the future of urban mobility.
            </p>
          </div>

          {/* ANP Score */}
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
                    {car.anpScore.toFixed(3)}
                  </span>
                  <span className="text-sm text-secondary">/ 1</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs font-semibold uppercase text-secondary">
                Ranking
              </p>

              <p className="font-bold text-primary">#{car.ranking} Terbaik</p>
            </div>
          </div>

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
              value={car.engineCapacity}
            />

            <SpecCard
              icon={<Users size={20} />}
              label="Kursi"
              value={`${car.seatCapacity} Kursi`}
            />

            <SpecCard
              icon={<Car size={20} />}
              label="Transmisi"
              value={car.transmission}
            />

            <SpecCard
              icon={<Battery size={20} />}
              label="Fuel"
              value={car.fuelType}
            />

            <SpecCard
              icon={<ShieldCheck size={20} />}
              label="Garansi"
              value={car.warranty}
            />
          </div>

          {/* Description */}
          <div>
            <h3 className="mb-3 text-xl font-semibold">Deskripsi</h3>

            <p className="leading-relaxed text-secondary">{car.description}</p>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-4 pt-2 sm:flex-row">
            <button className="flex-1 rounded-xl bg-primary px-6 py-4 font-semibold text-white transition hover:opacity-90">
              Lihat Rekomendasi
            </button>

            <button className="flex-1 rounded-xl border border-primary px-6 py-4 font-semibold text-primary transition hover:bg-primary/5">
              Mobil Serupa
            </button>
          </div>
        </div>
      </div>

      {/* Decision Support Analysis */}
      <section className="mt-20 border-t pt-12">
        <h2 className="mb-8 text-3xl font-bold">Decision Support Analysis</h2>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border bg-white p-8 md:col-span-2">
            <h3 className="mb-4 text-xl font-semibold">
              Analytic Network Process Matrix
            </h3>

            <p className="mb-8 max-w-xl text-secondary">
              Ringkasan performa mobil berdasarkan hasil evaluasi ANP.
            </p>

            <div className="space-y-6">
              {analysis.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>{item.label}</span>
                    <span className="font-semibold">{item.value}%</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-neutral">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${item.value}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
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

              <h3 className="mb-2 text-3xl font-bold">CR: 0.042</h3>

              <p className="text-white/70">
                Consistency Ratio berada di bawah ambang batas 0.1 sehingga
                matriks pairwise dianggap valid.
              </p>
            </div>

            <button className="mt-8 flex items-center gap-2 font-medium text-blue-300 hover:underline">
              Lihat Data Matrix
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
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
