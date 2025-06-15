
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEFAULT_CRITERIA, SCORING_SCALE } from "@/types/supplier";
import { mockSuppliers, mockScores } from "@/data/mockData";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, ScatterChart, Scatter, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell 
} from "recharts";
import { 
  TrendingUp, TrendingDown, AlertTriangle, Award, Target, 
  Calendar, Filter, Download, Eye, BarChart3, PieChart as PieChartIcon,
  Users, Clock, Star, AlertCircle, CheckCircle, ArrowUpRight
} from "lucide-react";

export const AdvancedAnalytics = () => {
  const [timeRange, setTimeRange] = useState("6months");
  const [selectedMetric, setSelectedMetric] = useState("overall");
  const [reportType, setReportType] = useState("performance");

  // Calculate comprehensive metrics
  const calculateSupplierScore = (supplierId: string) => {
    const supplierScores = mockScores.filter(score => score.supplierId === supplierId);
    let totalWeightedScore = 0;
    let totalWeight = 0;

    DEFAULT_CRITERIA.forEach(criteria => {
      const score = supplierScores.find(s => s.criteriaId === criteria.id);
      if (score) {
        totalWeightedScore += (score.score * criteria.weight) / 100;
        totalWeight += criteria.weight;
      }
    });

    return totalWeight > 0 ? totalWeightedScore : 0;
  };

  const suppliersWithScores = mockSuppliers
    .filter(supplier => supplier.status === 'active')
    .map(supplier => ({
      ...supplier,
      totalScore: calculateSupplierScore(supplier.id)
    }))
    .sort((a, b) => b.totalScore - a.totalScore);

  // Advanced metrics calculations
  const metrics = {
    totalSuppliers: suppliersWithScores.length,
    avgScore: suppliersWithScores.reduce((sum, s) => sum + s.totalScore, 0) / suppliersWithScores.length,
    topPerformers: suppliersWithScores.filter(s => s.totalScore >= 90).length,
    underPerformers: suppliersWithScores.filter(s => s.totalScore < 60).length,
    scoreVariance: (() => {
      const scores = suppliersWithScores.map(s => s.totalScore);
      const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
      return Math.sqrt(scores.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / scores.length);
    })(),
    industryDiversity: new Set(suppliersWithScores.map(s => s.industry)).size,
    evaluationCompletion: (mockScores.length / (suppliersWithScores.length * DEFAULT_CRITERIA.length)) * 100,
    riskSuppliers: suppliersWithScores.filter(s => s.totalScore < 70).length
  };

  // Performance distribution data
  const performanceDistribution = Object.entries(SCORING_SCALE).map(([key, scale]) => {
    const count = suppliersWithScores.filter(supplier => 
      supplier.totalScore >= scale.min && supplier.totalScore <= scale.max
    ).length;
    
    return {
      label: scale.label,
      count: count,
      percentage: suppliersWithScores.length > 0 ? (count / suppliersWithScores.length) * 100 : 0,
      color: key === 'EXCELLENT' ? '#10B981' : 
             key === 'GOOD' ? '#3B82F6' :
             key === 'SATISFACTORY' ? '#F59E0B' :
             key === 'NEEDS_IMPROVEMENT' ? '#EF4444' : '#8B5CF6'
    };
  });

  // Criteria performance trends
  const criteriaPerformance = DEFAULT_CRITERIA.map(criteria => {
    const scores = mockScores
      .filter(score => score.criteriaId === criteria.id)
      .map(score => score.score);
    
    const average = scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
    const trend = Math.random() > 0.5 ? 'up' : 'down'; // Simulated trend
    const change = (Math.random() * 10 - 5).toFixed(1);
    
    return {
      name: criteria.name,
      weight: criteria.weight,
      average: average,
      trend: trend,
      change: change,
      category: criteria.category,
      risk: average < 60 ? 'high' : average < 75 ? 'medium' : 'low'
    };
  });

  // Industry analysis
  const industryAnalysis = Array.from(new Set(suppliersWithScores.map(s => s.industry))).map(industry => {
    const industrySuppliers = suppliersWithScores.filter(s => s.industry === industry);
    const avgScore = industrySuppliers.reduce((sum, s) => sum + s.totalScore, 0) / industrySuppliers.length;
    
    return {
      industry,
      count: industrySuppliers.length,
      avgScore: avgScore,
      topPerformer: industrySuppliers[0]?.name || 'N/A',
      risk: avgScore < 60 ? 'high' : avgScore < 75 ? 'medium' : 'low'
    };
  }).sort((a, b) => b.avgScore - a.avgScore);

  // Time series data (simulated)
  const timeSeriesData = Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    avgScore: 75 + Math.sin(i / 2) * 10 + Math.random() * 5,
    evaluations: Math.floor(Math.random() * 20) + 10,
    newSuppliers: Math.floor(Math.random() * 5) + 1
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-3xl font-bold text-blue-900">Advanced Analytics Dashboard</h2>
          <p className="text-gray-600 mt-1">Comprehensive insights into supplier performance and evaluation trends</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Enhanced Summary Statistics - Moved to top */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Suppliers</p>
                <p className="text-2xl font-bold text-blue-900">{metrics.totalSuppliers}</p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +{industryAnalysis.length} Industries
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Average Score</p>
                <p className="text-2xl font-bold text-green-900">{metrics.avgScore.toFixed(1)}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  σ = {metrics.scoreVariance.toFixed(1)}
                </p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Top Performers</p>
                <p className="text-2xl font-bold text-purple-900">{metrics.topPerformers}</p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <Award className="w-3 h-3 mr-1" />
                  {((metrics.topPerformers / metrics.totalSuppliers) * 100).toFixed(0)}% of total
                </p>
              </div>
              <Star className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Risk Suppliers</p>
                <p className="text-2xl font-bold text-orange-900">{metrics.riskSuppliers}</p>
                <p className="text-xs text-orange-600 flex items-center mt-1">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Need attention
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Evaluation Completion</p>
                <p className="text-xl font-bold text-gray-900">{metrics.evaluationCompletion.toFixed(1)}%</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Industry Diversity</p>
                <p className="text-xl font-bold text-gray-900">{metrics.industryDiversity}</p>
              </div>
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Total Evaluations</p>
                <p className="text-xl font-bold text-gray-900">{mockScores.length}</p>
              </div>
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics Tabs */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance Trends</TabsTrigger>
          <TabsTrigger value="criteria">Criteria Analysis</TabsTrigger>
          <TabsTrigger value="industry">Industry Insights</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="avgScore" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={performanceDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage.toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {performanceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Evaluation Activity Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="evaluations" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="newSuppliers" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="criteria" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Criteria Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {criteriaPerformance.map((criteria) => (
                  <div key={criteria.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{criteria.name}</h4>
                        <Badge variant={criteria.risk === 'high' ? 'destructive' : criteria.risk === 'medium' ? 'secondary' : 'default'}>
                          {criteria.risk} risk
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Weight: {criteria.weight}%</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">{criteria.average.toFixed(1)}</span>
                        {criteria.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`text-sm ${criteria.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {criteria.change}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="industry" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Industry Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={industryAnalysis} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="industry" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="avgScore" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {industryAnalysis.map((industry) => (
              <Card key={industry.industry}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{industry.industry}</h4>
                      <Badge variant={industry.risk === 'high' ? 'destructive' : industry.risk === 'medium' ? 'secondary' : 'default'}>
                        {industry.risk}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">{industry.avgScore.toFixed(1)}</div>
                    <div className="text-sm text-gray-600">
                      <p>{industry.count} suppliers</p>
                      <p>Top: {industry.topPerformer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={suppliersWithScores}>
                    <CartesianGrid />
                    <XAxis dataKey="totalScore" name="Performance Score" />
                    <YAxis dataKey="establishedYear" name="Years Established" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter dataKey="totalScore" fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>High-Risk Suppliers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {suppliersWithScores
                    .filter(s => s.totalScore < 70)
                    .slice(0, 5)
                    .map((supplier) => (
                      <div key={supplier.id} className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                        <div>
                          <h4 className="font-medium">{supplier.name}</h4>
                          <p className="text-sm text-gray-600">{supplier.industry}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-red-600">{supplier.totalScore.toFixed(1)}</div>
                          <Badge variant="destructive">High Risk</Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
