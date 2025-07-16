#!/bin/bash

# SkillPass Database Initialization Script
# This script ensures the database is properly set up with tables and seed data

echo "🚀 SkillPass Database Initialization"
echo "===================================="

# Detect docker compose command (v1 vs v2)
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    echo "❌ Docker Compose not found. Please install Docker Compose."
    exit 1
fi

echo "📦 Using: $DOCKER_COMPOSE"

# Stop any existing containers
echo "🛑 Stopping existing containers..."
$DOCKER_COMPOSE down

# Remove existing volumes to ensure clean start
echo "🗑️  Removing existing database volumes..."
docker volume rm skillpass_postgres_data 2>/dev/null || true

# Start PostgreSQL container
echo "🐘 Starting PostgreSQL container..."
$DOCKER_COMPOSE up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
MAX_ATTEMPTS=30
ATTEMPT=0

until docker exec skillpass-postgres pg_isready -U skillpass_user -d skillpass_db > /dev/null 2>&1; do
    ATTEMPT=$((ATTEMPT + 1))
    if [ $ATTEMPT -gt $MAX_ATTEMPTS ]; then
        echo "❌ PostgreSQL failed to start after $MAX_ATTEMPTS attempts"
        echo "🔍 Container logs:"
        $DOCKER_COMPOSE logs postgres
        exit 1
    fi
    sleep 2
    echo "   Still waiting... (attempt $ATTEMPT/$MAX_ATTEMPTS)"
done

echo "✅ PostgreSQL is ready!"

# Verify tables were created
echo "🔍 Verifying table creation..."
TABLES=$(docker exec skillpass-postgres psql -U skillpass_user -d skillpass_db -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | tr -d ' ')

if [ "$TABLES" -gt 5 ]; then
    echo "✅ Tables created successfully! ($TABLES tables found)"
else
    echo "❌ Tables were not created properly. Check the logs:"
    $DOCKER_COMPOSE logs postgres
    exit 1
fi

# Show available tables
echo "📋 Available tables:"
docker exec skillpass-postgres psql -U skillpass_user -d skillpass_db -c "\dt"

# Count seed data
echo "📊 Checking seed data..."
USERS=$(docker exec skillpass-postgres psql -U skillpass_user -d skillpass_db -t -c "SELECT COUNT(*) FROM user_profiles;" 2>/dev/null | tr -d ' ')
SKILLS=$(docker exec skillpass-postgres psql -U skillpass_user -d skillpass_db -t -c "SELECT COUNT(*) FROM skills;" 2>/dev/null | tr -d ' ')
ENDORSEMENTS=$(docker exec skillpass-postgres psql -U skillpass_user -d skillpass_db -t -c "SELECT COUNT(*) FROM endorsements;" 2>/dev/null | tr -d ' ')

echo "   👥 Users: $USERS"
echo "   🎯 Skills: $SKILLS"
echo "   ⭐ Endorsements: $ENDORSEMENTS"

if [ "$USERS" -gt 0 ] && [ "$SKILLS" -gt 0 ] && [ "$ENDORSEMENTS" -gt 0 ]; then
    echo "✅ Seed data loaded successfully!"
else
    echo "⚠️  Seed data might not have loaded properly"
fi

echo ""
echo "🎉 Database initialization complete!"
echo ""
echo "Database connection details:"
echo "  Host: localhost"
echo "  Port: 5432"
echo "  Database: skillpass_db"
echo "  Username: skillpass_user"
echo "  Password: skillpass_password"
echo ""
echo "You can now:"
echo "  • Connect with DBeaver using the above credentials"
echo "  • Run 'npm run dev' to start the Next.js application"
echo "  • Access pgAdmin at http://localhost:8080 (admin@skillpass.com / admin123)"
echo "" 