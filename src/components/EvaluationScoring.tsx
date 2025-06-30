
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, DollarSign, Clock, Shield, Leaf } from "lucide-react";

interface EvaluationScoringProps {
  scores: Record<string, number>;
  onScoreChange: (criteria: string, score: number) => void;
  readOnly?: boolean;
}

export const EvaluationScoring = ({ scores, onScoreChange, readOnly = false }: EvaluationScoringProps) => {
  const evaluationCategories = [
    {
      title: "Product Quality",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      criteria: [
        { key: "product_specifications_adherence", label: "Product Specifications Adherence", description: "Compliance with technical specifications" },
        { key: "defect_rate_quality_control", label: "Defect Rate & Quality Control", description: "Quality control processes and defect rates" },
        { key: "quality_certifications_score", label: "Quality Certifications", description: "ISO 9001 and other quality certifications" }
      ]
    },
    {
      title: "Cost Competitiveness",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      criteria: [
        { key: "unit_pricing_competitiveness", label: "Unit Pricing Competitiveness", description: "Competitive pricing compared to market" },
        { key: "payment_terms_flexibility", label: "Payment Terms Flexibility", description: "Flexible payment terms and conditions" },
        { key: "total_cost_ownership", label: "Total Cost of Ownership", description: "Complete cost including maintenance and support" }
      ]
    },
    {
      title: "Lead Time Performance",
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      criteria: [
        { key: "ontime_delivery_performance", label: "On-time Delivery Performance", description: "Historical on-time delivery record" },
        { key: "lead_time_competitiveness", label: "Lead Time Competitiveness", description: "Competitive delivery timeframes" },
        { key: "emergency_response_capability", label: "Emergency Response Capability", description: "Ability to handle urgent requests" }
      ]
    },
    {
      title: "Reliability & Trust",
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      criteria: [
        { key: "communication_effectiveness", label: "Communication Effectiveness", description: "Clear and responsive communication" },
        { key: "contract_compliance_history", label: "Contract Compliance History", description: "Track record of meeting contractual obligations" },
        { key: "business_stability_longevity", label: "Business Stability & Longevity", description: "Financial stability and business history" }
      ]
    },
    {
      title: "Sustainability",
      icon: Leaf,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      criteria: [
        { key: "environmental_certifications", label: "Environmental Certifications", description: "ISO 14001 and environmental certifications" },
        { key: "social_responsibility_programs", label: "Social Responsibility Programs", description: "CSR initiatives and programs" },
        { key: "sustainable_sourcing_practices", label: "Sustainable Sourcing Practices", description: "Sustainable material sourcing" }
      ]
    }
  ];

  const getScoreLabel = (score: number) => {
    if (score >= 9) return { label: "Excellent", color: "bg-green-500" };
    if (score >= 7) return { label: "Good", color: "bg-blue-500" };
    if (score >= 5) return { label: "Average", color: "bg-yellow-500" };
    if (score >= 3) return { label: "Below Average", color: "bg-orange-500" };
    return { label: "Poor", color: "bg-red-500" };
  };

  return (
    <div className="space-y-6">
      {evaluationCategories.map((category) => {
        const CategoryIcon = category.icon;
        return (
          <Card key={category.title} className="liquid-glass border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className={`p-2 rounded-lg ${category.bgColor}`}>
                  <CategoryIcon className={`w-5 h-5 ${category.color}`} />
                </div>
                {category.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {category.criteria.map((criterion) => {
                const score = scores[criterion.key] || 0;
                const scoreInfo = getScoreLabel(score);
                
                return (
                  <div key={criterion.key} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="text-sm font-medium">{criterion.label}</Label>
                        <p className="text-xs text-gray-500 mt-1">{criterion.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={`${scoreInfo.color} text-white px-2 py-1 text-xs`}>
                          {scoreInfo.label}
                        </Badge>
                        <span className="text-lg font-bold text-gray-900 min-w-[3ch]">
                          {score.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    
                    {readOnly ? (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${scoreInfo.color}`}
                          style={{ width: `${(score / 10) * 100}%` }}
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Slider
                          value={[score]}
                          onValueChange={(value) => onScoreChange(criterion.key, value[0])}
                          max={10}
                          min={0}
                          step={0.1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>0 (Poor)</span>
                          <span>5 (Average)</span>
                          <span>10 (Excellent)</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
