import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { and, desc, eq, ilike, sql } from 'drizzle-orm';
import { dbCms as db } from '../db';
import { gallery } from '../db/schema';

export const galleryRoute = new OpenAPIHono();

const GallerySchema = z.object({
  id: z.number().openapi({ example: 1 }),
  title: z.string().openapi({ example: 'Foto Kegiatan' }),
  imageUrl: z.string().openapi({ example: 'https://example.com/img.jpg' }),
  category: z.string().nullable().openapi({ example: 'baksos' }),
  date: z.string().nullable().openapi({ example: '2024-03-20' }),
});

const GalleryListQuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(12),
});

const PaginatedGallerySchema = z.object({
  data: z.array(GallerySchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
});

galleryRoute.openapi(
  createRoute({
    method: 'get',
    path: '/',
    request: { query: GalleryListQuerySchema },
    responses: { 200: { content: { 'application/json': { schema: PaginatedGallerySchema } }, description: 'Get gallery (paginated)' } },
  }),
  async (c) => {
    const { q, category, page, pageSize } = c.req.valid('query');
    const offset = (page - 1) * pageSize;

    const where = and(
      q ? ilike(gallery.title, `%${q}%`) : undefined,
      category ? eq(gallery.category, category) : undefined
    );

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(gallery)
      .where(where);

    const rows = await db
      .select()
      .from(gallery)
      .where(where)
      .orderBy(desc(gallery.date), desc(gallery.createdAt))
      .limit(pageSize)
      .offset(offset);

    return c.json(
      {
        data: rows.map((r) => ({ ...r, date: r.date?.toISOString() || null })),
        page,
        pageSize,
        total: count,
      },
      200
    );
  }
);

galleryRoute.openapi(createRoute({ method: 'post', path: '/', request: { body: { content: { 'application/json': { schema: GallerySchema.omit({ id: true }) } } } }, responses: { 201: { content: { 'application/json': { schema: GallerySchema } }, description: 'Create gallery item' } } }), async (c) => {
  const body = c.req.valid('json');
  const [created] = await db.insert(gallery).values({ ...body, date: body.date ? new Date(body.date) : null }).returning();
  return c.json({ ...created, date: created.date?.toISOString() || null }, 201);
});

galleryRoute.openapi(createRoute({ method: 'put', path: '/{id}', request: { params: z.object({ id: z.string() }), body: { content: { 'application/json': { schema: GallerySchema.omit({ id: true }) } } } }, responses: { 200: { content: { 'application/json': { schema: GallerySchema } }, description: 'Update gallery item' }, 404: { description: 'Not found' } } }), async (c) => {
  const id = parseInt(c.req.param('id'));
  const body = c.req.valid('json');
  const [updated] = await db.update(gallery).set({ ...body, date: body.date ? new Date(body.date) : null, updatedAt: new Date() }).where(eq(gallery.id, id)).returning();
  if (!updated) return c.json({}, 404);
  return c.json({ ...updated, date: updated.date?.toISOString() || null }, 200);
});

galleryRoute.openapi(createRoute({ method: 'delete', path: '/{id}', request: { params: z.object({ id: z.string() }) }, responses: { 204: { description: 'Delete gallery item' } } }), async (c) => {
  const id = parseInt(c.req.param('id'));
  await db.delete(gallery).where(eq(gallery.id, id));
  return new Response(null, { status: 204 });
});
