import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { and, desc, eq, ilike, sql } from 'drizzle-orm';
import { dbAdmin as db } from '../db';
import { contactMessages } from '../db/schema';

export const messagesRoute = new OpenAPIHono();

const MessageSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  name: z.string().openapi({ example: 'Budi Santoso' }),
  email: z.string().openapi({ example: 'budi@gmail.com' }),
  subject: z.string().openapi({ example: 'Pendaftaran Anggota Baru' }),
  message: z.string().openapi({ example: 'Saya ingin mendaftar sebagai anggota...' }),
  isRead: z.boolean().nullable().openapi({ example: false }),
  createdAt: z.string().nullable().openapi({ example: '2024-03-20T00:00:00.000Z' }),
});

const MessageCreateSchema = MessageSchema.omit({ id: true, createdAt: true, isRead: true });

const MessageListQuerySchema = z.object({
  q: z.string().optional(),
  isRead: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(10),
});

const PaginatedMessagesSchema = z.object({
  data: z.array(MessageSchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
});

messagesRoute.openapi(
  createRoute({
    method: 'get',
    path: '/',
    request: { query: MessageListQuerySchema },
    responses: { 200: { content: { 'application/json': { schema: PaginatedMessagesSchema } }, description: 'Get messages (paginated)' } },
  }),
  async (c) => {
    const { q, isRead, page, pageSize } = c.req.valid('query');
    const offset = (page - 1) * pageSize;

    const where = and(
      q ? ilike(contactMessages.subject, `%${q}%`) : undefined,
      isRead === undefined ? undefined : eq(contactMessages.isRead, isRead)
    );

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(contactMessages)
      .where(where);

    const rows = await db
      .select()
      .from(contactMessages)
      .where(where)
      .orderBy(desc(contactMessages.createdAt))
      .limit(pageSize)
      .offset(offset);

    return c.json(
      {
        data: rows.map((r) => ({ ...r, createdAt: r.createdAt?.toISOString() || null })),
        page,
        pageSize,
        total: count,
      },
      200
    );
  }
);

messagesRoute.openapi(
  createRoute({
    method: 'post',
    path: '/',
    request: { body: { content: { 'application/json': { schema: MessageCreateSchema } } } },
    responses: { 201: { content: { 'application/json': { schema: MessageSchema } }, description: 'Create message' } },
  }),
  async (c) => {
    const body = c.req.valid('json');
    const [created] = await db.insert(contactMessages).values(body).returning();
    return c.json({ ...created, createdAt: created.createdAt?.toISOString() || null }, 201);
  }
);

messagesRoute.openapi(
  createRoute({
    method: 'put',
    path: '/{id}/read',
    request: { params: z.object({ id: z.string() }) },
    responses: { 200: { content: { 'application/json': { schema: MessageSchema } }, description: 'Mark message as read' }, 404: { description: 'Not found' } },
  }),
  async (c) => {
    const id = parseInt(c.req.param('id'));
    const [updated] = await db
      .update(contactMessages)
      .set({ isRead: true })
      .where(eq(contactMessages.id, id))
      .returning();

    if (!updated) return c.json({}, 404);
    return c.json({ ...updated, createdAt: updated.createdAt?.toISOString() || null }, 200);
  }
);

messagesRoute.openapi(
  createRoute({
    method: 'delete',
    path: '/{id}',
    request: { params: z.object({ id: z.string() }) },
    responses: { 204: { description: 'Delete message' } },
  }),
  async (c) => {
    const id = parseInt(c.req.param('id'));
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
    return new Response(null, { status: 204 });
  }
);
