import { CreateNewCarDto } from '@/modules/newCars/newCar.type';
import { Types } from 'mongoose';
import { connectDb, disconnectDB } from '@/config/database.config';
import { loadEnv } from '@/config/env';
import { carSeed } from '@/constants/car.constants';
import { NewCarModel } from '@/modules/newCars/newCar.model';

const env = loadEnv();

export const newCarSeed = [
  {
    brand: 'Toyota',
    model: 'Avanza 1.5 G CVT',
    year: 2025,
    price: 295000000,
    engine_capacity: 1496,
    seat_capacity: 7,
    fuel_efficiency: 14.5,
    transmission: 'automatic',
    fuel_type: 'gasoline',
    color: 'White',
    image_url:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    description: 'MPV keluarga populer dengan kabin luas.',
  },
  {
    brand: 'Toyota',
    model: 'Veloz Q CVT',
    year: 2025,
    price: 335000000,
    engine_capacity: 1496,
    seat_capacity: 7,
    fuel_efficiency: 14.2,
    transmission: 'automatic',
    fuel_type: 'gasoline',
    color: 'Black',
    image_url:
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
    description: 'MPV premium dengan fitur lengkap.',
  },
  {
    brand: 'Toyota',
    model: 'Yaris Cross Hybrid',
    year: 2025,
    price: 440000000,
    engine_capacity: 1490,
    seat_capacity: 5,
    fuel_efficiency: 30,
    transmission: 'automatic',
    fuel_type: 'hybrid',
    color: 'Silver',
    image_url:
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80',
    description: 'SUV hybrid hemat bahan bakar.',
  },
  {
    brand: 'Honda',
    model: 'Brio RS CVT',
    year: 2025,
    price: 255000000,
    engine_capacity: 1199,
    seat_capacity: 5,
    fuel_efficiency: 19,
    transmission: 'automatic',
    fuel_type: 'gasoline',
    color: 'Yellow',
    image_url:
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    description: 'City car lincah dan irit.',
  },
  {
    brand: 'Honda',
    model: 'WR-V RS CVT',
    year: 2025,
    price: 325000000,
    engine_capacity: 1498,
    seat_capacity: 5,
    fuel_efficiency: 17,
    transmission: 'automatic',
    fuel_type: 'gasoline',
    color: 'Red',
    image_url:
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
    description: 'Compact SUV modern.',
  },
  {
    brand: 'Honda',
    model: 'HR-V SE CVT',
    year: 2025,
    price: 425000000,
    engine_capacity: 1498,
    seat_capacity: 5,
    fuel_efficiency: 16,
    transmission: 'automatic',
    fuel_type: 'gasoline',
    color: 'White',
    image_url:
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80',
    description: 'SUV premium dengan desain elegan.',
  },
  {
    brand: 'Mitsubishi',
    model: 'Xpander Ultimate CVT',
    year: 2025,
    price: 340000000,
    engine_capacity: 1499,
    seat_capacity: 7,
    fuel_efficiency: 14.8,
    transmission: 'automatic',
    fuel_type: 'gasoline',
    color: 'Gray',
    image_url:
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
    description: 'MPV favorit keluarga Indonesia.',
  },
  {
    brand: 'Mitsubishi',
    model: 'Xforce Ultimate CVT',
    year: 2025,
    price: 415000000,
    engine_capacity: 1499,
    seat_capacity: 5,
    fuel_efficiency: 15.5,
    transmission: 'automatic',
    fuel_type: 'gasoline',
    color: 'White',
    image_url:
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
    description: 'SUV kompak dengan fitur modern.',
  },
  {
    brand: 'Suzuki',
    model: 'Ertiga Hybrid GX',
    year: 2025,
    price: 315000000,
    engine_capacity: 1462,
    seat_capacity: 7,
    fuel_efficiency: 20,
    transmission: 'automatic',
    fuel_type: 'hybrid',
    color: 'Black',
    image_url:
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1200&q=80',
    description: 'MPV hybrid ekonomis.',
  },
  {
    brand: 'Suzuki',
    model: 'XL7 Hybrid Alpha',
    year: 2025,
    price: 335000000,
    engine_capacity: 1462,
    seat_capacity: 7,
    fuel_efficiency: 19,
    transmission: 'automatic',
    fuel_type: 'hybrid',
    color: 'Orange',
    image_url:
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
    description: 'SUV keluarga dengan teknologi hybrid.',
  },
  {
    brand: 'Daihatsu',
    model: 'Sigra R CVT',
    year: 2025,
    price: 190000000,
    engine_capacity: 1197,
    seat_capacity: 7,
    fuel_efficiency: 18,
    transmission: 'automatic',
    fuel_type: 'gasoline',
    color: 'Silver',
    image_url:
      'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1200&q=80',
    description: 'MPV LCGC ekonomis.',
  },
  {
    brand: 'Daihatsu',
    model: 'Rocky 1.2 CVT',
    year: 2025,
    price: 265000000,
    engine_capacity: 1198,
    seat_capacity: 5,
    fuel_efficiency: 18.5,
    transmission: 'automatic',
    fuel_type: 'gasoline',
    color: 'Red',
    image_url:
      'https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=1200&q=80',
    description: 'SUV kompak hemat bahan bakar.',
  },
  {
    brand: 'Hyundai',
    model: 'Stargazer Prime',
    year: 2025,
    price: 335000000,
    engine_capacity: 1497,
    seat_capacity: 7,
    fuel_efficiency: 15.5,
    transmission: 'automatic',
    fuel_type: 'gasoline',
    color: 'White',
    image_url:
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    description: 'MPV futuristik dengan fitur ADAS.',
  },
  {
    brand: 'Hyundai',
    model: 'Creta Prime',
    year: 2025,
    price: 420000000,
    engine_capacity: 1497,
    seat_capacity: 5,
    fuel_efficiency: 16,
    transmission: 'automatic',
    fuel_type: 'gasoline',
    color: 'Black',
    image_url:
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
    description: 'SUV modern dengan fitur lengkap.',
  },
  {
    brand: 'Hyundai',
    model: 'Ioniq 5 Prime',
    year: 2025,
    price: 820000000,
    engine_capacity: 217,
    seat_capacity: 5,
    fuel_efficiency: 45,
    transmission: 'automatic',
    fuel_type: 'electric',
    color: 'Gray',
    image_url:
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
    description: 'SUV listrik premium.',
  },
  {
    brand: 'Wuling',
    model: 'Air EV Long Range',
    year: 2025,
    price: 305000000,
    engine_capacity: 50,
    seat_capacity: 4,
    fuel_efficiency: 40,
    transmission: 'automatic',
    fuel_type: 'electric',
    color: 'Blue',
    image_url:
      'https://images.unsplash.com/photo-1593941707882-a56bbc8df843?auto=format&fit=crop&w=1200&q=80',
    description: 'Mobil listrik perkotaan.',
  },
  {
    brand: 'Wuling',
    model: 'Binguo EV Premium',
    year: 2025,
    price: 390000000,
    engine_capacity: 68,
    seat_capacity: 5,
    fuel_efficiency: 42,
    transmission: 'automatic',
    fuel_type: 'electric',
    color: 'Green',
    image_url:
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=1200&q=80',
    description: 'EV hatchback dengan desain retro.',
  },
  {
    brand: 'BYD',
    model: 'Atto 3 Advanced',
    year: 2025,
    price: 515000000,
    engine_capacity: 150,
    seat_capacity: 5,
    fuel_efficiency: 43,
    transmission: 'automatic',
    fuel_type: 'electric',
    color: 'White',
    image_url:
      'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?auto=format&fit=crop&w=1200&q=80',
    description: 'SUV listrik global BYD.',
  },
  {
    brand: 'BYD',
    model: 'Seal Premium',
    year: 2025,
    price: 640000000,
    engine_capacity: 230,
    seat_capacity: 5,
    fuel_efficiency: 44,
    transmission: 'automatic',
    fuel_type: 'electric',
    color: 'Blue',
    image_url:
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80',
    description: 'Sedan listrik performa tinggi.',
  },
  {
    brand: 'Chery',
    model: 'Omoda E5',
    year: 2025,
    price: 505000000,
    engine_capacity: 150,
    seat_capacity: 5,
    fuel_efficiency: 42,
    transmission: 'automatic',
    fuel_type: 'electric',
    color: 'Silver',
    image_url:
      'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=80',
    description: 'SUV listrik modern dan kompetitif.',
  },
];

const up = async () => {
  for (const data of newCarSeed) {
    await NewCarModel.create(data);
  }
};

const down = async () => {
  if (env.NODE_ENV === 'production') {
    throw new Error(
      '❌ Perintah clear tidak diizinkan di environment production!',
    );
  }
  return await NewCarModel.deleteMany();
};

const runSeed = async () => {
  const arg = process.argv[2]; // seed | clear

  try {
    await connectDb();

    if (arg === 'clear') {
      await down();
      console.log('Data new car berhasil dihapus');
    } else {
      await up();
      console.log('Data new car berhasil ditambahkan');
    }
  } catch (error) {
    console.log('Error seed:', error);
  } finally {
    await disconnectDB();
  }
};

runSeed();
