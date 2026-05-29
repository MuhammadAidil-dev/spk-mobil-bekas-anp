import { connectDb, disconnectDB } from '@/config/database.config';
import { loadEnv } from '@/config/env';
import { Criteria } from '@/modules/criteria/criteria.model';

const env = loadEnv();

export const criteriaSeed = [
  {
    code: 'PRICE',
    name: 'Harga',
    type: 'cost',
    description: 'Harga mobil bekas',
    order: 1,
  },
  {
    code: 'MILEAGE',
    name: 'Kilometer',
    type: 'cost',
    description: 'Total jarak tempuh kendaraan',
    order: 2,
  },
  {
    code: 'ENGINE_CAPACITY',
    name: 'Kapasitas Mesin',
    type: 'benefit',
    description: 'Kapasitas mesin kendaraan dalam CC',
    order: 3,
  },
  {
    code: 'SEAT_CAPACITY',
    name: 'Kapasitas Kursi',
    type: 'benefit',
    description: 'Jumlah kapasitas penumpang',
    order: 4,
  },
];

const up = async () => {
  for (const data of criteriaSeed) {
    await Criteria.create(data);
    console.log('Criteria berhasil ditambahkan : ', data);
  }
};

const down = async () => {
  if (env.NODE_ENV === 'production') {
    throw new Error(
      '❌ Perintah clear tidak diizinkan di environment production!',
    );
  }
  return await Criteria.deleteMany();
};

const runSeed = async () => {
  const arg = process.argv[2]; // seed | clear

  try {
    await connectDb();

    if (arg === 'clear') {
      await down();
      console.log('Data criteria berhasil dihapus');
    } else {
      await up();
    }
  } catch (error) {
    console.log('Error seed:', error);
  } finally {
    await disconnectDB();
  }
};

runSeed();
