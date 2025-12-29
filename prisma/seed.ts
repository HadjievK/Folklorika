import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Започване на seed данни...');

  // Създаване на администратор
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@folklorika.bg' },
    update: {},
    create: {
      email: 'admin@folklorika.bg',
      name: 'Администратор',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Администратор:', admin.email);

  // Създаване на сдружение "Жълтуша"
  const zhultusha = await prisma.association.upsert({
    where: { slug: 'zhultusha' },
    update: {},
    create: {
      name: 'Жълтуша и Приятели',
      slug: 'zhultusha',
      city: 'София',
      region: 'София-град',
      description: 'Фолклорно сдружение за запазване и популяризиране на българския фолклор.',
      approved: true,
      members: {
        create: {
          userId: admin.id,
          role: 'OWNER',
        },
      },
    },
  });

  console.log('✅ Сдружение:', zhultusha.name);

  // Създаване на тестово събитие
  const event = await prisma.event.upsert({
    where: { slug: 'koladen-koncert-2025' },
    update: {},
    create: {
      title: 'Коледен концерт 2025',
      slug: 'koladen-koncert-2025',
      type: 'CONCERT',
      description: 'Традиционен коледен концерт с български народни песни и танци.',
      date: new Date('2025-12-24T19:00:00'),
      endDate: new Date('2025-12-24T22:00:00'),
      city: 'София',
      region: 'София-град',
      venue: 'НДК - Зала 1',
      isFree: false,
      ticketPrice: 20,
      approved: true,
      featured: true,
      associationId: zhultusha.id,
      creatorId: admin.id,
    },
  });

  console.log('✅ Събитие:', event.title);
  console.log('🎉 Seed данните са готови!');
}

main()
  .catch((e) => {
    console.error('❌ Грешка:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
