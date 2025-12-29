# 🇧🇬 Фолклорика - Национална платформа за български фолклор

Модерна уеб платформа за регистрация на фолклорни сдружения, публикуване на събития (концерти, фестивали, работилници) и популяризиране на българската култура.

## 🚀 Технологичен стек

- **Frontend + Backend**: Next.js 14 (React, TypeScript)
- **База данни**: PostgreSQL
- **ORM**: Prisma
- **Автентикация**: NextAuth.js (Google, Facebook, Email)
- **Styling**: Tailwind CSS

## 📋 Функционалности

✅ Регистрация на фолклорни сдружения  
✅ Публикуване на събития (концерти, фестивали, работилници)  
✅ Автентикация (Google, Facebook, Email/Password)  
✅ Ролева система (Admin, Association Admin, User)  
✅ Одобрение на сдружения и събития от администратор  
✅ SEO оптимизация  
✅ Responsive дизайн  

## 🛠️ Инсталация

### 1. Клониране на проекта

```bash
git clone <your-repo-url>
cd Folklorika
```

### 2. Инсталиране на зависимости

```bash
npm install
```

### 3. Настройка на база данни

#### Локална PostgreSQL база

Ако имате локален PostgreSQL:

```bash
# Създайте база данни
createdb folklorika
```

#### Cloud база (препоръчително за бързо начало)

Използвайте безплатен PostgreSQL хостинг:

- **[Supabase](https://supabase.com)** (препоръчан)
- **[Neon](https://neon.tech)**
- **[Railway](https://railway.app)**

### 4. Environment променливи

Копирайте `.env.example` в `.env`:

```bash
cp .env.example .env
```

Попълнете следните променливи в `.env`:

```env
# Database - получете от Supabase/Neon/Railway
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="генерирайте с: openssl rand -base64 32"

# Google OAuth (опционално)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Facebook OAuth (опционално)
FACEBOOK_CLIENT_ID="your-facebook-app-id"
FACEBOOK_CLIENT_SECRET="your-facebook-app-secret"
```

### 5. Инициализация на базата данни

```bash
# Генериране на Prisma Client
npx prisma generate

# Създаване на таблици
npx prisma db push

# Seed с тестови данни
npm run db:seed
```

### 6. Стартиране на приложението

```bash
npm run dev
```

Отворете [http://localhost:3000](http://localhost:3000) в браузъра.

## 🗄️ База данни

### Модели

- **User** - Потребители (Admin, Association Admin, User)
- **Association** - Фолклорни сдружения
- **AssociationMember** - Връзка между потребители и сдружения
- **Event** - События (концерти, фестивали, работилници)

### Prisma команди

```bash
# Отваряне на Prisma Studio (GUI за база данни)
npm run db:studio

# Създаване на нова миграция
npm run db:migrate

# Push промени без миграция (development)
npm run db:push
```

## 👤 Тестови акаунти

След `npm run db:seed`:

**Администратор:**
- Email: `admin@folklorika.bg`
- Парола: `admin123`

## 📁 Структура на проекта

```
Folklorika/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth
│   │   ├── events/       # Eventi API
│   │   └── associations/ # Сдружения API
│   ├── events/           # Страници за събития
│   ├── associations/     # Страници за сдружения
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Начална страница
├── lib/
│   ├── prisma.ts         # Prisma client
│   └── auth.ts           # NextAuth config
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed данни
├── types/                # TypeScript типове
└── package.json
```

## 🔐 Автентикация

### Google OAuth Setup

1. Отидете на [Google Cloud Console](https://console.cloud.google.com/)
2. Създайте нов проект
3. Активирайте Google+ API
4. Credentials → Create OAuth 2.0 Client ID
5. Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

### Facebook OAuth Setup

1. Отидете на [Facebook Developers](https://developers.facebook.com/)
2. Създайте ново приложение
3. Add Product → Facebook Login
4. Valid OAuth Redirect URIs: `http://localhost:3000/api/auth/callback/facebook`

## 🚢 Deployment

### Vercel (препоръчано)

```bash
# Инсталирайте Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Не забравяйте да добавите environment променливите във Vercel Dashboard!

## 📝 TODO за MVP

- [x] Next.js setup
- [x] Prisma + PostgreSQL
- [x] NextAuth (Google, Facebook, Credentials)
- [x] Основни модели (User, Association, Event)
- [x] API routes
- [x] Начална страница
- [ ] Dashboard за сдружения
- [ ] Форми за създаване на събития
- [ ] Admin панел за одобрения
- [ ] Upload на снимки
- [ ] Филтриране и търсене
- [ ] Карта на събития

## 🤝 Принос

Всички контрибуции са добре дошли! Моля, отворете issue или pull request.

## 📄 Лиценз

MIT License

---

Създадено с ❤️ за българския фолклор





