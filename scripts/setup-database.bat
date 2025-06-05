@echo off
setlocal enabledelayedexpansion

REM Corporate Stack Database Setup Script for Windows
REM This script sets up the PostgreSQL database for the Corporate Stack project

echo 🚀 Setting up Corporate Stack Database...

REM Configuration
set DB_NAME=corporate_stack_db
set DB_USER=postgres
set DB_PASSWORD=postgres123
set DB_HOST=localhost
set DB_PORT=5432

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
) else (
    echo ✅ Docker is installed
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
) else (
    echo ✅ Docker Compose is installed
)

REM Handle command line arguments
if "%1"=="start" goto start_services
if "%1"=="stop" goto stop_services
if "%1"=="restart" goto restart_services
if "%1"=="logs" goto show_logs
if "%1"=="clean" goto clean_database
if "%1"=="backup" goto backup_database
if "%1"=="restore" goto restore_database
if "%1"=="help" goto show_help
if not "%1"=="" goto show_help

REM Main setup process
echo 📊 Starting database setup...

REM Navigate to database directory
cd database
if errorlevel 1 (
    echo ❌ Database directory not found
    pause
    exit /b 1
)

REM Start database services
echo 🔄 Starting database services...
docker-compose up -d
if errorlevel 1 (
    echo ❌ Failed to start database services
    pause
    exit /b 1
)

REM Wait for database to be ready
echo ⏳ Waiting for database to be ready...
timeout /t 15 /nobreak >nul

REM Check if database is running
docker-compose ps | findstr "corporate_stack_db" | findstr "Up" >nul
if errorlevel 1 (
    echo ❌ Database failed to start properly
    pause
    exit /b 1
) else (
    echo ✅ Database is running
)

REM Navigate back to project root
cd ..

REM Install Node.js dependencies
echo 📦 Installing Node.js dependencies...
if not exist package.json (
    echo ❌ package.json not found
    pause
    exit /b 1
)

call npm install
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
) else (
    echo ✅ Dependencies installed
)

REM Setup Prisma
echo 🔧 Setting up Prisma...
call npx prisma generate
if errorlevel 1 (
    echo ❌ Failed to generate Prisma client
    pause
    exit /b 1
) else (
    echo ✅ Prisma client generated
)

echo 📤 Pushing schema to database...
call npx prisma db push
if errorlevel 1 (
    echo ❌ Failed to push schema to database
    pause
    exit /b 1
) else (
    echo ✅ Schema pushed to database
)

REM Verify database connection
echo 🔍 Verifying database connection...
docker exec corporate_stack_db psql -U %DB_USER% -d %DB_NAME% -c "SELECT 1;" >nul 2>&1
if errorlevel 1 (
    echo ⚠️ Database connection verification failed, but setup may still be successful
) else (
    echo ✅ Database connection verified
)

REM Show success message
echo.
echo ✅ Database setup completed successfully!
echo.
echo 📊 Database Information:
echo   Host: %DB_HOST%
echo   Port: %DB_PORT%
echo   Database: %DB_NAME%
echo   Username: %DB_USER%
echo   Password: %DB_PASSWORD%
echo.
echo 🔧 Management Tools:
echo   pgAdmin: http://localhost:8080
echo   Email: admin@corporatestack.com
echo   Password: admin123
echo.
echo 🚀 Next Steps:
echo   1. Start your Next.js application: npm run dev
echo   2. Access admin panel: http://localhost:3000/admin
echo   3. Use Prisma Studio: npx prisma studio
echo.
echo 📝 Default Admin Credentials:
echo   Username: admin
echo   Password: admin123
echo.
pause
exit /b 0

:start_services
echo 🔄 Starting database services...
cd database
docker-compose up -d
echo ✅ Database services started
pause
exit /b 0

:stop_services
echo 🛑 Stopping database services...
cd database
docker-compose down
echo ✅ Database services stopped
pause
exit /b 0

:restart_services
echo 🔄 Restarting database services...
cd database
docker-compose restart
echo ✅ Database services restarted
pause
exit /b 0

:show_logs
echo 📋 Showing database logs...
cd database
docker-compose logs -f
exit /b 0

:clean_database
echo ⚠️ This will remove all database data. Are you sure? (Y/N)
set /p response=
if /i "!response!"=="Y" (
    echo 🧹 Cleaning database...
    cd database
    docker-compose down -v
    echo ✅ Database cleaned
) else (
    echo ❌ Operation cancelled
)
pause
exit /b 0

:backup_database
echo 💾 Creating database backup...
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "timestamp=!dt:~0,8!_!dt:~8,6!"
set "backup_file=backup_!timestamp!.sql"
if not exist backups mkdir backups
docker exec corporate_stack_db pg_dump -U %DB_USER% %DB_NAME% > backups\!backup_file!
echo ✅ Backup created: backups\!backup_file!
pause
exit /b 0

:restore_database
if "%2"=="" (
    echo ❌ Please specify backup file: setup-database.bat restore backup_file.sql
    pause
    exit /b 1
)
echo 📥 Restoring database from %2...
docker exec -i corporate_stack_db psql -U %DB_USER% %DB_NAME% < %2
echo ✅ Database restored from %2
pause
exit /b 0

:show_help
echo Usage: setup-database.bat [command]
echo.
echo Commands:
echo   start    - Start database services
echo   stop     - Stop database services
echo   restart  - Restart database services
echo   logs     - Show database logs
echo   clean    - Remove all database data
echo   backup   - Create database backup
echo   restore  - Restore from backup file
echo   help     - Show this help message
echo.
echo Run without arguments to perform full setup
pause
exit /b 0
