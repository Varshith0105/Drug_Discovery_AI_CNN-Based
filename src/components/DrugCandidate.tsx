import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DrugCandidateData {
  name: string;
  smiles: string;
  bindingAffinity: number;
  confidence: number;
  properties: {
    molecularWeight: number;
    logP: number;
    hbd: number;
    hba: number;
  };
  mechanism: string;
}

interface DrugCandidateProps {
  candidate: DrugCandidateData;
  index: number;
}

export const DrugCandidate = ({ candidate, index }: DrugCandidateProps) => {
  const getAffinityColor = (affinity: number) => {
    if (affinity >= 8) return "text-green-400";
    if (affinity >= 6.5) return "text-yellow-400";
    return "text-orange-400";
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "bg-green-500/20 text-green-400 border-green-500/50";
    if (confidence >= 0.8) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
    return "bg-orange-500/20 text-orange-400 border-orange-500/50";
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">
              Candidate {index + 1}: {candidate.name}
            </h3>
            <Badge className={`${getConfidenceColor(candidate.confidence)}`}>
              {(candidate.confidence * 100).toFixed(1)}% Confidence
            </Badge>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getAffinityColor(candidate.bindingAffinity)}`}>
              {candidate.bindingAffinity.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">Binding Affinity</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm">
            <span className="text-muted-foreground">SMILES: </span>
            <code className="text-xs bg-secondary/50 px-2 py-1 rounded font-mono text-primary">
              {candidate.smiles}
            </code>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Mechanism: </span>
            {candidate.mechanism}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
          <div>
            <div className="text-xs text-muted-foreground">Molecular Weight</div>
            <div className="text-sm font-semibold text-foreground">{candidate.properties.molecularWeight.toFixed(2)} Da</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">LogP</div>
            <div className="text-sm font-semibold text-foreground">{candidate.properties.logP.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">H-Bond Donors</div>
            <div className="text-sm font-semibold text-foreground">{candidate.properties.hbd}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">H-Bond Acceptors</div>
            <div className="text-sm font-semibold text-foreground">{candidate.properties.hba}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
