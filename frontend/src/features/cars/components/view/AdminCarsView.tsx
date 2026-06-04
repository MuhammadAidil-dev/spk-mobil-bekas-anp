import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type CarStatus = 'available' | 'review' | 'sold';

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  engine: string;
  imageUrl: string;
  status: CarStatus;
}

const cars: Car[] = [
  {
    id: '1',
    brand: 'Toyota',
    model: 'Avanza 1.5 G',
    year: 2022,
    price: 215000000,
    mileage: 25000,
    engine: '1496 cc',
    status: 'available',
    imageUrl:
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=1200',
  },
  {
    id: '2',
    brand: 'Honda',
    model: 'Mobilio E CVT',
    year: 2021,
    price: 198000000,
    mileage: 42000,
    engine: '1496 cc',
    status: 'review',
    imageUrl:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200',
  },
  {
    id: '3',
    brand: 'Mitsubishi',
    model: 'Xpander Sport',
    year: 2022,
    price: 255000000,
    mileage: 18000,
    engine: '1499 cc',
    status: 'available',
    imageUrl:
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200',
  },
  {
    id: '4',
    brand: 'Suzuki',
    model: 'Ertiga GX',
    year: 2020,
    price: 185000000,
    mileage: 65000,
    engine: '1462 cc',
    status: 'sold',
    imageUrl:
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1200',
  },
];

const statusBadge = {
  available: {
    label: 'Available',
    className: 'bg-green-100 text-green-700 border border-green-200',
  },
  review: {
    label: 'In Review',
    className: 'bg-blue-100 text-blue-700 border border-blue-200',
  },
  sold: {
    label: 'Sold',
    className: 'bg-red-100 text-red-700 border border-red-200',
  },
};

export default function AdminCarsView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Car Inventory Management
          </h1>

          <p className="mt-1 text-sm text-secondary">
            Update dan monitor data mobil untuk proses perhitungan SPK ANP.
          </p>
        </div>

        <Link
          href={'/admin/cars/add'}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-white transition hover:opacity-90"
        >
          <Plus size={18} />
          Tambah Mobil
        </Link>
      </header>

      {/* Search & Filter */}
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
            />

            <input
              placeholder="Cari berdasarkan merk, model, atau tahun..."
              className="w-full rounded-lg border border-slate-300 bg-neutral py-2.5 pl-10 pr-4 outline-none transition focus:border-primary"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select className="rounded-lg border border-slate-300 bg-neutral px-4 py-2 text-sm">
              <option>Semua Merk</option>
              <option>Toyota</option>
              <option>Honda</option>
              <option>Mitsubishi</option>
            </select>

            <select className="rounded-lg border border-slate-300 bg-neutral px-4 py-2 text-sm">
              <option>Semua Status</option>
              <option>Available</option>
              <option>In Review</option>
              <option>Sold</option>
            </select>

            {/* <button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm text-secondary transition hover:bg-slate-50">
              <Filter size={16} />
              Filter
            </button> */}
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-neutral">
              <tr className="text-left text-xs uppercase tracking-wider text-secondary">
                <th className="px-6 py-4">Foto</th>
                <th className="px-6 py-4">Mobil</th>
                <th className="px-6 py-4">Tahun</th>
                <th className="px-6 py-4">Harga</th>
                <th className="px-6 py-4">KM</th>
                <th className="px-6 py-4">Mesin</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {cars.map((car) => (
                <tr
                  key={car.id}
                  className="border-t border-slate-100 transition hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <div className="h-12 w-16 overflow-hidden rounded-lg border border-slate-200">
                      <Image
                        src={car.imageUrl}
                        alt={car.model}
                        className="object-cover"
                        width={100}
                        height={100}
                      />
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold">{car.brand}</p>

                      <p className="text-sm text-secondary">{car.model}</p>
                    </div>
                  </td>

                  <td className="px-6 py-4 font-mono">{car.year}</td>

                  <td className="px-6 py-4 font-semibold">
                    Rp {car.price.toLocaleString('id-ID')}
                  </td>

                  <td className="px-6 py-4 font-mono">
                    {car.mileage.toLocaleString('id-ID')} km
                  </td>

                  <td className="px-6 py-4">
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium">
                      {car.engine}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        statusBadge[car.status].className
                      }`}
                    >
                      {statusBadge[car.status].label}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button className="rounded-lg p-2 text-secondary transition hover:bg-slate-100 hover:text-primary">
                        <Edit size={18} />
                      </button>

                      <button className="rounded-lg p-2 text-secondary transition hover:bg-slate-100 hover:text-red-600">
                        <Trash2 size={18} />
                      </button>

                      <button className="rounded-lg p-2 text-secondary transition hover:bg-slate-100 hover:text-primary">
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4">
          <p className="text-sm text-secondary">
            Menampilkan 1-4 dari 30 mobil
          </p>

          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-slate-300 p-2">
              <ChevronLeft size={18} />
            </button>

            <button className="h-8 w-8 rounded-lg bg-primary text-sm font-medium text-white">
              1
            </button>

            <button className="h-8 w-8 rounded-lg border border-slate-300 text-sm">
              2
            </button>

            <button className="h-8 w-8 rounded-lg border border-slate-300 text-sm">
              3
            </button>

            <button className="rounded-lg border border-slate-300 p-2">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
