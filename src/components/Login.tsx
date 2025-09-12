import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Building2, Lock, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (beeId: string, password: string) => boolean;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [beeId, setBeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate loading delay
    setTimeout(() => {
      const success = onLogin(beeId, password);
      if (!success) {
        setError('Invalid BEE ID or password. Please try again.');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Building2 className="h-10 w-10 text-green-400" />
            <span className="text-3xl text-white">KarbonX</span>
          </div>
          <h1 className="text-white mb-2">Carbon Credit Trading Platform</h1>
          <p className="text-gray-300">BEE Registered Companies - Bengaluru</p>
        </div>

        {/* Login Form */}
        <Card className="border-gray-700 bg-gray-800/80 backdrop-blur-sm shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-white flex items-center justify-center space-x-2">
              <Lock className="h-5 w-5" />
              <span>Company Login</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="beeId" className="text-gray-200">BEE ID</Label>
                <Input
                  id="beeId"
                  type="text"
                  placeholder="Enter your BEE ID (e.g., BEE-KA-S001)"
                  value={beeId}
                  onChange={(e) => setBeeId(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>

              {error && (
                <Alert className="border-red-500 bg-red-900/50">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-200">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Authenticating...' : 'Login to KarbonX'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            Bureau of Energy Efficiency (BEE) Certified Platform
          </p>
        </div>
      </div>
    </div>
  );
};