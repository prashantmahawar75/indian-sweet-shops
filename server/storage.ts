import { eq, and, or, like, gte, lte, desc } from 'drizzle-orm';
import { db } from './db';
import { 
  type User, 
  type InsertUser, 
  type Sweet, 
  type InsertSweet,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type InventoryAdjustment,
  type InsertInventoryAdjustment,
  users, 
  sweets, 
  orders, 
  orderItems, 
  inventoryAdjustments 
} from "@shared/schema";

export interface SweetFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Sweet operations
  getAllSweets(filters?: SweetFilters): Promise<Sweet[]>;
  getSweetById(id: string): Promise<Sweet | undefined>;
  insertSweet(sweet: InsertSweet): Promise<Sweet>;
  updateSweet(id: string, updates: Partial<Sweet>): Promise<Sweet>;
  deleteSweet(id: string): Promise<void>;
  searchSweets(query: string, filters?: SweetFilters): Promise<Sweet[]>;
  
  // Inventory operations
  purchaseSweet(sweetId: string, quantity: number): Promise<void>;
  restockSweet(sweetId: string, quantity: number): Promise<void>;
  recordInventoryAdjustment(adjustment: InsertInventoryAdjustment): Promise<void>;
  
  // Order operations
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  getUserOrders(userId: string): Promise<Order[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Sweet operations
  async getAllSweets(filters?: SweetFilters): Promise<Sweet[]> {
    let query = db.select().from(sweets);
    
    const conditions = [eq(sweets.active, true)];
    
    if (filters?.category) {
      conditions.push(eq(sweets.category, filters.category));
    }
    
    if (filters?.minPrice !== undefined) {
      conditions.push(gte(sweets.price, filters.minPrice.toString()));
    }
    
    if (filters?.maxPrice !== undefined) {
      conditions.push(lte(sweets.price, filters.maxPrice.toString()));
    }
    
    if (filters?.inStock) {
      conditions.push(gte(sweets.quantity, 1));
    }
    
    return query.where(and(...conditions)).orderBy(sweets.name);
  }

  async getSweetById(id: string): Promise<Sweet | undefined> {
    const result = await db.select().from(sweets).where(eq(sweets.id, id)).limit(1);
    return result[0];
  }

  async insertSweet(sweet: InsertSweet): Promise<Sweet> {
    const result = await db.insert(sweets).values(sweet).returning();
    return result[0];
  }

  async updateSweet(id: string, updates: Partial<Sweet>): Promise<Sweet> {
    const result = await db.update(sweets)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(sweets.id, id))
      .returning();
    return result[0];
  }

  async deleteSweet(id: string): Promise<void> {
    await db.update(sweets)
      .set({ active: false, updatedAt: new Date() })
      .where(eq(sweets.id, id));
  }

  async searchSweets(query: string, filters?: SweetFilters): Promise<Sweet[]> {
    const searchTerm = `%${query.toLowerCase()}%`;
    
    let dbQuery = db.select().from(sweets);
    
    const conditions = [
      eq(sweets.active, true),
      or(
        like(sweets.name, searchTerm),
        like(sweets.category, searchTerm),
        like(sweets.description, searchTerm)
      )
    ];
    
    if (filters?.category) {
      conditions.push(eq(sweets.category, filters.category));
    }
    
    if (filters?.minPrice !== undefined) {
      conditions.push(gte(sweets.price, filters.minPrice.toString()));
    }
    
    if (filters?.maxPrice !== undefined) {
      conditions.push(lte(sweets.price, filters.maxPrice.toString()));
    }
    
    if (filters?.inStock) {
      conditions.push(gte(sweets.quantity, 1));
    }
    
    return dbQuery.where(and(...conditions)).orderBy(sweets.name);
  }

  // Inventory operations
  async purchaseSweet(sweetId: string, quantity: number = 1): Promise<void> {
    await db.transaction(async (tx) => {
      const sweet = await tx.select().from(sweets).where(eq(sweets.id, sweetId)).limit(1);
      
      if (!sweet[0]) {
        throw new Error('Sweet not found');
      }
      
      if (sweet[0].quantity < quantity) {
        throw new Error('Insufficient inventory');
      }
      
      await tx.update(sweets)
        .set({ 
          quantity: sweet[0].quantity - quantity,
          updatedAt: new Date()
        })
        .where(eq(sweets.id, sweetId));
      
      await tx.insert(inventoryAdjustments).values({
        sweetId,
        delta: -quantity,
        reason: 'sale'
      });
    });
  }

  async restockSweet(sweetId: string, quantity: number): Promise<void> {
    await db.transaction(async (tx) => {
      const sweet = await tx.select().from(sweets).where(eq(sweets.id, sweetId)).limit(1);
      
      if (!sweet[0]) {
        throw new Error('Sweet not found');
      }
      
      await tx.update(sweets)
        .set({ 
          quantity: sweet[0].quantity + quantity,
          updatedAt: new Date()
        })
        .where(eq(sweets.id, sweetId));
      
      await tx.insert(inventoryAdjustments).values({
        sweetId,
        delta: quantity,
        reason: 'restock'
      });
    });
  }

  async recordInventoryAdjustment(adjustment: InsertInventoryAdjustment): Promise<void> {
    await db.insert(inventoryAdjustments).values(adjustment);
  }

  // Order operations
  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    return await db.transaction(async (tx) => {
      const newOrder = await tx.insert(orders).values(order).returning();
      
      for (const item of items) {
        await tx.insert(orderItems).values({
          ...item,
          orderId: newOrder[0].id
        });
      }
      
      return newOrder[0];
    });
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return db.select().from(orders)
      .where(eq(orders.customerId, userId))
      .orderBy(desc(orders.createdAt));
  }
}

// Fallback in-memory storage for development
class MemoryStorage implements IStorage {
  private users: User[] = [
    {
      id: '1',
      username: 'admin',
      password: '$2b$10$7/UTJQfpv.fYBLb7CiyZGep/IaxBFYjBw/Fx9/svsAomD5kIBWxXC', // admin123
      role: 'admin'
    },
    {
      id: '2',
      username: 'user',
      password: '$2b$10$kvyN3W7gqjgd.g.gVk0s1esWoH4eg3s2I2wJYRudcLX015ROaIKJK', // user123
      role: 'user'
    }
  ];

  private sweets: Sweet[] = [
    {
      id: '1',
      name: 'Kaju Katli',
      category: 'Dry Fruit Sweet',
      price: '899.00',
      quantity: 25,
      description: 'Premium cashew diamond-shaped sweet with silver foil',
      image: null,
      active: true,
      reorderPoint: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Moong Dal Burfi',
      category: 'Burfi',
      price: '650.00',
      quantity: 0,
      description: 'Traditional moong dal sweet with cardamom and ghee',
      image: null,
      active: true,
      reorderPoint: 15,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      name: 'Kalakand',
      category: 'Milk Sweet',
      price: '750.00',
      quantity: 15,
      description: 'Soft milk-based sweet with cardamom and pistachios',
      image: null,
      active: true,
      reorderPoint: 8,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '4',
      name: 'Gulab Jamun',
      category: 'Syrup Sweet',
      price: '450.00',
      quantity: 3,
      description: 'Soft milk dumplings soaked in rose-cardamom syrup',
      image: null,
      active: true,
      reorderPoint: 20,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '5',
      name: 'Rasgulla',
      category: 'Milk Sweet',
      price: '380.00',
      quantity: 18,
      description: 'Spongy cottage cheese balls in sugar syrup',
      image: null,
      active: true,
      reorderPoint: 12,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '6',
      name: 'Besan Laddu',
      category: 'Laddu',
      price: '520.00',
      quantity: 22,
      description: 'Traditional gram flour laddu with ghee and cardamom',
      image: null,
      active: true,
      reorderPoint: 15,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '7',
      name: 'Mysore Pak',
      category: 'Ghee Sweet',
      price: '680.00',
      quantity: 12,
      description: 'Rich ghee-based sweet from Karnataka',
      image: null,
      active: true,
      reorderPoint: 8,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '8',
      name: 'Sandesh',
      category: 'Milk Sweet',
      price: '420.00',
      quantity: 16,
      description: 'Bengali cottage cheese sweet with cardamom',
      image: null,
      active: true,
      reorderPoint: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  private orders: Order[] = [];
  private orderItems: OrderItem[] = [];
  private inventoryAdjustments: InventoryAdjustment[] = [];

  async getUser(id: string): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      id: String(this.users.length + 1),
      role: 'user',
      ...user
    };
    this.users.push(newUser);
    return newUser;
  }

  async getAllSweets(filters?: SweetFilters): Promise<Sweet[]> {
    let result = this.sweets.filter(s => s.active);
    
    if (filters?.category) {
      result = result.filter(s => s.category === filters.category);
    }
    if (filters?.minPrice !== undefined) {
      result = result.filter(s => parseFloat(s.price) >= filters.minPrice!);
    }
    if (filters?.maxPrice !== undefined) {
      result = result.filter(s => parseFloat(s.price) <= filters.maxPrice!);
    }
    if (filters?.inStock) {
      result = result.filter(s => s.quantity > 0);
    }
    
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }

  async getSweetById(id: string): Promise<Sweet | undefined> {
    return this.sweets.find(s => s.id === id && s.active);
  }

  async insertSweet(sweet: InsertSweet): Promise<Sweet> {
    const newSweet: Sweet = {
      id: String(this.sweets.length + 1),
      name: sweet.name,
      category: sweet.category,
      price: sweet.price,
      quantity: sweet.quantity || 0,
      description: sweet.description || null,
      image: sweet.image || null,
      active: sweet.active !== undefined ? sweet.active : true,
      reorderPoint: sweet.reorderPoint || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.sweets.push(newSweet);
    return newSweet;
  }

  async updateSweet(id: string, updates: Partial<Sweet>): Promise<Sweet> {
    const index = this.sweets.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Sweet not found');
    
    this.sweets[index] = { ...this.sweets[index], ...updates, updatedAt: new Date() };
    return this.sweets[index];
  }

  async deleteSweet(id: string): Promise<void> {
    const index = this.sweets.findIndex(s => s.id === id);
    if (index !== -1) {
      this.sweets[index].active = false;
      this.sweets[index].updatedAt = new Date();
    }
  }

  async searchSweets(query: string, filters?: SweetFilters): Promise<Sweet[]> {
    const searchTerm = query.toLowerCase();
    let result = this.sweets.filter(s => 
      s.active && (
        s.name.toLowerCase().includes(searchTerm) ||
        s.category.toLowerCase().includes(searchTerm) ||
        (s.description && s.description.toLowerCase().includes(searchTerm))
      )
    );
    
    if (filters?.category) {
      result = result.filter(s => s.category === filters.category);
    }
    if (filters?.minPrice !== undefined) {
      result = result.filter(s => parseFloat(s.price) >= filters.minPrice!);
    }
    if (filters?.maxPrice !== undefined) {
      result = result.filter(s => parseFloat(s.price) <= filters.maxPrice!);
    }
    if (filters?.inStock) {
      result = result.filter(s => s.quantity > 0);
    }
    
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }

  async purchaseSweet(sweetId: string, quantity: number = 1): Promise<void> {
    const sweet = this.sweets.find(s => s.id === sweetId);
    if (!sweet) throw new Error('Sweet not found');
    if (sweet.quantity < quantity) throw new Error('Insufficient inventory');
    
    sweet.quantity -= quantity;
    sweet.updatedAt = new Date();
  }

  async restockSweet(sweetId: string, quantity: number): Promise<void> {
    const sweet = this.sweets.find(s => s.id === sweetId);
    if (!sweet) throw new Error('Sweet not found');
    
    sweet.quantity += quantity;
    sweet.updatedAt = new Date();
  }

  async recordInventoryAdjustment(adjustment: InsertInventoryAdjustment): Promise<void> {
    // In-memory implementation - just log it
    console.log('Inventory adjustment:', adjustment);
  }

  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const newOrder: Order = {
      id: String(this.orders.length + 1),
      status: order.status || 'pending',
      customerId: order.customerId || null,
      total: order.total,
      customerName: order.customerName || null,
      customerEmail: order.customerEmail || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.orders.push(newOrder);
    return newOrder;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return this.orders.filter(o => o.customerId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }
}

// Try to use database storage, fallback to memory storage if DB connection fails
let storage: IStorage;
try {
  storage = new DatabaseStorage();
  // Test the connection by attempting a simple query
  storage.getAllSweets().catch(() => {
    console.log('Database connection failed, using in-memory storage');
    storage = new MemoryStorage();
  });
} catch (error) {
  console.log('Database initialization failed, using in-memory storage');
  storage = new MemoryStorage();
}

export { storage };
