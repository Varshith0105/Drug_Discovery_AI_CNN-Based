import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Cell
} from "recharts";
import { BarChart3, Target, TrendingUp } from "lucide-react";

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

interface DrugComparisonChartsProps {
  candidates: DrugCandidateData[];
}

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export const DrugComparisonCharts = ({ candidates }: DrugComparisonChartsProps) => {
  // Prepare data for binding affinity chart
  const affinityData = candidates.map((c, i) => ({
    name: `Candidate ${i + 1}`,
    fullName: c.name,
    affinity: c.bindingAffinity,
    confidence: c.confidence * 100
  }));

  // Prepare data for molecular properties comparison
  const propertiesData = candidates.map((c, i) => ({
    name: `C${i + 1}`,
    fullName: c.name,
    MW: Math.min(c.properties.molecularWeight / 100, 5), // Normalize to 0-5 scale
    LogP: Math.min(Math.max(c.properties.logP, 0), 5),
    HBD: c.properties.hbd,
    HBA: Math.min(c.properties.hba / 2, 5), // Normalize
    Affinity: c.bindingAffinity / 2 // Normalize to 0-5 scale
  }));

  // Prepare data for Lipinski's Rule of Five compliance
  const lipinskiData = candidates.map((c, i) => {
    const mwPass = c.properties.molecularWeight <= 500;
    const logPPass = c.properties.logP <= 5;
    const hbdPass = c.properties.hbd <= 5;
    const hbaPass = c.properties.hba <= 10;
    const violations = [mwPass, logPPass, hbdPass, hbaPass].filter(x => !x).length;
    
    return {
      name: `Candidate ${i + 1}`,
      fullName: c.name,
      violations,
      score: 4 - violations,
      mwPass,
      logPPass,
      hbdPass,
      hbaPass
    };
  });

  // Radar chart data
  const radarData = [
    { property: 'MW', fullName: 'Molecular Weight', ...Object.fromEntries(candidates.map((c, i) => [`C${i + 1}`, Math.min(c.properties.molecularWeight / 100, 5)])) },
    { property: 'LogP', fullName: 'Lipophilicity', ...Object.fromEntries(candidates.map((c, i) => [`C${i + 1}`, Math.min(Math.max(c.properties.logP + 1, 0), 5)])) },
    { property: 'HBD', fullName: 'H-Bond Donors', ...Object.fromEntries(candidates.map((c, i) => [`C${i + 1}`, c.properties.hbd])) },
    { property: 'HBA', fullName: 'H-Bond Acceptors', ...Object.fromEntries(candidates.map((c, i) => [`C${i + 1}`, Math.min(c.properties.hba / 2, 5)])) },
    { property: 'pIC50', fullName: 'Binding Affinity', ...Object.fromEntries(candidates.map((c, i) => [`C${i + 1}`, c.bindingAffinity / 2])) },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold text-foreground">{payload[0]?.payload?.fullName || label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs text-muted-foreground">
              <span style={{ color: entry.color }}>{entry.name}: </span>
              {entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/10 rounded-lg">
          <BarChart3 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Comparative Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Visual comparison of predicted drug candidates
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Binding Affinity & Confidence Chart */}
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h4 className="font-semibold text-foreground">Binding Affinity (pIC50) & Confidence</h4>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={affinityData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" domain={[0, 10]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="affinity" name="pIC50" radius={[0, 4, 4, 0]}>
                {affinityData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Radar Chart - Molecular Properties */}
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-primary" />
            <h4 className="font-semibold text-foreground">Molecular Property Profile</h4>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis 
                dataKey="property" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 5]} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }}
              />
              {candidates.map((_, i) => (
                <Radar
                  key={i}
                  name={`Candidate ${i + 1}`}
                  dataKey={`C${i + 1}`}
                  stroke={COLORS[i % COLORS.length]}
                  fill={COLORS[i % COLORS.length]}
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              ))}
              <Legend 
                wrapperStyle={{ fontSize: '11px' }}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Lipinski's Rule of Five Compliance */}
        <Card className="p-6 bg-card border-border md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-primary" />
            <h4 className="font-semibold text-foreground">Lipinski's Rule of Five Compliance</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {lipinskiData.map((drug, i) => (
              <div 
                key={i} 
                className="p-4 rounded-lg bg-secondary/30 border border-border"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-foreground">C{i + 1}</span>
                  <Badge 
                    className={
                      drug.violations === 0 
                        ? "bg-green-500/20 text-green-400 border-green-500/50" 
                        : drug.violations <= 1 
                          ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                          : "bg-red-500/20 text-red-400 border-red-500/50"
                    }
                  >
                    {drug.violations === 0 ? "Pass" : `${drug.violations} Violation${drug.violations > 1 ? 's' : ''}`}
                  </Badge>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">MW ≤ 500</span>
                    <span className={drug.mwPass ? "text-green-400" : "text-red-400"}>
                      {drug.mwPass ? "✓" : "✗"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">LogP ≤ 5</span>
                    <span className={drug.logPPass ? "text-green-400" : "text-red-400"}>
                      {drug.logPPass ? "✓" : "✗"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">HBD ≤ 5</span>
                    <span className={drug.hbdPass ? "text-green-400" : "text-red-400"}>
                      {drug.hbdPass ? "✓" : "✗"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">HBA ≤ 10</span>
                    <span className={drug.hbaPass ? "text-green-400" : "text-red-400"}>
                      {drug.hbaPass ? "✓" : "✗"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
