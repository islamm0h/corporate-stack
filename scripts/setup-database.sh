#!/bin/bash

# Corporate Stack Database Setup Script
# This script sets up the PostgreSQL database for the Corporate Stack project

set -e

echo "🚀 Setting up Corporate Stack Database..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DB_NAME="corporate_stack_db"
DB_USER="postgres"
DB_PASSWORD="postgres123"
DB_HOST="localhost"
DB_PORT="5432"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if command -v docker &> /dev/null; then
        print_success "Docker is installed"
        return 0
    else
        print_error "Docker is not installed. Please install Docker first."
        return 1
    fi
}

# Check if Docker Compose is installed
check_docker_compose() {
    if command -v docker-compose &> /dev/null; then
        print_success "Docker Compose is installed"
        return 0
    else
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        return 1
    fi
}

# Start database with Docker
start_database_docker() {
    print_status "Starting database with Docker..."
    
    cd database
    
    if [ ! -f "docker-compose.yml" ]; then
        print_error "docker-compose.yml not found in database directory"
        return 1
    fi
    
    # Start the services
    docker-compose up -d
    
    # Wait for database to be ready
    print_status "Waiting for database to be ready..."
    sleep 10
    
    # Check if database is running
    if docker-compose ps | grep -q "corporate_stack_db.*Up"; then
        print_success "Database is running"
        return 0
    else
        print_error "Failed to start database"
        return 1
    fi
}

# Install Node.js dependencies
install_dependencies() {
    print_status "Installing Node.js dependencies..."
    
    cd ..
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found"
        return 1
    fi
    
    npm install
    print_success "Dependencies installed"
}

# Setup Prisma
setup_prisma() {
    print_status "Setting up Prisma..."
    
    # Generate Prisma client
    npx prisma generate
    print_success "Prisma client generated"
    
    # Push schema to database
    print_status "Pushing schema to database..."
    npx prisma db push
    print_success "Schema pushed to database"
}

# Verify database connection
verify_connection() {
    print_status "Verifying database connection..."
    
    # Try to connect to database
    if docker exec corporate_stack_db psql -U $DB_USER -d $DB_NAME -c "SELECT 1;" &> /dev/null; then
        print_success "Database connection verified"
        return 0
    else
        print_error "Failed to connect to database"
        return 1
    fi
}

# Show database info
show_database_info() {
    print_success "Database setup completed successfully!"
    echo ""
    echo "📊 Database Information:"
    echo "  Host: $DB_HOST"
    echo "  Port: $DB_PORT"
    echo "  Database: $DB_NAME"
    echo "  Username: $DB_USER"
    echo "  Password: $DB_PASSWORD"
    echo ""
    echo "🔧 Management Tools:"
    echo "  pgAdmin: http://localhost:8080"
    echo "  Email: admin@corporatestack.com"
    echo "  Password: admin123"
    echo ""
    echo "🚀 Next Steps:"
    echo "  1. Start your Next.js application: npm run dev"
    echo "  2. Access admin panel: http://localhost:3000/admin"
    echo "  3. Use Prisma Studio: npx prisma studio"
    echo ""
    echo "📝 Default Admin Credentials:"
    echo "  Username: admin"
    echo "  Password: admin123"
}

# Main execution
main() {
    print_status "Starting Corporate Stack database setup..."
    
    # Check prerequisites
    if ! check_docker || ! check_docker_compose; then
        print_error "Prerequisites not met. Exiting."
        exit 1
    fi
    
    # Start database
    if ! start_database_docker; then
        print_error "Failed to start database. Exiting."
        exit 1
    fi
    
    # Install dependencies
    if ! install_dependencies; then
        print_error "Failed to install dependencies. Exiting."
        exit 1
    fi
    
    # Setup Prisma
    if ! setup_prisma; then
        print_error "Failed to setup Prisma. Exiting."
        exit 1
    fi
    
    # Verify connection
    if ! verify_connection; then
        print_warning "Database connection verification failed, but setup may still be successful."
    fi
    
    # Show info
    show_database_info
}

# Handle script arguments
case "${1:-}" in
    "start")
        print_status "Starting database services..."
        cd database && docker-compose up -d
        print_success "Database services started"
        ;;
    "stop")
        print_status "Stopping database services..."
        cd database && docker-compose down
        print_success "Database services stopped"
        ;;
    "restart")
        print_status "Restarting database services..."
        cd database && docker-compose restart
        print_success "Database services restarted"
        ;;
    "logs")
        print_status "Showing database logs..."
        cd database && docker-compose logs -f
        ;;
    "clean")
        print_warning "This will remove all database data. Are you sure? (y/N)"
        read -r response
        if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            print_status "Cleaning database..."
            cd database && docker-compose down -v
            print_success "Database cleaned"
        else
            print_status "Operation cancelled"
        fi
        ;;
    "backup")
        print_status "Creating database backup..."
        timestamp=$(date +"%Y%m%d_%H%M%S")
        backup_file="backup_${timestamp}.sql"
        docker exec corporate_stack_db pg_dump -U $DB_USER $DB_NAME > "backups/$backup_file"
        print_success "Backup created: backups/$backup_file"
        ;;
    "restore")
        if [ -z "$2" ]; then
            print_error "Please specify backup file: ./setup-database.sh restore <backup_file>"
            exit 1
        fi
        print_status "Restoring database from $2..."
        docker exec -i corporate_stack_db psql -U $DB_USER $DB_NAME < "$2"
        print_success "Database restored from $2"
        ;;
    "")
        main
        ;;
    *)
        echo "Usage: $0 [start|stop|restart|logs|clean|backup|restore <file>]"
        echo ""
        echo "Commands:"
        echo "  start    - Start database services"
        echo "  stop     - Stop database services"
        echo "  restart  - Restart database services"
        echo "  logs     - Show database logs"
        echo "  clean    - Remove all database data"
        echo "  backup   - Create database backup"
        echo "  restore  - Restore from backup file"
        echo ""
        echo "Run without arguments to perform full setup"
        exit 1
        ;;
esac
