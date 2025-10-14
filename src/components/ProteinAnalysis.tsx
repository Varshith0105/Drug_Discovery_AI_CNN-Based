import { Card } from "@/components/ui/card";

interface ProteinAnalysisData {
  family: string;
  function: string;
  targetSite: string;
}

interface ProteinAnalysisProps {
  analysis: ProteinAnalysisData;
}

export const ProteinAnalysis = ({ analysis }: ProteinAnalysisProps) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/5 border-primary/30">
      <h2 className="text-xl font-bold text-foreground mb-4">Protein Analysis</h2>
      <div className="space-y-3">
        <div>
          <span className="text-sm font-semibold text-primary">Family: </span>
          <span className="text-sm text-foreground">{analysis.family}</span>
        </div>
        <div>
          <span className="text-sm font-semibold text-primary">Function: </span>
          <span className="text-sm text-foreground">{analysis.function}</span>
        </div>
        <div>
          <span className="text-sm font-semibold text-primary">Target Site: </span>
          <span className="text-sm text-foreground">{analysis.targetSite}</span>
        </div>
      </div>
    </Card>
  );
};
