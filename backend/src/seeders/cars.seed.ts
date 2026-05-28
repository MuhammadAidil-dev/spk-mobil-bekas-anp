import { connectDb, disconnectDB } from '@/config/database.config';
import { loadEnv } from '@/config/env';

const env = loadEnv();

const up = async () => {
  //   for (const data of criteriaSeeds) {
  //     await Criteria.create(data);
  //     console.log('Criteria berhasil ditambahkan : ', data);
  //   }
};

const down = async () => {
  //   if (env.NODE_ENV === 'production') {
  //     throw new Error(
  //       '❌ Perintah clear tidak diizinkan di environment production!',
  //     );
  //   }
  //   return await Criteria.deleteMany();
};

const runSeed = async () => {
  const arg = process.argv[2]; // seed | clear

  try {
    await connectDb();

    if (arg === 'down') {
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
