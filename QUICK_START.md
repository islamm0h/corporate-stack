# 🚀 تشغيل سريع لقاعدة البيانات

## المشكلة الشائعة وحلولها

إذا كانت قاعدة البيانات لا تعمل، جرب هذه الحلول بالترتيب:

## الحل الأول: التشغيل السريع ⚡

### Windows:
```cmd
# تشغيل السكريبت السريع
quick-start.bat
```

### Linux/macOS:
```bash
# إعطاء أذونات وتشغيل
chmod +x start-database.sh
./start-database.sh
```

## الحل الثاني: أوامر npm 📦

```bash
# تشغيل قاعدة بيانات بسيطة
npm run db:quick

# انتظار 10 ثوان ثم
npm install
npm run db:generate
npm run db:push

# تشغيل التطبيق
npm run dev
```

## الحل الثالث: Docker Compose 🐳

```bash
# الانتقال لمجلد قاعدة البيانات
cd database

# تشغيل PostgreSQL فقط
docker-compose up -d postgres

# العودة للمجلد الرئيسي
cd ..

# إعداد Prisma
npm run db:generate
npm run db:push
```

## الحل الرابع: تشغيل يدوي 🔧

```bash
# تشغيل PostgreSQL مباشرة
docker run -d \
  --name corporate_stack_db \
  -e POSTGRES_DB=corporate_stack_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres123 \
  -p 5432:5432 \
  postgres:15-alpine

# انتظار 10 ثوان
sleep 10

# إعداد Prisma
npx prisma generate
npx prisma db push
```

## التحقق من التشغيل ✅

```bash
# التحقق من حالة الحاوية
docker ps

# التحقق من الاتصال
npm run db:status

# الاتصال بقاعدة البيانات
npm run db:connect
```

## إذا فشلت جميع الحلول 🆘

### 1. تنظيف Docker
```bash
# إيقاف وحذف الحاوية
docker stop corporate_stack_db
docker rm corporate_stack_db

# تنظيف النظام
docker system prune -f
```

### 2. التحقق من المتطلبات
- **Docker Desktop مثبت ومشغل**
- **المنفذ 5432 غير مستخدم**
- **اتصال إنترنت للتحميل**

### 3. استخدام منفذ مختلف
```bash
# تشغيل على منفذ 5433
docker run -d \
  --name corporate_stack_db \
  -e POSTGRES_DB=corporate_stack_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres123 \
  -p 5433:5432 \
  postgres:15-alpine

# تحديث DATABASE_URL في .env.local
DATABASE_URL="postgresql://postgres:postgres123@localhost:5433/corporate_stack_db"
```

## معلومات الاتصال 📊

بعد التشغيل الناجح:

```
قاعدة البيانات: localhost:5432
المستخدم: postgres
كلمة المرور: postgres123
اسم القاعدة: corporate_stack_db

رابط الاتصال:
postgresql://postgres:postgres123@localhost:5432/corporate_stack_db
```

## الخطوات التالية 🎯

1. **تشغيل التطبيق:**
   ```bash
   npm run dev
   ```

2. **الوصول للوحة التحكم:**
   ```
   http://localhost:3000/admin
   ```

3. **بيانات الدخول:**
   ```
   المستخدم: admin
   كلمة المرور: admin123
   ```

4. **Prisma Studio:**
   ```bash
   npm run db:studio
   ```

## أوامر مفيدة 🛠️

```bash
# حالة قاعدة البيانات
npm run db:status

# الاتصال بقاعدة البيانات
npm run db:connect

# عرض الجداول
\dt

# الخروج من قاعدة البيانات
\q

# إيقاف قاعدة البيانات
docker stop corporate_stack_db

# بدء قاعدة البيانات
docker start corporate_stack_db

# حذف قاعدة البيانات
docker rm -f corporate_stack_db
```

## استكشاف الأخطاء 🔍

### خطأ: Port already in use
```bash
# العثور على العملية التي تستخدم المنفذ
# Windows
netstat -ano | findstr :5432

# Linux/macOS  
lsof -i :5432

# إيقاف PostgreSQL المحلي
sudo systemctl stop postgresql
```

### خطأ: Docker not found
```bash
# تثبيت Docker
# Windows: تحميل Docker Desktop
# macOS: brew install --cask docker
# Linux: sudo apt install docker.io
```

### خطأ: Permission denied
```bash
# Linux/macOS
sudo usermod -aG docker $USER
newgrp docker

# Windows: تشغيل كمدير
```

## الحصول على المساعدة 📞

إذا استمرت المشاكل:

1. **تحقق من ملف troubleshoot.md**
2. **راجع سجلات Docker:**
   ```bash
   docker logs corporate_stack_db
   ```
3. **تواصل معنا:**
   - البريد: support@corporatestack.com
   - GitHub Issues: [رابط المشروع]

---

**💡 نصيحة:** ابدأ بالحل الأول (التشغيل السريع) فهو الأبسط والأسرع!
