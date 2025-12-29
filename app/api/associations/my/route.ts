import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get associations where user is a member
    const associations = await prisma.association.findMany({
      where: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        city: true,
        approved: true,
      },
    });

    return NextResponse.json(associations);
  } catch (error) {
    console.error('Error fetching associations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch associations' },
      { status: 500 }
    );
  }
}
