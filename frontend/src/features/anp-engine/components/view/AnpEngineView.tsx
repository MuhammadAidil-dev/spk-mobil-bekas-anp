'use client';

import { useState, useTransition } from 'react';
import {
  AlertCircle,
  CheckCircle,
  Eye,
  Gauge,
  Loader2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import {
  recalculateAnpAction,
  recalculateNewCarAnpAction,
} from '@/actions/anp.action';
import type { AnpResult, NewCarAnpResult } from '@/types/api.type';

interface AnpEngineViewProps {
  anpData: AnpResult;
  newCarAnpData: NewCarAnpResult;
}

type Tab = 'bekas' | 'baru';

export default function AnpEngineView({
  anpData,
  newCarAnpData,
}: AnpEngineViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>('bekas');
  const [usedCarData, setUsedCarData] = useState<AnpResult>(anpData);
  const [newCarData, setNewCarData] = useState<NewCarAnpResult>(newCarAnpData);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleRecalculate() {
    setError(null);
    startTransition(async () => {
      if (activeTab === 'bekas') {
        const result = await recalculateAnpAction();
        if (result.success) setUsedCarData(result.data);
        else setError(result.error.message);
      } else {
        const result = await recalculateNewCarAnpAction();
        if (result.success) setNewCarData(result.data);
        else setError(result.error.message);
      }
    });
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            ANP Calculation Engine
          </h1>
          <p className="mt-1 text-sm text-secondary">
            Hitung ulang ranking ANP untuk mobil bekas atau mobil baru.
          </p>
        </div>

        <button
          onClick={handleRecalculate}
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {isPending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <RefreshCw size={18} />
          )}
          {isPending ? 'Menghitung...' : 'Recalculate'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <AlertCircle size={18} className="shrink-0" />
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-slate-100 p-1 w-fit">
        <button
          onClick={() => setActiveTab('bekas')}
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
          onClick={() => setActiveTab('baru')}
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

      {activeTab === 'bekas' ? (
        <UsedCarPanel data={usedCarData} />
      ) : (
        <NewCarPanel data={newCarData} />
      )}
    </div>
  );
}

/* ─── Used Car Panel ──────────────────────────────────────────── */

function UsedCarPanel({ data }: { data: AnpResult }) {
  const { rankings, consistency, weights } = data;

  return (
    <>
      <SummaryCards
        candidateCount={rankings.length}
        criteriaCount={weights.length}
        consistency={consistency}
      />

      <WeightsSection
        weights={weights.map((w) => ({
          code: w.criteria_code,
          name: w.criteria_name,
          weight: w.weight,
        }))}
      />

      <section className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-xl font-semibold">Ranking — Mobil Bekas</h2>
          <ConsistencyBadge isConsistent={consistency.isConsistent} />
        </div>

        <RankingTable
          rows={rankings.map((item) => ({
            id: item.data_car._id,
            rank: item.rank_position,
            label: `${item.data_car.brand} ${item.data_car.model}`,
            year: item.data_car.year,
            score: item.final_score,
            detailHref: `/cars/${item.data_car._id}`,
          }))}
        />
      </section>
    </>
  );
}

/* ─── New Car Panel ───────────────────────────────────────────── */

function NewCarPanel({ data }: { data: NewCarAnpResult }) {
  const { rankings, consistency, weights } = data;

  return (
    <>
      <SummaryCards
        candidateCount={rankings.length}
        criteriaCount={weights.length}
        consistency={consistency}
      />

      <WeightsSection
        weights={weights.map((w) => ({
          code: w.criteria_code,
          name: w.criteria_name,
          weight: w.weight,
          type: w.type,
        }))}
      />

      <section className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-xl font-semibold">Ranking — Mobil Baru</h2>
          <ConsistencyBadge isConsistent={consistency.isConsistent} />
        </div>

        <RankingTable
          rows={rankings.map((item) => ({
            id: item.data_cars._id,
            rank: item.rank_position,
            label: `${item.data_cars.brand} ${item.data_cars.model}`,
            year: item.data_cars.year,
            score: item.final_score,
            detailHref: `/new-cars/${item.data_cars._id}`,
          }))}
        />
      </section>
    </>
  );
}

/* ─── Shared sub-components ───────────────────────────────────── */

function SummaryCards({
  candidateCount,
  criteriaCount,
  consistency,
}: {
  candidateCount: number;
  criteriaCount: number;
  consistency: { consistencyRatio: number; isConsistent: boolean };
}) {
  return (
    <section className="grid gap-6 md:grid-cols-3">
      <StatCard
        label="Total Alternatives"
        value={candidateCount}
        unit="kandidat"
      />
      <StatCard
        label="Criteria Count"
        value={criteriaCount}
        unit="Fixed Criteria"
      />

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <p className="mb-2 text-xs uppercase tracking-wider text-secondary">
          Consistency Ratio
        </p>
        <div className="flex items-center gap-3">
          <div
            className={`h-3 w-3 rounded-full ${
              consistency.isConsistent ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="text-4xl font-bold">
            {consistency.consistencyRatio.toFixed(3)}
          </span>
          <span
            className={`rounded px-2 py-1 text-xs font-semibold ${
              consistency.isConsistent
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {consistency.isConsistent ? 'CONSISTENT' : 'INCONSISTENT'}
          </span>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="mb-2 text-xs uppercase tracking-wider text-secondary">
        {label}
      </p>
      <div className="flex items-end gap-2">
        <span className="text-4xl font-bold">{value}</span>
        <span className="text-sm text-secondary">{unit}</span>
      </div>
    </div>
  );
}

function WeightsSection({
  weights,
}: {
  weights: { code: string; name: string; weight: number; type?: string }[];
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="mb-4 font-semibold">Bobot Kriteria</h2>
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {weights.map((w) => (
          <div
            key={w.code}
            className="rounded-lg border border-slate-100 bg-slate-50 p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase text-secondary">
                {w.code}
              </p>
              {w.type && (
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                    w.type === 'benefit'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {w.type}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-foreground">{w.name}</p>
            <p className="mt-2 text-2xl font-bold text-primary">
              {(w.weight * 100).toFixed(2)}%
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ConsistencyBadge({ isConsistent }: { isConsistent: boolean }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium sm:px-4 sm:py-2 sm:text-sm ${
        isConsistent ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
      }`}
    >
      <CheckCircle size={15} />
      {isConsistent ? 'Konsisten' : 'Tidak Konsisten'}
    </div>
  );
}

function RankingTable({
  rows,
}: {
  rows: {
    id: string;
    rank: number;
    label: string;
    year: number;
    score: number;
    detailHref?: string;
  }[];
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-secondary">
        Belum ada data. Klik Recalculate untuk menghitung.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-4 py-3 sm:px-6 sm:py-4">
        <h3 className="font-semibold">Full Ranking Table</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-100">
          <thead className="bg-neutral">
            <tr className="text-left text-xs uppercase tracking-wider text-secondary">
              <th className="px-4 py-3 sm:px-6 sm:py-4">Rank</th>
              <th className="px-4 py-3 sm:px-6 sm:py-4">Vehicle</th>
              <th className="px-4 py-3 sm:px-6 sm:py-4">Score</th>
              <th className="px-4 py-3 sm:px-6 sm:py-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-4 py-3 sm:px-6 sm:py-4">
                  <span
                    className={
                      row.rank === 1
                        ? 'font-bold text-primary'
                        : 'font-semibold'
                    }
                  >
                    #{row.rank}
                  </span>
                </td>

                <td className="px-4 py-3 sm:px-6 sm:py-4">
                  <p className="font-medium">{row.label}</p>
                  <p className="text-sm text-secondary">{row.year}</p>
                </td>

                <td className="px-4 py-3 font-mono sm:px-6 sm:py-4">{row.score.toFixed(4)}</td>

                <td className="px-4 py-3 sm:px-6 sm:py-4">
                  {row.detailHref ? (
                    <Link
                      href={row.detailHref}
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-secondary transition hover:bg-slate-200"
                    >
                      <Eye size={16} />
                      Detail
                    </Link>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
