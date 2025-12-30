import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { sendPasswordChangedNotification } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Не сте влезли в системата' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await request.json();

    // Валидация
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Всички полета са задължителни' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Новата парола трябва да е поне 6 символа' },
        { status: 400 }
      );
    }

    // Намери потребителя
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Потребителят не е намерен или използва социален вход' },
        { status: 404 }
      );
    }

    // Провери текущата парола
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Текущата парола е грешна' },
        { status: 400 }
      );
    }

    // Hash новата парола
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Обнови паролата
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Изпрати email нотификация
    const host = request.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    try {
      await sendPasswordChangedNotification({
        name: user.name || '',
        email: user.email,
        baseUrl,
      });
    } catch (emailError) {
      console.error('Failed to send password change notification:', emailError);
      // Не блокираме заявката ако email-a не може да се изпрати
    }

    return NextResponse.json({
      success: true,
      message: 'Паролата е сменена успешно',
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { error: 'Грешка при смяна на паролата' },
      { status: 500 }
    );
  }
}
