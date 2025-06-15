
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_CRITERIA, SCORING_SCALE } from "@/types/supplier";
import { Target, BarChart3, Clock, Leaf, Shield, Star, TrendingUp, Layers, Award } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

export const CriteriaWeights = () => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'quality': return <Target className="w-5 h-5 text-blue-600" />;
      case 'cost': return <BarChart3 className="w-5 h-5 text-green-600" />;
      case 'leadTime': return <Clock className="w-5 h-5 text-orange-600" />;
      case 'sustainability': return <Leaf className="w-5 h-5 text-emerald-600" />;
      case 'reliability': return <Shield className="w-5 h-5 text-purple-600" />;
      default: return <Target className="w-5 h-5 text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'quality': return '#3B82F6';
      case 'cost': return '#10B981';
      case 'leadTime': return '#F59E0B';
      case 'sustainability': return '#059669';
      case 'reliability': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  // Prepare data for charts
  const criteriaChartData = DEFAULT_CRITERIA.map(criteria => ({
    name: criteria.name.substring(0, 15) + (criteria.name.length > 15 ? '...' : ''),
    fullName: criteria.name,
    weight: criteria.weight,
    category: criteria.category,
    fill: getCategoryColor(criteria.category)
  }));

  const categoryWeights = DEFAULT_CRITERIA.reduce((acc, criteria) => {
    acc[criteria.category] = (acc[criteria.category] || 0) + criteria.weight;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryWeights).map(([category, weight]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    weight,
    fill: getCategoryColor(category)
  }));

  // Fixed scoring data with proper structure
  const scoringData = Object.entries(SCORING_SCALE).map(([key, scale]) => ({
    label: scale.label,
    min: scale.min,
    max: scale.max,
    score: scale.max,
    range: scale.max - scale.min,
    color: key === 'EXCELLENT' ? '#10B981' : 
           key === 'GOOD' ? '#3B82F6' :
           key === 'SATISFACTORY' ? '#F59E0B' :
           key === 'NEEDS_IMPROVEMENT' ? '#EF4444' : '#8B5CF6'
  }));

  const radarData = DEFAULT_CRITERIA.map(criteria => ({
    criteria: criteria.name.split(' ').slice(0, 2).join(' '),
    weight: criteria.weight,
    fullName: criteria.name
  }));

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="glass-card p-3 rounded-xl">
            <Layers className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold gradient-text">Evaluation Framework</h2>
            <p className="text-gray-600">Comprehensive criteria weights and performance scales</p>
          </div>
        </div>

        {/* Criteria Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="frosted-glass border-0 hover-glow smooth-transition">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-blue-900 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Weight Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={criteriaChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    dataKey="weight"
                    label={({ name, weight }) => `${weight}%`}
                    labelLine={false}
                  >
                    {criteriaChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`${value}%`, props.payload.fullName]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="frosted-glass border-0 hover-glow smooth-transition">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-green-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Category Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="category" fontSize={10} />
                  <YAxis fontSize={10} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Weight']} />
                  <Bar dataKey="weight" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="frosted-glass border-0 hover-glow smooth-transition">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-purple-900 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Impact Radar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="criteria" fontSize={10} />
                  <PolarRadiusAxis angle={90} domain={[0, 25]} fontSize={8} />
                  <Radar name="Weight" dataKey="weight" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} strokeWidth={2} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Detailed Criteria - Card Grid Layout */}
      <Card className="frosted-glass border-0">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Detailed Evaluation Criteria
          </CardTitle>
          <p className="text-gray-600">Interactive breakdown of all evaluation parameters</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DEFAULT_CRITERIA.map((criteria) => (
              <div key={criteria.id} className="glass-card p-6 rounded-xl hover-glow smooth-transition">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="flex-shrink-0 p-3 rounded-full glass-card">
                    {getIcon(criteria.category)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-gray-900 text-lg leading-tight">{criteria.name}</h4>
                      <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm px-3 py-1 ml-2">
                        {criteria.weight}%
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{criteria.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span className="font-medium">Impact Level</span>
                        <span>{criteria.weight}% of total score</span>
                      </div>
                      <div className="relative">
                        <Progress value={criteria.weight * 4} className="h-2" />
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {criteria.subCriteria && (
                  <div className="space-y-2 pt-4 border-t border-gray-100">
                    <h5 className="font-semibold text-gray-700 text-xs uppercase tracking-wider flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      Sub-Criteria
                    </h5>
                    <div className="grid gap-2">
                      {criteria.subCriteria.map((sub) => (
                        <div key={sub.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100">
                          <div className="flex-1">
                            <span className="font-medium text-gray-800 text-sm">{sub.name}</span>
                            <p className="text-xs text-gray-600 mt-1">{sub.description}</p>
                          </div>
                          <Badge variant="outline" className="text-xs ml-3 glass-card border-0">
                            {sub.weight}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Performance Scoring Scale */}
      <Card className="frosted-glass border-0">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-purple-900 flex items-center gap-2">
            <Star className="w-6 h-6" />
            Performance Scoring Framework
          </CardTitle>
          <p className="text-gray-600">Visual representation of scoring thresholds and performance benchmarks</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Enhanced Score Range Visualization */}
            <div className="space-y-6">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Score Distribution Analysis
              </h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={scoringData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="label" fontSize={10} angle={-45} textAnchor="end" height={80} />
                  <YAxis fontSize={10} />
                  <Tooltip 
                    formatter={(value, name) => [`${value} points`, 'Max Score']} 
                    labelFormatter={(label) => `Performance Level: ${label}`}
                  />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]} fill="url(#colorGradient)" />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1E40AF" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Enhanced Performance Level Cards */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                Performance Benchmarks
              </h4>
              <div className="space-y-3">
                {Object.entries(SCORING_SCALE).map(([key, scale]) => (
                  <div key={key} className="glass-card p-4 rounded-xl hover-glow smooth-transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ 
                            background: `linear-gradient(135deg, ${
                              key === 'EXCELLENT' ? '#10B981, #059669' : 
                              key === 'GOOD' ? '#3B82F6, #1E40AF' :
                              key === 'SATISFACTORY' ? '#F59E0B, #D97706' :
                              key === 'NEEDS_IMPROVEMENT' ? '#EF4444, #DC2626' : '#8B5CF6, #7C3AED'
                            })`
                          }}
                        >
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-lg">{scale.label}</div>
                          <div className="text-sm text-gray-600 mt-1">{scale.description}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant="outline" 
                          className="text-sm font-mono px-3 py-1 glass-card border-0"
                          style={{ 
                            background: `linear-gradient(135deg, ${
                              key === 'EXCELLENT' ? 'rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05)' : 
                              key === 'GOOD' ? 'rgba(59, 130, 246, 0.1), rgba(30, 64, 175, 0.05)' :
                              key === 'SATISFACTORY' ? 'rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05)' :
                              key === 'NEEDS_IMPROVEMENT' ? 'rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05)' : 'rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.05)'
                            })`,
                            color: key === 'EXCELLENT' ? '#059669' : 
                                  key === 'GOOD' ? '#1E40AF' :
                                  key === 'SATISFACTORY' ? '#D97706' :
                                  key === 'NEEDS_IMPROVEMENT' ? '#DC2626' : '#7C3AED'
                          }}
                        >
                          {scale.min}-{scale.max}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">
                          Range: {scale.max - scale.min} pts
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
