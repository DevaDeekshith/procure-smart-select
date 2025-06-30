
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Award, Building2, Calendar } from "lucide-react";
import { Supplier } from "@/types/supplier";

interface AdvancedAnalyticsProps {
  suppliers: Supplier[];
}

export const AdvancedAnalytics = ({ suppliers }: AdvancedAnalyticsProps) => {
  // Calculate analytics data from real suppliers
  const scoreRanges = [
    { name: '90-100', count: suppliers.filter(s => (s.overallScore || 0) >= 90).length, color: '#10B981' },
    { name: '80-89', count: suppliers.filter(s => (s.overallScore || 0) >= 80 && (s.overallScore || 0) < 90).length, color: '#3B82F6' },
    { name: '70-79', count: suppliers.filter(s => (s.overallScore || 0) >= 70 && (s.overallScore || 0) < 80).length, color: '#F59E0B' },
    { name: '60-69', count: suppliers.filter(s => (s.overallScore || 0) >= 60 && (s.overallScore || 0) < 70).length, color: '#EF4444' },
    { name: '<60', count: suppliers.filter(s => (s.overallScore || 0) < 60).length, color: '#DC2626' }
  ];

  const industryData = suppliers.reduce((acc, supplier) => {
    const industry = supplier.industry || 'Unknown';
    const existing = acc.find(item => item.industry === industry);
    if (existing) {
      existing.count += 1;
      existing.avgScore = ((existing.avgScore * (existing.count - 1)) + (supplier.overallScore || 0)) / existing.count;
    } else {
      acc.push({
        industry,
        count: 1,
        avgScore: supplier.overallScore || 0
      });
    }
    return acc;
  }, [] as Array<{ industry: string; count: number; avgScore: number }>);

  const performanceTrend = suppliers
    .filter(s => s.overallScore && s.overallScore > 0)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((supplier, index) => ({
      month: `Month ${index + 1}`,
      score: supplier.overallScore || 0,
      name: supplier.name
    }));

  const topCategories = [
    {
      name: 'Product Quality',
      avgScore: suppliers.length > 0 ? suppliers.reduce((sum, s) => {
        const scores = s.scores || {};
        const qualityScores = [
          scores['Product Specifications Adherence'] || 0,
          scores['Defect Rate & Quality Control'] || 0,
          scores['Quality Certifications'] || 0
        ];
        return sum + (qualityScores.reduce((a, b) => a + b, 0) / 3);
      }, 0) / suppliers.length : 0
    },
    {
      name: 'Cost Competitiveness',
      avgScore: suppliers.length > 0 ? suppliers.reduce((sum, s) => {
        const scores = s.scores || {};
        const costScores = [
          scores['Unit Pricing Competitiveness'] || 0,
          scores['Payment Terms Flexibility'] || 0,
          scores['Total Cost of Ownership'] || 0
        ];
        return sum + (costScores.reduce((a, b) => a + b, 0) / 3);
      }, 0) / suppliers.length : 0
    },
    {
      name: 'Lead Time Performance',
      avgScore: suppliers.length > 0 ? suppliers.reduce((sum, s) => {
        const scores = s.scores || {};
        const leadTimeScores = [
          scores['On-time Delivery Performance'] || 0,
          scores['Lead Time Competitiveness'] || 0,
          scores['Emergency Response Capability'] || 0
        ];
        return sum + (leadTimeScores.reduce((a, b) => a + b, 0) / 3);
      }, 0) / suppliers.length : 0
    },
    {
      name: 'Reliability & Trust',
      avgScore: suppliers.length > 0 ? suppliers.reduce((sum, s) => {
        const scores = s.scores || {};
        const reliabilityScores = [
          scores['Communication Effectiveness'] || 0,
          scores['Contract Compliance History'] || 0,
          scores['Business Stability & Longevity'] || 0
        ];
        return sum + (reliabilityScores.reduce((a, b) => a + b, 0) / 3);
      }, 0) / suppliers.length : 0
    },
    {
      name: 'Sustainability',
      avgScore: suppliers.length > 0 ? suppliers.reduce((sum, s) => {
        const scores = s.scores || {};
        const sustainabilityScores = [
          scores['Environmental Certifications'] || 0,
          scores['Social Responsibility Programs'] || 0,
          scores['Sustainable Sourcing Practices'] || 0
        ];
        return sum + (sustainabilityScores.reduce((a, b) => a + b, 0) / 3);
      }, 0) / suppliers.length : 0
    }
  ];

  return (
    <div className="space-y-6">
      {/* Score Distribution */}
      <Card className="liquid-glass border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart className="w-6 h-6 text-blue-600" />
            Score Distribution Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreRanges}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                  }} 
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Industry Performance */}
      <Card className="liquid-glass border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <Building2 className="w-6 h-6 text-green-600" />
            Industry Performance Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={industryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="industry" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                  }} 
                />
                <Bar dataKey="avgScore" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category Performance */}
      <Card className="liquid-glass border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <Award className="w-6 h-6 text-purple-600" />
            Category Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCategories.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between p-4 liquid-glass rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900">{category.name}</span>
                </div>
                <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                  {category.avgScore.toFixed(1)}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Trend */}
      {performanceTrend.length > 0 && (
        <Card className="liquid-glass border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-orange-600" />
              Performance Trend Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#f59e0b" 
                    strokeWidth={3}
                    dot={{ fill: '#f59e0b', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
