# 🗄️ إعداد قاعدة البيانات - Corporate Stack

## نظرة عامة

تم إنشاء قاعدة بيانات PostgreSQL شاملة لموقع Corporate Stack مع جميع الجداول والبيانات التجريبية المطلوبة لربط لوحة التحكم بالموقع الرئيسي.

## 📋 المتطلبات

### المتطلبات الأساسية
- **Docker Desktop** (الطريقة المفضلة)
- **Node.js** (الإصدار 18 أو أحدث)
- **npm** أو **yarn**

### المتطلبات البديلة (بدون Docker)
- **PostgreSQL** (الإصدار 13 أو أحدث)
- **Redis** (اختياري للتخزين المؤقت)

## 🚀 التشغيل السريع

### الطريقة الأولى: استخدام Docker (مُوصى بها)

#### 1. تشغيل سكريبت الإعداد التلقائي

**لنظام Linux/macOS:**
```bash
chmod +x scripts/setup-database.sh
./scripts/setup-database.sh
```

**لنظام Windows:**
```cmd
scripts\setup-database.bat
```

#### 2. التشغيل اليدوي

```bash
# 1. نسخ ملف البيئة
cp .env.local.example .env.local

# 2. تشغيل قاعدة البيانات
cd database
docker-compose up -d

# 3. تثبيت التبعيات
cd ..
npm install

# 4. إعداد Prisma
npx prisma generate
npx prisma db push

# 5. تشغيل التطبيق
npm run dev
```

### الطريقة الثانية: التثبيت اليدوي

#### 1. تثبيت PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Windows:**
تحميل من [الموقع الرسمي](https://www.postgresql.org/download/windows/)

#### 2. إنشاء قاعدة البيانات

```bash
sudo -u postgres psql
CREATE DATABASE corporate_stack_db;
CREATE USER corporate_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE corporate_stack_db TO corporate_user;
\q
```

#### 3. تشغيل ملف SQL

```bash
psql -U postgres -d corporate_stack_db -f database/schema.sql
```

## 🔧 الإعدادات

### متغيرات البيئة

قم بتحديث ملف `.env.local` بالقيم المناسبة:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/corporate_stack_db"

# Redis (اختياري)
REDIS_URL="redis://:redis123@localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Email (اختياري)
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## 📊 هيكل قاعدة البيانات

### الجداول الرئيسية

| الجدول | الوصف | عدد السجلات |
|--------|--------|-------------|
| `users` | المستخدمين والمديرين | 3 |
| `leads` | العملاء المحتملين | 10 |
| `systems` | الأنظمة والخدمات | 5 |
| `quote_requests` | طلبات العروض | 5 |
| `responses` | الردود والمتابعات | 2 |
| `system_settings` | إعدادات النظام | 35+ |
| `daily_stats` | الإحصائيات اليومية | 7 |
| `activity_logs` | سجل النشاطات | 4 |

### البيانات التجريبية

#### المستخدمين الافتراضيين
```
المدير العام:
- اسم المستخدم: admin
- كلمة المرور: admin123

المدير:
- اسم المستخدم: manager1
- كلمة المرور: manager123

المستخدم:
- اسم المستخدم: user1
- كلمة المرور: user123
```

#### العملاء المحتملين
- 10 شركات من مناطق مختلفة في السعودية
- حالات متنوعة: جديد، تم التواصل، مؤهل، إلخ
- نقاط جودة من 55 إلى 100

#### الأنظمة
- نظام المحاسبة والفاتورة الإلكترونية (15,000 ريال)
- نظام إدارة العملاء CRM (12,000 ريال)
- نظام إدارة الموارد البشرية (18,000 ريال)
- نظام إدارة المخزون (10,000 ريال)
- نظام إدارة المشاريع (8,000 ريال)

## 🔗 الربط مع لوحة التحكم

### APIs المتاحة

#### العملاء المحتملين
```
GET    /api/leads          # جلب العملاء المحتملين
POST   /api/leads          # إضافة عميل محتمل
PUT    /api/leads          # تحديث عميل محتمل
DELETE /api/leads?id=...   # حذف عميل محتمل
```

#### الأنظمة
```
GET    /api/systems        # جلب الأنظمة
POST   /api/systems        # إضافة نظام
PUT    /api/systems        # تحديث نظام
DELETE /api/systems?id=... # حذف نظام
```

#### التحليلات
```
GET /api/analytics?type=overview    # نظرة عامة
GET /api/analytics?type=leads       # تحليل العملاء
GET /api/analytics?type=systems     # تحليل الأنظمة
GET /api/analytics?type=regions     # تحليل المناطق
GET /api/analytics?type=trends      # الاتجاهات
```

#### الإعدادات
```
GET  /api/settings                  # جلب الإعدادات
POST /api/settings                  # حفظ إعداد
PUT  /api/settings                  # تحديث متعدد
```

### استخدام Prisma

```typescript
import prisma from '@/lib/database'

// جلب العملاء المحتملين
const leads = await prisma.lead.findMany({
  include: {
    assignedTo: true,
    quoteRequests: true
  }
})

// إضافة عميل محتمل جديد
const newLead = await prisma.lead.create({
  data: {
    companyName: 'شركة جديدة',
    contactPerson: 'أحمد محمد',
    email: 'ahmed@company.com',
    phone: '+966501234567'
  }
})
```

## 🛠️ أدوات الإدارة

### pgAdmin (واجهة إدارة قاعدة البيانات)
- **الرابط:** http://localhost:8080
- **البريد الإلكتروني:** admin@corporatestack.com
- **كلمة المرور:** admin123

### Prisma Studio
```bash
npx prisma studio
```
- **الرابط:** http://localhost:5555

### أوامر إدارة قاعدة البيانات

```bash
# بدء الخدمات
./scripts/setup-database.sh start

# إيقاف الخدمات
./scripts/setup-database.sh stop

# إعادة تشغيل
./scripts/setup-database.sh restart

# عرض السجلات
./scripts/setup-database.sh logs

# نسخة احتياطية
./scripts/setup-database.sh backup

# استعادة من نسخة احتياطية
./scripts/setup-database.sh restore backup_file.sql

# تنظيف البيانات
./scripts/setup-database.sh clean
```

## 🔍 استكشاف الأخطاء

### مشاكل شائعة

#### 1. فشل الاتصال بقاعدة البيانات
```bash
# التحقق من تشغيل Docker
docker ps

# التحقق من سجلات قاعدة البيانات
docker logs corporate_stack_db

# إعادة تشغيل الخدمات
docker-compose restart
```

#### 2. خطأ في Prisma
```bash
# إعادة توليد العميل
npx prisma generate

# إعادة دفع المخطط
npx prisma db push

# إعادة تعيين قاعدة البيانات
npx prisma migrate reset
```

#### 3. مشاكل الأذونات
```bash
# Linux/macOS
sudo chown -R $USER:$USER .
chmod +x scripts/setup-database.sh

# Windows (تشغيل كمدير)
# تشغيل PowerShell أو CMD كمدير
```

### سجلات الأخطاء

```bash
# سجلات قاعدة البيانات
docker logs corporate_stack_db

# سجلات التطبيق
tail -f logs/app.log

# سجلات Docker Compose
docker-compose logs -f
```

## 📈 الأداء والتحسين

### الفهارس
تم إنشاء فهارس محسنة على:
- حالة العملاء المحتملين
- المناطق والمصادر
- تواريخ الإنشاء
- معرفات المستخدمين

### التخزين المؤقت
- Redis للتخزين المؤقت (اختياري)
- تخزين مؤقت للاستعلامات المتكررة
- تخزين مؤقت للإعدادات

### النسخ الاحتياطي التلقائي
- نسخ احتياطية يومية
- الاحتفاظ بالنسخ لمدة 30 يوم
- ضغط الملفات لتوفير المساحة

## 🔐 الأمان

### تشفير كلمات المرور
- استخدام bcrypt مع 12 rounds
- تشفير قوي للبيانات الحساسة

### حماية API
- معدل محدود للطلبات
- التحقق من صحة البيانات
- سجل شامل للنشاطات

### النسخ الاحتياطي الآمن
- تشفير النسخ الاحتياطية
- تخزين آمن للملفات
- التحقق من سلامة البيانات

## 📞 الدعم

للحصول على المساعدة:
- **البريد الإلكتروني:** support@corporatestack.com
- **الوثائق:** [رابط الوثائق]
- **المجتمع:** [رابط المجتمع]

---

✅ **تم إعداد قاعدة البيانات بنجاح!**

يمكنك الآن تشغيل التطبيق والوصول إلى لوحة التحكم على:
**http://localhost:3000/admin**
