
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_CRITERIA, SCORING_SCALE } from "@/types/supplier";
import { Target, BarChart3, Clock, Leaf, Shield, Star, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

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

  const scoringData = Object.entries(SCORING_SCALE).map(([key, scale]) => ({
    label: scale.label,
    min: scale.min,
    max: scale.max,
    range: scale.max - scale.min,
    color: key === 'EXCELLENT' ? '#10B981' : 
           key === 'GOOD' ? '#3B82F6' :
           key === 'SATISFACTORY' ? '#F59E0B' :
           key === 'NEEDS_IMPROVEMENT' ? '#EF4444' : '#8B5CF6'
  }));

  return (
    <div className="space-y-6">
      {/* Criteria Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-900 flex items-center gap-2">
              <Target className="w-6 h-6" />
              Criteria Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={criteriaChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="weight"
                  label={({ name, weight }) => `${weight}%`}
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

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-green-900 flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Category Weights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Weight']} />
                <Bar dataKey="weight" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Criteria List */}
      <Card className="bg-gradient-to-r from-slate-50 to-gray-50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Detailed Evaluation Criteria
          </CardTitle>
          <p className="text-gray-600">Comprehensive breakdown of all evaluation parameters</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {DEFAULT_CRITERIA.map((criteria) => (
            <div key={criteria.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex-shrink-0 p-3 rounded-full bg-gray-50">
                  {getIcon(criteria.category)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-gray-900 text-lg">{criteria.name}</h4>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-sm px-3 py-1">
                      {criteria.weight}% Weight
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{criteria.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Impact Level</span>
                      <span>{criteria.weight}% of total score</span>
                    </div>
                    <Progress value={criteria.weight * 4} className="h-3" />
                  </div>
                </div>
              </div>
              
              {criteria.subCriteria && (
                <div className="ml-4 space-y-3 border-l-2 border-gray-100 pl-6">
                  <h5 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Sub-Criteria</h5>
                  {criteria.subCriteria.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <span className="font-medium text-gray-800">{sub.name}</span>
                        <p className="text-sm text-gray-600 mt-1">{sub.description}</p>
                      </div>
                      <Badge variant="outline" className="text-xs ml-3 bg-white">
                        {sub.weight}%
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Enhanced Scoring Scale */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-purple-900 flex items-center gap-2">
            <Star className="w-6 h-6" />
            Performance Scoring Scale
          </CardTitle>
          <p className="text-gray-600">Visual representation of scoring thresholds and performance levels</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Score Range Chart */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Score Distribution</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={scoringData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="label" type="category" width={100} />
                  <Tooltip formatter={(value, name) => [`${value} points`, 'Range']} />
                  <Bar dataKey="range" fill="#8884d8" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Detailed Score Breakdown */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 mb-4">Performance Levels</h4>
              {Object.entries(SCORING_SCALE).map(([key, scale]) => (
                <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-white shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ 
                        backgroundColor: key === 'EXCELLENT' ? '#10B981' : 
                                       key === 'GOOD' ? '#3B82F6' :
                                       key === 'SATISFACTORY' ? '#F59E0B' :
                                       key === 'NEEDS_IMPROVEMENT' ? '#EF4444' : '#8B5CF6'
                      }}
                    />
                    <div>
                      <div className="font-bold text-gray-900">{scale.label}</div>
                      <div className="text-sm text-gray-600">{scale.description}</div>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="text-sm font-mono"
                    style={{ 
                      borderColor: key === 'EXCELLENT' ? '#10B981' : 
                                  key === 'GOOD' ? '#3B82F6' :
                                  key === 'SATISFACTORY' ? '#F59E0B' :
                                  key === 'NEEDS_IMPROVEMENT' ? '#EF4444' : '#8B5CF6',
                      color: key === 'EXCELLENT' ? '#10B981' : 
                            key === 'GOOD' ? '#3B82F6' :
                            key === 'SATISFACTORY' ? '#F59E0B' :
                            key === 'NEEDS_IMPROVEMENT' ? '#EF4444' : '#8B5CF6'
                    }}
                  >
                    {scale.min}-{scale.max}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
