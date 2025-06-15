
import { AdvancedAnalytics } from "./AdvancedAnalytics";
import { Supplier } from "@/types/supplier";

interface EvaluationAnalyticsProps {
  suppliers: Supplier[];
}

export const EvaluationAnalytics = ({ suppliers }: EvaluationAnalyticsProps) => {
  return <AdvancedAnalytics suppliers={suppliers} />;
};
