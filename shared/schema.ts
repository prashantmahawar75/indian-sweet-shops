import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"), // "user" or "admin"
});

export const sweets = pgTable("sweets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  category: text("category").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull().default(0),
  description: text("description"),
  image: text("image"),
  active: boolean("active").notNull().default(true),
  reorderPoint: integer("reorder_point").default(5),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id"), // nullable for guest orders
  status: text("status").notNull().default("pending"), // "pending", "paid", "fulfilled", "refunded"
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  customerName: text("customer_name"),
  customerEmail: text("customer_email"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull(),
  sweetId: varchar("sweet_id").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
});

export const inventoryAdjustments = pgTable("inventory_adjustments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sweetId: varchar("sweet_id").notNull(),
  delta: integer("delta").notNull(), // positive for restock, negative for sale/loss
  reason: text("reason").notNull(), // "sale", "restock", "loss", "correction"
  createdAt: timestamp("created_at").defaultNow(),
});

// User schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Sweet schemas
export const insertSweetSchema = createInsertSchema(sweets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSweet = z.infer<typeof insertSweetSchema>;
export type Sweet = typeof sweets.$inferSelect;

// Order schemas
export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Order Item schemas
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

// Inventory Adjustment schemas
export const insertInventoryAdjustmentSchema = createInsertSchema(inventoryAdjustments).omit({
  id: true,
  createdAt: true,
});

export type InsertInventoryAdjustment = z.infer<typeof insertInventoryAdjustmentSchema>;
export type InventoryAdjustment = typeof inventoryAdjustments.$inferSelect;
