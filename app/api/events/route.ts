import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: {
        approved: true,
        date: {
          gte: new Date(),
        },
      },
      include: {
        association: {
          select: {
            name: true,
            slug: true,
            city: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
      take: 20,
    });

    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: 'Грешка при зареждане на събитията' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Тук ще добавим валидация и проверка за автентикация
    const event = await prisma.event.create({
      data: {
        ...body,
        approved: false, // Изисква одобрение от админ
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Грешка при създаване на събитие' }, { status: 500 });
  }
}
