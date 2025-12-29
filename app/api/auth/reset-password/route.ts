import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token и парола са задължителни' },
        { status: 400 }
      );
    }

    // Валидирай паролата
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Паролата трябва да е поне 6 символа' },
        { status: 400 }
      );
    }

    // Намери потребителя с този token
    const user = await prisma.user.findUnique({
      where: { resetToken: token },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Невалиден или изтекъл линк за нулиране' },
        { status: 400 }
      );
    }

    // Провери дали token-ът е изтекъл
    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      // Изчисти изтеклия token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: null,
          resetTokenExpiry: null,
        },
      });

      return NextResponse.json(
        { error: 'Линкът за нулиране е изтекъл. Моля заявете нов.' },
        { status: 400 }
      );
    }

    // Hash новата парола
    const hashedPassword = await bcrypt.hash(password, 10);

    // Актуализирай паролата и изчисти reset полетата
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json(
      { message: 'Паролата е променена успешно. Можете да влезете с новата парола.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Грешка при промяна на паролата' },
      { status: 500 }
    );
  }
}
