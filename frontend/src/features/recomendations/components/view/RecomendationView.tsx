'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Gauge, Sparkles, Droplets, Eye, TrendingDown, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import type { AnpResult, NewCarAnpResult } from '@/types/api.type';
import { getCarImageUrl } from '@/lib/api';

interface RecomendationViewProps {
  anpData: AnpResult;
  newCarAnpData: NewCarAnpResult;
}

type Tab = 'bekas' | 'baru';

const formatPrice = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);

export default function RecomendationView({
  anpData,
  newCarAnpData,
}: RecomendationViewProps) {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as Tab) ?? 'bekas';
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  return (
    <div className="min-h-screen">
      <div className="mx-auto py-8">
        {/* Header */}
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-secondary sm:text-4xl">
            Rekomendasi Mobil Terbaik
          </h1>
          <p className="mt-3 max-w-3xl text-slate-500 text-sm sm:text-base">
            Hasil perhitungan Analytic Network Process (ANP) berdasarkan
            berbagai kriteria teknis dan harga.
          </p>

          {/* Tabs */}
          <div className="mt-6 flex gap-1 rounded-xl bg-slate-100 p-1 w-fit">
            <button
              onClick={() => setActiveTab('bekas')}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 sm:px-5 sm:py-2.5 text-sm font-medium transition ${
                activeTab === 'bekas'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-secondary hover:text-foreground'
              }`}
            >
              <Gauge size={15} />
              Mobil Bekas
            </button>
            <button
              onClick={() => setActiveTab('baru')}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 sm:px-5 sm:py-2.5 text-sm font-medium transition ${
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

        {activeTab === 'bekas' && <UsedCarRanking anpData={anpData} />}
        {activeTab === 'baru' && <NewCarRanking newCarAnpData={newCarAnpData} />}
      </div>
    </div>
  );
}

/* ─── Used Car Ranking ─────────────────────────────────────────── */

function UsedCarRanking({ anpData }: { anpData: AnpResult }) {
  const { rankings, consistency, weights } = anpData;
  const topCar = rankings[0];

  if (!topCar) {
    return <EmptyState message="Belum ada data ranking mobil bekas." />;
  }

  return (
    <>
      {/* Stats */}
      <section className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard title="Total Kandidat" value={rankings.length} />
        <StatCard title="Kriteria" value={weights.length} />
        <StatCard title="CR" value={consistency.consistencyRatio.toFixed(4)} />
        <StatCard
          title="Status"
          value={consistency.isConsistent ? 'Konsisten' : 'Tidak Konsisten'}
          highlight={consistency.isConsistent}
        />
      </section>

      {/* Criteria Weights */}
      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="mb-1 font-semibold text-slate-800">Kriteria Penilaian ANP</h2>
        <p className="mb-5 text-xs text-slate-500">
          Bobot setiap kriteria dihitung melalui metode Analytic Network Process
          berdasarkan matriks perbandingan berpasangan.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {weights.map((w) => (
            <div
              key={w.criteria_code}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                  {w.criteria_code}
                </span>
                <span className="text-lg font-bold text-slate-800">
                  {(w.weight * 100).toFixed(1)}%
                </span>
              </div>

              <p className="mb-3 text-sm font-medium text-slate-700">
                {w.criteria_name}
              </p>

              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-primary transition-all duration-700"
                  style={{ width: `${w.weight * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Car */}
      <section className="mb-8 overflow-hidden rounded-3xl bg-secondary text-white">
        <div className="grid lg:grid-cols-2">
          <div className="p-6 sm:p-8 lg:p-12">
            <div className="inline-flex rounded-full bg-primary px-4 py-2 text-sm">
              Rekomendasi #1
            </div>

            <h2 className="mt-5 text-2xl font-bold sm:text-4xl">
              {topCar.data_car.brand} {topCar.data_car.model}
            </h2>

            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
              <span>{formatPrice(topCar.data_car.price)}</span>
              <span className="capitalize">{topCar.data_car.fuel_type}</span>
              <span>{topCar.data_car.seat_capacity} Kursi</span>
            </div>

            <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-5">
              <div className="text-sm text-slate-300">Final Score</div>
              <div className="text-3xl font-bold sm:text-4xl">
                {topCar.final_score.toFixed(4)}
              </div>
            </div>

            <Link
              href={`/cars/${topCar.data_car._id}`}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/30 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              <Eye size={15} />
              Lihat Detail Mobil
            </Link>
          </div>

          <div className="relative min-h-56 lg:min-h-0">
            <Image
              fill
              priority
              src={getCarImageUrl(topCar.data_car.image_url)}
              alt={`${topCar.data_car.brand} ${topCar.data_car.model}`}
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Ranking Table */}
      <RankingLayout
        tableNode={
          <div className="overflow-x-auto">
            <table className="w-full min-w-140">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-4 text-left text-xs uppercase tracking-wide text-slate-500">Rank</th>
                  <th className="p-4 text-left text-xs uppercase tracking-wide text-slate-500">Mobil</th>
                  <th className="p-4 text-left text-xs uppercase tracking-wide text-slate-500">Harga</th>
                  <th className="p-4 text-left text-xs uppercase tracking-wide text-slate-500">BBM</th>
                  <th className="p-4 text-left text-xs uppercase tracking-wide text-slate-500">Score</th>
                  <th className="p-4 text-left text-xs uppercase tracking-wide text-slate-500">Detail</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((item) => (
                  <tr key={item.data_car._id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="p-4">
                      <span className={`font-bold ${item.rank_position === 1 ? 'text-primary' : 'text-slate-700'}`}>
                        #{item.rank_position}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-800">
                        {item.data_car.brand} {item.data_car.model}
                      </div>
                      <div className="text-xs text-slate-400">{item.data_car.year}</div>
                    </td>
                    <td className="p-4 text-sm text-slate-700">{formatPrice(item.data_car.price)}</td>
                    <td className="p-4 text-sm capitalize text-slate-700">{item.data_car.fuel_type}</td>
                    <td className="p-4 font-semibold text-primary">{item.final_score.toFixed(4)}</td>
                    <td className="p-4">
                      <Link
                        href={`/cars/${item.data_car._id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-secondary transition hover:bg-primary hover:text-white"
                      >
                        <Eye size={13} />
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
        sideNote="Bobot ANP dihitung berdasarkan kriteria Harga, Kilometer, Kapasitas Mesin, dan Kapasitas Kursi."
        rankings={rankings.map((r) => ({
          id: r.data_car._id,
          label: `${r.data_car.brand} ${r.data_car.model}`,
          score: r.final_score,
        }))}
      />
    </>
  );
}

/* ─── New Car Ranking ──────────────────────────────────────────── */

function NewCarRanking({ newCarAnpData }: { newCarAnpData: NewCarAnpResult }) {
  const { rankings, consistency, weights } = newCarAnpData;
  const topItem = rankings[0];

  if (!topItem) {
    return <EmptyState message="Belum ada data ranking mobil baru." />;
  }

  const topCar = topItem.data_cars;

  return (
    <>
      {/* Stats */}
      <section className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard title="Total Kandidat" value={rankings.length} />
        <StatCard title="Kriteria" value={weights.length} />
        <StatCard title="CR" value={consistency.consistencyRatio.toFixed(4)} />
        <StatCard
          title="Status"
          value={consistency.isConsistent ? 'Konsisten' : 'Tidak Konsisten'}
          highlight={consistency.isConsistent}
        />
      </section>

      {/* Criteria Weights */}
      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="mb-1 font-semibold text-slate-800">Kriteria Penilaian ANP</h2>
        <p className="mb-5 text-xs text-slate-500">
          Setiap kriteria diklasifikasikan sebagai <strong>benefit</strong> (semakin
          tinggi semakin baik) atau <strong>cost</strong> (semakin rendah semakin baik).
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {weights.map((w) => (
            <div
              key={w.criteria_code}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                  {w.criteria_code}
                </span>
                <div className="flex items-center gap-1.5">
                  {w.type === 'benefit' ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                      <TrendingUp size={10} />
                      Benefit
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
                      <TrendingDown size={10} />
                      Cost
                    </span>
                  )}
                </div>
              </div>

              <p className="mb-1 text-sm font-medium text-slate-700">
                {w.criteria_name}
              </p>

              <p className="mb-3 text-xl font-bold text-slate-800">
                {(w.weight * 100).toFixed(1)}%
              </p>

              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ${
                    w.type === 'benefit' ? 'bg-green-500' : 'bg-orange-400'
                  }`}
                  style={{ width: `${w.weight * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Car */}
      <section className="mb-8 overflow-hidden rounded-3xl bg-secondary text-white">
        <div className="grid lg:grid-cols-2">
          <div className="p-6 sm:p-8 lg:p-12">
            <div className="inline-flex rounded-full bg-green-500 px-4 py-2 text-sm">
              Rekomendasi #1 — Mobil Baru
            </div>

            <h2 className="mt-5 text-2xl font-bold sm:text-4xl">
              {topCar.brand} {topCar.model}
            </h2>

            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
              <span>{formatPrice(topCar.price)}</span>
              <span className="capitalize">{topCar.fuel_type}</span>
              <span>{topCar.seat_capacity} Kursi</span>
              <span className="flex items-center gap-1">
                <Droplets size={14} />
                {topCar.fuel_efficiency} L/100km
              </span>
            </div>

            <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-5">
              <div className="text-sm text-slate-300">Final Score</div>
              <div className="text-3xl font-bold sm:text-4xl">
                {topItem.final_score.toFixed(4)}
              </div>
            </div>

            <Link
              href={`/new-cars/${topCar._id}`}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/30 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              <Eye size={15} />
              Lihat Detail Mobil
            </Link>
          </div>

          <div className="relative min-h-56 lg:min-h-0">
            <Image
              fill
              priority
              src={getCarImageUrl(topCar.image_url)}
              alt={`${topCar.brand} ${topCar.model}`}
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Ranking Table */}
      <RankingLayout
        tableNode={
          <div className="overflow-x-auto">
            <table className="w-full min-w-150">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-4 text-left text-xs uppercase tracking-wide text-slate-500">Rank</th>
                  <th className="p-4 text-left text-xs uppercase tracking-wide text-slate-500">Mobil</th>
                  <th className="p-4 text-left text-xs uppercase tracking-wide text-slate-500">Harga</th>
                  <th className="p-4 text-left text-xs uppercase tracking-wide text-slate-500">Efisiensi BBM</th>
                  <th className="p-4 text-left text-xs uppercase tracking-wide text-slate-500">Score</th>
                  <th className="p-4 text-left text-xs uppercase tracking-wide text-slate-500">Detail</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((item) => (
                  <tr key={item.data_cars._id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="p-4">
                      <span className={`font-bold ${item.rank_position === 1 ? 'text-primary' : 'text-slate-700'}`}>
                        #{item.rank_position}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-800">
                        {item.data_cars.brand} {item.data_cars.model}
                      </div>
                      <div className="text-xs text-slate-400">{item.data_cars.year}</div>
                    </td>
                    <td className="p-4 text-sm text-slate-700">{formatPrice(item.data_cars.price)}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-sm text-slate-700">
                        <Droplets size={13} className="text-blue-500" />
                        {item.data_cars.fuel_efficiency} L/100km
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-primary">{item.final_score.toFixed(4)}</td>
                    <td className="p-4">
                      <Link
                        href={`/new-cars/${item.data_cars._id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-secondary transition hover:bg-green-500 hover:text-white"
                      >
                        <Eye size={13} />
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
        sideNote="Bobot ANP dihitung berdasarkan kriteria Harga, Kapasitas Mesin, Kapasitas Kursi, dan Efisiensi BBM."
        rankings={rankings.map((r) => ({
          id: r.data_cars._id,
          label: `${r.data_cars.brand} ${r.data_cars.model}`,
          score: r.final_score,
        }))}
      />
    </>
  );
}

/* ─── Shared Layout Components ─────────────────────────────────── */

function RankingLayout({
  tableNode,
  sideNote,
  rankings,
}: {
  tableNode: React.ReactNode;
  sideNote: string;
  rankings: { id: string; label: string; score: number }[];
}) {
  return (
    <section className="grid gap-6 lg:grid-cols-3">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white lg:col-span-2">
        <div className="border-b p-5">
          <h3 className="font-semibold">Ranking Mobil</h3>
        </div>
        {tableNode}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="mb-6 font-semibold">Top Scores</h3>

        <div className="space-y-4">
          {rankings.map((item, index) => (
            <div key={item.id}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="shrink-0 text-xs font-bold text-slate-400">
                    #{index + 1}
                  </span>
                  <span className="truncate text-slate-700">{item.label}</span>
                </div>
                <span className="ml-2 shrink-0 font-semibold text-primary">
                  {item.score.toFixed(4)}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100">
                <div
                  className="h-1.5 rounded-full bg-primary transition-all duration-700"
                  style={{ width: `${item.score * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl bg-slate-50 p-4 text-xs text-slate-500 leading-relaxed">
          {sideNote}
        </div>
      </div>
    </section>
  );
}

function StatCard({
  title,
  value,
  highlight,
}: {
  title: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 sm:p-6 ${
        highlight === false
          ? 'border-red-100 bg-red-50'
          : highlight === true
            ? 'border-green-100 bg-green-50'
            : 'border-slate-200 bg-white'
      }`}
    >
      <p className="text-xs text-slate-500">{title}</p>
      <p
        className={`mt-2 text-xl font-bold sm:text-3xl ${
          highlight === false
            ? 'text-red-600'
            : highlight === true
              ? 'text-green-600'
              : 'text-secondary'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 py-20 text-center text-secondary">
      {message}
    </div>
  );
}
