
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_CRITERIA, SCORING_SCALE } from "@/types/supplier";
import { Target, BarChart3, Clock, Leaf, Shield } from "lucide-react";

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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-blue-900">Evaluation Criteria & Weights</CardTitle>
          <p className="text-gray-600">Standardized criteria used for supplier evaluation</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {DEFAULT_CRITERIA.map((criteria) => (
            <div key={criteria.id} className="space-y-3">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {getIcon(criteria.category)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-semibold text-gray-900">{criteria.name}</h4>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {criteria.weight}%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{criteria.description}</p>
                  <Progress value={criteria.weight * 4} className="h-2" />
                </div>
              </div>
              
              {criteria.subCriteria && (
                <div className="ml-9 space-y-2">
                  {criteria.subCriteria.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between text-sm">
                      <div className="flex-1">
                        <span className="text-gray-700">{sub.name}</span>
                        <p className="text-xs text-gray-500 mt-1">{sub.description}</p>
                      </div>
                      <Badge variant="outline" className="text-xs ml-2">
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

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-blue-900">Scoring Scale</CardTitle>
          <p className="text-gray-600">Performance rating guidelines</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(SCORING_SCALE).map(([key, scale]) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div>
                <div className="font-medium text-gray-900">{scale.label}</div>
                <div className="text-sm text-gray-600">{scale.description}</div>
              </div>
              <Badge variant="outline" className="ml-2">
                {scale.min}-{scale.max}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
