import nodemailer from 'nodemailer';

// Email configuration - ще използваме Gmail SMTP за простота
// За продукция можете да използвате SendGrid, AWS SES, etc.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Gmail адрес
    pass: process.env.EMAIL_PASSWORD, // App Password от Gmail
  },
});

interface AssociationNotification {
  associationName: string;
  city: string;
  email: string;
  userName: string;
  userEmail: string;
}

interface EventNotification {
  eventTitle: string;
  eventDate: string;
  city: string;
  userName: string;
  userEmail: string;
  associationName?: string;
}

export async function sendAssociationApprovalRequest(data: AssociationNotification) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'zhaltushaipriyateli@gmail.com',
    subject: `🎭 Ново сдружение чака одобрение - ${data.associationName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #c53030;">Ново фолклорно сдружение за одобрение</h2>
        
        <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">📋 Информация за сдружението:</h3>
          <p><strong>Име:</strong> ${data.associationName}</p>
          <p><strong>Град:</strong> ${data.city}</p>
          <p><strong>Email:</strong> ${data.email}</p>
        </div>

        <div style="background: #fff5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">👤 Регистрирано от:</h3>
          <p><strong>Име:</strong> ${data.userName}</p>
          <p><strong>Email:</strong> ${data.userEmail}</p>
        </div>

        <div style="margin: 30px 0; text-align: center;">
          <a href="${process.env.NEXTAUTH_URL}/admin/associations" 
             style="background: #c53030; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Отвори Admin панел
          </a>
        </div>

        <p style="color: #718096; font-size: 14px; margin-top: 30px;">
          Фолклорика - Платформа за български фолклор
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to zhaltushaipriyateli@gmail.com');
  } catch (error) {
    console.error('❌ Error sending email:', error);
    // Don't throw error - we don't want to block registration if email fails
  }
}

export async function sendEventApprovalRequest(data: EventNotification) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'zhaltushaipriyateli@gmail.com',
    subject: `🎪 Ново събитие чака одобрение - ${data.eventTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #c53030;">Ново фолклорно събитие за одобрение</h2>
        
        <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">📋 Информация за събитието:</h3>
          <p><strong>Название:</strong> ${data.eventTitle}</p>
          <p><strong>Дата:</strong> ${data.eventDate}</p>
          <p><strong>Град:</strong> ${data.city}</p>
          ${data.associationName ? `<p><strong>Организатор:</strong> ${data.associationName}</p>` : ''}
        </div>

        <div style="background: #fff5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">👤 Публикувано от:</h3>
          <p><strong>Име:</strong> ${data.userName}</p>
          <p><strong>Email:</strong> ${data.userEmail}</p>
        </div>

        <div style="margin: 30px 0; text-align: center;">
          <a href="${process.env.NEXTAUTH_URL}/admin/events" 
             style="background: #c53030; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Отвори Admin панел
          </a>
        </div>

        <p style="color: #718096; font-size: 14px; margin-top: 30px;">
          Фолклорика - Платформа за български фолклор
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to zhaltushaipriyateli@gmail.com');
  } catch (error) {
    console.error('❌ Error sending email:', error);
    // Don't throw error - we don't want to block event creation if email fails
  }
}
