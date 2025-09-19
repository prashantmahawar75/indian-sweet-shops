#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🍭 Sweet Shop Management System Setup');
console.log('=====================================\n');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from template...');
  fs.copyFileSync(envExamplePath, envPath);
  console.log('✅ .env file created');
  console.log('⚠️  Please update DATABASE_URL in .env with your Neon database connection string\n');
} else {
  console.log('✅ .env file already exists\n');
}

// Check if DATABASE_URL is set
const envContent = fs.readFileSync(envPath, 'utf8');
if (envContent.includes('ep-example-123456')) {
  console.log('⚠️  WARNING: Please update your DATABASE_URL in .env file');
  console.log('   Get your connection string from: https://neon.tech\n');
}

console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed\n');
} catch (error) {
  console.error('❌ Failed to install dependencies');
  process.exit(1);
}

console.log('🗄️  Setting up database...');
try {
  execSync('npm run db:push', { stdio: 'inherit' });
  console.log('✅ Database schema created\n');
} catch (error) {
  console.error('❌ Failed to create database schema');
  console.error('   Make sure your DATABASE_URL is correct in .env file');
  process.exit(1);
}

console.log('🌱 Seeding database with sample data...');
try {
  execSync('npm run seed', { stdio: 'inherit' });
  console.log('✅ Database seeded with sample data\n');
} catch (error) {
  console.error('❌ Failed to seed database');
  console.error('   This might be okay if data already exists');
}

console.log('🎉 Setup complete!');
console.log('\nTo start the development server:');
console.log('  npm run dev');
console.log('\nThen open http://localhost:5000 in your browser');
console.log('\nTest accounts:');
console.log('  Admin: admin / admin123');
console.log('  User:  user / user123');
console.log('\n🍬 Happy sweet shopping!');