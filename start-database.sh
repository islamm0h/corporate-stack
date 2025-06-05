#!/bin/bash

# Corporate Stack Database Startup Script
echo "🚀 بدء تشغيل قاعدة البيانات..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker غير مثبت. يرجى تثبيت Docker أولاً${NC}"
    echo "📥 تحميل من: https://www.docker.com/products/docker-desktop"
    exit 1
fi

echo -e "${GREEN}✅ Docker متوفر${NC}"

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker غير مشغل. يرجى تشغيل Docker أولاً${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker يعمل${NC}"

# Navigate to database directory
cd database

# Stop any existing containers
echo -e "${YELLOW}🛑 إيقاف الحاويات السابقة...${NC}"
docker-compose down

# Start PostgreSQL
echo -e "${BLUE}🔄 تشغيل قاعدة البيانات...${NC}"
docker-compose up -d postgres

# Wait for database to start
echo -e "${YELLOW}⏳ انتظار تشغيل قاعدة البيانات...${NC}"
sleep 10

# Check if database is running
if ! docker ps | grep -q "corporate_stack_db"; then
    echo -e "${RED}❌ فشل في تشغيل قاعدة البيانات${NC}"
    echo "📋 عرض السجلات:"
    docker logs corporate_stack_db
    exit 1
fi

echo -e "${GREEN}✅ قاعدة البيانات تعمل${NC}"

# Start pgAdmin
echo -e "${BLUE}🔄 تشغيل pgAdmin...${NC}"
docker-compose up -d pgadmin

# Go back to project root
cd ..

# Install dependencies if not installed
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 تثبيت التبعيات...${NC}"
    npm install
fi

# Setup Prisma
echo -e "${BLUE}🔧 إعداد Prisma...${NC}"
npx prisma generate

# Apply schema to database
echo -e "${BLUE}📤 تطبيق مخطط قاعدة البيانات...${NC}"
npx prisma db push

echo ""
echo -e "${GREEN}✅ تم تشغيل قاعدة البيانات بنجاح!${NC}"
echo ""
echo "📊 معلومات الاتصال:"
echo "  قاعدة البيانات: postgresql://postgres:postgres123@localhost:5432/corporate_stack_db"
echo "  pgAdmin: http://localhost:8080"
echo "  البريد: admin@corporatestack.com"
echo "  كلمة المرور: admin123"
echo ""
echo "🚀 الخطوات التالية:"
echo "  1. تشغيل التطبيق: npm run dev"
echo "  2. الوصول للوحة التحكم: http://localhost:3000/admin"
echo "  3. Prisma Studio: npx prisma studio"
echo ""
