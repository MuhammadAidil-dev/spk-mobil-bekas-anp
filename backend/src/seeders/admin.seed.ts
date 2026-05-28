import { connectDb, disconnectDB } from '@/config/database.config';
import { loadEnv } from '@/config/env';
import { Admin } from '@/modules/admin/admin.model';

const env = loadEnv();

const up = async () => {
  const adminData = {
    email: env.ADMIN.EMAIL,
    password_hash: env.ADMIN.PASSWORD,
    name: 'admin-mobil',
  };

  await Admin.create(adminData);
  console.log('Data admin berhasil ditambahkan');
};

const down = async () => {
  if (env.NODE_ENV === 'production') {
    throw new Error(
      '❌ Perintah clear tidak diizinkan di environment production!',
    );
  }
  return await Admin.deleteMany();
};

const runSeed = async () => {
  const arg = process.argv[2]; // seed | clear

  try {
    await connectDb();

    if (arg === 'clear') {
      await down();
      console.log('Data admin berhasil dihapus');
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
