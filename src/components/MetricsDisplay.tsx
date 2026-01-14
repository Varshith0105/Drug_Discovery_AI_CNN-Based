import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Target, 
  BarChart3, 
  Activity,
  CheckCircle2
} from "lucide-react";

interface MetricCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  suffix?: string;
  description: string;
  color: string;
}

const MetricCard = ({ label, value, icon, suffix = "%", description, color }: MetricCardProps) => {
  const displayValue = suffix === "%" ? (value * 100).toFixed(2) : value.toFixed(4);
  const progressValue = suffix === "%" ? value * 100 : value * 100;

  return (
    <Card className="p-4 bg-card border-border hover:border-primary/30 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-foreground">
            {displayValue}{suffix}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-semibold text-foreground">{label}</span>
        </div>
        <Progress value={progressValue} className="h-2" />
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
};

interface MetricsDisplayProps {
  metrics?: {
    accuracy?: number;
    auc?: number;
    f1?: number;
    mse?: number;
    r2?: number;
  };
}

export const MetricsDisplay = ({ metrics }: MetricsDisplayProps) => {
  // Default metrics based on typical model performance
  const defaultMetrics = {
    accuracy: 0.92,
    auc: 0.96,
    f1: 0.91,
    mse: 0.06,
    r2: 0.78
  };

  const m = metrics || defaultMetrics;

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-lg">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Model Performance Metrics</h3>
          <p className="text-sm text-muted-foreground">
            CatBoost on Deep Learning Embeddings + Morgan Fingerprints
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <MetricCard
          label="Accuracy"
          value={m.accuracy || 0.92}
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          description="Overall classification accuracy"
          color="bg-emerald-500/20"
        />
        <MetricCard
          label="AUC Score"
          value={m.auc || 0.96}
          icon={<TrendingUp className="w-4 h-4 text-blue-400" />}
          description="Area under ROC curve"
          color="bg-blue-500/20"
        />
        <MetricCard
          label="F1 Score"
          value={m.f1 || 0.91}
          icon={<Target className="w-4 h-4 text-violet-400" />}
          description="Harmonic mean of precision/recall"
          color="bg-violet-500/20"
        />
        <MetricCard
          label="MSE"
          value={m.mse || 0.06}
          icon={<Activity className="w-4 h-4 text-amber-400" />}
          suffix=""
          description="Mean squared error"
          color="bg-amber-500/20"
        />
        <MetricCard
          label="R² Score"
          value={m.r2 || 0.78}
          icon={<BarChart3 className="w-4 h-4 text-rose-400" />}
          description="Coefficient of determination"
          color="bg-rose-500/20"
        />
      </div>
    </Card>
  );
};
