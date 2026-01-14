import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoleculeStructure } from "@/components/MoleculeStructure";
import { ChevronDown, ChevronUp, Atom, FlaskConical } from "lucide-react";

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
  const [showStructure, setShowStructure] = useState(true);

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

  // Check Lipinski's Rule of Five
  const lipinskiViolations = [
    candidate.properties.molecularWeight > 500,
    candidate.properties.logP > 5,
    candidate.properties.hbd > 5,
    candidate.properties.hba > 10
  ].filter(Boolean).length;

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-primary" />
              <h3 className="text-lg font-bold text-foreground">
                Candidate {index + 1}: {candidate.name}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${getConfidenceColor(candidate.confidence)}`}>
                {(candidate.confidence * 100).toFixed(1)}% Confidence
              </Badge>
              <Badge 
                className={
                  lipinskiViolations === 0 
                    ? "bg-green-500/20 text-green-400 border-green-500/50" 
                    : lipinskiViolations <= 1 
                      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                      : "bg-red-500/20 text-red-400 border-red-500/50"
                }
              >
                Lipinski: {lipinskiViolations === 0 ? "Pass" : `${lipinskiViolations} Violation${lipinskiViolations > 1 ? 's' : ''}`}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getAffinityColor(candidate.bindingAffinity)}`}>
              {candidate.bindingAffinity.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">pIC50</div>
          </div>
        </div>

        {/* Molecular Structure */}
        <div className="border border-border rounded-lg overflow-hidden bg-secondary/20">
          <Button
            variant="ghost"
            size="sm"
            className="w-full flex items-center justify-between px-4 py-2 hover:bg-secondary/30"
            onClick={() => setShowStructure(!showStructure)}
          >
            <span className="flex items-center gap-2 text-sm font-medium">
              <Atom className="w-4 h-4 text-primary" />
              2D Molecular Structure
            </span>
            {showStructure ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          
          {showStructure && (
            <div className="p-4 flex justify-center animate-in fade-in duration-200">
              <MoleculeStructure 
                smiles={candidate.smiles} 
                width={280} 
                height={180}
              />
            </div>
          )}
        </div>

        {/* SMILES and Mechanism */}
        <div className="space-y-2">
          <div className="text-sm">
            <span className="text-muted-foreground">SMILES: </span>
            <code className="text-xs bg-secondary/50 px-2 py-1 rounded font-mono text-primary break-all">
              {candidate.smiles}
            </code>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Mechanism: </span>
            {candidate.mechanism}
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Molecular Weight</div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                {candidate.properties.molecularWeight.toFixed(2)} Da
              </span>
              {candidate.properties.molecularWeight > 500 && (
                <span className="text-xs text-red-400">(&gt;500)</span>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">LogP (Lipophilicity)</div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                {candidate.properties.logP.toFixed(2)}
              </span>
              {candidate.properties.logP > 5 && (
                <span className="text-xs text-red-400">(&gt;5)</span>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">H-Bond Donors</div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                {candidate.properties.hbd}
              </span>
              {candidate.properties.hbd > 5 && (
                <span className="text-xs text-red-400">(&gt;5)</span>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">H-Bond Acceptors</div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                {candidate.properties.hba}
              </span>
              {candidate.properties.hba > 10 && (
                <span className="text-xs text-red-400">(&gt;10)</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
