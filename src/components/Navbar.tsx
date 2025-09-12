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
  onShowMyListings?: () => void;
  onShowMyEarnings?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  company, 
  currentPage, 
  onNavigate, 
  onLogout, 
  onShowMyListings, 
  onShowMyEarnings 
}) => {
  if (!company) return null;

  const navItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'marketplace', label: 'Marketplace', icon: BarChart3 },
    { id: 'transactions', label: 'Transactions', icon: History },
    { id: 'wallet', label: 'Wallet', icon: CreditCard }
  ];

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short'
    });
  };

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

          {/* Profile Menu and User Avatar */}
          <div className="flex items-center space-x-2">
            {/* Profile Options Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end">
                <DropdownMenuLabel className="flex items-center space-x-2">
                  <span className="text-lg">{company.logo}</span>
                  <div>
                    <div className="text-sm">{company.name}</div>
                    <div className="text-xs text-gray-500">{company.id}</div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <div className="p-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Sector:</span>
                    <span className="text-gray-900">{company.sector}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Location:</span>
                    <span className="text-gray-900">{company.location}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Target Year:</span>
                    <span className="text-gray-900">{company.targetYear}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Last Update:</span>
                    <span className="text-gray-900">{formatTime(company.lastUpdate)}</span>
                  </div>
                </div>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={onShowMyListings}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>My Listings</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={onShowMyEarnings}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>My Earnings</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={onLogout}
                  className="flex items-center space-x-2 cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Avatar Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback style={{ backgroundColor: company.primaryColor, color: 'white' }}>
                      {company.logo}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="px-2 py-1.5">
                  <p className="text-sm">{company.name}</p>
                  <p className="text-xs text-gray-500">{company.type}</p>
                </div>
                <DropdownMenuSeparator />
                
                {/* Mobile Navigation */}
                <div className="md:hidden">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem 
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className="flex items-center space-x-2"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </DropdownMenuItem>
                    );
                  })}
                  <DropdownMenuSeparator />
                </div>

                <DropdownMenuItem onClick={onLogout} className="text-red-600 focus:text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};