import 'dotenv/config';
import { db } from './db';
import { users, sweets } from '@shared/schema';
import { hashPassword } from './auth';
import { eq } from 'drizzle-orm';

async function seed() {
  try {
    console.log('Seeding database...');

    // Check if admin user already exists
    const existingAdmin = await db.select().from(users).where(eq(users.username, 'admin')).limit(1);
    
    if (existingAdmin.length === 0) {
      // Create admin user
      const adminPassword = await hashPassword('admin123');
      await db.insert(users).values({
        username: 'admin',
        password: adminPassword,
        role: 'admin'
      });
      console.log('Created admin user');
    }

    // Check if regular user already exists
    const existingUser = await db.select().from(users).where(eq(users.username, 'user')).limit(1);
    
    if (existingUser.length === 0) {
      // Create regular user
      const userPassword = await hashPassword('user123');
      await db.insert(users).values({
        username: 'user',
        password: userPassword,
        role: 'user'
      });
      console.log('Created regular user');
    }

    // Check if sweets already exist
    const existingSweets = await db.select().from(sweets).limit(1);
    
    if (existingSweets.length === 0) {
      // Create sample sweets
      const sampleSweets = [
        {
          name: 'Kaju Katli',
          category: 'Dry Fruit Sweet',
          price: '899.00',
          quantity: 25,
          description: 'Premium cashew diamond-shaped sweet with silver foil',
          reorderPoint: 10
        },
        {
          name: 'Moong Dal Burfi',
          category: 'Burfi',
          price: '650.00',
          quantity: 0,
          description: 'Traditional moong dal sweet with cardamom and ghee',
          reorderPoint: 15
        },
        {
          name: 'Kalakand',
          category: 'Milk Sweet',
          price: '750.00',
          quantity: 15,
          description: 'Soft milk-based sweet with cardamom and pistachios',
          reorderPoint: 8
        },
        {
          name: 'Gulab Jamun',
          category: 'Syrup Sweet',
          price: '450.00',
          quantity: 20,
          description: 'Soft milk dumplings soaked in rose-cardamom syrup',
          reorderPoint: 20
        },
        {
          name: 'Rasgulla',
          category: 'Milk Sweet',
          price: '380.00',
          quantity: 18,
          description: 'Spongy cottage cheese balls in sugar syrup',
          reorderPoint: 12
        },
        {
          name: 'Besan Laddu',
          category: 'Laddu',
          price: '520.00',
          quantity: 22,
          description: 'Traditional gram flour laddu with ghee and cardamom',
          reorderPoint: 15
        },
        {
          name: 'Mysore Pak',
          category: 'Ghee Sweet',
          price: '680.00',
          quantity: 12,
          description: 'Rich ghee-based sweet from Karnataka',
          reorderPoint: 5
        },
        {
          name: 'Sandesh',
          category: 'Milk Sweet',
          price: '420.00',
          quantity: 16,
          description: 'Bengali cottage cheese sweet with cardamom',
          reorderPoint: 10
        }
      ];

      await db.insert(sweets).values(sampleSweets);
      console.log('Created sample sweets');
    }

    console.log('Database seeded successfully!');
    console.log('Login credentials:');
    console.log('Admin user: admin / admin123');
    console.log('Regular user: user / user123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();