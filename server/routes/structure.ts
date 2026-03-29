import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { and, asc, desc, eq, sql } from 'drizzle-orm';
import { dbCore as db } from '../db';
import { organizationMembers, organizationPeriods, structure } from '../db/schema';

export const structureRoute = new OpenAPIHono();

const StructureSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  role: z.string().openapi({ example: 'Ketua Umum' }),
  name: z.string().openapi({ example: 'Budi Santoso' }),
  description: z.string().nullable().openapi({ example: 'Deskripsi tugas...' }),
  hierarchyLevel: z.number().openapi({ example: 1 }),
});

const OrganizationMemberSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  periodId: z.number().openapi({ example: 1 }),
  name: z.string().openapi({ example: 'Ahmad Fauzi' }),
  position: z.string().openapi({ example: 'Ketua Umum' }),
  department: z.string().nullable().openapi({ example: 'Pimpinan' }),
  photoUrl: z.string().nullable().openapi({ example: 'https://example.com/photo.jpg' }),
  order: z.number().nullable().openapi({ example: 1 }),
});

const OrganizationPeriodSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  period: z.string().openapi({ example: '2024-2025' }),
  isActive: z.boolean().nullable().openapi({ example: true }),
});

const OrganizationOverviewSchema = z.object({
  period: z.string().nullable(),
  members: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      position: z.string(),
      department: z.string().nullable(),
      photoUrl: z.string().nullable(),
    })
  ),
});

structureRoute.openapi(
  createRoute({
    method: 'get',
    path: '/organization',
    responses: {
      200: {
        content: { 'application/json': { schema: OrganizationOverviewSchema } },
        description: 'Get organization overview (active period + members)',
      },
    },
  }),
  async (c) => {
    const [active] = await db
      .select()
      .from(organizationPeriods)
      .where(eq(organizationPeriods.isActive, true))
      .limit(1);

    if (!active) {
      return c.json({ period: null, members: [] }, 200);
    }

    const members = await db
      .select({
        id: organizationMembers.id,
        name: organizationMembers.name,
        position: organizationMembers.position,
        department: organizationMembers.department,
        photoUrl: organizationMembers.photoUrl,
      })
      .from(organizationMembers)
      .where(eq(organizationMembers.periodId, active.id))
      .orderBy(asc(organizationMembers.order), asc(organizationMembers.id));

    return c.json({ period: active.period, members }, 200);
  }
);

structureRoute.openapi(
  createRoute({
    method: 'get',
    path: '/organization/periods',
    responses: {
      200: { content: { 'application/json': { schema: z.array(OrganizationPeriodSchema) } }, description: 'List organization periods' },
    },
  }),
  async (c) => {
    const rows = await db.select().from(organizationPeriods).orderBy(desc(organizationPeriods.createdAt));
    return c.json(rows, 200);
  }
);

structureRoute.openapi(
  createRoute({
    method: 'post',
    path: '/organization/periods',
    request: { body: { content: { 'application/json': { schema: OrganizationPeriodSchema.omit({ id: true }) } } } },
    responses: {
      201: { content: { 'application/json': { schema: OrganizationPeriodSchema } }, description: 'Create organization period' },
    },
  }),
  async (c) => {
    const body = c.req.valid('json');
    const [created] = await db.insert(organizationPeriods).values(body).returning();
    return c.json(created, 201);
  }
);

structureRoute.openapi(
  createRoute({
    method: 'post',
    path: '/organization/periods/{id}/activate',
    request: { params: z.object({ id: z.string() }) },
    responses: { 200: { content: { 'application/json': { schema: OrganizationPeriodSchema } }, description: 'Activate period' } },
  }),
  async (c) => {
    const id = parseInt(c.req.param('id'));
    await db.update(organizationPeriods).set({ isActive: false, updatedAt: new Date() }).where(eq(organizationPeriods.isActive, true));
    const [updated] = await db.update(organizationPeriods).set({ isActive: true, updatedAt: new Date() }).where(eq(organizationPeriods.id, id)).returning();
    return c.json(updated ?? null, 200);
  }
);

structureRoute.openapi(
  createRoute({
    method: 'get',
    path: '/organization/members',
    request: { query: z.object({ periodId: z.coerce.number().int().optional() }) },
    responses: { 200: { content: { 'application/json': { schema: z.array(OrganizationMemberSchema) } }, description: 'List organization members' } },
  }),
  async (c) => {
    const { periodId } = c.req.valid('query');
    let pid = periodId;

    if (!pid) {
      const [active] = await db
        .select({ id: organizationPeriods.id })
        .from(organizationPeriods)
        .where(eq(organizationPeriods.isActive, true))
        .limit(1);
      pid = active?.id;
    }

    if (!pid) return c.json([], 200);

    const rows = await db
      .select()
      .from(organizationMembers)
      .where(eq(organizationMembers.periodId, pid))
      .orderBy(asc(organizationMembers.order), asc(organizationMembers.id));
    return c.json(rows, 200);
  }
);

structureRoute.openapi(
  createRoute({
    method: 'post',
    path: '/organization/members',
    request: { body: { content: { 'application/json': { schema: OrganizationMemberSchema.omit({ id: true }) } } } },
    responses: { 201: { content: { 'application/json': { schema: OrganizationMemberSchema } }, description: 'Create organization member' } },
  }),
  async (c) => {
    const body = c.req.valid('json');
    const [created] = await db.insert(organizationMembers).values(body).returning();
    return c.json(created, 201);
  }
);

structureRoute.openapi(
  createRoute({
    method: 'put',
    path: '/organization/members/{id}',
    request: { params: z.object({ id: z.string() }), body: { content: { 'application/json': { schema: OrganizationMemberSchema.omit({ id: true }) } } } },
    responses: {
      200: { content: { 'application/json': { schema: OrganizationMemberSchema } }, description: 'Update organization member' },
      404: { description: 'Not found' },
    },
  }),
  async (c) => {
    const id = parseInt(c.req.param('id'));
    const body = c.req.valid('json');
    const [updated] = await db.update(organizationMembers).set({ ...body, updatedAt: new Date() }).where(eq(organizationMembers.id, id)).returning();
    if (!updated) return c.json({}, 404);
    return c.json(updated, 200);
  }
);

structureRoute.openapi(
  createRoute({
    method: 'delete',
    path: '/organization/members/{id}',
    request: { params: z.object({ id: z.string() }) },
    responses: { 204: { description: 'Delete organization member' } },
  }),
  async (c) => {
    const id = parseInt(c.req.param('id'));
    await db.delete(organizationMembers).where(eq(organizationMembers.id, id));
    return new Response(null, { status: 204 });
  }
);

structureRoute.openapi(createRoute({ method: 'get', path: '/', responses: { 200: { content: { 'application/json': { schema: z.array(StructureSchema) } }, description: 'Get all structure' } } }), async (c) => {
  const all = await db.select().from(structure);
  return c.json(all, 200);
});

structureRoute.openapi(createRoute({ method: 'post', path: '/', request: { body: { content: { 'application/json': { schema: StructureSchema.omit({ id: true }) } } } }, responses: { 201: { content: { 'application/json': { schema: StructureSchema } }, description: 'Create structure' } } }), async (c) => {
  const body = c.req.valid('json');
  const [created] = await db.insert(structure).values(body).returning();
  return c.json(created, 201);
});

structureRoute.openapi(createRoute({ method: 'put', path: '/{id}', request: { params: z.object({ id: z.string() }), body: { content: { 'application/json': { schema: StructureSchema.omit({ id: true }) } } } }, responses: { 200: { content: { 'application/json': { schema: StructureSchema } }, description: 'Update structure' }, 404: { description: 'Not found' } } }), async (c) => {
  const id = parseInt(c.req.param('id'));
  const body = c.req.valid('json');
  const [updated] = await db.update(structure).set({ ...body, updatedAt: new Date() }).where(eq(structure.id, id)).returning();
  if (!updated) return c.json({}, 404);
  return c.json(updated, 200);
});

structureRoute.openapi(createRoute({ method: 'delete', path: '/{id}', request: { params: z.object({ id: z.string() }) }, responses: { 204: { description: 'Delete structure' } } }), async (c) => {
  const id = parseInt(c.req.param('id'));
  await db.delete(structure).where(eq(structure.id, id));
  return new Response(null, { status: 204 });
});
