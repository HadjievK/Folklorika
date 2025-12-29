import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { sendVerificationEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Валидация
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Всички полета са задължителни' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Паролата трябва да е поне 6 символа' },
        { status: 400 }
      );
    }

    // Проверка дали email вече съществува
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Този email вече е регистриран' },
        { status: 400 }
      );
    }

    // Хеширане на паролата
    const hashedPassword = await bcrypt.hash(password, 10);

    // Генериране на verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Създаване на потребител
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: false,
        verificationToken,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // Изпращане на verification email
    const host = request.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const verificationUrl = `${protocol}://${host}/api/auth/verify?token=${verificationToken}`;
    
    try {
      await sendVerificationEmail({
        name: user.name || '',
        email: user.email,
        verificationUrl,
      });
    } catch (emailError) {
      // Ако email-ът не може да се изпрати, изтриваме потребителя
      await prisma.user.delete({ where: { id: user.id } });
      return NextResponse.json(
        { error: 'Грешка при изпращане на потвърдителен email. Моля опитайте отново.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Успешна регистрация! Моля проверете вашия email за потвърждение.',
        user 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Грешка при регистрация' },
      { status: 500 }
    );
  }
}
