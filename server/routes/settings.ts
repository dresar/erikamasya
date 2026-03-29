import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { eq } from 'drizzle-orm';
import { dbAdmin as db } from '../db';
import { siteSettings } from '../db/schema';

export const settingsRoute = new OpenAPIHono();

const SettingsSchema = z.object({
  organizationName: z.string().nullable(),
  description: z.string().nullable(),
  logoUrl: z.string().nullable(),
  primaryColor: z.string().nullable(),
  accentColor: z.string().nullable(),
  address: z.string().nullable(),
  phone: z.string().nullable(),
  contactEmail: z.string().nullable(),
  officeHours: z.string().nullable(),
  mapEmbedUrl: z.string().nullable(),
});

const SettingsUpdateSchema = SettingsSchema.partial();

const SETTINGS_KEYS = {
  organizationName: 'organizationName',
  description: 'description',
  logoUrl: 'logoUrl',
  primaryColor: 'primaryColor',
  accentColor: 'accentColor',
  address: 'address',
  phone: 'phone',
  contactEmail: 'contactEmail',
  officeHours: 'officeHours',
  mapEmbedUrl: 'mapEmbedUrl',
} as const;

async function getSetting(key: string) {
  const [row] = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
  return row?.value ?? null;
}

settingsRoute.openapi(
  createRoute({
    method: 'get',
    path: '/',
    responses: { 200: { content: { 'application/json': { schema: SettingsSchema } }, description: 'Get site settings' } },
  }),
  async (c) => {
    const [organizationName, description, logoUrl, primaryColor, accentColor, address, phone, contactEmail, officeHours, mapEmbedUrl] =
      await Promise.all([
      getSetting(SETTINGS_KEYS.organizationName),
      getSetting(SETTINGS_KEYS.description),
      getSetting(SETTINGS_KEYS.logoUrl),
      getSetting(SETTINGS_KEYS.primaryColor),
      getSetting(SETTINGS_KEYS.accentColor),
      getSetting(SETTINGS_KEYS.address),
      getSetting(SETTINGS_KEYS.phone),
      getSetting(SETTINGS_KEYS.contactEmail),
      getSetting(SETTINGS_KEYS.officeHours),
      getSetting(SETTINGS_KEYS.mapEmbedUrl),
    ]);

    return c.json({ organizationName, description, logoUrl, primaryColor, accentColor, address, phone, contactEmail, officeHours, mapEmbedUrl }, 200);
  }
);

settingsRoute.openapi(
  createRoute({
    method: 'put',
    path: '/',
    request: { body: { content: { 'application/json': { schema: SettingsUpdateSchema } } } },
    responses: { 200: { content: { 'application/json': { schema: SettingsSchema } }, description: 'Update site settings' } },
  }),
  async (c) => {
    const body = c.req.valid('json');

    const entries = Object.entries(body).filter(([, v]) => v !== undefined) as Array<[keyof typeof SETTINGS_KEYS, string | null]>;
    if (entries.length === 0) {
      const [organizationName, description, logoUrl, primaryColor, accentColor, address, phone, contactEmail, officeHours, mapEmbedUrl] =
        await Promise.all([
        getSetting(SETTINGS_KEYS.organizationName),
        getSetting(SETTINGS_KEYS.description),
        getSetting(SETTINGS_KEYS.logoUrl),
        getSetting(SETTINGS_KEYS.primaryColor),
        getSetting(SETTINGS_KEYS.accentColor),
        getSetting(SETTINGS_KEYS.address),
        getSetting(SETTINGS_KEYS.phone),
        getSetting(SETTINGS_KEYS.contactEmail),
        getSetting(SETTINGS_KEYS.officeHours),
        getSetting(SETTINGS_KEYS.mapEmbedUrl),
      ]);

      return c.json({ organizationName, description, logoUrl, primaryColor, accentColor, address, phone, contactEmail, officeHours, mapEmbedUrl }, 200);
    }

    for (const [key, value] of entries) {
      await db
        .insert(siteSettings)
        .values({ key: SETTINGS_KEYS[key], value: value ?? null, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: siteSettings.key,
          set: { value: value ?? null, updatedAt: new Date() },
        });
    }

    const [organizationName, description, logoUrl, primaryColor, accentColor, address, phone, contactEmail, officeHours, mapEmbedUrl] =
      await Promise.all([
      getSetting(SETTINGS_KEYS.organizationName),
      getSetting(SETTINGS_KEYS.description),
      getSetting(SETTINGS_KEYS.logoUrl),
      getSetting(SETTINGS_KEYS.primaryColor),
      getSetting(SETTINGS_KEYS.accentColor),
      getSetting(SETTINGS_KEYS.address),
      getSetting(SETTINGS_KEYS.phone),
      getSetting(SETTINGS_KEYS.contactEmail),
      getSetting(SETTINGS_KEYS.officeHours),
      getSetting(SETTINGS_KEYS.mapEmbedUrl),
    ]);

    return c.json({ organizationName, description, logoUrl, primaryColor, accentColor, address, phone, contactEmail, officeHours, mapEmbedUrl }, 200);
  }
);
