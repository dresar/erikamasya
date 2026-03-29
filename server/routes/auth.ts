import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { eq } from 'drizzle-orm';
import { dbAdmin as db } from '../db';
import { users } from '../db/schema';
import { signJwt, verifyJwt } from '../lib/jwt';
import { verifyPassword } from '../lib/password';

export const authRoute = new OpenAPIHono();

const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const LoginResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    role: z.string().nullable(),
  }),
});

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return secret;
}

async function issueToken(user: { id: number; role: string | null }) {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
  return signJwt({ sub: String(user.id), role: user.role ?? null, exp }, getJwtSecret());
}

authRoute.openapi(
  createRoute({
    method: 'post',
    path: '/login',
    request: { body: { content: { 'application/json': { schema: LoginRequestSchema } } } },
    responses: {
      200: { content: { 'application/json': { schema: LoginResponseSchema } }, description: 'Login' },
      401: { description: 'Invalid credentials' },
    },
  }),
  async (c) => {
    const { email, password } = c.req.valid('json');
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user?.passwordHash) return c.json({}, 401);

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return c.json({}, 401);

    const token = await issueToken({ id: user.id, role: user.role ?? null });
    return c.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role ?? null } }, 200);
  }
);

authRoute.openapi(
  createRoute({
    method: 'get',
    path: '/me',
    responses: {
      200: { content: { 'application/json': { schema: LoginResponseSchema.shape.user } }, description: 'Current user' },
      401: { description: 'Unauthorized' },
    },
  }),
  async (c) => {
    const auth = c.req.header('authorization') ?? '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return c.json({}, 401);

    const payload = await verifyJwt(token, getJwtSecret());
    if (!payload) return c.json({}, 401);

    const userId = Number(payload.sub);
    if (!Number.isFinite(userId)) return c.json({}, 401);

    const [user] = await db
      .select({ id: users.id, name: users.name, email: users.email, role: users.role })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (!user) return c.json({}, 401);
    return c.json({ ...user, role: user.role ?? null }, 200);
  }
);
