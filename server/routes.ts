import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { hashPassword, comparePassword, generateToken, authenticateToken, requireAdmin, type AuthRequest } from "./auth";
import { insertUserSchema, insertSweetSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Hash password
      const hashedPassword = await hashPassword(userData.password);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      // Generate token
      const token = generateToken(user);
      
      res.status(201).json({
        message: "User created successfully",
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      
      // Find user
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Check password
      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Generate token
      const token = generateToken(user);
      
      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: AuthRequest, res) => {
    res.json({
      user: {
        id: req.user!.id,
        username: req.user!.username,
        role: req.user!.role
      }
    });
  });

  // Sweet routes
  app.get("/api/sweets", async (req, res) => {
    try {
      const filters = {
        category: req.query.category as string,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        inStock: req.query.inStock === 'true'
      };
      
      const sweets = await storage.getAllSweets(filters);
      res.json(sweets);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/sweets/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query required" });
      }
      
      const filters = {
        category: req.query.category as string,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        inStock: req.query.inStock === 'true'
      };
      
      const sweets = await storage.searchSweets(query, filters);
      res.json(sweets);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/sweets/:id", async (req, res) => {
    try {
      const sweet = await storage.getSweetById(req.params.id);
      if (!sweet) {
        return res.status(404).json({ message: "Sweet not found" });
      }
      res.json(sweet);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/sweets", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const sweetData = insertSweetSchema.parse(req.body);
      const sweet = await storage.insertSweet(sweetData);
      res.status(201).json(sweet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/sweets/:id", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const updates = req.body;
      const sweet = await storage.updateSweet(req.params.id, updates);
      res.json(sweet);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/sweets/:id", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
    try {
      await storage.deleteSweet(req.params.id);
      res.json({ message: "Sweet deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/sweets/:id/purchase", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const quantity = req.body.quantity || 1;
      await storage.purchaseSweet(req.params.id, quantity);
      res.json({ message: "Purchase successful" });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Sweet not found') {
          return res.status(404).json({ message: error.message });
        }
        if (error.message === 'Insufficient inventory') {
          return res.status(400).json({ message: error.message });
        }
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/sweets/:id/restock", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const { quantity } = req.body;
      if (!quantity || quantity <= 0) {
        return res.status(400).json({ message: "Valid quantity required" });
      }
      
      await storage.restockSweet(req.params.id, quantity);
      res.json({ message: "Restock successful" });
    } catch (error) {
      if (error instanceof Error && error.message === 'Sweet not found') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
