import { API_BASE_URL } from './axios';

export function getCarImageUrl(imageUrl?: string): string {
  const fallback = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8';
  if (!imageUrl) return fallback;
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${API_BASE_URL}/uploads/cars/${imageUrl}`;
}

export { API_BASE_URL };
