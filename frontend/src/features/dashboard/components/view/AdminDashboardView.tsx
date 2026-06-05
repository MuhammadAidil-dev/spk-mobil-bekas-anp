import Image from 'next/image';
import Link from 'next/link';
import {
  Car,
  CarFront,
  MonitorCog,
  Plus,
  TrendingUp,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { getCarImageUrl } from '@/lib/api';
import type { ApiCar, ApiNewCar, AnpResult, NewCarAnpResult } from '@/types/api.type';

interface AdminDashboardViewProps {
  cars: ApiCar[];
  newCars: ApiNewCar[];
  anpData: AnpResult;
  newCarAnpData: NewCarAnpResult;
}

export default function AdminDashboardView({
  cars,
  newCars,
  anpData,
  newCarAnpData,
}: AdminDashboardViewProps) {
  const activeCars = cars.filter((c) => c.is_active).length;
  const activeNewCars = newCars.filter((c) => c.is_active).length;
  const topUsed = anpData.rankings[0];
  const topNew = newCarAnpData.rankings[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary sm:text-3xl">Dashboard Overview</h1>
          <p className="mt-1 text-secondary">
            Sistem Pendukung Keputusan Mobil — Metode ANP
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Link
            href="/admin/cars/add"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90 sm:px-4 sm:py-2.5 sm:text-sm"
          >
            <Plus size={15} />
            Tambah Mobil Bekas
          </Link>
          <Link
            href="/admin/new-cars/add"
            className="inline-flex items-center gap-2 rounded-xl border border-primary bg-white px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/5 sm:px-4 sm:py-2.5 sm:text-sm"
          >
            <Plus size={15} />
            Tambah Mobil Baru
          </Link>
          <Link
            href="/admin/anp-engine"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-primary hover:text-primary sm:px-4 sm:py-2.5 sm:text-sm"
          >
            <MonitorCog size={15} />
            ANP Engine
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<Car size={22} className="text-primary" />}
          label="Mobil Bekas"
          value={cars.length}
          sub={`${activeCars} aktif · ${cars.length - activeCars} nonaktif`}
          href="/admin/cars"
          color="blue"
        />
        <StatCard
          icon={<CarFront size={22} className="text-green-600" />}
          label="Mobil Baru"
          value={newCars.length}
          sub={`${activeNewCars} aktif · ${newCars.length - activeNewCars} nonaktif`}
          href="/admin/new-cars"
          color="green"
        />
        <ConsistencyCard
          label="ANP Mobil Bekas"
          cr={anpData.consistency.consistencyRatio}
          isConsistent={anpData.consistency.isConsistent}
          criteriaCount={anpData.weights.length}
        />
        <ConsistencyCard
          label="ANP Mobil Baru"
          cr={newCarAnpData.consistency.consistencyRatio}
          isConsistent={newCarAnpData.consistency.isConsistent}
          criteriaCount={newCarAnpData.weights.length}
        />
      </section>

      {/* Top Picks */}
      {(topUsed || topNew) && (
        <section className="grid gap-5 lg:grid-cols-2">
          {topUsed && (
            <TopPickCard
              label="Rekomendasi Terbaik — Bekas"
              rank={topUsed.rank_position}
              brand={topUsed.data_car.brand}
              model={topUsed.data_car.model}
              year={topUsed.data_car.year}
              score={topUsed.final_score}
              imageUrl={getCarImageUrl(topUsed.data_car.image_url)}
              price={topUsed.data_car.price}
              href={`/cars/${topUsed.data_car._id}`}
              badge="Bekas"
              badgeColor="bg-primary"
            />
          )}
          {topNew && (
            <TopPickCard
              label="Rekomendasi Terbaik — Baru"
              rank={topNew.rank_position}
              brand={topNew.data_cars.brand}
              model={topNew.data_cars.model}
              year={topNew.data_cars.year}
              score={topNew.final_score}
              imageUrl={getCarImageUrl(topNew.data_cars.image_url)}
              price={topNew.data_cars.price}
              href={`/new-cars/${topNew.data_cars._id}`}
              badge="Baru"
              badgeColor="bg-green-500"
            />
          )}
        </section>
      )}

      {/* Rankings side-by-side */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Used cars ranking */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex items-center gap-2">
              <Car size={18} className="text-primary" />
              <h2 className="font-semibold">Top Ranking Mobil Bekas</h2>
            </div>
            <Link
              href="/admin/anp-engine"
              className="text-xs font-medium text-primary hover:underline"
            >
              Lihat semua
            </Link>
          </div>

          {anpData.rankings.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-secondary">
              Belum ada data ranking. Jalankan ANP Engine terlebih dahulu.
            </p>
          ) : (
            <div className="divide-y divide-slate-50">
              {anpData.rankings.slice(0, 5).map((item) => (
                <RankRow
                  key={item.data_car._id}
                  rank={item.rank_position}
                  imageUrl={getCarImageUrl(item.data_car.image_url)}
                  name={`${item.data_car.brand} ${item.data_car.model}`}
                  year={item.data_car.year}
                  score={item.final_score}
                  href={`/cars/${item.data_car._id}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* New cars ranking */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex items-center gap-2">
              <CarFront size={18} className="text-green-600" />
              <h2 className="font-semibold">Top Ranking Mobil Baru</h2>
            </div>
            <Link
              href="/admin/anp-engine"
              className="text-xs font-medium text-primary hover:underline"
            >
              Lihat semua
            </Link>
          </div>

          {newCarAnpData.rankings.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-secondary">
              Belum ada data ranking. Jalankan ANP Engine terlebih dahulu.
            </p>
          ) : (
            <div className="divide-y divide-slate-50">
              {newCarAnpData.rankings.slice(0, 5).map((item) => (
                <RankRow
                  key={item.data_cars._id}
                  rank={item.rank_position}
                  imageUrl={getCarImageUrl(item.data_cars.image_url)}
                  name={`${item.data_cars.brand} ${item.data_cars.model}`}
                  year={item.data_cars.year}
                  score={item.final_score}
                  href={`/new-cars/${item.data_cars._id}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ANP Criteria weights */}
      <section className="grid gap-6 lg:grid-cols-2">
        <CriteriaCard label="Bobot Kriteria — Mobil Bekas" weights={anpData.weights.map((w) => ({ code: w.criteria_code, name: w.criteria_name, weight: w.weight }))} />
        <CriteriaCard label="Bobot Kriteria — Mobil Baru" weights={newCarAnpData.weights.map((w) => ({ code: w.criteria_code, name: w.criteria_name, weight: w.weight, type: w.type }))} />
      </section>
    </div>
  );
}

/* ─── Sub-components ───────────────────────────────────────────── */

function StatCard({
  icon,
  label,
  value,
  sub,
  href,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub: string;
  href: string;
  color: 'blue' | 'green';
}) {
  const bg = color === 'blue' ? 'bg-blue-50' : 'bg-green-50';
  return (
    <Link
      href={href}
      className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-6"
    >
      <div className="flex items-center justify-between">
        <div className={`rounded-xl ${bg} p-3`}>{icon}</div>
        <TrendingUp size={16} className="text-slate-300 transition group-hover:text-primary" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-secondary">{label}</p>
        <p className="mt-1 text-4xl font-bold text-foreground">{value}</p>
        <p className="mt-1 text-xs text-secondary">{sub}</p>
      </div>
    </Link>
  );
}

function ConsistencyCard({
  label,
  cr,
  isConsistent,
  criteriaCount,
}: {
  label: string;
  cr: number;
  isConsistent: boolean;
  criteriaCount: number;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex items-center justify-between">
        <div className={`rounded-xl p-3 ${isConsistent ? 'bg-green-50' : 'bg-red-50'}`}>
          {isConsistent ? (
            <CheckCircle2 size={22} className="text-green-600" />
          ) : (
            <XCircle size={22} className="text-red-500" />
          )}
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            isConsistent
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-600'
          }`}
        >
          {isConsistent ? 'Konsisten' : 'Tidak Konsisten'}
        </span>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-secondary">{label}</p>
        <p className="mt-1 text-4xl font-bold">{cr.toFixed(3)}</p>
        <p className="mt-1 text-xs text-secondary">CR · {criteriaCount} kriteria</p>
      </div>
    </div>
  );
}

function TopPickCard({
  label,
  rank,
  brand,
  model,
  year,
  score,
  imageUrl,
  price,
  href,
  badge,
  badgeColor,
}: {
  label: string;
  rank: number;
  brand: string;
  model: string;
  year: number;
  score: number;
  imageUrl: string;
  price: number;
  href: string;
  badge: string;
  badgeColor: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-secondary">{label}</p>
      </div>
      <div className="flex items-center gap-4 p-6">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-slate-100">
          <Image src={imageUrl} alt={`${brand} ${model}`} fill className="object-cover" sizes="112px" />
          <span className={`absolute left-2 top-2 rounded px-1.5 py-0.5 text-xs font-bold text-white ${badgeColor}`}>
            {badge}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-bold text-slate-900">
                {brand} {model}
              </p>
              <p className="text-sm text-secondary">{year}</p>
            </div>
            <span className="shrink-0 rounded-lg bg-blue-50 px-2.5 py-1 text-sm font-bold text-primary">
              #{rank}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-secondary">ANP Score</p>
              <p className="font-mono font-semibold text-primary">{score.toFixed(4)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-secondary">Harga</p>
              <p className="text-sm font-semibold">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100 px-6 py-3">
        <Link href={href} className="text-sm font-medium text-primary hover:underline">
          Lihat Detail →
        </Link>
      </div>
    </div>
  );
}

function RankRow({
  rank,
  imageUrl,
  name,
  year,
  score,
  href,
}: {
  rank: number;
  imageUrl: string;
  name: string;
  year: number;
  score: number;
  href: string;
}) {
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-3 transition hover:bg-slate-50 sm:gap-4 sm:px-6">
      <span className="w-6 shrink-0 text-center text-sm font-bold text-secondary">
        {rank}
      </span>
      <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-100">
        <Image src={imageUrl} alt={name} fill className="object-cover" sizes="56px" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{name}</p>
        <p className="text-xs text-secondary">{year}</p>
      </div>
      <span className="shrink-0 font-mono text-sm font-semibold text-primary">
        {score.toFixed(4)}
      </span>
    </Link>
  );
}

function CriteriaCard({
  label,
  weights,
}: {
  label: string;
  weights: { code: string; name: string; weight: number; type?: 'cost' | 'benefit' }[];
}) {
  const maxWeight = Math.max(...weights.map((w) => w.weight), 0.001);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <h3 className="mb-5 font-semibold">{label}</h3>
      {weights.length === 0 ? (
        <p className="text-sm text-secondary">Tidak ada data bobot.</p>
      ) : (
        <div className="space-y-3">
          {weights.map((w) => (
            <div key={w.code}>
              <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-secondary">
                    {w.code}
                  </span>
                  <span className="truncate text-slate-700">{w.name}</span>
                  {w.type && (
                    <span
                      className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-medium ${
                        w.type === 'benefit'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {w.type}
                    </span>
                  )}
                </div>
                <span className="shrink-0 font-semibold">{(w.weight * 100).toFixed(1)}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${
                    w.type === 'cost'
                      ? 'bg-orange-400'
                      : 'bg-primary'
                  }`}
                  style={{ width: `${(w.weight / maxWeight) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
