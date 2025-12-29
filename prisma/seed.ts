import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Започване на seed данни...');

  // Създаване на администратор - Веселин Буров
  const hashedPassword = await bcrypt.hash('zhultusha2025', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'zhaltushaipriyateli@gmail.com' },
    update: {
      emailVerified: true,
      role: 'ADMIN',
    },
    create: {
      email: 'zhaltushaipriyateli@gmail.com',
      name: 'Веселин Буров',
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: true,
    },
  });

  console.log('✅ Администратор:', admin.email, '-', admin.name);

  // Създаване на сдружение "Жълтуша и Приятели"
  const zhultusha = await prisma.association.upsert({
    where: { slug: 'zhultusha' },
    update: {},
    create: {
      name: 'Жълтуша и Приятели',
      slug: 'zhultusha',
      city: 'Кърджали',
      region: 'Кърджали',
      address: 'ул. Републиканска 45',
      email: 'zhaltushaipriyateli@gmail.com',
      phone: '+359 88 123 4567',
      description: 'Фолклорно сдружение "Жълтуша и Приятели" от Кърджали за запазване и популяризиране на българския фолклор и традиции. Организираме концерти, фестивали и работилници.',
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
      description: 'Традиционен коледен концерт с български народни песни и танци, организиран от сдружение "Жълтуша и Приятели".',
      date: new Date('2025-12-24T19:00:00'),
      endDate: new Date('2025-12-24T22:00:00'),
      city: 'Кърджали',
      region: 'Кърджали',
      venue: 'Общински културен център',
      address: 'пл. Съединение 1',
      isFree: false,
      ticketPrice: 15,
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
