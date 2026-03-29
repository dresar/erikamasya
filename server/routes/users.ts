import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { and, asc, eq, ilike, sql } from 'drizzle-orm';
import { dbAdmin as db } from '../db';
import { users } from '../db/schema';

export const usersRoute = new OpenAPIHono();

const UserSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  name: z.string().openapi({ example: 'Admin User' }),
  email: z.string().openapi({ example: 'admin@example.com' }),
  role: z.string().nullable().openapi({ example: 'admin' }),
  isActive: z.boolean().nullable().openapi({ example: true }),
});

const UserCreateSchema = UserSchema.extend({
  passwordHash: z.string().openapi({ example: 'hashedpassword123' })
});

const UserListQuerySchema = z.object({
  q: z.string().optional(),
  role: z.string().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(10),
});

const PaginatedUsersSchema = z.object({
  data: z.array(UserSchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
});

usersRoute.openapi(
  createRoute({
    method: 'get',
    path: '/',
    request: { query: UserListQuerySchema },
    responses: { 200: { content: { 'application/json': { schema: PaginatedUsersSchema } }, description: 'Get users (paginated)' } },
  }),
  async (c) => {
    const { q, role, page, pageSize } = c.req.valid('query');
    const offset = (page - 1) * pageSize;

    const where = and(
      q ? ilike(users.email, `%${q}%`) : undefined,
      role ? eq(users.role, role) : undefined
    );

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(users)
      .where(where);

    const rows = await db
      .select({ id: users.id, name: users.name, email: users.email, role: users.role, isActive: users.isActive })
      .from(users)
      .where(where)
      .orderBy(asc(users.name))
      .limit(pageSize)
      .offset(offset);

    return c.json({ data: rows, page, pageSize, total: count }, 200);
  }
);

usersRoute.openapi(createRoute({ method: 'post', path: '/', request: { body: { content: { 'application/json': { schema: UserCreateSchema.omit({ id: true }) } } } }, responses: { 201: { content: { 'application/json': { schema: UserSchema } }, description: 'Create user' } } }), async (c) => {
  const body = c.req.valid('json');
  const [created] = await db.insert(users).values(body).returning({ id: users.id, name: users.name, email: users.email, role: users.role, isActive: users.isActive });
  return c.json(created, 201);
});

usersRoute.openapi(createRoute({ method: 'put', path: '/{id}', request: { params: z.object({ id: z.string() }), body: { content: { 'application/json': { schema: UserSchema.omit({ id: true }) } } } }, responses: { 200: { content: { 'application/json': { schema: UserSchema } }, description: 'Update user' }, 404: { description: 'Not found' } } }), async (c) => {
  const id = parseInt(c.req.param('id'));
  const body = c.req.valid('json');
  const [updated] = await db.update(users).set({ ...body, updatedAt: new Date() }).where(eq(users.id, id)).returning({ id: users.id, name: users.name, email: users.email, role: users.role, isActive: users.isActive });
  if (!updated) return c.json({}, 404);
  return c.json(updated, 200);
});

usersRoute.openapi(createRoute({ method: 'delete', path: '/{id}', request: { params: z.object({ id: z.string() }) }, responses: { 204: { description: 'Delete user' } } }), async (c) => {
  const id = parseInt(c.req.param('id'));
  await db.delete(users).where(eq(users.id, id));
  return new Response(null, { status: 204 });
});
