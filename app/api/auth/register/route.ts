import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

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

    // Създаване на потребител
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(
      { message: 'Успешна регистрация', user },
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
