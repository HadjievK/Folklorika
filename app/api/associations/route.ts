import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const associations = await prisma.association.findMany({
      where: {
        approved: true,
      },
      include: {
        _count: {
          select: {
            events: true,
            members: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(associations);
  } catch (error) {
    return NextResponse.json({ error: 'Грешка при зареждане на сдруженията' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const association = await prisma.association.create({
      data: {
        ...body,
        approved: false, // Изисква одобрение от админ
      },
    });

    return NextResponse.json(association, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Грешка при създаване на сдружение' }, { status: 500 });
  }
}
