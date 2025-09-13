import React from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from './ui/dropdown-menu';
import { 
  Building2, 
  User, 
  BarChart3, 
  CreditCard, 
  History, 
  LogOut, 
  MoreVertical,
  Settings,
  FileText,
  Award,
  Clock,
  ShoppingBag,
  TrendingUp
} from 'lucide-react';
import type { Company } from '../App';

interface NavbarProps {
  company: Company | null;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  company, 
  currentPage, 
  onNavigate, 
  onLogout
}) => {
  if (!company) return null;

  const navItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'marketplace', label: 'Marketplace', icon: BarChart3 },
    { id: 'listings', label: 'My Listings', icon: ShoppingBag },
    { id: 'earnings', label: 'My Earnings', icon: TrendingUp },
    { id: 'transactions', label: 'Transactions', icon: History },
    { id: 'wallet', label: 'Wallet', icon: CreditCard }
  ];

  return (
    <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Company */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8" style={{ color: company.primaryColor }} />
              <span className="text-xl" style={{ color: company.primaryColor }}>KarbonX</span>
            </div>
            
            {/* Logout Button after logo */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
            
            <div className="hidden md:flex items-center space-x-2 pl-4 border-l border-gray-300">
              <span className="text-2xl">{company.logo}</span>
              <div>
                <div className="text-sm">{company.name}</div>
                <div className="text-xs text-gray-500">{company.id}</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center space-x-2 ${
                    isActive 
                      ? `text-white` 
                      : `text-gray-600 hover:text-gray-900`
                  }`}
                  style={isActive ? { backgroundColor: company.primaryColor } : {}}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </nav>

          {/* User Avatar */}
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarFallback style={{ backgroundColor: company.primaryColor, color: 'white' }}>
                {company.logo}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
};