import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config();

function createPool(url: string) {
  return new Pool({
    connectionString: url,
    max: 10,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
  });
}

function getUrl(envKey: string) {
  return process.env[envKey] || process.env.DATABASE_URL;
}

export const poolCore = createPool(getUrl('DATABASE_URL_CORE')!);
export const poolCms = createPool(getUrl('DATABASE_URL_CMS')!);
export const poolAdmin = createPool(getUrl('DATABASE_URL_ADMIN')!);
export const poolAnalytics = createPool(getUrl('DATABASE_URL_ANALYTICS')!);

export const dbCore = drizzle(poolCore, { schema });
export const dbCms = drizzle(poolCms, { schema });
export const dbAdmin = drizzle(poolAdmin, { schema });
export const dbAnalytics = drizzle(poolAnalytics, { schema });

export const db = dbCore;
