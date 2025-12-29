const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteUser() {
  try {
    const user = await prisma.user.delete({
      where: { email: 'krisihadjiev@gmail.com' }
    });
    console.log('✅ Потребителят е изтрит успешно:', user.email);
  } catch (error) {
    if (error.code === 'P2025') {
      console.log('⚠️  Потребителят не е намерен в базата данни');
    } else {
      console.error('❌ Грешка:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

deleteUser();
