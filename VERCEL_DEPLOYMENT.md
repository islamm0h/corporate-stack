# 🚀 نشر التطبيق على Vercel مع قاعدة البيانات

## 📋 خطوات النشر

### 1. إعداد قاعدة البيانات على Vercel

#### أ) إنشاء مشروع Vercel
```bash
# تسجيل الدخول إلى Vercel
npx vercel login

# ربط المشروع
npx vercel link
```

#### ب) إضافة قاعدة بيانات Postgres
1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر مشروعك
3. اذهب إلى تبويب **Storage**
4. اضغط **Create Database**
5. اختر **Postgres**
6. اسم قاعدة البيانات: `cs-leads-system`

### 2. تحديث إعدادات قاعدة البيانات

#### أ) تحديث schema.prisma للإنتاج
```prisma
datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_URL")
}
```

#### ب) إعداد متغيرات البيئة
```env
# Production Database (Vercel Postgres)
POSTGRES_URL="postgresql://..."
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NO_SSL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."
POSTGRES_USER="..."
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="..."
```

### 3. تحديث مخطط قاعدة البيانات للإنتاج

#### أ) إنشاء ملف schema منفصل للإنتاج
```bash
cp database/prisma/schema.prisma database/prisma/schema.production.prisma
```

#### ب) تحديث package.json
```json
{
  "scripts": {
    "build": "prisma generate && prisma db push && next build",
    "deploy": "prisma generate --schema=database/prisma/schema.production.prisma && prisma db push --schema=database/prisma/schema.production.prisma && next build"
  }
}
```

### 4. إعداد متغيرات البيئة في Vercel

#### في Vercel Dashboard:
1. اذهب إلى **Settings** → **Environment Variables**
2. أضف المتغيرات التالية:

```env
# Database
POSTGRES_URL=postgresql://...
DATABASE_URL=postgresql://...

# Authentication
NEXTAUTH_SECRET=your-production-secret-here
NEXTAUTH_URL=https://your-app.vercel.app
JWT_SECRET=your-production-jwt-secret

# Application
NODE_ENV=production
```

### 5. تحديث الكود للإنتاج

#### أ) تحديث lib/database.ts
```typescript
const prisma = globalThis.prisma || new PrismaClient({
  datasources: {
    db: {
      url: process.env.NODE_ENV === 'production' 
        ? process.env.POSTGRES_URL 
        : process.env.DATABASE_URL
    }
  }
})
```

#### ب) إنشاء ملف seed للإنتاج
```bash
cp database/prisma/seed.ts database/prisma/seed.production.ts
```

### 6. النشر

#### أ) النشر الأولي
```bash
# رفع الكود
git add .
git commit -m "Setup for Vercel deployment"
git push

# النشر
npx vercel --prod
```

#### ب) تطبيق مخطط قاعدة البيانات
```bash
# بعد النشر، تطبيق المخطط
npx prisma db push --schema=database/prisma/schema.production.prisma
```

#### ج) إضافة البيانات الأولية
```bash
# تشغيل seed على الإنتاج
npx prisma db seed --schema=database/prisma/schema.production.prisma
```

### 7. التحقق من النشر

#### أ) فحص الموقع
- الموقع: https://your-app.vercel.app
- لوحة التحكم: https://your-app.vercel.app/admin

#### ب) فحص قاعدة البيانات
```bash
# فحص الاتصال
curl https://your-app.vercel.app/api/check-db-connection
```

## 🔧 إعدادات إضافية

### 1. إعداد النطاق المخصص
1. في Vercel Dashboard → **Domains**
2. أضف النطاق المخصص
3. حدث NEXTAUTH_URL

### 2. إعداد البريد الإلكتروني
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 3. إعداد التحليلات
```env
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

## 🚨 نصائح مهمة

### 1. الأمان
- استخدم أسرار قوية للإنتاج
- فعل HTTPS فقط
- قم بتشفير البيانات الحساسة

### 2. الأداء
- استخدم Connection Pooling
- فعل Caching
- قم بضغط الصور

### 3. المراقبة
- راقب استخدام قاعدة البيانات
- فعل Error Tracking
- راقب الأداء

## 📞 الدعم

في حالة وجود مشاكل:
1. تحقق من Vercel Logs
2. تحقق من Database Logs
3. تحقق من متغيرات البيئة
4. تحقق من Prisma Schema

---

## ✅ قائمة المراجعة

- [ ] إنشاء قاعدة بيانات Vercel Postgres
- [ ] تحديث schema.prisma
- [ ] إعداد متغيرات البيئة
- [ ] تحديث الكود للإنتاج
- [ ] النشر على Vercel
- [ ] تطبيق مخطط قاعدة البيانات
- [ ] إضافة البيانات الأولية
- [ ] اختبار الموقع
- [ ] إعداد النطاق المخصص (اختياري)

🎉 **بعد اتباع هذه الخطوات، سيكون التطبيق متاحاً على الإنترنت!**
