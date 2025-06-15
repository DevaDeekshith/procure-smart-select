
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_CRITERIA, SCORING_SCALE, Supplier, SupplierScore } from "@/types/supplier";
import { useToast } from "@/hooks/use-toast";
import { Save, AlertCircle, Calculator, TrendingUp } from "lucide-react";

interface SupplierScoringProps {
  supplier: Supplier;
  existingScores?: SupplierScore[];
  onScoreSubmit: (scores: SupplierScore[]) => void;
  onCancel: () => void;
}

export const SupplierScoring = ({ supplier, existingScores = [], onScoreSubmit, onCancel }: SupplierScoringProps) => {
  const { toast } = useToast();
  const [scores, setScores] = useState<Record<string, { score: number; comments: string }>>(() => {
    const initialScores: Record<string, { score: number; comments: string }> = {};
    DEFAULT_CRITERIA.forEach(criteria => {
      const existing = existingScores.find(s => s.criteriaId === criteria.id);
      initialScores[criteria.id] = {
        score: existing?.score || 0,
        comments: existing?.comments || ''
      };
    });
    return initialScores;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [evaluatorName, setEvaluatorName] = useState('');

  const validateScore = (criteriaId: string, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return "Score must be a valid number";
    }
    if (numValue < 0 || numValue > 100) {
      return "Score must be between 0 and 100";
    }
    return null;
  };

  const handleScoreChange = (criteriaId: string, value: string) => {
    const error = validateScore(criteriaId, value);
    setErrors(prev => ({
      ...prev,
      [criteriaId]: error || ''
    }));

    const numValue = parseFloat(value) || 0;
    setScores(prev => ({
      ...prev,
      [criteriaId]: {
        ...prev[criteriaId],
        score: numValue
      }
    }));
  };

  const handleCommentsChange = (criteriaId: string, comments: string) => {
    setScores(prev => ({
      ...prev,
      [criteriaId]: {
        ...prev[criteriaId],
        comments
      }
    }));
  };

  const calculateOverallScore = () => {
    let totalWeightedScore = 0;
    let totalWeight = 0;

    DEFAULT_CRITERIA.forEach(criteria => {
      const score = scores[criteria.id]?.score || 0;
      if (score > 0) {
        totalWeightedScore += (score * criteria.weight) / 100;
        totalWeight += criteria.weight;
      }
    });

    return totalWeight > 0 ? totalWeightedScore : 0;
  };

  const getScoreRating = (score: number) => {
    const scaleEntry = Object.entries(SCORING_SCALE).find(([_, scale]) => 
      score >= scale.min && score <= scale.max
    );
    return scaleEntry ? scaleEntry[1] : null;
  };

  const getCompletionPercentage = () => {
    const completedCriteria = DEFAULT_CRITERIA.filter(criteria => 
      scores[criteria.id]?.score > 0
    ).length;
    return (completedCriteria / DEFAULT_CRITERIA.length) * 100;
  };

  const handleSubmit = () => {
    if (!evaluatorName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name as the evaluator",
        variant: "destructive",
      });
      return;
    }

    const hasErrors = Object.values(errors).some(error => error);
    if (hasErrors) {
      toast({
        title: "Validation Error",
        description: "Please fix all scoring errors before submitting",
        variant: "destructive",
      });
      return;
    }

    const scoredCriteria = DEFAULT_CRITERIA.filter(criteria => scores[criteria.id]?.score > 0);
    if (scoredCriteria.length === 0) {
      toast({
        title: "Error",
        description: "Please provide scores for at least one criterion",
        variant: "destructive",
      });
      return;
    }

    const supplierScores: SupplierScore[] = scoredCriteria.map(criteria => ({
      id: `score_${supplier.id}_${criteria.id}_${Date.now()}`,
      supplierId: supplier.id,
      criteriaId: criteria.id,
      score: scores[criteria.id].score,
      comments: scores[criteria.id].comments,
      evaluatedBy: evaluatorName,
      evaluatedAt: new Date()
    }));

    onScoreSubmit(supplierScores);
    
    toast({
      title: "Success",
      description: `Evaluation completed for ${supplier.name}`,
    });
  };

  const overallScore = calculateOverallScore();
  const completionPercentage = getCompletionPercentage();
  const overallRating = getScoreRating(overallScore);

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">Evaluate Supplier</h2>
          <p className="text-gray-600">{supplier.name} - {supplier.industry}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Save Evaluation
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Evaluation Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label className="text-sm font-medium text-gray-700">Completion</Label>
              <div className="mt-2">
                <Progress value={completionPercentage} className="h-3" />
                <p className="text-sm text-gray-600 mt-1">{completionPercentage.toFixed(0)}% Complete</p>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Overall Score</Label>
              <div className="mt-2">
                <div className="text-2xl font-bold text-blue-900">{overallScore.toFixed(1)}</div>
                {overallRating && (
                  <Badge className="mt-1 bg-blue-100 text-blue-800">{overallRating.label}</Badge>
                )}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Evaluator</Label>
              <div className="mt-2">
                <Input
                  placeholder="Enter your name"
                  value={evaluatorName}
                  onChange={(e) => setEvaluatorName(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scoring Criteria */}
      <div className="space-y-4">
        {DEFAULT_CRITERIA.map((criteria) => {
          const currentScore = scores[criteria.id]?.score || 0;
          const currentComments = scores[criteria.id]?.comments || '';
          const error = errors[criteria.id];
          const rating = getScoreRating(currentScore);

          return (
            <Card key={criteria.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{criteria.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{criteria.description}</p>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Weight: {criteria.weight}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`score-${criteria.id}`} className="text-sm font-medium">
                      Score (0-100) *
                    </Label>
                    <div className="mt-1 space-y-2">
                      <Input
                        id={`score-${criteria.id}`}
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={currentScore || ''}
                        onChange={(e) => handleScoreChange(criteria.id, e.target.value)}
                        className={error ? "border-red-500" : ""}
                        placeholder="Enter score"
                      />
                      {error && (
                        <Alert variant="destructive" className="py-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-sm">{error}</AlertDescription>
                        </Alert>
                      )}
                      {currentScore > 0 && !error && (
                        <div className="flex items-center gap-2">
                          <Progress value={currentScore} className="flex-1 h-2" />
                          {rating && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              {rating.label}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`comments-${criteria.id}`} className="text-sm font-medium">
                      Comments & Justification
                    </Label>
                    <Textarea
                      id={`comments-${criteria.id}`}
                      value={currentComments}
                      onChange={(e) => handleCommentsChange(criteria.id, e.target.value)}
                      placeholder="Provide reasoning for your score..."
                      className="mt-1 min-h-[80px]"
                    />
                  </div>
                </div>

                {/* Sub-criteria breakdown */}
                {criteria.subCriteria && criteria.subCriteria.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-2">Sub-criteria Breakdown:</h5>
                    <div className="space-y-1">
                      {criteria.subCriteria.map((sub) => (
                        <div key={sub.id} className="flex justify-between items-center text-sm">
                          <span className="text-gray-700">{sub.name} ({sub.weight}%)</span>
                          <span className="text-gray-500">{sub.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Scoring Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Scoring Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(SCORING_SCALE).map(([key, scale]) => (
              <div key={key} className="p-3 border rounded-lg">
                <div className="font-medium text-gray-900">{scale.label}</div>
                <div className="text-sm text-gray-600">{scale.min}-{scale.max} points</div>
                <div className="text-xs text-gray-500 mt-1">{scale.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
