@echo off
chcp 65001 >nul
title إعداد قاعدة البيانات - كوربريت ستاك

echo.
echo ========================================
echo    إعداد قاعدة البيانات - كوربريت ستاك
echo ========================================
echo.

REM التحقق من وجود Docker
echo 🔍 التحقق من Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker غير مثبت. يرجى تثبيت Docker أولاً
    echo    تحميل من: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
) else (
    echo ✅ Docker متوفر
)

REM التحقق من وجود Node.js
echo 🔍 التحقق من Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js غير مثبت. يرجى تثبيت Node.js أولاً
    echo    تحميل من: https://nodejs.org
    pause
    exit /b 1
) else (
    echo ✅ Node.js متوفر
)

REM إنشاء ملف .env إذا لم يكن موجوداً
echo 🔧 إعداد متغيرات البيئة...
if not exist .env (
    echo DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/corporate_stack_db > .env
    echo NEXTAUTH_SECRET=your-secret-key-here >> .env
    echo NEXTAUTH_URL=http://localhost:3000 >> .env
    echo ✅ تم إنشاء ملف .env
) else (
    echo ✅ ملف .env موجود
)

REM بدء قاعدة البيانات
echo 🚀 بدء قاعدة البيانات...
cd database
docker-compose -f docker-compose-simple.yml up -d
if errorlevel 1 (
    echo ❌ فشل في بدء قاعدة البيانات
    pause
    exit /b 1
) else (
    echo ✅ تم بدء قاعدة البيانات
)

REM انتظار بدء قاعدة البيانات
echo ⏳ انتظار بدء قاعدة البيانات...
timeout /t 10 /nobreak >nul

REM العودة للمجلد الرئيسي
cd ..

REM تثبيت التبعيات
echo 📦 تثبيت التبعيات...
npm install
if errorlevel 1 (
    echo ❌ فشل في تثبيت التبعيات
    pause
    exit /b 1
) else (
    echo ✅ تم تثبيت التبعيات
)

REM إعداد Prisma
echo 🔧 إعداد Prisma...
npx prisma generate
if errorlevel 1 (
    echo ❌ فشل في إنشاء Prisma client
    pause
    exit /b 1
) else (
    echo ✅ تم إنشاء Prisma client
)

echo 📤 تطبيق مخطط قاعدة البيانات...
npx prisma db push
if errorlevel 1 (
    echo ❌ فشل في تطبيق مخطط قاعدة البيانات
    pause
    exit /b 1
) else (
    echo ✅ تم تطبيق مخطط قاعدة البيانات
)

REM إدراج البيانات التجريبية (اختياري)
echo 🌱 إدراج البيانات التجريبية...
npx prisma db seed
if errorlevel 1 (
    echo ⚠️ لم يتم العثور على ملف البذر، سيتم المتابعة بدون بيانات تجريبية
) else (
    echo ✅ تم إدراج البيانات التجريبية
)

echo.
echo ✅ تم إعداد قاعدة البيانات بنجاح!
echo.
echo 📊 معلومات الاتصال:
echo   قاعدة البيانات: postgresql://postgres:postgres123@localhost:5432/corporate_stack_db
echo   pgAdmin: http://localhost:8080
echo   البريد: admin@corporatestack.com
echo   كلمة المرور: admin123
echo.
echo 🚀 الخطوات التالية:
echo   1. تشغيل التطبيق: npm run dev
echo   2. الوصول للموقع: http://localhost:3000
echo   3. الوصول للوحة التحكم: http://localhost:3000/admin
echo   4. Prisma Studio: npx prisma studio
echo.
echo 💡 نصائح:
echo   - لإيقاف قاعدة البيانات: docker-compose -f database/docker-compose-simple.yml down
echo   - لعرض السجلات: docker-compose -f database/docker-compose-simple.yml logs
echo   - لإعادة تشغيل: docker-compose -f database/docker-compose-simple.yml restart
echo.
pause
