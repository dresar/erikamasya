import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { and, asc, eq, ilike, or, sql } from 'drizzle-orm';
import { dbCore as db } from '../db';
import { members } from '../db/schema';

export const membersRoute = new OpenAPIHono();

const MemberSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  memberCode: z.string().openapi({ example: 'MBR-2f5b0b58' }),
  name: z.string().openapi({ example: 'John Doe' }),
  nim: z.string().openapi({ example: '2021001' }),
  angkatan: z.string().nullable().openapi({ example: '2021' }),
  jurusan: z.string().nullable().openapi({ example: 'Pendidikan Agama Islam' }),
  status: z.string().nullable().openapi({ example: 'Aktif' }),
  email: z.string().nullable().openapi({ example: 'john@example.com' }),
  phone: z.string().nullable().openapi({ example: '+62 812-0000-0000' }),
  address: z.string().nullable().openapi({ example: 'Kendal, Jawa Tengah' }),
  placeOfBirth: z.string().nullable().openapi({ example: 'Kendal' }),
  dateOfBirth: z.string().nullable().openapi({ example: '2002-01-15' }),
  gender: z.string().nullable().openapi({ example: 'Laki-laki' }),
  joinedAt: z.string().nullable().openapi({ example: '2024-01-01' }),
  notes: z.string().nullable().openapi({ example: 'Catatan internal' }),
  photoUrl: z.string().nullable().openapi({ example: 'https://example.com/photo.jpg' }),
  isActive: z.boolean().nullable().openapi({ example: true }),
});

const MemberCreateSchema = z.object({
  name: z.string().min(1),
  nim: z.string().min(1),
  memberCode: z.string().optional(),
  angkatan: z.string().nullable().optional(),
  jurusan: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  placeOfBirth: z.string().nullable().optional(),
  dateOfBirth: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  joinedAt: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  photoUrl: z.string().nullable().optional(),
  isActive: z.boolean().nullable().optional(),
});

const MemberUpdateSchema = MemberCreateSchema.partial();

const MemberListQuerySchema = z.object({
  q: z.string().optional(),
  status: z.string().optional(),
  angkatan: z.string().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(200).optional().default(20),
});

const PaginatedMembersSchema = z.object({
  data: z.array(MemberSchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
});

membersRoute.openapi(
  createRoute({
    method: 'get',
    path: '/',
    request: { query: MemberListQuerySchema },
    responses: { 200: { content: { 'application/json': { schema: PaginatedMembersSchema } }, description: 'Get members (paginated)' } },
  }),
  async (c) => {
    const { q, status, angkatan, page, pageSize } = c.req.valid('query');
    const offset = (page - 1) * pageSize;

    const where = and(
      q
        ? or(ilike(members.name, `%${q}%`), ilike(members.nim, `%${q}%`), ilike(members.jurusan, `%${q}%`))
        : undefined,
      status ? eq(members.status, status) : undefined,
      angkatan ? eq(members.angkatan, angkatan) : undefined
    );

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(members)
      .where(where);

    const rows = await db
      .select()
      .from(members)
      .where(where)
      .orderBy(asc(members.name))
      .limit(pageSize)
      .offset(offset);

    return c.json(
      {
        data: rows.map((r) => ({
          ...r,
          dateOfBirth: r.dateOfBirth?.toISOString() || null,
          joinedAt: r.joinedAt?.toISOString() || null,
        })),
        page,
        pageSize,
        total: count,
      },
      200
    );
  }
);

membersRoute.openapi(
  createRoute({
    method: 'get',
    path: '/meta',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.object({
              angkatan: z.array(z.string()),
              status: z.array(z.string()),
            }),
          },
        },
        description: 'Members filter metadata',
      },
    },
  }),
  async (c) => {
    const rows = await db
      .select({ angkatan: members.angkatan, status: members.status })
      .from(members);

    const angkatan = Array.from(new Set(rows.map((r) => r.angkatan).filter((v): v is string => !!v))).sort();
    const status = Array.from(new Set(rows.map((r) => r.status).filter((v): v is string => !!v))).sort();
    return c.json({ angkatan, status }, 200);
  }
);

membersRoute.openapi(
  createRoute({
    method: 'get',
    path: '/{id}',
    request: { params: z.object({ id: z.string() }) },
    responses: {
      200: { content: { 'application/json': { schema: MemberSchema } }, description: 'Get member by id' },
      404: { description: 'Not found' },
    },
  }),
  async (c) => {
    const id = parseInt(c.req.param('id'));
    const [row] = await db.select().from(members).where(eq(members.id, id)).limit(1);
    if (!row) return c.json({}, 404);
    return c.json(
      {
        ...row,
        dateOfBirth: row.dateOfBirth?.toISOString() || null,
        joinedAt: row.joinedAt?.toISOString() || null,
      },
      200
    );
  }
);

membersRoute.openapi(
  createRoute({
    method: 'post',
    path: '/',
    request: { body: { content: { 'application/json': { schema: MemberCreateSchema } } } },
    responses: { 201: { content: { 'application/json': { schema: MemberSchema } }, description: 'Create member' } },
  }),
  async (c) => {
    const body = c.req.valid('json');
    const memberCode = body.memberCode ?? `MBR-${crypto.randomUUID()}`;
    const [created] = await db
      .insert(members)
      .values({
        ...body,
        memberCode,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
        joinedAt: body.joinedAt ? new Date(body.joinedAt) : null,
      })
      .returning();
    return c.json(
      { ...created, dateOfBirth: created.dateOfBirth?.toISOString() || null, joinedAt: created.joinedAt?.toISOString() || null },
      201
    );
  }
);

membersRoute.openapi(
  createRoute({
    method: 'put',
    path: '/{id}',
    request: { params: z.object({ id: z.string() }), body: { content: { 'application/json': { schema: MemberUpdateSchema } } } },
    responses: {
      200: { content: { 'application/json': { schema: MemberSchema } }, description: 'Update member' },
      404: { description: 'Not found' },
    },
  }),
  async (c) => {
    const id = parseInt(c.req.param('id'));
    const body = c.req.valid('json');
    const [updated] = await db
      .update(members)
      .set({
        ...body,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
        joinedAt: body.joinedAt ? new Date(body.joinedAt) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(members.id, id))
      .returning();
    if (!updated) return c.json({}, 404);
    return c.json(
      { ...updated, dateOfBirth: updated.dateOfBirth?.toISOString() || null, joinedAt: updated.joinedAt?.toISOString() || null },
      200
    );
  }
);

membersRoute.openapi(createRoute({ method: 'delete', path: '/{id}', request: { params: z.object({ id: z.string() }) }, responses: { 204: { description: 'Delete member' } } }), async (c) => {
  const id = parseInt(c.req.param('id'));
  await db.delete(members).where(eq(members.id, id));
  return new Response(null, { status: 204 });
});
