import { Home, Package, ShoppingCart, Plus, BarChart3, Settings, Candy } from "lucide-react"
import { Link, useLocation } from "wouter"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Mock user data - todo: remove mock functionality
const mockUser = {
  name: "Admin User",
  email: "admin@sweetshop.com",
  role: "Admin",
  avatar: null
}

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Sweet Inventory",
    url: "/inventory",
    icon: Package,
  },
  {
    title: "Add Sweet",
    url: "/add-sweet",
    icon: Plus,
  },
  {
    title: "Sales",
    url: "/sales",
    icon: ShoppingCart,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const [location] = useLocation()

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Candy className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Sweet Shop</h2>
            <p className="text-sm text-muted-foreground">Management System</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(' ', '-')}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={mockUser.avatar || undefined} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {mockUser.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{mockUser.name}</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {mockUser.role}
              </Badge>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}