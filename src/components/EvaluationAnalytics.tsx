
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DEFAULT_CRITERIA, SCORING_SCALE, Supplier } from "@/types/supplier";
import { mockSuppliers, mockScores } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { TrendingUp, Award, AlertTriangle, BarChart3 } from "lucide-react";

export const EvaluationAnalytics = () => {
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

  // Criteria performance analysis
  const criteriaAnalysis = DEFAULT_CRITERIA.map(criteria => {
    const scores = mockScores
      .filter(score => score.criteriaId === criteria.id)
      .map(score => score.score);
    
    const average = scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
    const min = scores.length > 0 ? Math.min(...scores) : 0;
    const max = scores.length > 0 ? Math.max(...scores) : 0;

    return {
      name: criteria.name,
      weight: criteria.weight,
      average: average,
      min: min,
      max: max,
      category: criteria.category
    };
  });

  // Performance distribution
  const performanceDistribution = Object.entries(SCORING_SCALE).map(([key, scale]) => {
    const count = suppliersWithScores.filter(supplier => 
      supplier.totalScore >= scale.min && supplier.totalScore <= scale.max
    ).length;
    
    return {
      label: scale.label,
      count: count,
      percentage: suppliersWithScores.length > 0 ? (count / suppliersWithScores.length) * 100 : 0
    };
  });

  // Top performer radar chart data
  const topPerformer = suppliersWithScores[0];
  const radarData = topPerformer ? DEFAULT_CRITERIA.map(criteria => {
    const score = mockScores.find(s => s.supplierId === topPerformer.id && s.criteriaId === criteria.id);
    return {
      criteria: criteria.name.split(' ')[0], // Shortened name for display
      score: score?.score || 0,
      fullName: criteria.name
    };
  }) : [];

  const getPerformanceInsights = () => {
    const insights = [];
    
    // Best performing criteria
    const bestCriteria = criteriaAnalysis.reduce((prev, current) => 
      prev.average > current.average ? prev : current
    );
    insights.push({
      type: 'positive',
      title: 'Strongest Performance',
      description: `${bestCriteria.name} shows the highest average performance at ${bestCriteria.average.toFixed(1)}/100`
    });

    // Worst performing criteria
    const worstCriteria = criteriaAnalysis.reduce((prev, current) => 
      prev.average < current.average ? prev : current
    );
    insights.push({
      type: 'warning',
      title: 'Improvement Opportunity',
      description: `${worstCriteria.name} needs attention with average performance of ${worstCriteria.average.toFixed(1)}/100`
    });

    // Performance spread
    const excellentPerformers = performanceDistribution.find(d => d.label === 'Excellent')?.count || 0;
    const totalSuppliers = suppliersWithScores.length;
    
    if (excellentPerformers === 0 && totalSuppliers > 0) {
      insights.push({
        type: 'warning',
        title: 'No Excellent Performers',
        description: 'No suppliers currently meet excellent performance standards (90+ score)'
      });
    } else if (excellentPerformers > 0) {
      insights.push({
        type: 'positive',
        title: 'Excellence Achievement',
        description: `${excellentPerformers} supplier(s) achieve excellent performance standards`
      });
    }

    return insights;
  };

  const insights = getPerformanceInsights();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">Evaluation Analytics</h2>
          <p className="text-gray-600">Comprehensive analysis of supplier performance data</p>
        </div>
        <Badge className="bg-blue-100 text-blue-800">
          {suppliersWithScores.length} Suppliers Analyzed
        </Badge>
      </div>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map((insight, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {insight.type === 'positive' ? (
                    <Award className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  )}
                  <span className="font-medium text-gray-900">{insight.title}</span>
                </div>
                <p className="text-sm text-gray-600">{insight.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {topPerformer && (
          <Card>
            <CardHeader>
              <CardTitle>Top Performer Profile</CardTitle>
              <p className="text-sm text-gray-600">{topPerformer.name} - {topPerformer.totalScore.toFixed(1)}/100</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="criteria" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Score" dataKey="score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Criteria Performance Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Criteria Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {criteriaAnalysis.map((criteria) => (
              <div key={criteria.name} className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">{criteria.name}</h4>
                    <p className="text-sm text-gray-600">Weight: {criteria.weight}%</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-blue-900">{criteria.average.toFixed(1)}</div>
                    <div className="text-xs text-gray-500">Average Score</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Progress value={criteria.average} className="h-3" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Min: {criteria.min.toFixed(1)}</span>
                    <span>Max: {criteria.max.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Summary Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-900">
                {suppliersWithScores.length > 0 ? 
                  (suppliersWithScores.reduce((sum, s) => sum + s.totalScore, 0) / suppliersWithScores.length).toFixed(1) : 
                  '0.0'
                }
              </div>
              <div className="text-sm text-gray-600">Average Score</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-900">
                {suppliersWithScores.length > 0 ? Math.max(...suppliersWithScores.map(s => s.totalScore)).toFixed(1) : '0.0'}
              </div>
              <div className="text-sm text-gray-600">Highest Score</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-900">
                {suppliersWithScores.length > 0 ? Math.min(...suppliersWithScores.map(s => s.totalScore)).toFixed(1) : '0.0'}
              </div>
              <div className="text-sm text-gray-600">Lowest Score</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-900">
                {mockScores.length}
              </div>
              <div className="text-sm text-gray-600">Total Evaluations</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
