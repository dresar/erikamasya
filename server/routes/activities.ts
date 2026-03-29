import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { and, desc, eq, ilike, sql } from 'drizzle-orm';
import { dbCore as db } from '../db';
import { activities } from '../db/schema';

export const activitiesRoute = new OpenAPIHono();

const ActivitySchema = z.object({
  id: z.number().openapi({ example: 1 }),
  title: z.string().openapi({ example: 'Bakti Sosial' }),
  description: z.string().nullable().openapi({ example: 'Kegiatan bakti sosial desa' }),
  date: z.string().nullable().openapi({ example: '2026-03-28' }),
  location: z.string().nullable().openapi({ example: 'Desa A' }),
  category: z.string().nullable().openapi({ example: 'Sosial' }),
  status: z.string().nullable().openapi({ example: 'Berlangsung' }),
  imageUrl: z.string().nullable().openapi({ example: 'https://via.placeholder.com/150' }),
});

const ActivityListQuerySchema = z.object({
  q: z.string().optional(),
  status: z.string().optional(),
  category: z.string().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(10),
});

const PaginatedActivitiesSchema = z.object({
  data: z.array(ActivitySchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
});

activitiesRoute.openapi(
  createRoute({
    method: 'get',
    path: '/',
    request: { query: ActivityListQuerySchema },
    responses: {
      200: { content: { 'application/json': { schema: PaginatedActivitiesSchema } }, description: 'Get activities (paginated)' },
    },
  }),
  async (c) => {
    const { q, status, category, page, pageSize } = c.req.valid('query');
    const offset = (page - 1) * pageSize;

    const where = and(
      q ? ilike(activities.title, `%${q}%`) : undefined,
      status ? eq(activities.status, status) : undefined,
      category ? eq(activities.category, category) : undefined
    );

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(activities)
      .where(where);

    const rows = await db
      .select()
      .from(activities)
      .where(where)
      .orderBy(desc(activities.date), desc(activities.createdAt))
      .limit(pageSize)
      .offset(offset);

    return c.json(
      {
        data: rows.map((a) => ({ ...a, date: a.date?.toISOString() || null })),
        page,
        pageSize,
        total: count,
      },
      200
    );
  }
);

activitiesRoute.openapi(
  createRoute({
    method: 'post',
    path: '/',
    request: { body: { content: { 'application/json': { schema: ActivitySchema.omit({ id: true }) } } } },
    responses: {
      201: { content: { 'application/json': { schema: ActivitySchema } }, description: 'Create activity' },
    },
  }),
  async (c) => {
    const body = c.req.valid('json');
    const [newActivity] = await db.insert(activities).values({
      ...body,
      date: body.date ? new Date(body.date) : null
    }).returning();
    return c.json({
      ...newActivity,
      date: newActivity.date?.toISOString() || null
    }, 201);
  }
);

activitiesRoute.openapi(
  createRoute({
    method: 'put',
    path: '/{id}',
    request: { 
      params: z.object({ id: z.string() }),
      body: { content: { 'application/json': { schema: ActivitySchema.omit({ id: true }) } } }
    },
    responses: {
      200: { content: { 'application/json': { schema: ActivitySchema } }, description: 'Update activity' },
      404: { description: 'Activity not found' }
    },
  }),
  async (c) => {
    const id = parseInt(c.req.param('id'));
    const body = c.req.valid('json');
    const [updatedActivity] = await db.update(activities).set({
      ...body,
      date: body.date ? new Date(body.date) : null,
      updatedAt: new Date()
    }).where(eq(activities.id, id)).returning();
    
    if (!updatedActivity) return c.json({}, 404);
    
    return c.json({
      ...updatedActivity,
      date: updatedActivity.date?.toISOString() || null
    }, 200);
  }
);

activitiesRoute.openapi(
  createRoute({
    method: 'delete',
    path: '/{id}',
    request: { params: z.object({ id: z.string() }) },
    responses: {
      204: { description: 'Delete activity' },
    },
  }),
  async (c) => {
    const id = parseInt(c.req.param('id'));
    await db.delete(activities).where(eq(activities.id, id));
    return new Response(null, { status: 204 });
  }
);
