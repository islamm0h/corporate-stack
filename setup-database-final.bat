@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    إعداد قاعدة البيانات - الحل النهائي
echo ========================================
echo.

REM التحقق من وجود Node.js
echo 🔍 التحقق من Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js غير مثبت. يرجى تثبيت Node.js أولاً
    echo 📥 تحميل من: https://nodejs.org
    pause
    exit /b 1
) else (
    echo ✅ Node.js متوفر
)

REM التحقق من وجود npm
echo 🔍 التحقق من npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm غير متوفر
    pause
    exit /b 1
) else (
    echo ✅ npm متوفر
)

echo.
echo 🔧 إعداد قاعدة البيانات...

REM إنشاء مجلد قاعدة البيانات
if not exist "database" (
    mkdir database
    echo ✅ تم إنشاء مجلد قاعدة البيانات
)

REM إنشاء مجلد النسخ الاحتياطية
if not exist "backups" (
    mkdir backups
    echo ✅ تم إنشاء مجلد النسخ الاحتياطية
)

REM تثبيت التبعيات
echo 📦 تثبيت التبعيات...
call npm install
if errorlevel 1 (
    echo ❌ فشل في تثبيت التبعيات
    pause
    exit /b 1
) else (
    echo ✅ تم تثبيت التبعيات
)

REM توليد عميل Prisma
echo 🔧 توليد عميل Prisma...
call npx prisma generate
if errorlevel 1 (
    echo ❌ فشل في توليد عميل Prisma
    pause
    exit /b 1
) else (
    echo ✅ تم توليد عميل Prisma
)

REM تطبيق مخطط قاعدة البيانات
echo 📤 تطبيق مخطط قاعدة البيانات...
call npx prisma db push
if errorlevel 1 (
    echo ❌ فشل في تطبيق مخطط قاعدة البيانات
    pause
    exit /b 1
) else (
    echo ✅ تم تطبيق مخطط قاعدة البيانات
)

REM إضافة البيانات الأولية
echo 🌱 إضافة البيانات الأولية...
call npx prisma db seed
if errorlevel 1 (
    echo ❌ فشل في إضافة البيانات الأولية
    pause
    exit /b 1
) else (
    echo ✅ تم إضافة البيانات الأولية
)

echo.
echo ========================================
echo        ✅ تم إعداد قاعدة البيانات بنجاح!
echo ========================================
echo.
echo 📊 معلومات قاعدة البيانات:
echo   النوع: SQLite
echo   الملف: ./database/cs_leads_system.db
echo   ORM: Prisma
echo.
echo 👤 بيانات تسجيل الدخول:
echo   المدير:
echo     البريد: admin@cs-leads-system.com
echo     كلمة المرور: admin123
echo.
echo   المدير التنفيذي:
echo     البريد: manager@cs-leads-system.com
echo     كلمة المرور: manager123
echo.
echo   المستخدم:
echo     البريد: user@cs-leads-system.com
echo     كلمة المرور: user123
echo.
echo 🚀 الخطوات التالية:
echo   1. تشغيل التطبيق: npm run dev
echo   2. الوصول للموقع: http://localhost:3000
echo   3. الوصول للوحة التحكم: http://localhost:3000/admin
echo   4. Prisma Studio: npx prisma studio
echo.
echo 💡 نصائح:
echo   - قاعدة البيانات محفوظة في: ./database/cs_leads_system.db
echo   - النسخ الاحتياطية في: ./backups/
echo   - لإعادة تعيين البيانات: npx prisma db seed
echo   - لفتح Prisma Studio: npx prisma studio
echo.
pause
