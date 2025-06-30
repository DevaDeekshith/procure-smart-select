
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, TrendingUp, Award } from "lucide-react";
import { Supplier } from "@/types/supplier";

interface EvaluationAnalyticsProps {
  suppliers: Supplier[];
}

export const EvaluationAnalytics = ({ suppliers }: EvaluationAnalyticsProps) => {
  const topPerformers = suppliers
    .filter(s => s.overallScore && s.overallScore >= 85)
    .sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0))
    .slice(0, 5);

  const averageScore = suppliers.length > 0 
    ? suppliers.reduce((sum, s) => sum + (s.overallScore || 0), 0) / suppliers.length
    : 0;

  const scoreDistribution = {
    excellent: suppliers.filter(s => (s.overallScore || 0) >= 90).length,
    good: suppliers.filter(s => (s.overallScore || 0) >= 80 && (s.overallScore || 0) < 90).length,
    satisfactory: suppliers.filter(s => (s.overallScore || 0) >= 70 && (s.overallScore || 0) < 80).length,
    needsImprovement: suppliers.filter(s => (s.overallScore || 0) < 70).length,
  };

  return (
    <div className="space-y-6">
      {/* Performance Summary */}
      <Card className="liquid-glass border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{averageScore.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Average Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{topPerformers.length}</div>
              <div className="text-sm text-gray-600">Top Performers</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Distribution */}
      <Card className="liquid-glass border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <Star className="w-6 h-6 text-yellow-600" />
            Score Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Excellent (90+)</span>
              <Badge className="bg-green-100 text-green-800">{scoreDistribution.excellent}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Good (80-89)</span>
              <Badge className="bg-blue-100 text-blue-800">{scoreDistribution.good}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Satisfactory (70-79)</span>
              <Badge className="bg-yellow-100 text-yellow-800">{scoreDistribution.satisfactory}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Needs Improvement (<70)</span>
              <Badge className="bg-red-100 text-red-800">{scoreDistribution.needsImprovement}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Suppliers */}
      <Card className="liquid-glass border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-600" />
            Top Performing Suppliers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformers.map((supplier, index) => (
              <div key={supplier.id} className="flex items-center justify-between p-4 liquid-glass rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{supplier.name}</h4>
                    <p className="text-sm text-gray-600">{supplier.industry}</p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                  {supplier.overallScore?.toFixed(1)}%
                </Badge>
              </div>
            ))}
            {topPerformers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No top performers yet. Add evaluation scores to see rankings.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
