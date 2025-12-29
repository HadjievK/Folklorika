# Ръководство за Deploy на Vercel

## Предварителни стъпки

### 1. Създайте Git репозитори (GitHub/GitLab/Bitbucket)

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### 2. Регистрация на Vercel

1. Отидете на [vercel.com](https://vercel.com)
2. Регистрирайте се с GitHub/GitLab/Bitbucket акаунта си
3. Свържете вашето Git репозитори

## Деплойване

### Стъпка 1: Import на проекта

1. В Vercel Dashboard кликнете "Add New Project"
2. Изберете вашето репозитори
3. Vercel автоматично ще разпознае Next.js проекта

### Стъпка 2: Environment Variables

Добавете следните environment variables в Vercel:

```
DATABASE_URL=postgresql://postgres.xxx:5432/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.xxx:5432/postgres
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=<генерирайте с: openssl rand -base64 32>
GOOGLE_CLIENT_ID=<вашето Google Client ID>
GOOGLE_CLIENT_SECRET=<вашето Google Secret>
FACEBOOK_CLIENT_ID=<вашето Facebook App ID>
FACEBOOK_CLIENT_SECRET=<вашето Facebook Secret>
EMAIL_USER=zhaltushaipriyateli@gmail.com
EMAIL_PASSWORD=<вашата Gmail app password>
```

### Стъпка 3: Deploy

1. Кликнете "Deploy"
2. Изчакайте build process-а (2-3 минути)
3. Ще получите URL като `https://folklorika.vercel.app`

### Стъпка 4: Актуализирайте OAuth Redirect URLs

**Google Console:**
- Authorized JavaScript origins: `https://your-app.vercel.app`
- Authorized redirect URIs: `https://your-app.vercel.app/api/auth/callback/google`

**Facebook Console:**
- Valid OAuth Redirect URIs: `https://your-app.vercel.app/api/auth/callback/facebook`

### Стъпка 5: Актуализирайте NEXTAUTH_URL

В Vercel environment variables, актуализирайте `NEXTAUTH_URL` с реалния URL.

## Други опции за deploy

### Railway (с PostgreSQL включена)
- [railway.app](https://railway.app)
- Автоматично PostgreSQL hosting
- $5/месец

### Render
- [render.com](https://render.com)
- Безплатен tier (но по-бавен)
- Включва PostgreSQL

### Netlify
- [netlify.com](https://netlify.com)
- Добра алтернатива на Vercel

## Важни забележки

⚠️ **Gmail SMTP**: Gmail има лимити за изпращане на email-и. За production, използвайте:
- SendGrid (100 emails/ден безплатно)
- Mailgun
- AWS SES

⚠️ **База данни**: Supabase вече е хоствана, но уверете се че connection pooling работи (pgbouncer).

⚠️ **SSL**: Vercel автоматично предоставя HTTPS.

## Автоматично деплойване

След първоначалното setup, всеки push към `main` branch автоматично ще trigger-ва deploy на Vercel.

## Полезни команди

```bash
# Генериране на NEXTAUTH_SECRET
openssl rand -base64 32

# Проверка на environment variables
vercel env ls

# Deploy от команден ред
npm i -g vercel
vercel
```
