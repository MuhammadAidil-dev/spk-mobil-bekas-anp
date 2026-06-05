'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  CheckSquare,
  Scale,
  Trophy,
  Brain,
  BadgeCheck,
  Wallet,
  Headset,
  Gauge,
  Settings,
  Fuel,
  Zap,
  Sparkles,
  Droplets,
} from 'lucide-react';
import Link from 'next/link';
import type { ApiCar, NewCarAnpRanking } from '@/types/api.type';
import { getCarImageUrl } from '@/lib/api';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price);

interface HomeViewProps {
  cars: ApiCar[];
  topNewCars: NewCarAnpRanking[];
}

type FeaturedTab = 'bekas' | 'baru';

export default function HomeView({ cars, topNewCars }: HomeViewProps) {
  const [featuredTab, setFeaturedTab] = useState<FeaturedTab>('bekas');

  return (
    <div className="pb-12">
      {/* HERO */}
      <section className="relative overflow-hidden bg-white py-20 lg:py-32">
        <div className="container mx-auto">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-primary">
                Analytic Network Process Driven
              </span>

              <h1 className="mt-6 text-5xl font-bold leading-tight text-foreground">
                Temukan Mobil Terbaik dengan{' '}
                <span className="text-primary">Metode ANP</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg text-secondary">
                Sistem pendukung keputusan cerdas untuk mobil bekas maupun mobil
                baru — mempertimbangkan setiap keterkaitan antar kriteria
                teknis, harga, dan preferensi Anda.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/recomendations"
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 font-semibold text-white duration-150 hover:bg-primary/80"
                >
                  Mulai Analisis
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/catalog"
                  className="rounded-xl border border-secondary px-8 py-4 font-semibold duration-150 hover:text-primary hover:shadow-md"
                >
                  Lihat Katalog
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1502877338535-766e1452684a"
                  alt="Hero Car"
                  width={900}
                  height={600}
                  className="h-112.5 w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-neutral py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold">How It Works</h2>
            <p className="mt-4 text-secondary">
              Tiga langkah sederhana menuju mobil impian Anda.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: CheckSquare,
                title: 'Pilih Kriteria',
                desc: 'Tentukan prioritas kebutuhan Anda.',
              },
              {
                icon: Scale,
                title: 'Pairwise Comparison',
                desc: 'Bandingkan tingkat kepentingan antar kriteria.',
              },
              {
                icon: Trophy,
                title: 'Hasil & Ranking',
                desc: 'Dapatkan rekomendasi mobil terbaik.',
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className="relative rounded-2xl border bg-white p-8"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-primary">
                  <item.icon size={24} />
                </div>

                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-secondary">{item.desc}</p>

                <span className="absolute right-6 top-6 text-4xl font-bold text-secondary">
                  0{index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED CARS */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header + Tabs */}
          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-4xl font-bold">Featured Cars</h2>
              <p className="mt-2 text-secondary">
                Inventaris pilihan berdasarkan skor ANP.
              </p>

              {/* Tabs */}
              <div className="mt-5 flex gap-1 rounded-xl bg-slate-100 p-1 w-fit">
                <TabButton
                  active={featuredTab === 'bekas'}
                  onClick={() => setFeaturedTab('bekas')}
                  icon={<Gauge size={15} />}
                  label="Mobil Bekas"
                />
                <TabButton
                  active={featuredTab === 'baru'}
                  onClick={() => setFeaturedTab('baru')}
                  icon={<Sparkles size={15} />}
                  label="Mobil Baru"
                />
              </div>
            </div>

            <Link
              href={featuredTab === 'bekas' ? '/catalog' : '/catalog?tab=baru'}
              className="flex items-center gap-2 pb-1 font-semibold text-primary transition-transform duration-150 hover:border-b"
            >
              Lihat Semua
              <ArrowUpRight size={18} />
            </Link>
          </div>

          {/* Used Cars */}
          {featuredTab === 'bekas' && (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {cars.length === 0 && (
                <p className="col-span-3 text-center text-secondary py-12">
                  Belum ada data mobil bekas.
                </p>
              )}
              {cars.map((car) => (
                <UsedCarCard key={car._id} car={car} />
              ))}
            </div>
          )}

          {/* New Cars */}
          {featuredTab === 'baru' && (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {topNewCars.length === 0 && (
                <p className="col-span-3 text-center text-secondary py-12">
                  Belum ada data mobil baru.
                </p>
              )}
              {topNewCars.map((item) => (
                <NewCarCard key={item.data_cars._id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="rounded-lg bg-primary py-24 text-white shadow-md">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold">Kenapa AutoANP?</h2>
            <p className="mt-4 text-white/80">
              Keunggulan sistem dibanding platform konvensional.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {[
              { icon: Brain, title: 'Analisis Cerdas' },
              { icon: BadgeCheck, title: 'Terverifikasi' },
              { icon: Wallet, title: 'Transparansi Harga' },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                  <item.icon size={30} />
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── Sub-components ──────────────────────────────────────────── */

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition ${
        active
          ? 'bg-white text-primary shadow-sm'
          : 'text-secondary hover:text-foreground'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function UsedCarCard({ car }: { car: ApiCar }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white transition hover:shadow-lg">
      <div className="relative h-56">
        <Image
          src={getCarImageUrl(car.image_url)}
          alt={`${car.brand} ${car.model}`}
          fill
          className="object-cover"
        />
        <div className="absolute left-4 top-4 rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-white">
          Bekas
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4 flex justify-between gap-4">
          <div>
            <h3 className="font-semibold">
              {car.brand} {car.model}
            </h3>
            <p className="text-sm text-secondary">{car.year}</p>
          </div>
          <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm">
            {formatPrice(car.price)}
          </span>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-3 text-xs text-secondary">
          <div className="flex items-center gap-1">
            <Gauge size={14} />
            {car.mileage.toLocaleString()} KM
          </div>
          <div className="flex items-center gap-1">
            <Settings size={14} />
            {car.transmission}
          </div>
          <div className="flex items-center gap-1">
            {car.fuel_type === 'electric' ? (
              <Zap size={14} />
            ) : (
              <Fuel size={14} />
            )}
            {car.fuel_type}
          </div>
        </div>

        <Link
          href={`/cars/${car._id}`}
          className="block w-full rounded-xl border p-2 text-center text-sm font-medium hover:border-primary hover:text-primary"
        >
          Detail Kendaraan
        </Link>
      </div>
    </div>
  );
}

function NewCarCard({ item }: { item: NewCarAnpRanking }) {
  const { data_cars: car, final_score, rank_position } = item;

  return (
    <div className="overflow-hidden rounded-2xl border bg-white transition hover:shadow-lg">
      <div className="relative h-56">
        <Image
          src={getCarImageUrl(car.image_url)}
          alt={`${car.brand} ${car.model}`}
          fill
          className="object-cover"
        />
        <div className="absolute left-4 top-4 rounded-lg bg-green-500 px-3 py-1 text-xs font-semibold text-white">
          Baru
        </div>
        <div className="absolute right-4 top-4 rounded-lg bg-black/50 px-3 py-1 text-xs font-semibold text-white">
          #{rank_position}
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4 flex justify-between gap-4">
          <div>
            <h3 className="font-semibold">
              {car.brand} {car.model}
            </h3>
            <p className="text-sm text-secondary">{car.year}</p>
          </div>
          <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm">
            {formatPrice(car.price)}
          </span>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-3 text-xs text-secondary">
          <div className="flex items-center gap-1">
            <Settings size={14} />
            {car.transmission}
          </div>
          <div className="flex items-center gap-1">
            {car.fuel_type === 'electric' ? (
              <Zap size={14} />
            ) : (
              <Fuel size={14} />
            )}
            {car.fuel_type}
          </div>
          <div className="flex items-center gap-1">
            <Droplets size={14} />
            {car.fuel_efficiency} L/100km
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between rounded-xl bg-blue-50 px-4 py-2">
          <span className="text-xs text-secondary">ANP Score</span>
          <span className="font-bold text-primary">
            {final_score.toFixed(4)}
          </span>
        </div>

        <Link
          href={`/new-cars/${car._id}`}
          className="block w-full rounded-xl border p-2 text-center text-sm font-medium hover:border-primary hover:text-primary"
        >
          Detail Mobil
        </Link>
      </div>
    </div>
  );
}
