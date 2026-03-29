import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { and, desc, eq, ilike, sql } from 'drizzle-orm';
import { dbCms as db } from '../db';
import { articles } from '../db/schema';

export const articlesRoute = new OpenAPIHono();

const ArticleSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  slug: z.string().openapi({ example: 'peran-pemuda-dalam-pembangunan-bangsa' }),
  title: z.string().openapi({ example: 'Judul Artikel' }),
  excerpt: z.string().nullable().openapi({ example: 'Ringkasan artikel...' }),
  content: z.string().nullable().openapi({ example: 'Isi artikel...' }),
  authorName: z.string().nullable().openapi({ example: 'Ahmad Fauzi' }),
  authorId: z.number().nullable().openapi({ example: 1 }),
  status: z.string().nullable().openapi({ example: 'published' }),
  category: z.string().nullable().openapi({ example: 'Opini' }),
  readTime: z.string().nullable().openapi({ example: '5 menit' }),
  thumbnailUrl: z.string().nullable().openapi({ example: 'https://via.placeholder.com/800x450' }),
  publishedAt: z.string().nullable().openapi({ example: '2024-03-15' }),
});

const ArticleListQuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(50).optional().default(10),
});

const PaginatedArticlesSchema = z.object({
  data: z.array(ArticleSchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
});

articlesRoute.openapi(
  createRoute({
    method: 'get',
    path: '/',
    request: { query: ArticleListQuerySchema },
    responses: { 200: { content: { 'application/json': { schema: PaginatedArticlesSchema } }, description: 'Get articles (paginated)' } },
  }),
  async (c) => {
    const { q, category, status, page, pageSize } = c.req.valid('query');
    const offset = (page - 1) * pageSize;

    const where = and(
      q ? ilike(articles.title, `%${q}%`) : undefined,
      category ? eq(articles.category, category) : undefined,
      status ? eq(articles.status, status) : undefined
    );

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(articles)
      .where(where);

    const rows = await db
      .select()
      .from(articles)
      .where(where)
      .orderBy(desc(articles.publishedAt), desc(articles.createdAt))
      .limit(pageSize)
      .offset(offset);

    return c.json(
      {
        data: rows.map((r) => ({ ...r, publishedAt: r.publishedAt?.toISOString() || null })),
        page,
        pageSize,
        total: count,
      },
      200
    );
  }
);

articlesRoute.openapi(
  createRoute({
    method: 'get',
    path: '/id/{id}',
    request: { params: z.object({ id: z.string() }) },
    responses: {
      200: { content: { 'application/json': { schema: ArticleSchema } }, description: 'Get article by id' },
      404: { description: 'Not found' },
    },
  }),
  async (c) => {
    const id = parseInt(c.req.param('id'));
    const [row] = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
    if (!row) return c.json({}, 404);
    return c.json({ ...row, publishedAt: row.publishedAt?.toISOString() || null }, 200);
  }
);

articlesRoute.openapi(
  createRoute({
    method: 'get',
    path: '/{slug}',
    request: { params: z.object({ slug: z.string() }) },
    responses: {
      200: { content: { 'application/json': { schema: ArticleSchema } }, description: 'Get article by slug' },
      404: { description: 'Not found' },
    },
  }),
  async (c) => {
    const slug = c.req.param('slug');
    const [row] = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
    if (!row) return c.json({}, 404);
    return c.json({ ...row, publishedAt: row.publishedAt?.toISOString() || null }, 200);
  }
);

articlesRoute.openapi(createRoute({ method: 'post', path: '/', request: { body: { content: { 'application/json': { schema: ArticleSchema.omit({ id: true }) } } } }, responses: { 201: { content: { 'application/json': { schema: ArticleSchema } }, description: 'Create article' } } }), async (c) => {
  const body = c.req.valid('json');
  const [created] = await db
    .insert(articles)
    .values({ ...body, publishedAt: body.publishedAt ? new Date(body.publishedAt) : null })
    .returning();
  return c.json({ ...created, publishedAt: created.publishedAt?.toISOString() || null }, 201);
});

articlesRoute.openapi(createRoute({ method: 'put', path: '/{id}', request: { params: z.object({ id: z.string() }), body: { content: { 'application/json': { schema: ArticleSchema.omit({ id: true }) } } } }, responses: { 200: { content: { 'application/json': { schema: ArticleSchema } }, description: 'Update article' }, 404: { description: 'Not found' } } }), async (c) => {
  const id = parseInt(c.req.param('id'));
  const body = c.req.valid('json');
  const [updated] = await db
    .update(articles)
    .set({ ...body, publishedAt: body.publishedAt ? new Date(body.publishedAt) : null, updatedAt: new Date() })
    .where(eq(articles.id, id))
    .returning();
  if (!updated) return c.json({}, 404);
  return c.json({ ...updated, publishedAt: updated.publishedAt?.toISOString() || null }, 200);
});

articlesRoute.openapi(createRoute({ method: 'delete', path: '/{id}', request: { params: z.object({ id: z.string() }) }, responses: { 204: { description: 'Delete article' } } }), async (c) => {
  const id = parseInt(c.req.param('id'));
  await db.delete(articles).where(eq(articles.id, id));
  return new Response(null, { status: 204 });
});
