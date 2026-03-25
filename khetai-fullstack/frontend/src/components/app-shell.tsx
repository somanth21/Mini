'use client';
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Home,
  Leaf,
  HandCoins,
  Building2,
  History,
  Settings,
  LogIn,
  LogOut,
  ShieldAlert,
  CloudSun,
  Lightbulb,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import LanguageSwitcher from './language-switcher';
import { ThemeToggle } from './theme-toggle';
import { useLanguage } from '@/contexts/language-context';
import { useAuth } from '@/contexts/auth-context';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;

  const menuItems = [
    { href: '/', label: t('home'), icon: Home },
    { href: '/crop-diagnosis', label: t('crop_health'), icon: Leaf },
    { href: '/mandi-prices', label: t('mandi_prices'), icon: HandCoins },
    { href: '/gov-schemes', label: t('gov_schemes'), icon: Building2 },
    { href: '/suggestions', label: 'Suggestions', icon: Lightbulb },
    { href: '/weather', label: 'Weather', icon: CloudSun },
    { href: '/history', label: t('history'), icon: History },
  ];

  return (
    <SidebarProvider defaultOpen={false}>
      <Sidebar>
        <SidebarHeader>
          <div className="p-4">
            <Logo />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link to={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <SidebarMenu>
            {isAdmin && (
              <SidebarMenuItem>
                <Link to="/admin">
                  <SidebarMenuButton isActive={pathname === '/admin'}>
                    <ShieldAlert className="h-4 w-4" />
                    <span>Admin Panel</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )}
            <SidebarMenuItem>
              {isAuthenticated ? (
                <SidebarMenuButton onClick={logout}>
                  <LogOut className="h-4 w-4" />
                  <span>{t('logout')}</span>
                </SidebarMenuButton>
              ) : (
                <Link to="/login">
                  <SidebarMenuButton isActive={pathname === '/login'}>
                    <LogIn className="h-4 w-4" />
                    <span>{t('login')}</span>
                  </SidebarMenuButton>
                </Link>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      
      <SidebarInset className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center px-4 md:px-8 max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="h-9 w-9" />
              <Link to="/" className="hover:opacity-80 transition-opacity">
                <Logo />
              </Link>
              <nav className="hidden lg:flex items-center gap-6 ml-8">
                {menuItems.slice(0, 5).map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      pathname === item.href ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="ml-auto flex items-center gap-4">
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
              {isAuthenticated ? (
                 <Button onClick={logout} variant="outline" size="sm" className="hidden md:flex gap-2">
                    <LogOut className="h-4 w-4" />
                    <span>{t('logout')}</span>
                 </Button>
              ) : (
                <Link to="/login" className="hidden md:block">
                  <Button size="sm" className="gap-2">
                    <LogIn className="h-4 w-4" />
                    <span>{t('login')}</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden">
          <div className="container py-6 md:py-10 max-w-7xl mx-auto px-4 md:px-8">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
