'use server';

import { createCar, updateCar, deleteCar } from '@/services/cars.service';

export async function createCarAction(formData: FormData) {
  return createCar(formData);
}

export async function updateCarAction(id: string, formData: FormData) {
  return updateCar(id, formData);
}

export async function deleteCarAction(id: string) {
  return deleteCar(id);
}
