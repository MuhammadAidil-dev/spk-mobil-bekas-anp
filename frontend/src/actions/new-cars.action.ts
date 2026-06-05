'use server';

import { createNewCar, deleteNewCar, updateNewCar } from '@/services/new-cars.service';

export async function createNewCarAction(formData: FormData) {
  return createNewCar(formData);
}

export async function updateNewCarAction(id: string, formData: FormData) {
  return updateNewCar(id, formData);
}

export async function deleteNewCarAction(id: string) {
  return deleteNewCar(id);
}
