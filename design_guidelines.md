# Sweet Shop Management System Design Guidelines

## Design Approach
**Reference-Based Approach** - Drawing inspiration from modern e-commerce platforms like Shopify admin and Etsy marketplace for their blend of product management functionality with visual appeal.

## Core Design Elements

### A. Color Palette
**Primary Brand Colors:**
- Light mode: 340 65% 55% (warm rose-pink for sweetness)
- Dark mode: 340 45% 40% (deeper rose for contrast)

**Secondary/Accent Colors:**
- Success: 142 70% 45% (for purchase confirmations)
- Warning: 38 85% 55% (for low stock alerts)
- Neutral grays: 220 10% 95% (light) / 220 15% 15% (dark)

### B. Typography
**Font Stack:** Inter via Google Fonts CDN
- Headings: 600-700 weight, larger scales for hierarchy
- Body text: 400 weight, 16px base size
- UI elements: 500 weight for buttons and labels

### C. Layout System
**Spacing Units:** Consistent use of Tailwind units 2, 4, 6, 8, 12
- Component padding: p-4, p-6
- Section margins: mb-8, mt-12
- Grid gaps: gap-4, gap-6

### D. Component Library

**Navigation:**
- Top navigation bar with role-based menu items
- Sidebar for admin panel with collapsible sections
- Breadcrumb navigation for deep pages

**Product Cards:**
- Grid layout for sweet inventory display
- Card shadow on hover with subtle lift animation
- Price prominence with stock indicators
- Category badges with color coding

**Forms & Inputs:**
- Rounded corners (rounded-lg)
- Focus states with brand color outline
- Form validation with inline error messages
- Search bars with prominent placement

**Data Displays:**
- Clean tables for admin inventory management
- Status indicators with color coding (in-stock/low/out)
- Modal overlays for detailed views and confirmations

**Admin Panel:**
- Dashboard cards showing key metrics
- Action buttons grouped logically
- Bulk operations with confirmation dialogs

### E. User Experience Patterns

**Authentication Flow:**
- Clean login/register forms with minimal fields
- Role selection during registration
- Dashboard redirect based on user type

**Shopping Experience:**
- Prominent search and category filters
- One-click purchase with quantity selection
- Real-time stock updates and validation
- Purchase confirmation with order details

**Admin Operations:**
- Intuitive CRUD operations for sweet management
- Bulk actions for inventory updates
- Clear success/error feedback for all operations
- Confirmation dialogs for destructive actions

## Visual Hierarchy
- Large, clear headings for section identification
- Visual separation between user and admin interfaces
- Consistent button styling with primary/secondary variants
- Strategic use of whitespace for content breathing room

## Responsive Considerations
- Mobile-first approach with touch-friendly interactions
- Collapsible navigation for smaller screens
- Stacked layouts on mobile, grid layouts on desktop
- Accessible font sizes and touch targets

This design system balances the functional requirements of inventory management with the visual appeal expected from a sweet shop, creating an intuitive experience for both customers and administrators.