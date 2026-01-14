import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Cpu, 
  Layers, 
  GitBranch, 
  Zap, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp,
  Binary,
  Brain,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LayerInfo {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  details: string[];
  specs: { label: string; value: string }[];
  color: string;
}

const architectureLayers: LayerInfo[] = [
  {
    id: "drug-encoder",
    name: "Drug SMILES Encoder",
    icon: <Binary className="w-5 h-5" />,
    description: "Character-level tokenization of SMILES strings with Transformer encoding",
    details: [
      "Character Tokenizer (max_len=100)",
      "Embedding Layer (vocab → 128 dim)",
      "Transformer Encoder (2 layers, 4 heads)",
      "Dropout: 0.1"
    ],
    specs: [
      { label: "Input", value: "SMILES String" },
      { label: "Embedding Dim", value: "128" },
      { label: "Attention Heads", value: "4" },
      { label: "Layers", value: "2" }
    ],
    color: "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30"
  },
  {
    id: "protein-encoder",
    name: "Protein Sequence Encoder",
    icon: <Layers className="w-5 h-5" />,
    description: "CNN + Transformer hybrid for protein sequence processing",
    details: [
      "Character Tokenizer (max_len=800)",
      "Embedding Layer (vocab → 128 dim)",
      "Conv1D (kernel=7, padding=3) + ReLU",
      "MaxPool1D (factor=2)",
      "Transformer Encoder (2 layers, 4 heads)"
    ],
    specs: [
      { label: "Input", value: "Protein Sequence" },
      { label: "CNN Kernel", value: "7" },
      { label: "Pooling", value: "MaxPool 2x" },
      { label: "Output Dim", value: "128" }
    ],
    color: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30"
  },
  {
    id: "cross-attention",
    name: "Cross-Attention Fusion",
    icon: <GitBranch className="w-5 h-5" />,
    description: "Multi-head attention between drug and protein representations",
    details: [
      "Query: Drug Transformer output",
      "Key/Value: Protein CNN+Transformer output",
      "Multi-Head Attention (4 heads)",
      "Mean pooling over sequence dimension"
    ],
    specs: [
      { label: "Mechanism", value: "Scaled Dot-Product" },
      { label: "Heads", value: "4" },
      { label: "Output", value: "128-dim vector" },
      { label: "Pooling", value: "Mean" }
    ],
    color: "from-violet-500/20 to-violet-600/10 border-violet-500/30"
  },
  {
    id: "fingerprints",
    name: "Morgan Fingerprints",
    icon: <Cpu className="w-5 h-5" />,
    description: "High-resolution molecular fingerprints for structural features",
    details: [
      "RDKit Morgan Fingerprint Generator",
      "Radius: 2 (captures local environment)",
      "Fingerprint Size: 2048 bits",
      "Concatenated with DL embeddings"
    ],
    specs: [
      { label: "Type", value: "Morgan (ECFP4)" },
      { label: "Radius", value: "2" },
      { label: "Bits", value: "2048" },
      { label: "Library", value: "RDKit" }
    ],
    color: "from-amber-500/20 to-amber-600/10 border-amber-500/30"
  },
  {
    id: "catboost",
    name: "CatBoost Classifier",
    icon: <Zap className="w-5 h-5" />,
    description: "Gradient boosting on hybrid features (DL embeddings + fingerprints)",
    details: [
      "Input: 128-dim DL + 2048-bit FP = 2176 features",
      "Iterations: 2000",
      "Learning Rate: 0.03",
      "Max Depth: 6",
      "Loss: LogLoss, Metric: Accuracy"
    ],
    specs: [
      { label: "Iterations", value: "2000" },
      { label: "Learning Rate", value: "0.03" },
      { label: "Depth", value: "6" },
      { label: "GPU", value: "Enabled" }
    ],
    color: "from-rose-500/20 to-rose-600/10 border-rose-500/30"
  },
  {
    id: "output",
    name: "Prediction Output",
    icon: <Target className="w-5 h-5" />,
    description: "Binary classification with probability scores",
    details: [
      "Active (IC50 < 100nM): Class 1",
      "Inactive (IC50 > 10,000nM): Class 0",
      "Probability via predict_proba()",
      "Threshold: 0.5 for classification"
    ],
    specs: [
      { label: "Task", value: "Binary Classification" },
      { label: "Metric", value: "AUC, F1, Accuracy" },
      { label: "Active Threshold", value: "< 100nM" },
      { label: "Inactive Threshold", value: "> 10μM" }
    ],
    color: "from-primary/20 to-accent/10 border-primary/30"
  }
];

interface ArchitectureLayerProps {
  layer: LayerInfo;
  isExpanded: boolean;
  onToggle: () => void;
  isLast: boolean;
}

const ArchitectureLayer = ({ layer, isExpanded, onToggle, isLast }: ArchitectureLayerProps) => {
  return (
    <div className="relative">
      <Card 
        className={cn(
          "p-4 cursor-pointer transition-all duration-300 bg-gradient-to-br",
          layer.color,
          isExpanded ? "ring-2 ring-primary/50" : "hover:ring-1 hover:ring-primary/30"
        )}
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-background/50 rounded-lg">
              {layer.icon}
            </div>
            <div>
              <h4 className="font-semibold text-foreground">{layer.name}</h4>
              <p className="text-xs text-muted-foreground">{layer.description}</p>
            </div>
          </div>
          <div className="text-muted-foreground">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border/50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-semibold text-foreground mb-2">Architecture Details</h5>
                <ul className="space-y-1">
                  {layer.details.map((detail, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-semibold text-foreground mb-2">Specifications</h5>
                <div className="grid grid-cols-2 gap-2">
                  {layer.specs.map((spec, i) => (
                    <div key={i} className="bg-background/30 rounded px-2 py-1">
                      <div className="text-[10px] text-muted-foreground">{spec.label}</div>
                      <div className="text-xs font-semibold text-foreground">{spec.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
      
      {!isLast && (
        <div className="flex justify-center py-2">
          <ArrowRight className="w-5 h-5 text-primary/50 rotate-90" />
        </div>
      )}
    </div>
  );
};

export const ModelArchitecture = () => {
  const [expandedLayer, setExpandedLayer] = useState<string | null>(null);
  const [showArchitecture, setShowArchitecture] = useState(false);

  return (
    <Card className="p-6 bg-card border-border">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setShowArchitecture(!showArchitecture)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
            <Brain className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">DeepDTI Model Architecture</h3>
            <p className="text-sm text-muted-foreground">
              CNN + Transformers + Cross-Attention + CatBoost
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex gap-2">
            <Badge variant="outline" className="text-xs">PyTorch</Badge>
            <Badge variant="outline" className="text-xs">RDKit</Badge>
            <Badge variant="outline" className="text-xs">CatBoost</Badge>
          </div>
          {showArchitecture ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </div>

      {showArchitecture && (
        <div className="mt-6 space-y-0 animate-in fade-in slide-in-from-top-4 duration-300">
          {/* Data Flow Diagram */}
          <div className="mb-6 p-4 bg-secondary/30 rounded-lg">
            <h4 className="text-sm font-semibold text-foreground mb-3">Data Flow Overview</h4>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">SMILES</Badge>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">Transformer</Badge>
              <span className="text-muted-foreground mx-2">+</span>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">Protein</Badge>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">CNN→Transformer</Badge>
              <ArrowRight className="w-4 h-4 text-muted-foreground hidden md:block" />
              <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/50">Cross-Attn</Badge>
              <span className="text-muted-foreground mx-2">⊕</span>
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50">Fingerprints</Badge>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/50">CatBoost</Badge>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <Badge className="bg-primary/20 text-primary border-primary/50">Prediction</Badge>
            </div>
          </div>

          {/* Interactive Layers */}
          <div className="space-y-0">
            {architectureLayers.map((layer, index) => (
              <ArchitectureLayer
                key={layer.id}
                layer={layer}
                isExpanded={expandedLayer === layer.id}
                onToggle={() => setExpandedLayer(expandedLayer === layer.id ? null : layer.id)}
                isLast={index === architectureLayers.length - 1}
              />
            ))}
          </div>

          {/* Training Info */}
          <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Training Configuration
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <div className="text-muted-foreground">Target</div>
                <div className="font-semibold text-foreground">EGFR (CHEMBL203)</div>
              </div>
              <div>
                <div className="text-muted-foreground">Dataset</div>
                <div className="font-semibold text-foreground">ChEMBL (Balanced)</div>
              </div>
              <div>
                <div className="text-muted-foreground">DL Epochs</div>
                <div className="font-semibold text-foreground">30</div>
              </div>
              <div>
                <div className="text-muted-foreground">Optimizer</div>
                <div className="font-semibold text-foreground">Adam (lr=0.0005)</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
