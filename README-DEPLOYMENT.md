# نشر نظام إدارة العملاء المحتملين على Vercel

## خطوات النشر:

### 1. إعداد قاعدة البيانات على Vercel

1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. انقر على "Storage" في القائمة الجانبية
3. انقر على "Create Database"
4. اختر "Postgres"
5. أدخل اسم قاعدة البيانات: `cs-leads-system-db`
6. اختر المنطقة الأقرب لك
7. انقر على "Create"

### 2. الحصول على متغيرات قاعدة البيانات

بعد إنشاء قاعدة البيانات، ستحصل على:
- `DATABASE_URL`
- `POSTGRES_PRISMA_URL` 
- `POSTGRES_URL_NON_POOLING`

### 3. نشر المشروع

#### الطريقة الأولى: من خلال GitHub
1. ارفع المشروع إلى GitHub repository
2. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
3. انقر على "New Project"
4. اختر repository من GitHub
5. اتبع الخطوات

#### الطريقة الثانية: من خلال Vercel CLI
```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# نشر المشروع
vercel --prod
```

### 4. إعداد متغيرات البيئة

في Vercel Dashboard > Project Settings > Environment Variables:

```
DATABASE_URL=postgresql://...
POSTGRES_PRISMA_URL=postgresql://...
POSTGRES_URL_NON_POOLING=postgresql://...
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
NODE_ENV=production
```

### 5. إعداد قاعدة البيانات

بعد النشر، قم بتشغيل:
```bash
# إنشاء الجداول
npx prisma db push

# إضافة البيانات التجريبية (اختياري)
npx prisma db seed
```

### 6. التحقق من النشر

1. افتح الرابط المعطى من Vercel
2. تأكد من عمل جميع الصفحات
3. اختبر إضافة عميل محتمل جديد
4. تحقق من عمل لوحة التحكم

## ملاحظات مهمة:

- تأكد من أن جميع APIs تعمل مع قاعدة البيانات الجديدة
- قم بتحديث NEXTAUTH_URL في متغيرات البيئة
- اختبر جميع الوظائف بعد النشر
- احتفظ بنسخة احتياطية من البيانات المحلية

## استكشاف الأخطاء:

### خطأ في قاعدة البيانات:
- تحقق من صحة متغيرات البيئة
- تأكد من تشغيل `prisma db push`

### خطأ في البناء:
- تحقق من أن جميع dependencies موجودة
- تأكد من عدم وجود أخطاء TypeScript

### خطأ في APIs:
- تحقق من logs في Vercel Dashboard
- تأكد من أن Prisma schema صحيح
