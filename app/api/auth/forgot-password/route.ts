import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email е задължителен' },
        { status: 400 }
      );
    }

    // Намери потребителя
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Винаги връщай успех (за security - да не разкриваме дали email съществува)
    if (!user) {
      return NextResponse.json(
        { message: 'Ако този email е регистриран, ще получите инструкции за нулиране на паролата.' },
        { status: 200 }
      );
    }

    // Проверка дали е с credentials provider
    if (user.provider !== 'credentials' || !user.password) {
      return NextResponse.json(
        { error: 'Този акаунт е регистриран чрез Google/Facebook. Използвайте социалния вход.' },
        { status: 400 }
      );
    }

    // Генерирай reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 час

    // Запази token в базата
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Изпрати email
    const host = request.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const resetUrl = `${protocol}://${host}/auth/reset-password?token=${resetToken}`;

    try {
      await sendPasswordResetEmail({
        name: user.name || '',
        email: user.email,
        resetUrl,
      });
    } catch (emailError) {
      // Изчисти token ако email не може да се изпрати
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: null,
          resetTokenExpiry: null,
        },
      });
      return NextResponse.json(
        { error: 'Грешка при изпращане на email. Моля опитайте отново.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Ако този email е регистриран, ще получите инструкции за нулиране на паролата.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Грешка при обработка на заявката' },
      { status: 500 }
    );
  }
}
