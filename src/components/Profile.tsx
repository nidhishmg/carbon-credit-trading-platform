import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Leaf, 
  Factory, 
  Zap, 
  Recycle,
  Target,
  Calendar,
  Users,
  MapPin,
  Award,
  Clock,
  Eye,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Activity,
  Star,
  ArrowUp,
  ArrowDown,
  ShoppingCart,
  Coins
} from 'lucide-react';
import type { Company, Transaction } from '../App';
import { useRealTime, formatRealTime, useLiveStatus } from '../utils/timeUtils';

interface ProfileProps {
  company: Company | null;
  transactions: Transaction[];
  onNavigate: (page: string) => void;
  onLogout: () => void;
  isConnected?: boolean;
  activeUsers?: number;
}

export const Profile: React.FC<ProfileProps> = ({ 
  company, 
  transactions, 
  onNavigate, 
  onLogout, 
  isConnected = false, 
  activeUsers = 0
}) => {
  const currentTime = useRealTime();
  const isLive = useLiveStatus();
  const [detailsOpen, setDetailsOpen] = useState(false);

  if (!company) return null;

  const reductionPercentage = ((company.emissions.baseline - company.emissions.current) / company.emissions.baseline) * 100;
  const targetProgress = ((company.emissions.baseline - company.emissions.current) / (company.emissions.baseline - company.emissions.target)) * 100;
  const yearlyReduction = ((company.emissions.previousYear - company.emissions.current) / company.emissions.previousYear) * 100;  const getCurrentHourEmission = () => {
    const currentHour = currentTime.getHours();
    const formattedHour = `${currentHour.toString().padStart(2, '0')}:00`;
    const hourData = company.hourlyEmissions.find(h => h.hour === formattedHour);
    return hourData || company.hourlyEmissions[currentHour];
  };

  const currentHourData = getCurrentHourEmission();
  const peakHour = company.hourlyEmissions.reduce((max, hour) => 
    hour.emission > max.emission ? hour : max
  );

  return (
    <div className="min-h-screen">
      <Navbar 
        company={company} 
        currentPage="profile" 
        onNavigate={onNavigate} 
        onLogout={onLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Company Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{company.logo}</div>
              <div>
                <h1 className="text-gray-900">{company.name}</h1>
                <p className="text-gray-600">{company.type} • {company.sector}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-4 mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span className="text-xs text-gray-600">
                    {isConnected ? `Live • ${activeUsers} connected` : 'Offline'}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-500">Live Update</div>
              <div className="text-lg text-gray-900">{currentTime.toLocaleTimeString('en-IN')}</div>
            </div>
          </div>
          
          {/* BEE Information Grid */}
          <div className="grid md:grid-cols-6 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">{company.id}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{company.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Updated: {formatRealTime(currentTime)}
                {isLive && <span className="ml-2 inline-flex items-center">
                  <span className="animate-pulse w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                  <span className="text-green-600 text-xs">LIVE</span>
                </span>}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Target: {company.targetYear}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-gray-600">BEE Rating: {company.beeData.beeRating}/5</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-600">{company.beeData.complianceStatus}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Frame */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Button
                onClick={() => onNavigate('marketplace')}
                className="h-20 bg-green-600 hover:bg-green-700 transition-colors flex flex-col items-center justify-center space-y-2"
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="text-sm font-medium">Buy Credits</span>
              </Button>
              
              <Button
                onClick={() => onNavigate('marketplace')}
                className="h-20 bg-blue-600 hover:bg-blue-700 transition-colors flex flex-col items-center justify-center space-y-2"
              >
                <TrendingUp className="h-6 w-6" />
                <span className="text-sm font-medium">Sell Credits</span>
              </Button>
              
              <Button
                onClick={() => onNavigate('marketplace')}
                variant="outline"
                className="h-20 border-purple-600 text-purple-600 hover:bg-purple-50 transition-colors flex flex-col items-center justify-center space-y-2"
              >
                <Coins className="h-6 w-6" />
                <span className="text-sm font-medium">Earn Rewards</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Live Dashboard */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900">Live Dashboard</h2>
            <div className="flex items-center space-x-2 text-green-600">
              <Activity className="h-4 w-4 animate-pulse" />
              <span className="text-sm">Real-time Monitoring</span>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-4 gap-6 mb-6">
            <Card className="border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-blue-600 flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  Current SEC
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-blue-800">{company.beeData.currentSEC}</div>
                <p className="text-xs text-gray-600">GJ/tonne</p>
                <div className="mt-2">
                  <Progress value={(company.beeData.currentSEC / company.beeData.targetSEC) * 100} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-green-600 flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Target SEC (Govt.)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-green-800">{company.beeData.governmentTarget}</div>
                <p className="text-xs text-gray-600">BEE Mandated</p>
                <div className="mt-2">
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {company.beeData.complianceStatus}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-red-600 flex items-center">
                  <Factory className="h-4 w-4 mr-2" />
                  CO₂ Emissions (Till Date)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-red-800">{(company.emissions.tillDate2024 / 1000000).toFixed(1)}M</div>
                <p className="text-xs text-gray-600">tonnes CO₂ in 2024</p>
                <div className="mt-2 flex items-center text-green-600">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  <span className="text-xs">{yearlyReduction.toFixed(1)}% vs 2023</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-purple-600 flex items-center">
                  <Activity className="h-4 w-4 mr-2" />
                  Current Hour Emission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-purple-800">{currentHourData.emission.toLocaleString()}</div>
                <p className="text-xs text-gray-600">tonnes/hour</p>
                <div className="mt-2">
                  <span className="text-xs text-gray-500">Efficiency: {currentHourData.efficiency}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Live Emissions Chart with Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-gray-900">
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" style={{ color: company.primaryColor }} />
                  Live Emissions - 2024 vs 2023
                </div>
                <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Detailed
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Detailed Carbon Emissions Analysis</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      {/* Hourly Emissions Chart */}
                      <div>
                        <h3 className="text-lg mb-4">Hourly Emissions Pattern</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <AreaChart data={company.hourlyEmissions}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="hour" />
                            <YAxis />
                            <Tooltip 
                              formatter={(value, name) => [
                                name === 'emission' ? `${(value as number).toLocaleString()} tonnes` : `${value}%`,
                                name === 'emission' ? 'Emissions' : 'Efficiency'
                              ]}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="emission" 
                              stroke={company.primaryColor}
                              fill={company.primaryColor}
                              fillOpacity={0.3}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="efficiency" 
                              stroke={company.secondaryColor}
                              strokeWidth={2}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                          <div className="flex items-center text-yellow-700">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            <span className="text-sm">Peak Hour Analysis</span>
                          </div>
                          <p className="text-sm text-yellow-600 mt-1">
                            Highest emissions at {peakHour.hour} with {peakHour.emission.toLocaleString()} tonnes/hour 
                            (Efficiency: {peakHour.efficiency}%)
                          </p>
                        </div>
                      </div>

                      {/* BEE Ratings History */}
                      <div>
                        <h3 className="text-lg mb-4">BEE Star Rating History</h3>
                        <div className="flex items-center space-x-4">
                          {company.beeData.previousRatings.map((rating, index) => (
                            <div key={index} className="text-center">
                              <div className="text-2xl text-yellow-500">
                                {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
                              </div>
                              <div className="text-xs text-gray-600">{2021 + index}</div>
                            </div>
                          ))}
                          <div className="text-center border-l-2 border-dashed border-gray-300 pl-4">
                            <div className="text-2xl text-yellow-500">
                              {'★'.repeat(company.beeData.beeRating)}{'☆'.repeat(5 - company.beeData.beeRating)}
                            </div>
                            <div className="text-xs text-gray-600">2024</div>
                          </div>
                        </div>
                      </div>

                      {/* Credits Analysis */}
                      <div>
                        <h3 className="text-lg mb-4">Carbon Credits Progress</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-green-50 rounded-lg">
                            <div className="text-lg text-green-800">{company.credits.gainedThisYear.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">Credits Gained (2024)</div>
                            <div className="flex items-center mt-2 text-green-600">
                              <ArrowUp className="h-3 w-3 mr-1" />
                              <span className="text-xs">
                                +{((company.credits.gainedThisYear - company.credits.previousYearGained) / company.credits.previousYearGained * 100).toFixed(1)}% vs 2023
                              </span>
                            </div>
                          </div>
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <div className="text-lg text-blue-800">{company.emissions.yearlyReduction.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">CO₂ Reduced (tonnes)</div>
                            <div className="text-xs text-gray-500 mt-2">From previous year</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={company.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${(value as number / 1000).toFixed(0)}K tonnes`,
                      name === 'emissions' ? '2024 Emissions' : '2023 Emissions'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="emissions" 
                    stroke={company.primaryColor}
                    strokeWidth={3}
                    dot={{ fill: company.primaryColor }}
                    name="emissions"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="previousYear" 
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#94a3b8' }}
                    name="previousYear"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Yearly Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <TrendingDown className="h-5 w-5 mr-2" style={{ color: company.secondaryColor }} />
                Performance Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Yearly Stats */}
                <div className="grid grid-cols-2 gap-4">
                  {company.yearlyComparison.map((year) => (
                    <div key={year.year} className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-lg text-gray-900">{year.year}</div>
                      <div className="text-sm text-gray-600">
                        {(year.emissions / 1000000).toFixed(1)}M tonnes CO₂
                      </div>
                      <div className="text-sm text-green-600">
                        {year.credits.toLocaleString()} credits
                      </div>
                      <div className="text-xs text-blue-600">
                        {year.reduction}% reduction
                      </div>
                    </div>
                  ))}
                </div>

                {/* BEE Rating Display */}
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Current BEE Rating</span>
                    <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                      {company.beeData.beeRating}/5 Stars
                    </Badge>
                  </div>
                  <div className="text-2xl text-yellow-500 mb-2">
                    {'★'.repeat(company.beeData.beeRating)}{'☆'.repeat(5 - company.beeData.beeRating)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Certified: {new Date(company.beeData.certificationDate).toLocaleDateString()}
                  </div>
                </div>

                {/* Reduction Summary */}
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">Annual Emission Reduction</div>
                  <div className="text-2xl text-green-800">{yearlyReduction.toFixed(1)}%</div>
                  <div className="text-xs text-gray-500">
                    {company.emissions.yearlyReduction.toLocaleString()} tonnes CO₂ reduced from 2023
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Performance Metrics */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Sustainability Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 flex items-center">
                    <Zap className="h-4 w-4 mr-2" />
                    Energy Efficiency
                  </span>
                  <span style={{ color: company.primaryColor }}>{company.metrics.energyEfficiency}%</span>
                </div>
                <Progress value={company.metrics.energyEfficiency} />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 flex items-center">
                    <Leaf className="h-4 w-4 mr-2" />
                    Renewable Energy
                  </span>
                  <span style={{ color: company.primaryColor }}>{company.metrics.renewableEnergy}%</span>
                </div>
                <Progress value={company.metrics.renewableEnergy} />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 flex items-center">
                    <Recycle className="h-4 w-4 mr-2" />
                    Waste Reduction
                  </span>
                  <span style={{ color: company.primaryColor }}>{company.metrics.wasteReduction}%</span>
                </div>
                <Progress value={company.metrics.wasteReduction} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Credits & Impact Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl text-green-800">{company.credits.gainedThisYear.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Credits Gained (2024)</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl text-blue-800">{company.credits.previousYearGained.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Credits Gained (2023)</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Carbon Intensity</span>
                  <span className="text-gray-900">{company.metrics.carbonIntensity} tCO₂/MWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">BEE Compliance</span>
                  <span className="text-green-600">{company.beeData.complianceStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Emission Reduction</span>
                  <span className="text-green-600 flex items-center">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    {yearlyReduction.toFixed(1)}% from 2023
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Credits Growth</span>
                  <span className="text-blue-600 flex items-center">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    {((company.credits.gainedThisYear - company.credits.previousYearGained) / company.credits.previousYearGained * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SDG Goals Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <Target className="h-5 w-5 mr-2" />
                SDG Goals Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {company.sdgGoals.map((sdg) => (
                <div key={sdg.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs w-8 h-6 flex items-center justify-center">
                        {sdg.id}
                      </Badge>
                      <span className="text-sm text-gray-700">{sdg.name}</span>
                    </div>
                    <span className="text-sm" style={{ color: company.primaryColor }}>
                      {sdg.progress}%
                    </span>
                  </div>
                  <Progress 
                    value={sdg.progress} 
                    className="h-2" 
                    style={{ 
                      '--progress-background': company.primaryColor + '20',
                      '--progress-foreground': company.primaryColor 
                    } as React.CSSProperties}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* AI Sustainability Improvement Suggestions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900">AI Sustainability Improvement Suggestions</h2>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <span className="text-sm text-orange-600">Action Required to Meet 2025 Targets</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-1 gap-6">
            {company.sustainabilitySuggestions.map((suggestion, index) => (
              <Card key={index} className="border-l-4" style={{ borderLeftColor: company.primaryColor }}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-gray-900">{suggestion.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={suggestion.priority === 'High' ? 'default' : 'secondary'}
                        className={suggestion.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}
                      >
                        {suggestion.priority} Priority
                      </Badge>
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        {suggestion.timeline}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{suggestion.description}</p>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-600">Expected Impact</div>
                      <div className="text-green-800">{suggestion.impact}</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-600">Implementation Timeline</div>
                      <div className="text-blue-800">{suggestion.timeline}</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="text-sm text-gray-600">Priority Level</div>
                      <div className="text-purple-800">{suggestion.priority}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Aligned SDG Goals:</span>
                    <div className="flex space-x-1">
                      {suggestion.sdgAlignment.map((sdgId) => (
                        <Badge 
                          key={sdgId} 
                          variant="outline" 
                          className="text-xs w-8 h-6 flex items-center justify-center"
                          style={{ borderColor: company.primaryColor, color: company.primaryColor }}
                        >
                          {sdgId}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Risk Assessment */}
          <Card className="mt-6 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Risk Assessment: Meeting Government Targets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-gray-900 mb-3">Current Status vs Targets</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current SEC:</span>
                      <span className="text-gray-900">{company.beeData.currentSEC} GJ/tonne</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Government Target:</span>
                      <span className="text-red-600">{company.beeData.governmentTarget} GJ/tonne</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gap to Target:</span>
                      <span className={`${company.beeData.currentSEC > company.beeData.governmentTarget ? 'text-red-600' : 'text-green-600'}`}>
                        {(company.beeData.currentSEC - company.beeData.governmentTarget).toFixed(2)} GJ/tonne
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time Remaining:</span>
                      <span className="text-orange-600">{company.targetYear - 2024} years</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-gray-900 mb-3">Recommended Action Plan</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-orange-700">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>Implement high-priority suggestions immediately</span>
                    </div>
                    <div className="flex items-center text-orange-700">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>Focus on renewable energy expansion</span>
                    </div>
                    <div className="flex items-center text-orange-700">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>Regular monitoring and BEE compliance audits</span>
                    </div>
                    <div className="flex items-center text-orange-700">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>Increase carbon credit generation by 25%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};