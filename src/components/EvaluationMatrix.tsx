
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_CRITERIA, SCORING_SCALE } from "@/types/supplier";
import { mockSuppliers, mockScores } from "@/data/mockData";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export const EvaluationMatrix = () => {
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

  const getRankBadge = (index: number) => {
    const rank = index + 1;
    if (rank === 1) return <Badge className="bg-yellow-500 text-white text-xs">🥇 1st</Badge>;
    if (rank === 2) return <Badge className="bg-gray-400 text-white text-xs">🥈 2nd</Badge>;
    if (rank === 3) return <Badge className="bg-orange-600 text-white text-xs">🥉 3rd</Badge>;
    return <Badge variant="outline" className="text-xs">{rank}th</Badge>;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    if (score >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    const scaleEntry = Object.entries(SCORING_SCALE).find(([_, scale]) => 
      score >= scale.min && score <= scale.max
    );
    
    if (!scaleEntry) return null;
    
    const [key, scale] = scaleEntry;
    const colorMap = {
      EXCELLENT: "bg-green-100 text-green-800",
      GOOD: "bg-blue-100 text-blue-800", 
      SATISFACTORY: "bg-yellow-100 text-yellow-800",
      NEEDS_IMPROVEMENT: "bg-orange-100 text-orange-800",
      UNACCEPTABLE: "bg-red-100 text-red-800"
    };
    
    return (
      <Badge className={`${colorMap[key as keyof typeof colorMap] || "bg-gray-100 text-gray-800"} text-xs`}>
        {scale.label}
      </Badge>
    );
  };

  const getPerformanceIcon = (score: number) => {
    if (score >= 85) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (score >= 70) return <Minus className="w-4 h-4 text-yellow-600" />;
    return <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-blue-900">Supplier Evaluation Matrix</CardTitle>
        <p className="text-gray-600">Comprehensive performance ranking based on weighted criteria</p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-2">
          <span>Total Suppliers Evaluated: {suppliersWithScores.length}</span>
          <span>•</span>
          <span>Criteria: {DEFAULT_CRITERIA.length}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 text-center">Rank</TableHead>
                  <TableHead className="min-w-[200px]">Supplier</TableHead>
                  <TableHead className="text-center min-w-[120px]">Overall Score</TableHead>
                  <TableHead className="text-center min-w-[100px]">Quality (25%)</TableHead>
                  <TableHead className="text-center min-w-[100px]">Cost (20%)</TableHead>
                  <TableHead className="text-center min-w-[100px]">Lead Time (20%)</TableHead>
                  <TableHead className="text-center min-w-[100px]">Reliability (20%)</TableHead>
                  <TableHead className="text-center min-w-[120px]">Sustainability (15%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliersWithScores.map((supplier, index) => {
                  const supplierScores = mockScores.filter(score => score.supplierId === supplier.id);
                  return (
                    <TableRow key={supplier.id} className="hover:bg-gray-50">
                      <TableCell className="text-center">{getRankBadge(index)}</TableCell>
                      <TableCell>
                        <div className="space-y-1 min-w-0">
                          <div className="font-semibold text-blue-900 flex items-center gap-2">
                            <span className="truncate">{supplier.name}</span>
                            {getPerformanceIcon(supplier.totalScore)}
                          </div>
                          <div className="text-sm text-gray-500 truncate">{supplier.industry}</div>
                          <div className="text-xs text-gray-400">Est. {supplier.establishedYear}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="space-y-2">
                          <div className={`text-xl font-bold ${getScoreColor(supplier.totalScore)}`}>
                            {supplier.totalScore.toFixed(1)}
                          </div>
                          <Progress value={supplier.totalScore} className="w-20 mx-auto" />
                          {getScoreBadge(supplier.totalScore)}
                        </div>
                      </TableCell>
                      {DEFAULT_CRITERIA.map(criteria => {
                        const score = supplierScores.find(s => s.criteriaId === criteria.id);
                        const scoreValue = score?.score || 0;
                        return (
                          <TableCell key={criteria.id} className="text-center">
                            <div className="space-y-1">
                              <div className={`text-lg font-semibold ${getScoreColor(scoreValue)}`}>
                                {scoreValue || 'N/A'}
                              </div>
                              <Progress value={scoreValue} className="w-16 mx-auto" />
                              {score && (
                                <div className="text-xs text-gray-500 max-w-[80px] truncate mx-auto" title={score.comments}>
                                  {score.comments}
                                </div>
                              )}
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Evaluation Summary</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="break-words">
              <span className="font-medium">Top Performer:</span>
              <span className="ml-2 text-blue-700">
                {suppliersWithScores[0]?.name} ({suppliersWithScores[0]?.totalScore.toFixed(1)})
              </span>
            </div>
            <div>
              <span className="font-medium">Average Score:</span>
              <span className="ml-2 text-blue-700">
                {(suppliersWithScores.reduce((sum, s) => sum + s.totalScore, 0) / suppliersWithScores.length).toFixed(1)}
              </span>
            </div>
            <div>
              <span className="font-medium">Evaluation Date:</span>
              <span className="ml-2 text-blue-700">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
