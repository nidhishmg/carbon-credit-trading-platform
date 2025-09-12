import React from 'react';
import { Button } from './ui/button';
import { Leaf, TrendingUp, Shield, Globe } from 'lucide-react';

interface LandingProps {
  onNavigate: (page: string) => void;
}

export const Landing: React.FC<LandingProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="border-b border-green-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-xl text-green-800">CarbonX</span>
            </div>
            <div className="space-x-4">
              <Button variant="outline" onClick={() => onNavigate('login')} className="border-green-600 text-green-600 hover:bg-green-50">
                Login
              </Button>
              <Button onClick={() => onNavigate('signup')} className="bg-green-600 hover:bg-green-700">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-20 text-center">
          <h1 className="text-5xl text-gray-900 mb-6">
            Trade Carbon Credits,
            <span className="block text-green-600">Build a Greener Future</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join the world's most trusted carbon credit marketplace. Buy, sell, and trade verified carbon credits 
            to offset your environmental impact and contribute to global climate solutions.
          </p>
          <div className="space-x-4">
            <Button size="lg" onClick={() => onNavigate('signup')} className="bg-green-600 hover:bg-green-700 px-8 py-3">
              Get Started Today
            </Button>
            <Button size="lg" variant="outline" onClick={() => onNavigate('login')} className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3">
              Explore Platform
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-green-100">
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-green-800 mb-2">Real-Time Trading</h3>
              <p className="text-gray-600">Access live market prices and execute trades instantly with our advanced trading platform.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-blue-100">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-blue-800 mb-2">Verified Credits</h3>
              <p className="text-gray-600">All credits are verified and certified by leading environmental standards organizations.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-green-100">
              <Globe className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-green-800 mb-2">Global Impact</h3>
              <p className="text-gray-600">Support climate projects worldwide and track your positive environmental impact.</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-16 bg-white rounded-2xl shadow-sm border border-gray-100 mb-16">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl text-green-600 mb-2">2.5M+</div>
              <div className="text-gray-600">Credits Traded</div>
            </div>
            <div>
              <div className="text-3xl text-blue-600 mb-2">$25.50</div>
              <div className="text-gray-600">Current Price/Credit</div>
            </div>
            <div>
              <div className="text-3xl text-green-600 mb-2">10K+</div>
              <div className="text-gray-600">Active Traders</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-green-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 CarbonX. Building a sustainable future through carbon credit trading.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};