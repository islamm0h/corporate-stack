@echo off
echo 🚀 بدء تشغيل قاعدة البيانات...

REM التحقق من وجود Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker غير مثبت. يرجى تثبيت Docker Desktop أولاً
    echo 📥 تحميل من: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo ✅ Docker متوفر

REM التحقق من تشغيل Docker
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker غير مشغل. يرجى تشغيل Docker Desktop أولاً
    pause
    exit /b 1
)

echo ✅ Docker يعمل

REM الانتقال لمجلد قاعدة البيانات
cd database

REM إيقاف أي حاويات سابقة
echo 🛑 إيقاف الحاويات السابقة...
docker-compose down

REM تشغيل قاعدة البيانات
echo 🔄 تشغيل قاعدة البيانات...
docker-compose up -d postgres

REM انتظار تشغيل قاعدة البيانات
echo ⏳ انتظار تشغيل قاعدة البيانات...
timeout /t 10 /nobreak >nul

REM التحقق من حالة قاعدة البيانات
docker ps | findstr "corporate_stack_db" >nul
if errorlevel 1 (
    echo ❌ فشل في تشغيل قاعدة البيانات
    echo 📋 عرض السجلات:
    docker logs corporate_stack_db
    pause
    exit /b 1
)

echo ✅ قاعدة البيانات تعمل

REM تشغيل pgAdmin
echo 🔄 تشغيل pgAdmin...
docker-compose up -d pgadmin

REM العودة للمجلد الرئيسي
cd ..

REM تثبيت التبعيات إذا لم تكن مثبتة
if not exist node_modules (
    echo 📦 تثبيت التبعيات...
    npm install
)

REM إعداد Prisma
echo 🔧 إعداد Prisma...
call npx prisma generate

REM تطبيق المخطط على قاعدة البيانات
echo 📤 تطبيق مخطط قاعدة البيانات...
call npx prisma db push

echo.
echo ✅ تم تشغيل قاعدة البيانات بنجاح!
echo.
echo 📊 معلومات الاتصال:
echo   قاعدة البيانات: postgresql://postgres:postgres123@localhost:5432/corporate_stack_db
echo   pgAdmin: http://localhost:8080
echo   البريد: admin@corporatestack.com
echo   كلمة المرور: admin123
echo.
echo 🚀 الخطوات التالية:
echo   1. تشغيل التطبيق: npm run dev
echo   2. الوصول للوحة التحكم: http://localhost:3000/admin
echo   3. Prisma Studio: npx prisma studio
echo.
pause
