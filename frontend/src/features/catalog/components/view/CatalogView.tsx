import {
  Calendar,
  Car,
  Fuel,
  Gauge,
  Search,
  Settings2,
  Users,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

type Transmission = 'manual' | 'automatic';
type FuelType = 'gasoline' | 'diesel' | 'hybrid' | 'electric';

interface CarItem {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  engineCapacity: number;
  seatCapacity: number;
  transmission: Transmission;
  fuelType: FuelType;
  color: string;
  plateRegion: string;
  imageUrl: string;
  description: string;
  isActive: boolean;
}

const cars: CarItem[] = [
  {
    id: '1',
    brand: 'Toyota',
    model: 'Avanza 1.3 E',
    year: 2020,
    price: 165000000,
    mileage: 78000,
    engineCapacity: 1329,
    seatCapacity: 7,
    transmission: 'manual',
    fuelType: 'gasoline',
    color: 'Silver',
    plateRegion: 'BM',
    imageUrl: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8',
    description: 'Toyota Avanza kondisi terawat.',
    isActive: true,
  },
  {
    id: '2',
    brand: 'Honda',
    model: 'BR-V Prestige',
    year: 2021,
    price: 245000000,
    mileage: 42000,
    engineCapacity: 1497,
    seatCapacity: 7,
    transmission: 'automatic',
    fuelType: 'gasoline',
    color: 'White',
    plateRegion: 'BM',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70',
    description: 'Honda BR-V automatic.',
    isActive: true,
  },
  {
    id: '3',
    brand: 'Toyota',
    model: 'Innova Reborn',
    year: 2022,
    price: 355000000,
    mileage: 25000,
    engineCapacity: 2393,
    seatCapacity: 7,
    transmission: 'automatic',
    fuelType: 'diesel',
    color: 'Black',
    plateRegion: 'BM',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d',
    description: 'Innova diesel kondisi istimewa.',
    isActive: true,
  },
  {
    id: '4',
    brand: 'Mitsubishi',
    model: 'Xpander Ultimate',
    year: 2021,
    price: 255000000,
    mileage: 39000,
    engineCapacity: 1499,
    seatCapacity: 7,
    transmission: 'automatic',
    fuelType: 'gasoline',
    color: 'Grey',
    plateRegion: 'BM',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341',
    description: 'Xpander Ultimate AT.',
    isActive: true,
  },
  {
    id: '5',
    brand: 'Suzuki',
    model: 'Ertiga GX',
    year: 2020,
    price: 185000000,
    mileage: 62000,
    engineCapacity: 1462,
    seatCapacity: 7,
    transmission: 'manual',
    fuelType: 'gasoline',
    color: 'Silver',
    plateRegion: 'BM',
    imageUrl: 'https://images.unsplash.com/photo-1502877338535-766e1452684a',
    description: 'Suzuki Ertiga GX.',
    isActive: true,
  },
  {
    id: '6',
    brand: 'Daihatsu',
    model: 'Terios R',
    year: 2022,
    price: 245000000,
    mileage: 28000,
    engineCapacity: 1496,
    seatCapacity: 7,
    transmission: 'automatic',
    fuelType: 'gasoline',
    color: 'White',
    plateRegion: 'BM',
    imageUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c',
    description: 'Terios R AT.',
    isActive: true,
  },
];

const formatPrice = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);

export default function CatalogView() {
  return (
    <main className="mx-auto max-w-7xl py-8">
      {/* Header */}
      <section className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-foreground">
          Katalog Mobil Bekas
        </h1>

        <p className="text-secondary">
          Temukan mobil terbaik berdasarkan kebutuhan dan rekomendasi ANP.
        </p>
      </section>

      {/* Filter */}
      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-12">
          <div className="relative md:col-span-4">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Cari merk atau model..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition focus:border-primary"
            />
          </div>

          <div className="md:col-span-2">
            <select className="w-full rounded-xl border border-slate-200 px-4 py-3">
              <option>Semua Merk</option>
              <option>Toyota</option>
              <option>Honda</option>
              <option>Mitsubishi</option>
            </select>
          </div>

          {/* <div className="md:col-span-1">
            <select className="w-full rounded-xl border border-slate-200 px-2 py-3">
              <option>Tahun</option>
            </select>
          </div> */}

          {/* <div className="md:col-span-2">
            <select className="w-full rounded-xl border border-slate-200 px-4 py-3">
              <option>Rentang Harga</option>
            </select>
          </div> */}

          <div className="md:col-span-2">
            <select className="w-full rounded-xl border border-slate-200 px-4 py-3">
              <option>Transmisi</option>
              <option>Manual</option>
              <option>Automatic</option>
            </select>
          </div>

          {/* <div className="flex justify-end md:col-span-1">
            <button className="rounded-xl p-3 text-primary transition hover:bg-blue-50">
              <Settings2 size={20} />
            </button>
          </div> */}
        </div>
      </section>

      {/* Card Grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cars.map((car) => (
          <article
            key={car.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative h-52 overflow-hidden">
              <img
                src={car.imageUrl}
                alt={car.model}
                className="h-full w-full object-cover transition duration-500 hover:scale-105"
              />

              <span className="absolute left-4 top-4 rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-white">
                Tersedia
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
                  <span>{car.fuelType}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users size={16} />
                  <span>{car.seatCapacity} Kursi</span>
                </div>
              </div>

              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary py-3 font-medium text-primary transition hover:bg-primary hover:text-white">
                <Car size={18} />
                Lihat Detail
              </button>
            </div>
          </article>
        ))}
      </section>

      {/* Pagination */}
      <section className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-8 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-secondary">
          Menampilkan 1 - 6 dari 30 mobil
        </p>

        <div className="flex items-center gap-2">
          <button
            disabled
            className="rounded-xl border border-slate-200 p-2 opacity-50"
          >
            <ChevronLeft size={18} />
          </button>

          <button className="h-10 w-10 rounded-xl bg-primary text-white">
            1
          </button>

          <button className="h-10 w-10 rounded-xl border border-slate-200">
            2
          </button>

          <button className="h-10 w-10 rounded-xl border border-slate-200">
            3
          </button>

          <button className="rounded-xl border border-slate-200 p-2">
            <ChevronRight size={18} />
          </button>
        </div>
      </section>
    </main>
  );
}
