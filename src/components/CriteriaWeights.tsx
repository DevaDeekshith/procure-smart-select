
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DEFAULT_CRITERIA } from "@/types/supplier";
import { BarChart3, Target, Clock, Leaf, Shield } from "lucide-react";

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-blue-900">Evaluation Criteria & Weights</CardTitle>
        <p className="text-gray-600">Standardized criteria used for supplier evaluation</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {DEFAULT_CRITERIA.map((criteria) => (
          <div key={criteria.id} className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {getIcon(criteria.category)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-semibold text-gray-900">{criteria.name}</h4>
                <span className="text-sm font-medium text-blue-600">{criteria.weight}%</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{criteria.description}</p>
              <Progress value={criteria.weight} className="h-2" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
