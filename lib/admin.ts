import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

// Само имейлът на Жълтуша и Приятели има достъп до Admin панела
const ADMIN_EMAIL = 'zhaltushaipriyateli@gmail.com';

export async function isAdmin() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || !session.user.email) {
    return false;
  }
  
  // Проверка дали имейлът е точно zhaltushaipriyateli@gmail.com
  return session.user.email === ADMIN_EMAIL;
}

export async function requireAdmin() {
  const admin = await isAdmin();
  
  if (!admin) {
    throw new Error('Unauthorized - Admin access required');
  }
}
