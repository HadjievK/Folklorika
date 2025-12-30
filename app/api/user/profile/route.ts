import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Не сте влезли в системата' },
        { status: 401 }
      );
    }

    // Вземи пълната информация за потребителя
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            createdEvents: true,
            associations: {
              where: {
                role: 'OWNER',
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Потребителят не е намерен' },
        { status: 404 }
      );
    }

    // Форматирай резултата
    const profile = {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      _count: {
        events: user._count.createdEvents,
        associations: user._count.associations,
      },
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Грешка при зареждане на профила' },
      { status: 500 }
    );
  }
}
