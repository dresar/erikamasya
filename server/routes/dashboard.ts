import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { desc, eq, sql } from 'drizzle-orm';
import { dbAnalytics, dbCore } from '../db';
import { activities, articles, contactMessages, members, pageViews } from '../db/schema';

export const dashboardRoute = new OpenAPIHono();

const DashboardStatsSchema = z.object({
  totalAnggota: z.number(),
  totalKegiatan: z.number(),
  totalArtikel: z.number(),
  pengunjungBulanIni: z.number(),
  pesanMasuk: z.number(),
  anggotaAktif: z.number(),
  totalAlumni: z.number(),
});

const MonthlySeriesSchema = z.array(
  z.object({
    bulan: z.string(),
    value: z.number(),
  })
);

const MembersActivitiesSeriesSchema = z.array(
  z.object({
    bulan: z.string(),
    anggota: z.number(),
    kegiatan: z.number(),
  })
);

dashboardRoute.openapi(
  createRoute({
    method: 'get',
    path: '/stats',
    responses: { 200: { content: { 'application/json': { schema: DashboardStatsSchema } }, description: 'Get dashboard stats' } },
  }),
  async (c) => {
    const [
      [{ totalAnggota }],
      [{ totalKegiatan }],
      [{ totalArtikel }],
      [{ pesanMasuk }],
      [{ anggotaAktif }],
      [{ totalAlumni }],
      [{ pengunjungBulanIni }],
    ] = await Promise.all([
      dbCore.select({ totalAnggota: sql<number>`count(*)`.mapWith(Number) }).from(members),
      dbCore.select({ totalKegiatan: sql<number>`count(*)`.mapWith(Number) }).from(activities),
      dbCore.select({ totalArtikel: sql<number>`count(*)`.mapWith(Number) }).from(articles),
      dbCore.select({ pesanMasuk: sql<number>`count(*)`.mapWith(Number) }).from(contactMessages).where(eq(contactMessages.isRead, false)),
      dbCore.select({ anggotaAktif: sql<number>`count(*)`.mapWith(Number) }).from(members).where(eq(members.isActive, true)),
      dbCore.select({ totalAlumni: sql<number>`count(*)`.mapWith(Number) }).from(members).where(eq(members.status, 'Alumni')),
      dbAnalytics.select({ pengunjungBulanIni: sql<number>`count(*)`.mapWith(Number) })
        .from(pageViews)
        .where(sql`date_trunc('month', ${pageViews.viewedAt}) = date_trunc('month', now())`),
    ]);

    return c.json({ totalAnggota, totalKegiatan, totalArtikel, pengunjungBulanIni, pesanMasuk, anggotaAktif, totalAlumni }, 200);
  }
);

dashboardRoute.openapi(
  createRoute({
    method: 'get',
    path: '/members-activities',
    responses: { 200: { content: { 'application/json': { schema: MembersActivitiesSeriesSchema } }, description: 'Monthly members & activities series (last 6 months)' } },
  }),
  async (c) => {
    const membersRows = await dbCore
      .select({
        month: sql<string>`to_char(date_trunc('month', ${members.createdAt}), 'Mon')`,
        value: sql<number>`count(*)`.mapWith(Number),
      })
      .from(members)
      .where(sql`${members.createdAt} >= (now() - interval '6 months')`)
      .groupBy(sql`date_trunc('month', ${members.createdAt})`)
      .orderBy(desc(sql`date_trunc('month', ${members.createdAt})`));

    const activitiesRows = await dbCore
      .select({
        month: sql<string>`to_char(date_trunc('month', ${activities.date}), 'Mon')`,
        value: sql<number>`count(*)`.mapWith(Number),
      })
      .from(activities)
      .where(sql`${activities.date} >= (now() - interval '6 months')`)
      .groupBy(sql`date_trunc('month', ${activities.date})`)
      .orderBy(desc(sql`date_trunc('month', ${activities.date})`));

    const map = new Map<string, { anggota: number; kegiatan: number }>();
    for (const r of membersRows) map.set(r.month, { anggota: r.value, kegiatan: 0 });
    for (const r of activitiesRows) {
      const existing = map.get(r.month) ?? { anggota: 0, kegiatan: 0 };
      map.set(r.month, { anggota: existing.anggota, kegiatan: r.value });
    }

    const merged = Array.from(map.entries()).map(([bulan, v]) => ({ bulan, anggota: v.anggota, kegiatan: v.kegiatan }));
    return c.json(merged.reverse(), 200);
  }
);

dashboardRoute.openapi(
  createRoute({
    method: 'get',
    path: '/visits',
    responses: { 200: { content: { 'application/json': { schema: MonthlySeriesSchema } }, description: 'Monthly visits series (last 6 months)' } },
  }),
  async (c) => {
    const rows = await dbAnalytics.select({
      month: sql<string>`to_char(date_trunc('month', ${pageViews.viewedAt}), 'Mon')`,
      value: sql<number>`count(*)`.mapWith(Number),
    })
      .from(pageViews)
      .where(sql`${pageViews.viewedAt} >= (now() - interval '6 months')`)
      .groupBy(sql`date_trunc('month', ${pageViews.viewedAt})`)
      .orderBy(desc(sql`date_trunc('month', ${pageViews.viewedAt})`));

    return c.json(rows.reverse().map((r) => ({ bulan: r.month, value: r.value })), 200);
  }
);
