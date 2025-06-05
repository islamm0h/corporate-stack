@echo off
echo 🚀 تشغيل سريع لقاعدة البيانات

REM التحقق من Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ يرجى تثبيت Docker Desktop أولاً من:
    echo https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo ✅ Docker متوفر

REM تشغيل PostgreSQL فقط
echo 🔄 تشغيل PostgreSQL...
docker run -d ^
  --name corporate_stack_db ^
  -e POSTGRES_DB=corporate_stack_db ^
  -e POSTGRES_USER=postgres ^
  -e POSTGRES_PASSWORD=postgres123 ^
  -p 5432:5432 ^
  postgres:15-alpine

REM انتظار
echo ⏳ انتظار 10 ثوان...
timeout /t 10 /nobreak >nul

REM التحقق من التشغيل
docker ps | findstr "corporate_stack_db" >nul
if errorlevel 1 (
    echo ❌ فشل في التشغيل
    docker logs corporate_stack_db
    pause
    exit /b 1
)

echo ✅ قاعدة البيانات تعمل!

REM تثبيت التبعيات
if not exist node_modules (
    echo 📦 تثبيت التبعيات...
    npm install
)

REM إعداد Prisma
echo 🔧 إعداد Prisma...
call npx prisma generate
call npx prisma db push

echo.
echo ✅ جاهز للاستخدام!
echo 🌐 تشغيل التطبيق: npm run dev
echo 📊 قاعدة البيانات: localhost:5432
echo.
pause
