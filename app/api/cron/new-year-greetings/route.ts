import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const newYearEmailTemplate = (name: string, year: number) => `
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
        ✨ <strong>Честита Нова ${year} година!</strong> ✨
      </div>
      
      <div class="message">
        Нека новата година донесе здраве, щастие и много нови фолклорни празници! 
        Благодарим Ви че сте част от нашата платформа и че заедно популяризираме 
        българската култура и традиции.
      </div>
      
      <div class="message">
        🎊 Нека ${year}-та бъде изпълнена с музика, танци и хубави моменти! 🎊
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

export async function GET(request: Request) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    
    console.log(`🎉 Starting New Year greetings for ${currentYear}...`);

    // Get all users with verified emails
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
        { message: 'No users to send greetings to', sent: 0 },
        { status: 200 }
      );
    }

    const results = {
      sent: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Send email to each user
    for (const user of users) {
      try {
        await transporter.sendMail({
          from: `"Фолклорика" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: `🎉 Честита Нова ${currentYear} Година от Фолклорика!`,
          html: newYearEmailTemplate(user.name || '', currentYear),
        });
        results.sent++;
        console.log(`✅ Sent to ${user.email}`);
      } catch (error) {
        results.failed++;
        results.errors.push(`${user.email}: ${error}`);
        console.error(`❌ Failed to send to ${user.email}:`, error);
      }

      // Add delay between emails to not overload SMTP
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`🎉 Finished! Sent: ${results.sent}, Failed: ${results.failed}`);

    return NextResponse.json({
      message: 'New Year greetings sent successfully',
      timestamp: now.toISOString(),
      year: currentYear,
      total: users.length,
      sent: results.sent,
      failed: results.failed,
      errors: results.errors.length > 0 ? results.errors : undefined,
    });

  } catch (error) {
    console.error('❌ Error in New Year cron job:', error);
    return NextResponse.json(
      { error: 'Failed to send New Year greetings', details: String(error) },
      { status: 500 }
    );
  }
}
