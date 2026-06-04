import { rankedCars, recommendationSummary } from '@/data/recomendations.data';
import Image from 'next/image';

export default function RecomendationView() {
  const topCar = rankedCars[0];

  return (
    <div className="min-h-screen ">
      <div className="mx-auto py-8">
        <section className="mb-10">
          <h1 className="text-4xl font-bold text-secondary">
            Rekomendasi Mobil Terbaik
          </h1>

          <p className="mt-3 max-w-3xl text-slate-500">
            Hasil perhitungan Analytic Network Process (ANP) berdasarkan
            kriteria harga, kilometer, kapasitas mesin dan kapasitas tempat
            duduk.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-4 mb-10">
          <StatCard
            title="Total Kandidat"
            value={recommendationSummary.totalCandidates}
          />

          <StatCard
            title="Kriteria"
            value={recommendationSummary.totalCriteria}
          />

          <StatCard title="CR" value={recommendationSummary.consistencyRatio} />

          <StatCard
            title="Waktu Proses"
            value={recommendationSummary.processingTime}
          />
        </section>

        <section className="overflow-hidden rounded-3xl bg-secondary text-white mb-10">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 lg:p-12">
              <div className="inline-flex rounded-full bg-primary px-4 py-2 text-sm">
                Rekomendasi #1
              </div>

              <h2 className="mt-5 text-4xl font-bold">
                {topCar.car.brand} {topCar.car.model}
              </h2>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-300">
                <span>Rp {topCar.car.price.toLocaleString('id-ID')}</span>

                <span>{topCar.car.fuelType}</span>

                <span>{topCar.car.seatCapacity} Kursi</span>
              </div>

              <div className="mt-8 rounded-2xl border border-white/20 bg-white/10 p-6">
                <div className="text-sm text-slate-300">Final Score</div>

                <div className="text-4xl font-bold">{topCar.score}</div>
              </div>
            </div>

            <div className="relative min-h-87.5">
              <Image
                fill
                priority
                src={topCar.car.imageUrl}
                alt={topCar.car.model}
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 overflow-hidden">
            <div className="border-b p-5">
              <h3 className="font-semibold">Ranking Mobil</h3>
            </div>

            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-4 text-left">Rank</th>
                  <th className="p-4 text-left">Mobil</th>
                  <th className="p-4 text-left">Harga</th>
                  <th className="p-4 text-left">BBM</th>
                  <th className="p-4 text-left">Score</th>
                </tr>
              </thead>

              <tbody>
                {rankedCars.map((item) => (
                  <tr key={item.car.id} className="border-t">
                    <td className="p-4">#{item.rank}</td>

                    <td className="p-4">
                      <div className="font-medium">
                        {item.car.brand} {item.car.model}
                      </div>

                      <div className="text-sm text-slate-500">
                        {item.car.year}
                      </div>
                    </td>

                    <td className="p-4">
                      Rp {item.car.price.toLocaleString('id-ID')}
                    </td>

                    <td className="p-4 capitalize">{item.car.fuelType}</td>

                    <td className="p-4 font-semibold text-primary">
                      {item.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 p-6">
            <h3 className="mb-6 font-semibold">Top Scores</h3>

            <div className="space-y-5">
              {rankedCars.map((item) => (
                <div key={item.car.id}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>{item.car.brand}</span>

                    <span>{item.score}</span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-primary transition-all duration-700"
                      style={{
                        width: `${item.score * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
              Bobot ANP dihitung berdasarkan kriteria Harga, Kilometer,
              Kapasitas Mesin, dan Kapasitas Kursi.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <p className="text-sm text-slate-500">{title}</p>

      <p className="mt-2 text-3xl font-bold text-secondary">{value}</p>
    </div>
  );
}
