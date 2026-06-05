'use client';

import { useMemo, useState } from 'react';
import {
  Calendar,
  Car,
  Fuel,
  Gauge,
  Search,
  Users,
  Settings,
  Droplets,
  Sparkles,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { ApiCar, NewCarAnpRanking } from '@/types/api.type';
import { getCarImageUrl } from '@/lib/api';

const formatPrice = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);

interface CatalogViewProps {
  cars: ApiCar[];
  newCarRankings: NewCarAnpRanking[];
}

type Tab = 'bekas' | 'baru';

export default function CatalogView({ cars, newCarRankings }: CatalogViewProps) {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as Tab) ?? 'bekas';

  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('');
  const [transmission, setTransmission] = useState('');
  const [fuelType, setFuelType] = useState('');

  const newCars = useMemo(
    () => newCarRankings.map((r) => r.data_cars),
    [newCarRankings],
  );

  const brandList = useMemo(() => {
    const source = activeTab === 'bekas' ? cars : newCars;
    return [...new Set(source.map((c) => c.brand))].sort();
  }, [activeTab, cars, newCars]);

  const filteredUsedCars = useMemo(() => {
    return cars.filter((car) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        car.brand.toLowerCase().includes(q) ||
        car.model.toLowerCase().includes(q);
      const matchBrand = !brand || car.brand === brand;
      const matchTrans = !transmission || car.transmission === transmission;
      const matchFuel = !fuelType || car.fuel_type === fuelType;
      return matchSearch && matchBrand && matchTrans && matchFuel;
    });
  }, [cars, search, brand, transmission, fuelType]);

  const filteredNewCars = useMemo(() => {
    return newCars.filter((car) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        car.brand.toLowerCase().includes(q) ||
        car.model.toLowerCase().includes(q);
      const matchBrand = !brand || car.brand === brand;
      const matchTrans = !transmission || car.transmission === transmission;
      const matchFuel = !fuelType || car.fuel_type === fuelType;
      return matchSearch && matchBrand && matchTrans && matchFuel;
    });
  }, [newCars, search, brand, transmission, fuelType]);

  function handleTabChange(tab: Tab) {
    setActiveTab(tab);
    setBrand('');
    setSearch('');
    setTransmission('');
    setFuelType('');
  }

  const displayedCars = activeTab === 'bekas' ? filteredUsedCars : filteredNewCars;
  const rankingMap = useMemo(
    () =>
      new Map(
        newCarRankings.map((r) => [r.data_cars._id, r]),
      ),
    [newCarRankings],
  );

  return (
    <main className="mx-auto max-w-7xl py-8">
      {/* Header */}
      <section className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-foreground">
          Katalog Mobil
        </h1>
        <p className="text-secondary">
          Temukan mobil terbaik berdasarkan kebutuhan dan rekomendasi ANP.
        </p>

        {/* Tabs */}
        <div className="mt-5 flex gap-1 rounded-xl bg-slate-100 p-1 w-fit">
          <button
            onClick={() => handleTabChange('bekas')}
            className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-medium transition ${
              activeTab === 'bekas'
                ? 'bg-white text-primary shadow-sm'
                : 'text-secondary hover:text-foreground'
            }`}
          >
            <Gauge size={15} />
            Mobil Bekas
          </button>
          <button
            onClick={() => handleTabChange('baru')}
            className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-medium transition ${
              activeTab === 'baru'
                ? 'bg-white text-primary shadow-sm'
                : 'text-secondary hover:text-foreground'
            }`}
          >
            <Sparkles size={15} />
            Mobil Baru
          </button>
        </div>
      </section>

      {/* Filter */}
      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-12">
          {/* Search */}
          <div className="relative md:col-span-4">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari merk atau model..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition focus:border-primary"
            />
          </div>

          {/* Brand */}
          <div className="md:col-span-2">
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
            >
              <option value="">Semua Merk</option>
              {brandList.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Transmission */}
          <div className="md:col-span-2">
            <select
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
            >
              <option value="">Semua Transmisi</option>
              <option value="manual">Manual</option>
              <option value="automatic">Automatic</option>
            </select>
          </div>

          {/* Fuel Type */}
          <div className="md:col-span-2">
            <select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-primary"
            >
              <option value="">Semua BBM</option>
              <option value="gasoline">Gasoline</option>
              <option value="diesel">Diesel</option>
              <option value="hybrid">Hybrid</option>
              <option value="electric">Electric</option>
            </select>
          </div>

          {/* Reset */}
          {(search || brand || transmission || fuelType) && (
            <div className="md:col-span-2 flex items-center">
              <button
                onClick={() => {
                  setSearch('');
                  setBrand('');
                  setTransmission('');
                  setFuelType('');
                }}
                className="text-sm text-secondary underline hover:text-foreground"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Card Grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {displayedCars.length === 0 && (
          <div className="col-span-4 rounded-2xl border border-dashed border-slate-300 py-16 text-center text-secondary">
            Tidak ada mobil yang sesuai filter.
          </div>
        )}

        {activeTab === 'bekas' &&
          filteredUsedCars.map((car) => (
            <UsedCarCard key={car._id} car={car} />
          ))}

        {activeTab === 'baru' &&
          filteredNewCars.map((car) => {
            const ranking = rankingMap.get(car._id);
            return (
              <NewCarCard key={car._id} car={car} ranking={ranking} />
            );
          })}
      </section>

      {/* Footer count */}
      <section className="mt-12 border-t border-slate-200 pt-8">
        <p className="text-sm text-secondary">
          Menampilkan{' '}
          <span className="font-semibold text-foreground">
            {displayedCars.length}
          </span>{' '}
          {activeTab === 'bekas' ? 'mobil bekas' : 'mobil baru'}
        </p>
      </section>
    </main>
  );
}

/* ─── Sub-components ──────────────────────────────────────────── */

function UsedCarCard({ car }: { car: ApiCar }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-52 overflow-hidden">
        <img
          src={getCarImageUrl(car.image_url)}
          alt={`${car.brand} ${car.model}`}
          className="h-full w-full object-cover transition duration-500 hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-white">
          Bekas
        </span>
      </div>

      <div className="p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-secondary">
              {car.brand}
            </p>
            <h3 className="font-semibold text-foreground">{car.model}</h3>
          </div>
          <span className="text-sm font-bold text-primary">
            {formatPrice(car.price)}
          </span>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{car.year}</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge size={16} />
            <span>{car.mileage.toLocaleString()} km</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel size={16} />
            <span className="capitalize">{car.fuel_type}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} />
            <span>{car.seat_capacity} Kursi</span>
          </div>
        </div>

        <Link
          href={`/cars/${car._id}`}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary py-3 font-medium text-primary transition hover:bg-primary hover:text-white"
        >
          <Car size={18} />
          Lihat Detail
        </Link>
      </div>
    </article>
  );
}

function NewCarCard({
  car,
  ranking,
}: {
  car: import('@/types/api.type').ApiNewCar;
  ranking?: import('@/types/api.type').NewCarAnpRanking;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-52 overflow-hidden">
        <img
          src={getCarImageUrl(car.image_url)}
          alt={`${car.brand} ${car.model}`}
          className="h-full w-full object-cover transition duration-500 hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-lg bg-green-500 px-3 py-1 text-xs font-semibold text-white">
          Baru
        </span>
        {ranking && (
          <span className="absolute right-4 top-4 rounded-lg bg-black/50 px-3 py-1 text-xs font-semibold text-white">
            #{ranking.rank_position}
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-secondary">
              {car.brand}
            </p>
            <h3 className="font-semibold text-foreground">{car.model}</h3>
          </div>
          <span className="text-sm font-bold text-primary">
            {formatPrice(car.price)}
          </span>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{car.year}</span>
          </div>
          <div className="flex items-center gap-2">
            <Settings size={16} />
            <span className="capitalize">{car.transmission}</span>
          </div>
          <div className="flex items-center gap-2">
            {car.fuel_type === 'electric' ? (
              <Zap size={16} />
            ) : (
              <Fuel size={16} />
            )}
            <span className="capitalize">{car.fuel_type}</span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets size={16} />
            <span>{car.fuel_efficiency} L/100km</span>
          </div>
        </div>

        {ranking && (
          <div className="mb-4 flex items-center justify-between rounded-xl bg-blue-50 px-3 py-2 text-xs">
            <span className="text-secondary">ANP Score</span>
            <span className="font-bold text-primary">
              {ranking.final_score.toFixed(4)}
            </span>
          </div>
        )}

        <Link
          href={`/new-cars/${car._id}`}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-green-500 py-3 font-medium text-green-600 transition hover:bg-green-500 hover:text-white"
        >
          <Car size={18} />
          Lihat Detail
        </Link>
      </div>
    </article>
  );
}
