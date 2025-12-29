import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendAssociationApprovalRequest } from '@/lib/email';

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
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    console.log('Creating association with data:', body);
    console.log('User ID:', session.user.id);
    
    // Validate required fields
    if (!body.name || !body.slug || !body.city) {
      return NextResponse.json(
        { error: 'Име, slug и град са задължителни' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingAssociation = await prisma.association.findUnique({
      where: { slug: body.slug },
    });

    if (existingAssociation) {
      return NextResponse.json(
        { error: 'Сдружение с това име вече съществува' },
        { status: 400 }
      );
    }
    
    // Create association with the creator as OWNER member
    const association = await prisma.association.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        city: body.city,
        region: body.region || null,
        address: body.address || null,
        email: body.email || null,
        phone: body.phone || null,
        website: body.website || null,
        facebook: body.facebook || null,
        instagram: body.instagram || null,
        approved: false, // Requires admin approval
        members: {
          create: {
            userId: session.user.id,
            role: 'OWNER',
          },
        },
      },
    });

    console.log('Association created:', association);

    // Изпращане на имейл до Жълтуша за одобрение
    await sendAssociationApprovalRequest({
      associationName: association.name,
      city: association.city,
      email: association.email || 'N/A',
      userName: session.user.name || 'Неизвестен',
      userEmail: session.user.email || 'N/A',
    });

    return NextResponse.json(association, { status: 201 });
  } catch (error: any) {
    console.error('Error creating association:', error);
    return NextResponse.json(
      { 
        error: 'Грешка при създаване на сдружение',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
