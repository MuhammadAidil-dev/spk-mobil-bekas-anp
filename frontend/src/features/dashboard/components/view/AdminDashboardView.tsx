import Image from 'next/image';

type DashboardMetric = {
  title: string;
  value: string;
  description: string;
  trend?: 'up' | 'warning';
};

type Activity = {
  id: string;
  title: string;
  time: string;
};

type TopCar = {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  engine_capacity: number;
  seat_capacity: number;
  transmission: 'manual' | 'automatic';
  fuel_type: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
  color: string;
  plate_region: string;
  image_url: string;
  is_active: boolean;
  clusterWeight: number;
  consistencyRatio: number;
  rankLabel: string;
  status: string;
};

const metrics: DashboardMetric[] = [
  {
    title: 'Total Mobil',
    value: '1,284',
    description: '+12% vs bulan lalu',
    trend: 'up',
  },
  {
    title: 'Total Kriteria',
    value: '4',
    description: 'Fixed criteria',
  },
  {
    title: 'Total Pairwise',
    value: '12',
    description: 'Perlu validasi CR',
    trend: 'warning',
  },
  {
    title: 'Total Ranking',
    value: '156',
    description: 'Ranking tersimpan',
  },
];

const activities: Activity[] = [
  {
    id: '1',
    title: 'Toyota Avanza 1.3 E berhasil ditambahkan',
    time: '2 menit lalu',
  },
  {
    id: '2',
    title: 'Pairwise comparison diperbarui',
    time: '1 jam lalu',
  },
  {
    id: '3',
    title: 'Perhitungan ANP berhasil dijalankan',
    time: '3 jam lalu',
  },
  {
    id: '4',
    title: 'Consistency Ratio melebihi batas',
    time: '5 jam lalu',
  },
];

const topCars: TopCar[] = [
  {
    id: '1',
    brand: 'Toyota',
    model: 'Avanza 1.3 E',
    year: 2019,
    price: 165000000,
    mileage: 78000,
    engine_capacity: 1329,
    seat_capacity: 7,
    transmission: 'manual',
    fuel_type: 'gasoline',
    color: 'Silver',
    plate_region: 'BM',
    image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70',
    is_active: true,
    clusterWeight: 0.1428,
    consistencyRatio: 0.082,
    rankLabel: 'Top 1%',
    status: 'Active',
  },
  {
    id: '2',
    brand: 'Honda',
    model: 'Mobilio E CVT',
    year: 2020,
    price: 185000000,
    mileage: 65000,
    engine_capacity: 1496,
    seat_capacity: 7,
    transmission: 'automatic',
    fuel_type: 'gasoline',
    color: 'White',
    plate_region: 'BM',
    image_url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8',
    is_active: true,
    clusterWeight: 0.1294,
    consistencyRatio: 0.091,
    rankLabel: 'Top 5%',
    status: 'Active',
  },
  {
    id: '3',
    brand: 'Suzuki',
    model: 'Ertiga GX',
    year: 2018,
    price: 158000000,
    mileage: 92000,
    engine_capacity: 1462,
    seat_capacity: 7,
    transmission: 'manual',
    fuel_type: 'gasoline',
    color: 'Black',
    plate_region: 'BM',
    image_url: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d',
    is_active: true,
    clusterWeight: 0.1182,
    consistencyRatio: 0.114,
    rankLabel: 'Pending',
    status: 'Action Needed',
  },
];

const chartData = [40, 60, 55, 80, 70, 85, 90, 88, 95, 100];

export default function AdminDashboardView() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-secondary">
            Sistem Pendukung Keputusan Mobil Bekas Metode ANP
          </p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <button className="rounded-xl bg-primary px-5 py-4 font-semibold text-white transition hover:opacity-90 cursor-pointer">
          Tambah Mobil
        </button>

        <button className="rounded-xl border border-primary bg-white px-5 py-4 font-semibold text-primary cursor-pointer">
          Jalankan ANP
        </button>
      </section>

      {/* Metrics */}
      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {metric.title}
            </p>

            <h3 className="mt-3 text-4xl font-bold">{metric.value}</h3>

            <p
              className={`mt-3 text-sm ${
                metric.trend === 'up'
                  ? 'text-tertiary'
                  : metric.trend === 'warning'
                    ? 'text-red-500'
                    : 'text-slate-500'
              }`}
            >
              {metric.description}
            </p>
          </div>
        ))}
      </section>

      {/* Analytics */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-semibold">ANP Model Convergence</h2>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="h-3 w-3 rounded-full bg-primary" />
              Stability Index
            </div>
          </div>

          <div className="flex h-72 items-end gap-2">
            {chartData.map((value, index) => (
              <div
                key={index}
                className="flex-1 rounded-t-lg bg-primary transition hover:opacity-80"
                style={{ height: `${value}%` }}
              />
            ))}
          </div>
        </div>

        {/* Activities */}
        <div className="rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
          </div>

          <div className="space-y-6 p-6">
            {activities.map((activity) => (
              <div key={activity.id}>
                <p className="font-medium">{activity.title}</p>
                <span className="text-sm text-slate-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Cars */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <h2 className="text-xl font-semibold">Top Ranking Mobil Bekas</h2>

          <button className="font-semibold text-primary">Lihat Semua</button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-neutral">
              <tr>
                <th className="px-6 py-4 text-left">Mobil</th>
                <th className="px-6 py-4 text-left">Cluster Weight</th>
                <th className="px-6 py-4 text-left">CR</th>
                <th className="px-6 py-4 text-left">Ranking</th>
                <th className="px-6 py-4 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {topCars.map((car) => (
                <tr
                  key={car.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={car.image_url}
                        alt={car.model}
                        className="object-cover"
                        width={48}
                        height={48}
                      />

                      <div>
                        <p className="font-semibold">
                          {car.brand} {car.model}
                        </p>
                        <p className="text-sm text-slate-500">{car.year}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">{car.clusterWeight.toFixed(4)}</td>

                  <td className="px-6 py-4">
                    <span
                      className={
                        car.consistencyRatio <= 0.1
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {car.consistencyRatio.toFixed(3)}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-lg bg-blue-100 px-3 py-1 text-sm text-primary">
                      {car.rankLabel}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={
                        car.status === 'Active'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {car.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
