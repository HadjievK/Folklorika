import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(
        new URL('/auth/signin?error=invalid-token', process.env.NEXTAUTH_URL!)
      );
    }

    // Намери потребителя с този token
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      return NextResponse.redirect(
        new URL('/auth/signin?error=invalid-token', process.env.NEXTAUTH_URL!)
      );
    }

    // Провери дали вече е верифициран
    if (user.emailVerified) {
      return NextResponse.redirect(
        new URL('/auth/signin?verified=already', process.env.NEXTAUTH_URL!)
      );
    }

    // Верифицирай email-a
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null, // Изчисти token-a
      },
    });

    // Пренасочи към login с успех съобщение
    return NextResponse.redirect(
      new URL('/auth/signin?verified=success', process.env.NEXTAUTH_URL!)
    );
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.redirect(
      new URL('/auth/signin?error=verification-failed', process.env.NEXTAUTH_URL!)
    );
  }
}
