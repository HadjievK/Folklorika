import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendEventApprovalRequest } from '@/lib/email';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';

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
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Валидация
    if (!body.title || !body.date || !body.city) {
      return NextResponse.json(
        { error: 'Име, дата и град са задължителни' },
        { status: 400 }
      );
    }

    // Създаване на събитие
    const event = await prisma.event.create({
      data: {
        title: body.title,
        slug: body.slug,
        type: body.type || 'OTHER',
        description: body.description || null,
        date: new Date(body.date),
        endDate: body.endDate ? new Date(body.endDate) : null,
        city: body.city,
        region: body.region || null,
        venue: body.venue || null,
        address: body.address || null,
        isFree: body.isFree || false,
        ticketPrice: body.ticketPrice || null,
        ticketUrl: body.ticketUrl || null,
        associationId: body.associationId || null,
        creatorId: session.user.id,
        approved: false, // Изисква одобрение от админ
      },
      include: {
        association: {
          select: {
            name: true,
          },
        },
      },
    });

    // Изпращане на имейл до Жълтуша за одобрение
    const host = request.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const adminUrl = `${protocol}://${host}`;
    
    await sendEventApprovalRequest({
      eventTitle: event.title,
      eventDate: format(new Date(event.date), 'dd MMM yyyy', { locale: bg }),
      city: event.city,
      userName: session.user.name || 'Неизвестен',
      userEmail: session.user.email || 'N/A',
      associationName: event.association?.name,
      adminUrl,
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error: any) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { 
        error: 'Грешка при създаване на събитие',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
