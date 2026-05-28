import { connectDb, disconnectDB } from '@/config/database.config';
import { loadEnv } from '@/config/env';
import { CarModel } from '@/modules/cars/car.model';

const env = loadEnv();

export const carSeed = [
  {
    brand: 'Toyota',
    model: 'Avanza G',
    year: 2020,
    price: 185000000,
    mileage: 45000,
    engine_capacity: 1500,
    seat_capacity: 7,
    transmission: 'automatic',
    fuel_type: 'gasoline',
    color: 'Black',
    plate_region: 'BM',
    image_url: 'https://example.com/cars/toyota-avanza-2020.jpg',
    description:
      'Toyota Avanza G 2020 kondisi sangat baik, cocok untuk keluarga.',
    is_active: true,
  },
  {
    brand: 'Honda',
    model: 'Brio RS',
    year: 2021,
    price: 198000000,
    mileage: 28000,
    engine_capacity: 1200,
    seat_capacity: 5,
    transmission: 'automatic',
    fuel_type: 'gasoline',
    color: 'Red',
    plate_region: 'BM',
    image_url: 'https://example.com/cars/honda-brio-2021.jpg',
    description: 'Honda Brio RS sporty dan irit bahan bakar.',
    is_active: true,
  },
  {
    brand: 'Mitsubishi',
    model: 'Xpander Ultimate',
    year: 2019,
    price: 225000000,
    mileage: 52000,
    engine_capacity: 1500,
    seat_capacity: 7,
    transmission: 'automatic',
    fuel_type: 'gasoline',
    color: 'Silver',
    plate_region: 'BM',
    image_url: 'https://example.com/cars/xpander-2019.jpg',
    description: 'Mitsubishi Xpander Ultimate dengan kabin luas dan nyaman.',
    is_active: true,
  },
  {
    brand: 'Suzuki',
    model: 'Ertiga GX',
    year: 2018,
    price: 165000000,
    mileage: 67000,
    engine_capacity: 1400,
    seat_capacity: 7,
    transmission: 'manual',
    fuel_type: 'gasoline',
    color: 'White',
    plate_region: 'BM',
    image_url: 'https://example.com/cars/ertiga-2018.jpg',
    description: 'Suzuki Ertiga GX cocok untuk kebutuhan keluarga.',
    is_active: true,
  },
  {
    brand: 'Toyota',
    model: 'Rush TRD',
    year: 2021,
    price: 255000000,
    mileage: 31000,
    engine_capacity: 1500,
    seat_capacity: 7,
    transmission: 'automatic',
    fuel_type: 'gasoline',
    color: 'White',
    plate_region: 'BM',
    image_url: 'https://example.com/cars/rush-2021.jpg',
    description:
      'Toyota Rush TRD dengan tampilan sporty dan ground clearance tinggi.',
    is_active: true,
  },
  {
    brand: 'Daihatsu',
    model: 'Terios X',
    year: 2020,
    price: 210000000,
    mileage: 42000,
    engine_capacity: 1500,
    seat_capacity: 7,
    transmission: 'manual',
    fuel_type: 'gasoline',
    color: 'Gray',
    plate_region: 'BM',
    image_url: 'https://example.com/cars/terios-2020.jpg',
    description: 'Daihatsu Terios X tangguh untuk perjalanan luar kota.',
    is_active: true,
  },
  {
    brand: 'Honda',
    model: 'Mobilio E CVT',
    year: 2019,
    price: 178000000,
    mileage: 50000,
    engine_capacity: 1500,
    seat_capacity: 7,
    transmission: 'automatic',
    fuel_type: 'gasoline',
    color: 'Black',
    plate_region: 'BM',
    image_url: 'https://example.com/cars/mobilio-2019.jpg',
    description: 'Honda Mobilio nyaman digunakan harian dan irit.',
    is_active: true,
  },
  {
    brand: 'Nissan',
    model: 'Grand Livina XV',
    year: 2018,
    price: 160000000,
    mileage: 75000,
    engine_capacity: 1500,
    seat_capacity: 7,
    transmission: 'automatic',
    fuel_type: 'gasoline',
    color: 'Brown',
    plate_region: 'BM',
    image_url: 'https://example.com/cars/livina-2018.jpg',
    description: 'Nissan Grand Livina dengan suspensi nyaman untuk keluarga.',
    is_active: true,
  },
  {
    brand: 'Toyota',
    model: 'Innova Reborn G',
    year: 2020,
    price: 315000000,
    mileage: 39000,
    engine_capacity: 2000,
    seat_capacity: 7,
    transmission: 'automatic',
    fuel_type: 'gasoline',
    color: 'Silver',
    plate_region: 'BM',
    image_url: 'https://example.com/cars/innova-2020.jpg',
    description: 'Toyota Innova Reborn premium dengan kabin luas.',
    is_active: true,
  },
  {
    brand: 'Wuling',
    model: 'Almaz RS',
    year: 2022,
    price: 298000000,
    mileage: 18000,
    engine_capacity: 1500,
    seat_capacity: 7,
    transmission: 'automatic',
    fuel_type: 'gasoline',
    color: 'Blue',
    plate_region: 'BM',
    image_url: 'https://example.com/cars/almaz-2022.jpg',
    description: 'Wuling Almaz RS dengan fitur modern dan teknologi lengkap.',
    is_active: true,
  },
];

const up = async () => {
  for (const data of carSeed) {
    await CarModel.create(data);
    console.log('Car berhasil ditambahkan : ', data);
  }
};

const down = async () => {
  if (env.NODE_ENV === 'production') {
    throw new Error(
      '❌ Perintah clear tidak diizinkan di environment production!',
    );
  }
  return await CarModel.deleteMany();
};

const runSeed = async () => {
  const arg = process.argv[2]; // seed | clear

  try {
    await connectDb();

    if (arg === 'clear') {
      await down();
      console.log('Data car berhasil dihapus');
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
