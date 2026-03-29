import { boolean, integer, jsonb, pgTable, serial, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 50 }).default('user'),
  isActive: boolean('is_active').default(true),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const userProfiles = pgTable('user_profiles', {
  userId: integer('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  position: varchar('position', { length: 256 }),
  avatarUrl: text('avatar_url'),
  avatarInitials: varchar('avatar_initials', { length: 8 }),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const activities = pgTable('activities', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 256 }).notNull(),
  description: text('description'),
  date: timestamp('date'),
  location: varchar('location', { length: 256 }),
  category: varchar('category', { length: 100 }),
  status: varchar('status', { length: 50 }),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 256 }).notNull(),
  title: varchar('title', { length: 256 }).notNull(),
  excerpt: text('excerpt'),
  content: text('content'),
  authorName: varchar('author_name', { length: 256 }),
  authorId: integer('author_id').references(() => users.id),
  status: varchar('status', { length: 50 }).default('draft'),
  category: varchar('category', { length: 100 }),
  readTime: varchar('read_time', { length: 50 }),
  thumbnailUrl: text('thumbnail_url'),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
  slugIdx: uniqueIndex('articles_slug_unique').on(t.slug),
}));

export const documents = pgTable('documents', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 256 }).notNull(),
  category: varchar('category', { length: 100 }),
  fileUrl: text('file_url'),
  fileType: varchar('file_type', { length: 50 }),
  fileSize: varchar('file_size', { length: 50 }),
  uploadedBy: integer('uploaded_by').references(() => users.id),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const gallery = pgTable('gallery', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 256 }).notNull(),
  imageUrl: text('image_url').notNull(),
  category: varchar('category', { length: 100 }),
  date: timestamp('date'),
  uploadedBy: integer('uploaded_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const members = pgTable('members', {
  id: serial('id').primaryKey(),
  memberCode: varchar('member_code', { length: 64 }).notNull(),
  name: varchar('name', { length: 256 }).notNull(),
  nim: varchar('nim', { length: 64 }).notNull(),
  angkatan: varchar('angkatan', { length: 16 }),
  jurusan: varchar('jurusan', { length: 256 }),
  status: varchar('status', { length: 50 }).default('Aktif'),
  email: varchar('email', { length: 256 }),
  phone: varchar('phone', { length: 64 }),
  address: text('address'),
  placeOfBirth: varchar('place_of_birth', { length: 256 }),
  dateOfBirth: timestamp('date_of_birth'),
  gender: varchar('gender', { length: 32 }),
  joinedAt: timestamp('joined_at'),
  notes: text('notes'),
  photoUrl: text('photo_url'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
  memberCodeIdx: uniqueIndex('members_member_code_unique').on(t.memberCode),
  nimIdx: uniqueIndex('members_nim_unique').on(t.nim),
}));

export const structure = pgTable('structure', {
  id: serial('id').primaryKey(),
  role: varchar('role', { length: 256 }).notNull(),
  name: varchar('name', { length: 256 }).notNull(),
  description: text('description'),
  hierarchyLevel: serial('hierarchy_level'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const organizationPeriods = pgTable('organization_periods', {
  id: serial('id').primaryKey(),
  period: varchar('period', { length: 32 }).notNull(),
  isActive: boolean('is_active').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
  periodIdx: uniqueIndex('organization_periods_period_unique').on(t.period),
}));

export const organizationMembers = pgTable('organization_members', {
  id: serial('id').primaryKey(),
  periodId: integer('period_id')
    .notNull()
    .references(() => organizationPeriods.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 256 }).notNull(),
  position: varchar('position', { length: 256 }).notNull(),
  department: varchar('department', { length: 256 }),
  photoUrl: text('photo_url'),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  email: varchar('email', { length: 256 }).notNull(),
  subject: varchar('subject', { length: 256 }).notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const siteSettings = pgTable('site_settings', {
  key: varchar('key', { length: 128 }).primaryKey(),
  value: text('value'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const pageViews = pgTable('page_views', {
  id: serial('id').primaryKey(),
  path: varchar('path', { length: 512 }).notNull(),
  viewedAt: timestamp('viewed_at').defaultNow().notNull(),
});

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  actorUserId: integer('actor_user_id').references(() => users.id),
  action: varchar('action', { length: 64 }).notNull(),
  entity: varchar('entity', { length: 64 }).notNull(),
  entityId: varchar('entity_id', { length: 64 }),
  meta: jsonb('meta'),
  createdAt: timestamp('created_at').defaultNow(),
});
