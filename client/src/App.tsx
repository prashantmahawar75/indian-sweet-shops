import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useState } from "react";

import Dashboard from "@/pages/dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import AddSweetPage from "@/pages/add-sweet-page";
import AnalyticsPage from "@/pages/analytics-page";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route path="/" component={Dashboard} />
      <Route path="/inventory" component={AdminDashboard} />
      <Route path="/add-sweet" component={AddSweetPage} />
      <Route path="/sales" component={Dashboard} />
      <Route path="/analytics" component={AnalyticsPage} />
      <Route path="/settings" component={() => (
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Settings</h1>
          <p className="text-muted-foreground">Settings page coming soon...</p>
        </div>
      )} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Mock authentication state - todo: remove mock functionality
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user] = useState({ role: "admin" }); // Mock user role

  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ThemeProvider>
            <AuthPage />
            <Toaster />
          </ThemeProvider>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <SidebarProvider style={style as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <AppSidebar />
              <div className="flex flex-col flex-1">
                <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <SidebarTrigger data-testid="button-sidebar-toggle" />
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                  </div>
                </header>
                <main className="flex-1 overflow-auto p-6">
                  <Router />
                </main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
