# قاعدة بيانات Corporate Stack

## نظرة عامة

قاعدة بيانات PostgreSQL شاملة لموقع Corporate Stack تتضمن جميع الجداول والبيانات المطلوبة لإدارة العملاء المحتملين والأنظمة والطلبات والردود.

## هيكل قاعدة البيانات

### الجداول الرئيسية

#### 1. جدول المستخدمين (users)
- إدارة المستخدمين والمديرين
- أدوار مختلفة: admin, manager, user
- تشفير كلمات المرور باستخدام bcrypt

#### 2. جدول العملاء المحتملين (leads)
- معلومات الشركات والعملاء المحتملين
- تتبع المصدر والحالة ونقاط الجودة
- ربط بالمناطق والمدن

#### 3. جدول الأنظمة (systems)
- كتالوج الأنظمة والخدمات
- معلومات SEO والأسعار
- المميزات والمواصفات بصيغة JSON

#### 4. جدول طلبات العروض (quote_requests)
- طلبات العملاء للحصول على عروض أسعار
- أنواع مختلفة: quote, demo, consultation
- تتبع الحالة والأولوية

#### 5. جدول الردود (responses)
- ردود الفريق على طلبات العملاء
- أنواع مختلفة: email, phone, meeting
- تتبع المتابعات

#### 6. جدول الإعدادات (system_settings)
- إعدادات النظام العامة
- إعدادات SEO والأمان
- إعدادات النسخ الاحتياطي والأداء

#### 7. جداول إضافية
- سجل النشاطات (activity_logs)
- الإحصائيات اليومية (daily_stats)
- الملفات المرفوعة (file_uploads)
- النسخ الاحتياطية (backups)

## التشغيل باستخدام Docker

### المتطلبات
- Docker
- Docker Compose

### خطوات التشغيل

1. **نسخ ملف البيئة:**
```bash
cp .env.example .env
```

2. **تشغيل قاعدة البيانات:**
```bash
docker-compose up -d
```

3. **التحقق من حالة الخدمات:**
```bash
docker-compose ps
```

### الخدمات المتاحة

#### PostgreSQL
- **المنفذ:** 5432
- **قاعدة البيانات:** corporate_stack_db
- **المستخدم:** postgres
- **كلمة المرور:** postgres123

#### pgAdmin (واجهة إدارة قاعدة البيانات)
- **الرابط:** http://localhost:8080
- **البريد الإلكتروني:** admin@corporatestack.com
- **كلمة المرور:** admin123

#### Redis (التخزين المؤقت)
- **المنفذ:** 6379
- **كلمة المرور:** redis123

## التشغيل اليدوي

### 1. تثبيت PostgreSQL
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql

# Windows
# تحميل من https://www.postgresql.org/download/windows/
```

### 2. إنشاء قاعدة البيانات
```bash
sudo -u postgres psql
CREATE DATABASE corporate_stack_db;
CREATE USER corporate_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE corporate_stack_db TO corporate_user;
\q
```

### 3. تشغيل ملف SQL
```bash
psql -U postgres -d corporate_stack_db -f schema.sql
```

## استخدام Prisma

### 1. تثبيت Prisma
```bash
npm install prisma @prisma/client
npm install -D prisma
```

### 2. إعداد Prisma
```bash
npx prisma init
```

### 3. تطبيق المخطط
```bash
npx prisma db push
```

### 4. توليد العميل
```bash
npx prisma generate
```

### 5. استخدام Prisma Studio
```bash
npx prisma studio
```

## البيانات التجريبية

تتضمن قاعدة البيانات بيانات تجريبية شاملة:

### المستخدمين
- **المدير:** admin / admin123
- **المدير:** manager1 / manager123
- **المستخدم:** user1 / user123

### العملاء المحتملين
- 10 عملاء محتملين من مناطق مختلفة
- حالات متنوعة: جديد، تم التواصل، مؤهل، إلخ
- نقاط جودة مختلفة

### الأنظمة
- نظام المحاسبة والفاتورة الإلكترونية
- نظام إدارة العملاء (CRM)
- نظام إدارة الموارد البشرية
- نظام إدارة المخزون
- نظام إدارة المشاريع

### الطلبات والردود
- طلبات عروض أسعار متنوعة
- ردود ومتابعات من الفريق
- حالات مختلفة للطلبات

## الأمان

### تشفير كلمات المرور
- استخدام bcrypt مع salt
- قوة التشفير: 12 rounds

### الفهارس
- فهارس محسنة للاستعلامات السريعة
- فهارس على الحقول المهمة

### النسخ الاحتياطي
- نسخ احتياطية تلقائية
- الاحتفاظ بالنسخ لمدة 30 يوم

## الصيانة

### تحديث الإحصائيات
```sql
-- تحديث إحصائيات اليوم
INSERT INTO daily_stats (date, total_leads, new_leads, ...)
VALUES (CURRENT_DATE, ...)
ON CONFLICT (date) DO UPDATE SET ...;
```

### تنظيف البيانات القديمة
```sql
-- حذف سجلات النشاطات الأقدم من 90 يوم
DELETE FROM activity_logs 
WHERE created_at < NOW() - INTERVAL '90 days';
```

### إعادة فهرسة الجداول
```sql
REINDEX DATABASE corporate_stack_db;
```

## استكشاف الأخطاء

### مشاكل الاتصال
1. التحقق من تشغيل PostgreSQL
2. التحقق من إعدادات الشبكة
3. التحقق من كلمات المرور

### مشاكل الأداء
1. تحليل الاستعلامات البطيئة
2. إضافة فهارس جديدة
3. تحسين الاستعلامات

### النسخ الاحتياطي والاستعادة
```bash
# إنشاء نسخة احتياطية
pg_dump -U postgres corporate_stack_db > backup.sql

# استعادة من نسخة احتياطية
psql -U postgres -d corporate_stack_db < backup.sql
```

## API والتكامل

### متغيرات البيئة المطلوبة
```env
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/corporate_stack_db
REDIS_URL=redis://:redis123@localhost:6379
JWT_SECRET=your-secret-key
```

### مثال على الاتصال
```javascript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// الحصول على جميع العملاء المحتملين
const leads = await prisma.lead.findMany({
  include: {
    assignedTo: true,
    quoteRequests: true
  }
})
```

## الدعم والمساعدة

للحصول على المساعدة أو الإبلاغ عن مشاكل:
- البريد الإلكتروني: support@corporatestack.com
- الوثائق: [رابط الوثائق]
- المجتمع: [رابط المجتمع]
