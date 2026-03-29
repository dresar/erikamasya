import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { sql } from 'drizzle-orm';

import { dbAdmin, dbCms, dbCore } from './db';
import {
  activities,
  articles,
  documents,
  gallery,
  members,
  organizationMembers,
  organizationPeriods,
  siteSettings,
  users,
} from './db/schema';
import { hashPassword } from './lib/password';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

type MemberJson = {
  id: number;
  name: string;
  nim: string;
  angkatan: string;
  jurusan: string;
  status: string;
  photo: string;
};

type ActivityJson = {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  image: string;
  status: string;
};

type OrganizationJson = {
  period: string;
  members: Array<{ id: number; name: string; position: string; photo: string; department: string }>;
};

type ArticleJson = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
};

type DocumentJson = {
  id: number;
  title: string;
  category: string;
  fileSize: string;
  fileType: string;
  date: string;
};

type GalleryJson = { id: number; title: string; category: string; image: string; date: string };

async function readJson<T>(relativePath: string): Promise<T> {
  const fullPath = join(projectRoot, relativePath);
  const raw = await readFile(fullPath, 'utf-8');
  return JSON.parse(raw) as T;
}

async function seedUsers() {
  const [{ count: existing }] = await dbAdmin.select({ count: sql<number>`count(*)`.mapWith(Number) }).from(users);
  if (existing > 0) return;

  const passwordHash = await hashPassword('admin123');
  await dbAdmin.insert(users).values({ name: 'Admin', email: 'admin@local.dev', passwordHash, role: 'admin', isActive: true });
}

async function seedSettings() {
  const [{ count: existing }] = await dbAdmin.select({ count: sql<number>`count(*)`.mapWith(Number) }).from(siteSettings);
  if (existing > 0) return;

  const defaults: Array<{ key: string; value: string }> = [
    { key: 'organizationName', value: 'PMII Komisariat STAIM Kendal' },
    { key: 'description', value: 'Organisasi pergerakan mahasiswa Islam yang berkomitmen mencetak kader-kader bangsa.' },
    { key: 'primaryColor', value: '#1975D3' },
    { key: 'accentColor', value: '#F5C542' },
    { key: 'address', value: 'Jl. Raya Kendal, Jawa Tengah' },
    { key: 'phone', value: '+62 812-0000-0000' },
    { key: 'contactEmail', value: 'admin@local.dev' },
    { key: 'officeHours', value: 'Senin - Jumat, 08.00 - 16.00 WIB' },
  ];

  await dbAdmin.insert(siteSettings).values(defaults.map((d) => ({ ...d, updatedAt: new Date() })));
}

async function seedCore() {
  const [{ count: membersCount }] = await dbCore.select({ count: sql<number>`count(*)`.mapWith(Number) }).from(members);
  if (membersCount === 0) {
    const data = await readJson<Array<MemberJson>>('src/data/members.json');
    await dbCore.insert(members).values(
      data.map((m) => ({
        memberCode: `MBR-${m.nim}`,
        name: m.name,
        nim: m.nim,
        angkatan: m.angkatan,
        jurusan: m.jurusan,
        status: m.status,
        photoUrl: m.photo,
        isActive: true,
      }))
    );
  }

  const [{ count: activitiesCount }] = await dbCore.select({ count: sql<number>`count(*)`.mapWith(Number) }).from(activities);
  if (activitiesCount === 0) {
    const data = await readJson<Array<ActivityJson>>('src/data/activities.json');
    await dbCore.insert(activities).values(
      data.map((a) => ({
        title: a.title,
        description: a.description,
        date: new Date(a.date),
        location: a.location,
        category: a.category,
        status: a.status,
        imageUrl: a.image,
      }))
    );
  }

  const [{ count: orgCount }] = await dbCore.select({ count: sql<number>`count(*)`.mapWith(Number) }).from(organizationPeriods);
  if (orgCount === 0) {
    const org = await readJson<OrganizationJson>('src/data/organization.json');
    const [period] = await dbCore
      .insert(organizationPeriods)
      .values({ period: org.period, isActive: true })
      .returning();

    await dbCore.insert(organizationMembers).values(
      org.members.map((m, idx) => ({
        periodId: period.id,
        name: m.name,
        position: m.position,
        department: m.department,
        photoUrl: m.photo,
        order: idx + 1,
      }))
    );
  }
}

async function seedCms() {
  const [{ count: articlesCount }] = await dbCms.select({ count: sql<number>`count(*)`.mapWith(Number) }).from(articles);
  if (articlesCount === 0) {
    const data = await readJson<Array<ArticleJson>>('src/data/articles.json');
    await dbCms.insert(articles).values(
      data.map((a) => ({
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        content: a.content,
        authorName: a.author,
        status: 'published',
        category: a.category,
        readTime: a.readTime,
        thumbnailUrl: a.thumbnail,
        publishedAt: new Date(a.date),
      }))
    );
  }

  const [{ count: documentsCount }] = await dbCms.select({ count: sql<number>`count(*)`.mapWith(Number) }).from(documents);
  if (documentsCount === 0) {
    const data = await readJson<Array<DocumentJson>>('src/data/documents.json');
    await dbCms.insert(documents).values(
      data.map((d) => ({
        title: d.title,
        category: d.category,
        fileType: d.fileType,
        fileSize: d.fileSize,
        fileUrl: null,
        publishedAt: new Date(d.date),
      }))
    );
  }

  const [{ count: galleryCount }] = await dbCms.select({ count: sql<number>`count(*)`.mapWith(Number) }).from(gallery);
  if (galleryCount === 0) {
    const data = await readJson<Array<GalleryJson>>('src/data/gallery.json');
    await dbCms.insert(gallery).values(
      data.map((g) => ({
        title: g.title,
        category: g.category,
        imageUrl: g.image,
        date: new Date(g.date),
      }))
    );
  }
}

async function main() {
  await seedUsers();
  await seedSettings();
  await seedCore();
  await seedCms();
  process.stdout.write('Seed OK\n');
}

main().catch((err) => {
  process.stderr.write(String(err) + '\n');
  process.exitCode = 1;
});
