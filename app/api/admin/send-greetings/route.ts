import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const newYearEmailTemplate = (name: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .greeting { font-size: 24px; font-weight: bold; margin-bottom: 20px; }
    .message { margin-bottom: 20px; }
    .signature { margin-top: 30px; font-style: italic; color: #666; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 32px;">🎉 Честита Нова Година! 🎉</h1>
    </div>
    <div class="content">
      <div class="greeting">Здравейте${name ? ', ' + name : ''}!</div>
      
      <div class="message">
        От името на екипа на <strong>Фолклорика</strong> искаме да Ви пожелаем:
      </div>
      
      <div class="message">
        ✨ <strong>Честита Нова 2026 година!</strong> ✨
      </div>
      
      <div class="message">
        Нека новата година донесе здраве, щастие и много нови фолклорни празници! 
        Благодарим Ви че сте част от нашата платформа и че заедно популяризираме 
        българската култура и традиции.
      </div>
      
      <div class="message">
        🎊 Нека 2026-та бъде изпълнена с музика, танци и хубави моменти! 🎊
      </div>
      
      <div class="signature">
        С уважение,<br>
        Екипът на Фолклорика 🎪
      </div>
    </div>
    
    <div class="footer">
      <p>Фолклорика - Национална платформа за български фолклор</p>
    </div>
  </div>
</body>
</html>
`;

export async function POST() {
  try {
    // Провери дали потребителят е администратор
    await requireAdmin();

    // Вземи всички потребители с verified emails
    const users = await prisma.user.findMany({
      where: {
        emailVerified: true,
      },
      select: {
        email: true,
        name: true,
      },
    });

    if (users.length === 0) {
      return NextResponse.json(
        { message: 'Няма потребители за изпращане' },
        { status: 200 }
      );
    }

    const results = {
      sent: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Изпрати мейл на всеки потребител
    for (const user of users) {
      try {
        await transporter.sendMail({
          from: `"Фолклорика" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: '🎉 Честита Нова Година от Фолклорика!',
          html: newYearEmailTemplate(user.name || ''),
        });
        results.sent++;
      } catch (error) {
        results.failed++;
        results.errors.push(`${user.email}: ${error}`);
        console.error(`Failed to send to ${user.email}:`, error);
      }

      // Добави малко забавяне между мейлите за да не претоварваме SMTP сървъра
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return NextResponse.json({
      message: 'Изпращането завърши',
      total: users.length,
      sent: results.sent,
      failed: results.failed,
      errors: results.errors.length > 0 ? results.errors : undefined,
    });

  } catch (error) {
    console.error('Error sending greetings:', error);
    return NextResponse.json(
      { error: 'Грешка при изпращане на поздравления' },
      { status: 500 }
    );
  }
}
