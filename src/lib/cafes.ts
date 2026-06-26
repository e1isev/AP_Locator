import { supabase } from './supabase';
import { Cafe } from '../types/cafe';

export interface MapBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export async function fetchCafesInBounds(bounds: MapBounds): Promise<Cafe[]> {
  const { data, error } = await supabase
    .from('cafes')
    .select('*')
    .gte('lat', bounds.minLat)
    .lte('lat', bounds.maxLat)
    .gte('lng', bounds.minLng)
    .lte('lng', bounds.maxLng);

  if (error) throw error;
  return (data ?? []) as Cafe[];
}

export async function searchCafes(query: string): Promise<Cafe[]> {
  const { data, error } = await supabase
    .from('cafes')
    .select('*')
    .or(`name.ilike.%${query}%,suburb.ilike.%${query}%`)
    .limit(50);

  if (error) throw error;
  return (data ?? []) as Cafe[];
}
