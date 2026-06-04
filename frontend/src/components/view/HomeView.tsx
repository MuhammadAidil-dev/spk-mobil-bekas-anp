'use client';

import Image from 'next/image';

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
} from 'lucide-react';
import { featuredCars } from '@/data/cars.data';
import Link from 'next/link';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price);

export default function HomeView() {
  return (
    <div className="pb-12">
      {/* HERO */}
      <section className="relative overflow-hidden bg-white py-20 lg:py-32">
        <div className="container mx-auto">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-primary">
                Analytic Network Process Driven
              </span>

              <h1 className="mt-6 text-5xl font-bold leading-tight text-foreground">
                Temukan Mobil Bekas Terbaik dengan{' '}
                <span className="text-primary">Metode ANP</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg text-secondary">
                Sistem pendukung keputusan cerdas yang mempertimbangkan setiap
                keterkaitan antara kriteria teknis, harga, dan preferensi
                pribadi Anda.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href={'/recomendations'}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 font-semibold text-white hover:bg-primary/80 duration-150"
                >
                  Mulai Analisis
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href={'/catalog'}
                  className="rounded-xl border border-secondary px-8 py-4 font-semibold hover:shadow-md duration-150 hover:text-primary"
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
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-4xl font-bold">Featured Cars</h2>

              <p className="mt-2 text-secondary">
                Inventaris pilihan dengan skor tinggi.
              </p>
            </div>

            <Link
              href={'/catalog'}
              className="flex items-center gap-2 text-primary font-semibold hover:border-b duration-150 pb-1 transition-transform"
            >
              Lihat Semua
              <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {featuredCars.map((car) => (
              <div
                key={car.id}
                className="overflow-hidden rounded-2xl border bg-white transition hover:shadow-lg"
              >
                <div className="relative h-56">
                  <Image
                    src={car.imageUrl}
                    alt={car.name}
                    fill
                    className="object-cover"
                  />

                  {car.badge && (
                    <div className="absolute left-4 top-4 rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-white">
                      {car.badge}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="mb-4 flex justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{car.name}</h3>

                      <p className="text-sm text-secondary">{car.variant}</p>
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
                      {car.fuelType === 'Electric' ? (
                        <Zap size={14} />
                      ) : (
                        <Fuel size={14} />
                      )}
                      {car.fuelType}
                    </div>
                  </div>

                  <Link
                    href={`/cars/${car.id}`}
                    className="w-full rounded-xl border p-2 text-sm font-medium hover:border-primary hover:text-primary"
                  >
                    Detail Kendaraan
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-primary py-24 text-white rounded-lg shadow-md">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold">Kenapa AutoANP?</h2>

            <p className="mt-4 text-white/80">
              Keunggulan sistem dibanding platform konvensional.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                icon: Brain,
                title: 'Analisis Cerdas',
              },
              {
                icon: BadgeCheck,
                title: 'Terverifikasi',
              },
              {
                icon: Wallet,
                title: 'Transparansi Harga',
              },
              {
                icon: Headset,
                title: 'Dukungan Ahli',
              },
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

      {/* CTA */}
      {/* <section className="bg-white py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-5xl font-bold">Siap Memilih dengan Presisi?</h2>

          <p className="mt-6 text-lg text-secondary">
            Temukan kendaraan terbaik berdasarkan metode ANP.
          </p>

          <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
            <button className="rounded-2xl bg-primary px-10 py-5 font-semibold text-white">
              Daftar Sekarang
            </button>

            <button className="rounded-2xl border px-10 py-5 font-semibold">
              Hubungi Sales
            </button>
          </div>
        </div>
      </section> */}
    </div>
  );
}
