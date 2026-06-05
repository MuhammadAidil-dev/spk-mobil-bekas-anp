'use server';

import { getAnpResult } from '@/services/anp.service';
import { getNewCarAnpResult } from '@/services/new-cars.service';

export async function recalculateAnpAction() {
  return getAnpResult();
}

export async function recalculateNewCarAnpAction() {
  return getNewCarAnpResult();
}
