import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';

// PATCH - Approve association
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const association = await prisma.association.update({
      where: {
        id: params.id,
      },
      data: {
        approved: true,
      },
    });

    return NextResponse.json(association);
  } catch (error: any) {
    if (error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Грешка при одобряване на сдружението' }, { status: 500 });
  }
}

// DELETE - Reject/delete association
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    // First delete all members (cascade)
    await prisma.associationMember.deleteMany({
      where: {
        associationId: params.id,
      },
    });

    // Then delete the association
    await prisma.association.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Грешка при изтриване на сдружението' }, { status: 500 });
  }
}
