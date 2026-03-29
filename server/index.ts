import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';

import { activitiesRoute } from './routes/activities';
import { articlesRoute } from './routes/articles';
import { authRoute } from './routes/auth';
import { dashboardRoute } from './routes/dashboard';
import { documentsRoute } from './routes/documents';
import { galleryRoute } from './routes/gallery';
import { membersRoute } from './routes/members';
import { messagesRoute } from './routes/messages';
import { profileRoute } from './routes/profile';
import { settingsRoute } from './routes/settings';
import { structureRoute } from './routes/structure';
import { usersRoute } from './routes/users';

const app = new OpenAPIHono();

// Middlewares
app.use('*', logger());
app.use('/api/*', cors());

// Swagger documentation
app.get('/ui', swaggerUI({ url: '/doc' }));
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Erika Masya API',
    description: 'API for PMI Organization with multiple modules',
  },
});

// Register Routes
app.route('/api/activities', activitiesRoute);
app.route('/api/articles', articlesRoute);
app.route('/api/auth', authRoute);
app.route('/api/dashboard', dashboardRoute);
app.route('/api/documents', documentsRoute);
app.route('/api/gallery', galleryRoute);
app.route('/api/members', membersRoute);
app.route('/api/messages', messagesRoute);
app.route('/api/profile', profileRoute);
app.route('/api/settings', settingsRoute);
app.route('/api/structure', structureRoute);
app.route('/api/users', usersRoute);

// Add a catch-all route for frontend (SPA fallback) when deployed
// app.get('*', serveStatic({ path: './dist' }));

export default app;
