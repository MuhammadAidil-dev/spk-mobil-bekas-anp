import {
  CheckCircle,
  Eye,
  RefreshCw,
  Grid2X2,
  BarChart3,
  Table2,
  Layers3,
  Trophy,
} from 'lucide-react';

interface RankingResult {
  id: string;
  rank: number;
  score: number;
  car: {
    brand: string;
    model: string;
    year: number;
  };
}

const rankingResults: RankingResult[] = [
  {
    id: '1',
    rank: 1,
    score: 0.9421,
    car: {
      brand: 'Toyota',
      model: 'Avanza 1.5 G',
      year: 2022,
    },
  },
  {
    id: '2',
    rank: 2,
    score: 0.8954,
    car: {
      brand: 'Honda',
      model: 'Mobilio E',
      year: 2021,
    },
  },
  {
    id: '3',
    rank: 3,
    score: 0.8812,
    car: {
      brand: 'Suzuki',
      model: 'Ertiga GX',
      year: 2022,
    },
  },
  {
    id: '4',
    rank: 4,
    score: 0.8432,
    car: {
      brand: 'Mitsubishi',
      model: 'Xpander Sport',
      year: 2021,
    },
  },
  {
    id: '5',
    rank: 5,
    score: 0.8125,
    car: {
      brand: 'Toyota',
      model: 'Rush TRD',
      year: 2020,
    },
  },
  {
    id: '6',
    rank: 6,
    score: 0.7651,
    car: {
      brand: 'Daihatsu',
      model: 'Terios R',
      year: 2020,
    },
  },
  {
    id: '7',
    rank: 7,
    score: 0.7428,
    car: {
      brand: 'Honda',
      model: 'BR-V',
      year: 2019,
    },
  },
  {
    id: '8',
    rank: 8,
    score: 0.7104,
    car: {
      brand: 'Nissan',
      model: 'Livina VL',
      year: 2020,
    },
  },
];

const processSteps = [
  {
    label: 'Pairwise Matrix',
    icon: Grid2X2,
    active: true,
  },
  {
    label: 'Normalization',
    icon: BarChart3,
    active: false,
  },
  {
    label: 'Supermatrix',
    icon: Table2,
    active: false,
  },
  {
    label: 'Limit Matrix',
    icon: Layers3,
    active: false,
  },
  {
    label: 'Final Ranking',
    icon: Trophy,
    active: true,
  },
];

export default function AnpEngineView() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          ANP Calculation Engine
        </h1>

        <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-medium text-white transition hover:opacity-90 cursor-pointer">
          <RefreshCw size={18} />
          Recalculate
        </button>
      </div>

      {/* Stepper */}
      {/* <section className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="relative flex justify-between">
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-200" />

          {processSteps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.label}
                className="relative z-10 flex flex-col items-center gap-3"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white ${
                    step.active
                      ? 'border-primary text-primary'
                      : 'border-slate-300 text-slate-400'
                  }`}
                >
                  <Icon size={20} />
                </div>

                <span
                  className={`text-sm font-medium ${
                    step.active ? 'text-primary' : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </section> */}

      {/* Summary */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-2 text-xs uppercase tracking-wider text-secondary">
            Total Alternatives
          </p>

          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold">42</span>

            <span className="text-sm font-medium text-tertiary">
              +3 since last run
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-2 text-xs uppercase tracking-wider text-secondary">
            Criteria Count
          </p>

          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold">4</span>

            <span className="text-sm text-secondary">Fixed Criteria</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-2 text-xs uppercase tracking-wider text-secondary">
            Consistency Ratio
          </p>

          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-tertiary" />

            <span className="text-4xl font-bold">0.082</span>

            <span className="rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
              CONSISTENT
            </span>
          </div>
        </div>
      </section>

      {/* Result Header */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-2xl font-semibold">Ranking Results</h2>

          <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-tertiary">
            <CheckCircle size={16} />
            Calculation completed successfully
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h3 className="font-semibold">Full Ranking Table</h3>

            <button className="font-medium text-primary hover:underline">
              Export Results
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-neutral">
                <tr className="text-left text-xs uppercase tracking-wider text-secondary">
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {rankingResults.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <span
                        className={
                          item.rank === 1
                            ? 'font-bold text-primary'
                            : 'font-semibold'
                        }
                      >
                        #{item.rank}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">
                          {item.car.brand} {item.car.model}
                        </p>

                        <p className="text-sm text-secondary">
                          {item.car.year}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-mono">
                      {item.score.toFixed(4)}
                    </td>

                    <td className="px-6 py-4">
                      <button className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-secondary transition hover:bg-slate-200">
                        <Eye size={16} />
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
