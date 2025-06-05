# 🔧 حل مشاكل قاعدة البيانات

## المشاكل الشائعة والحلول

### 1. Docker غير مثبت أو لا يعمل

#### المشكلة:
```
❌ Docker غير مثبت أو غير مشغل
```

#### الحل:
**Windows:**
1. تحميل Docker Desktop من: https://www.docker.com/products/docker-desktop
2. تثبيت وإعادة تشغيل الكمبيوتر
3. تشغيل Docker Desktop
4. التأكد من ظهور أيقونة Docker في شريط المهام

**macOS:**
```bash
# تثبيت باستخدام Homebrew
brew install --cask docker

# أو تحميل من الموقع الرسمي
# https://www.docker.com/products/docker-desktop
```

**Linux (Ubuntu/Debian):**
```bash
# تحديث النظام
sudo apt update

# تثبيت Docker
sudo apt install docker.io docker-compose

# تشغيل Docker
sudo systemctl start docker
sudo systemctl enable docker

# إضافة المستخدم لمجموعة Docker
sudo usermod -aG docker $USER

# إعادة تسجيل الدخول أو تشغيل:
newgrp docker
```

### 2. المنفذ 5432 مستخدم

#### المشكلة:
```
Error: Port 5432 is already in use
```

#### الحل:
```bash
# التحقق من العمليات التي تستخدم المنفذ
# Windows
netstat -ano | findstr :5432

# Linux/macOS
lsof -i :5432

# إيقاف PostgreSQL المحلي
# Windows (في Services)
# Linux/macOS
sudo systemctl stop postgresql

# أو تغيير المنفذ في docker-compose.yml
ports:
  - "5433:5432"  # استخدام منفذ مختلف
```

### 3. مشاكل الأذونات

#### المشكلة:
```
Permission denied
```

#### الحل:
**Linux/macOS:**
```bash
# إعطاء أذونات التشغيل للسكريبت
chmod +x start-database.sh

# تشغيل السكريبت
./start-database.sh
```

**Windows:**
```cmd
# تشغيل Command Prompt كمدير
# ثم تشغيل السكريبت
start-database.bat
```

### 4. فشل في تشغيل الحاوية

#### المشكلة:
```
Container failed to start
```

#### الحل:
```bash
# عرض سجلات الأخطاء
docker logs corporate_stack_db

# إعادة تشغيل Docker
# Windows: إعادة تشغيل Docker Desktop
# Linux/macOS:
sudo systemctl restart docker

# تنظيف الحاويات القديمة
docker system prune -f

# إعادة تشغيل قاعدة البيانات
cd database
docker-compose down
docker-compose up -d
```

### 5. مشاكل الشبكة

#### المشكلة:
```
Network connection failed
```

#### الحل:
```bash
# التحقق من حالة الحاوية
docker ps

# التحقق من الشبكة
docker network ls

# إعادة إنشاء الشبكة
docker network rm corporate_stack_network
docker-compose up -d
```

### 6. مشاكل Prisma

#### المشكلة:
```
Prisma Client not generated
```

#### الحل:
```bash
# إعادة توليد Prisma Client
npx prisma generate

# تطبيق المخطط
npx prisma db push

# إعادة تعيين قاعدة البيانات (احذر: يحذف البيانات)
npx prisma migrate reset
```

### 7. مشاكل متغيرات البيئة

#### المشكلة:
```
Environment variables not found
```

#### الحل:
```bash
# إنشاء ملف .env.local
cp .env.local.example .env.local

# تحديث DATABASE_URL في .env.local
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/corporate_stack_db"
```

## أوامر التشخيص

### التحقق من حالة Docker
```bash
# حالة Docker
docker --version
docker info

# الحاويات المشغلة
docker ps

# جميع الحاويات
docker ps -a

# استخدام الموارد
docker stats
```

### التحقق من قاعدة البيانات
```bash
# الاتصال بقاعدة البيانات
docker exec -it corporate_stack_db psql -U postgres -d corporate_stack_db

# التحقق من الجداول
\dt

# الخروج
\q
```

### سجلات الأخطاء
```bash
# سجلات قاعدة البيانات
docker logs corporate_stack_db

# سجلات pgAdmin
docker logs corporate_stack_pgadmin

# سجلات Docker Compose
cd database
docker-compose logs
```

## الحلول السريعة

### إعادة تعيين كاملة
```bash
# إيقاف جميع الحاويات
docker-compose down

# حذف البيانات (احذر!)
docker-compose down -v

# إعادة التشغيل
docker-compose up -d

# إعادة إعداد Prisma
npx prisma generate
npx prisma db push
```

### تشغيل بدون Docker
```bash
# تثبيت PostgreSQL محلياً
# Windows: تحميل من postgresql.org
# macOS: brew install postgresql
# Linux: sudo apt install postgresql

# إنشاء قاعدة البيانات
createdb corporate_stack_db

# تشغيل ملف SQL
psql -d corporate_stack_db -f database/schema.sql

# تحديث DATABASE_URL
DATABASE_URL="postgresql://postgres:password@localhost:5432/corporate_stack_db"
```

## طلب المساعدة

إذا استمرت المشاكل، يرجى تقديم المعلومات التالية:

1. **نظام التشغيل:** Windows/macOS/Linux
2. **إصدار Docker:** `docker --version`
3. **رسالة الخطأ الكاملة**
4. **سجلات Docker:** `docker logs corporate_stack_db`
5. **حالة الحاويات:** `docker ps -a`

### معلومات الاتصال:
- **البريد الإلكتروني:** support@corporatestack.com
- **GitHub Issues:** [رابط المشروع]

## اختبار سريع

```bash
# اختبار الاتصال بقاعدة البيانات
docker exec corporate_stack_db pg_isready -U postgres

# اختبار الاتصال من التطبيق
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect().then(() => {
  console.log('✅ اتصال ناجح بقاعدة البيانات');
  process.exit(0);
}).catch(err => {
  console.error('❌ فشل الاتصال:', err.message);
  process.exit(1);
});
"
```
