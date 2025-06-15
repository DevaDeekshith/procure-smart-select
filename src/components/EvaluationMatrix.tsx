
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_CRITERIA } from "@/types/supplier";
import { mockSuppliers, mockScores } from "@/data/mockData";

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
    if (index === 0) return <Badge className="bg-gold-500 text-white">1st</Badge>;
    if (index === 1) return <Badge className="bg-silver-500 text-white">2nd</Badge>;
    if (index === 2) return <Badge className="bg-bronze-500 text-white">3rd</Badge>;
    return <Badge variant="outline">{index + 1}th</Badge>;
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-blue-900">Supplier Evaluation Matrix</CardTitle>
        <p className="text-gray-600">Overall performance ranking based on weighted criteria</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-center">Overall Score</TableHead>
                <TableHead>Quality (25%)</TableHead>
                <TableHead>Cost (20%)</TableHead>
                <TableHead>Lead Time (20%)</TableHead>
                <TableHead>Sustainability (15%)</TableHead>
                <TableHead>Reliability (20%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliersWithScores.map((supplier, index) => {
                const supplierScores = mockScores.filter(score => score.supplierId === supplier.id);
                return (
                  <TableRow key={supplier.id} className="hover:bg-gray-50">
                    <TableCell>{getRankBadge(index)}</TableCell>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold text-blue-900">{supplier.name}</div>
                        <div className="text-sm text-gray-500">{supplier.industry}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-2">
                        <div className={`text-2xl font-bold ${getScoreColor(supplier.totalScore)}`}>
                          {supplier.totalScore.toFixed(1)}
                        </div>
                        <Progress value={supplier.totalScore} className="w-20" />
                      </div>
                    </TableCell>
                    {DEFAULT_CRITERIA.map(criteria => {
                      const score = supplierScores.find(s => s.criteriaId === criteria.id);
                      return (
                        <TableCell key={criteria.id} className="text-center">
                          <div className="space-y-1">
                            <div className={`font-semibold ${getScoreColor(score?.score || 0)}`}>
                              {score?.score || 0}
                            </div>
                            <Progress value={score?.score || 0} className="w-16" />
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
      </CardContent>
    </Card>
  );
};
