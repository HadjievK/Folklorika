const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteUser() {
  const email = process.argv[2];

  if (!email) {
    console.error('❌ Моля предоставете email адрес');
    console.log('Използване: node scripts/delete-user.js <email>');
    process.exit(1);
  }

  try {
    // Намери потребителя
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`ℹ️  Потребител с email ${email} не съществува`);
      process.exit(0);
    }

    // Изтрий потребителя (cascade ще изтрие и свързаните данни)
    await prisma.user.delete({
      where: { email },
    });

    console.log(`✅ Потребител ${email} е изтрит успешно`);
  } catch (error) {
    console.error('❌ Грешка при изтриване:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

deleteUser();
