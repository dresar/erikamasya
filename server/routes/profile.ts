import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { eq } from 'drizzle-orm';
import { dbAdmin as db } from '../db';
import { userProfiles, users } from '../db/schema';

export const profileRoute = new OpenAPIHono();

const ProfileSchema = z.object({
  userId: z.number().openapi({ example: 1 }),
  name: z.string().openapi({ example: 'Ahmad Fauzi' }),
  email: z.string().openapi({ example: 'admin@pmii-staimkendal.id' }),
  role: z.string().nullable().openapi({ example: 'admin' }),
  position: z.string().nullable().openapi({ example: 'Ketua Umum' }),
  avatarUrl: z.string().nullable().openapi({ example: 'https://example.com/avatar.png' }),
  avatarInitials: z.string().nullable().openapi({ example: 'AF' }),
});

const ProfileUpdateSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  position: z.string().optional(),
  avatarUrl: z.string().optional(),
  avatarInitials: z.string().optional(),
});

profileRoute.openapi(
  createRoute({
    method: 'get',
    path: '/{userId}',
    request: { params: z.object({ userId: z.string() }) },
    responses: {
      200: { content: { 'application/json': { schema: ProfileSchema } }, description: 'Get user profile' },
      404: { description: 'Not found' },
    },
  }),
  async (c) => {
    const userId = parseInt(c.req.param('userId'));
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) return c.json({}, 404);

    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);

    return c.json(
      {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        position: profile?.position ?? null,
        avatarUrl: profile?.avatarUrl ?? null,
        avatarInitials: profile?.avatarInitials ?? null,
      },
      200
    );
  }
);

profileRoute.openapi(
  createRoute({
    method: 'put',
    path: '/{userId}',
    request: { params: z.object({ userId: z.string() }), body: { content: { 'application/json': { schema: ProfileUpdateSchema } } } },
    responses: { 200: { content: { 'application/json': { schema: ProfileSchema } }, description: 'Update user profile' }, 404: { description: 'Not found' } },
  }),
  async (c) => {
    const userId = parseInt(c.req.param('userId'));
    const body = c.req.valid('json');

    const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.id, userId)).limit(1);
    if (!existing) return c.json({}, 404);

    if (body.name || body.email) {
      const userUpdate: { name?: string; email?: string; updatedAt: Date } = { updatedAt: new Date() };
      if (body.name) userUpdate.name = body.name;
      if (body.email) userUpdate.email = body.email;
      await db.update(users).set(userUpdate).where(eq(users.id, userId));
    }

    if (body.position || body.avatarUrl || body.avatarInitials) {
      await db
        .insert(userProfiles)
        .values({
          userId,
          position: body.position,
          avatarUrl: body.avatarUrl,
          avatarInitials: body.avatarInitials,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: userProfiles.userId,
          set: {
            position: body.position,
            avatarUrl: body.avatarUrl,
            avatarInitials: body.avatarInitials,
            updatedAt: new Date(),
          },
        });
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);

    return c.json(
      {
        userId: user!.id,
        name: user!.name,
        email: user!.email,
        role: user!.role,
        position: profile?.position ?? null,
        avatarUrl: profile?.avatarUrl ?? null,
        avatarInitials: profile?.avatarInitials ?? null,
      },
      200
    );
  }
);
