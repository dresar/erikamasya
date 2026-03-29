import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { and, desc, eq, ilike, sql } from 'drizzle-orm';
import { dbCms as db } from '../db';
import { documents } from '../db/schema';

export const documentsRoute = new OpenAPIHono();

const DocumentSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  title: z.string().openapi({ example: 'Dokumen Penting' }),
  category: z.string().nullable().openapi({ example: 'Organisasi' }),
  fileUrl: z.string().nullable().openapi({ example: 'https://example.com/doc.pdf' }),
  fileType: z.string().nullable().openapi({ example: 'PDF' }),
  fileSize: z.string().nullable().openapi({ example: '2.4 MB' }),
  uploadedBy: z.number().nullable().openapi({ example: 1 }),
  publishedAt: z.string().nullable().openapi({ example: '2024-01-15' }),
});

const DocumentListQuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(10),
});

const PaginatedDocumentsSchema = z.object({
  data: z.array(DocumentSchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
});

documentsRoute.openapi(
  createRoute({
    method: 'get',
    path: '/',
    request: { query: DocumentListQuerySchema },
    responses: { 200: { content: { 'application/json': { schema: PaginatedDocumentsSchema } }, description: 'Get documents (paginated)' } },
  }),
  async (c) => {
    const { q, category, page, pageSize } = c.req.valid('query');
    const offset = (page - 1) * pageSize;

    const where = and(
      q ? ilike(documents.title, `%${q}%`) : undefined,
      category ? eq(documents.category, category) : undefined
    );

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(documents)
      .where(where);

    const rows = await db
      .select()
      .from(documents)
      .where(where)
      .orderBy(desc(documents.publishedAt), desc(documents.createdAt))
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

documentsRoute.openapi(createRoute({ method: 'post', path: '/', request: { body: { content: { 'application/json': { schema: DocumentSchema.omit({ id: true }) } } } }, responses: { 201: { content: { 'application/json': { schema: DocumentSchema } }, description: 'Create document' } } }), async (c) => {
  const body = c.req.valid('json');
  const [created] = await db
    .insert(documents)
    .values({ ...body, publishedAt: body.publishedAt ? new Date(body.publishedAt) : null })
    .returning();
  return c.json({ ...created, publishedAt: created.publishedAt?.toISOString() || null }, 201);
});

documentsRoute.openapi(createRoute({ method: 'put', path: '/{id}', request: { params: z.object({ id: z.string() }), body: { content: { 'application/json': { schema: DocumentSchema.omit({ id: true }) } } } }, responses: { 200: { content: { 'application/json': { schema: DocumentSchema } }, description: 'Update document' }, 404: { description: 'Not found' } } }), async (c) => {
  const id = parseInt(c.req.param('id'));
  const body = c.req.valid('json');
  const [updated] = await db
    .update(documents)
    .set({ ...body, publishedAt: body.publishedAt ? new Date(body.publishedAt) : null, updatedAt: new Date() })
    .where(eq(documents.id, id))
    .returning();
  if (!updated) return c.json({}, 404);
  return c.json({ ...updated, publishedAt: updated.publishedAt?.toISOString() || null }, 200);
});

documentsRoute.openapi(createRoute({ method: 'delete', path: '/{id}', request: { params: z.object({ id: z.string() }) }, responses: { 204: { description: 'Delete document' } } }), async (c) => {
  const id = parseInt(c.req.param('id'));
  await db.delete(documents).where(eq(documents.id, id));
  return new Response(null, { status: 204 });
});
