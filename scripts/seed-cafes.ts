import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars before running this script.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const csvPath = process.argv[2] ?? path.join(__dirname, '..', 'assets', 'seed', 'cafes.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const rows: Record<string, string>[] = parse(csvContent, { columns: true, skip_empty_lines: true });

async function main() {
  const cafes = rows.map((row) => ({
    name: row.name,
    address: row.address,
    suburb: row.suburb,
    state: row.state,
    postcode: row.postcode,
    lat: Number(row.lat),
    lng: Number(row.lng),
    phone: row.phone || null,
    website: row.website || null,
    hours: row.hours_json ? JSON.parse(row.hours_json) : null,
    allpress_verified: row.allpress_verified === 'true',
    notes: row.notes || null,
  }));

  const { error, count } = await supabase.from('cafes').insert(cafes, { count: 'exact' });
  if (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
  console.log(`Inserted ${count ?? cafes.length} cafes from ${csvPath}`);
}

main();
