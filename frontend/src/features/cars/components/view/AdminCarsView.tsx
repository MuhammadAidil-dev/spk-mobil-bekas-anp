'use client';

import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { deleteCarAction } from '@/actions/cars.action';
import { getCarImageUrl } from '@/lib/api';
import type { ApiCar } from '@/types/api.type';
import ConfirmModal from '@/components/ui/ConfirmModal';

interface AdminCarsViewProps {
  cars: ApiCar[];
}

export default function AdminCarsView({ cars }: AdminCarsViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [targetCar, setTargetCar] = useState<ApiCar | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = cars.filter((car) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      car.brand.toLowerCase().includes(q) ||
      car.model.toLowerCase().includes(q) ||
      String(car.year).includes(q);
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && car.is_active) ||
      (statusFilter === 'inactive' && !car.is_active);
    return matchSearch && matchStatus;
  });

  function requestDelete(car: ApiCar) {
    setTargetCar(car);
    setPendingDeleteId(car._id);
  }

  function cancelDelete() {
    setPendingDeleteId(null);
    setTargetCar(null);
  }

  function confirmDelete() {
    if (!pendingDeleteId) return;
    startTransition(async () => {
      await deleteCarAction(pendingDeleteId);
      setPendingDeleteId(null);
      setTargetCar(null);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Mobil Bekas Inventori Manajemen
          </h1>
          <p className="mt-1 text-sm text-secondary">
            Update dan monitor data mobil bekas untuk proses perhitungan SPK
            ANP.
          </p>
        </div>

        <Link
          href="/admin/cars/add"
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari berdasarkan merk, model, atau tahun..."
              className="w-full rounded-lg border border-slate-300 bg-neutral py-2.5 pl-10 pr-4 outline-none transition focus:border-primary"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-neutral px-4 py-2 text-sm"
          >
            <option value="all">Semua Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </section>

      {/* Table */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-175">
            <thead className="bg-neutral">
              <tr className="text-left text-xs uppercase tracking-wider text-secondary">
                <th className="px-4 py-3 sm:px-6 sm:py-4">Foto</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4">Mobil</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4">Tahun</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4">Harga</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4">KM</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4">Mesin</th>
                <th className="px-4 py-3 text-center sm:px-6 sm:py-4">Status</th>
                <th className="px-4 py-3 text-right sm:px-6 sm:py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-secondary sm:py-16"
                  >
                    {cars.length === 0
                      ? 'Belum ada data mobil.'
                      : 'Tidak ada mobil yang cocok dengan pencarian.'}
                  </td>
                </tr>
              )}

              {filtered.map((car) => (
                <tr
                  key={car._id}
                  className="border-t border-slate-100 transition hover:bg-slate-50"
                >
                  <td className="px-4 py-3 sm:px-6 sm:py-4">
                    <div className="relative h-12 w-16 overflow-hidden rounded-lg border border-slate-200">
                      <Image
                        src={getCarImageUrl(car.image_url)}
                        alt={car.model}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  </td>

                  <td className="px-4 py-3 sm:px-6 sm:py-4">
                    <p className="font-semibold">{car.brand}</p>
                    <p className="text-sm text-secondary">{car.model}</p>
                  </td>

                  <td className="px-4 py-3 font-mono sm:px-6 sm:py-4">{car.year}</td>

                  <td className="px-4 py-3 font-semibold sm:px-6 sm:py-4">
                    Rp {car.price.toLocaleString('id-ID')}
                  </td>

                  <td className="px-4 py-3 font-mono sm:px-6 sm:py-4">
                    {car.mileage.toLocaleString('id-ID')} km
                  </td>

                  <td className="px-4 py-3 sm:px-6 sm:py-4">
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium">
                      {car.engine_capacity} cc
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center sm:px-6 sm:py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        car.is_active
                          ? 'border border-green-200 bg-green-100 text-green-700'
                          : 'border border-red-200 bg-red-100 text-red-700'
                      }`}
                    >
                      {car.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  <td className="px-4 py-3 sm:px-6 sm:py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/cars/${car._id}/edit`}
                        className="rounded-lg p-2 text-secondary transition hover:bg-slate-100 hover:text-primary"
                      >
                        <Edit size={18} />
                      </Link>

                      <Link
                        href={`/admin/cars/${car._id}`}
                        className="rounded-lg p-2 text-secondary transition hover:bg-slate-100 hover:text-primary"
                      >
                        <Eye size={18} />
                      </Link>

                      <button
                        onClick={() => requestDelete(car)}
                        className="rounded-lg p-2 text-secondary transition hover:bg-slate-100 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6 sm:py-4">
          <p className="text-sm text-secondary">
            Menampilkan {filtered.length} dari {cars.length} mobil
          </p>
        </div>
      </section>

      <ConfirmModal
        open={pendingDeleteId !== null}
        title="Hapus Mobil"
        message={
          targetCar
            ? `Yakin ingin menghapus "${targetCar.brand} ${targetCar.model} ${targetCar.year}"? Data tidak dapat dipulihkan.`
            : 'Yakin ingin menghapus mobil ini?'
        }
        confirmLabel="Hapus"
        isLoading={isPending}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
