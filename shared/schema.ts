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

// Removed unnecessary tables: orders, orderItems, inventoryAdjustments

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

// Removed unnecessary schemas for orders, orderItems, and inventoryAdjustments
