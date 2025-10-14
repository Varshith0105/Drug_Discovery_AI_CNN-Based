import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProteinInput } from "@/components/ProteinInput";
import { DrugCandidate } from "@/components/DrugCandidate";
import { ProteinAnalysis } from "@/components/ProteinAnalysis";
import { Loader2, Sparkles, FlaskConical, Beaker } from "lucide-react";

const SAMPLE_SEQUENCE = "MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRVGDGTQDNLSGAEKAVQVKVKALPDAQFEVVHSLAKWKRQTLGQHDFSAGEGLYTHMKALRPDEDRLSPLHSVYVDQWDWERVMGDGERQFSTLKSTVEAIWAGIKATEAAVSEEFGLAPFLPDQIHFVHSQELLSRYPDLDAKGRERAIAKDLGAVFLVGIGGKLSDGHRHDVRAPDYDDWSTPSELGHAGLNGDILVWNPVLEDAFELSSMGIRVDADTLKHQLALTGDEDRLELEWHQALLRGEMPQTIGGGIGQSRLTMLLLQLPHIGQVQAGVWPAAVRESVPSLL";

const Index = () => {
  const [proteinSequence, setProteinSequence] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const loadSample = () => {
    setProteinSequence(SAMPLE_SEQUENCE);
    toast({
      title: "Sample Loaded",
      description: "Sample protein sequence loaded for testing",
    });
  };

  const analyzePr = async () => {
    if (!proteinSequence.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a protein sequence",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke('drug-discovery', {
        body: { proteinSequence }
      });

      if (error) throw error;

      setResults(data);
      toast({
        title: "Analysis Complete",
        description: `Found ${data.drugCandidates?.length || 0} potential drug candidates`,
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze protein sequence",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
              <FlaskConical className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Drug Discovery AI
              </h1>
              <p className="text-sm text-muted-foreground">
                GNN + Transformers + Cross Attention
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Input Section */}
        <div className="mb-8">
          <div className="bg-card border border-border rounded-lg p-6 shadow-card">
            <ProteinInput
              value={proteinSequence}
              onChange={setProteinSequence}
              disabled={isAnalyzing}
            />
            
            <div className="flex gap-3 mt-4">
              <Button
                onClick={analyzePr}
                disabled={isAnalyzing || !proteinSequence.trim()}
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing with AI Models...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Discover Potential Drugs
                  </>
                )}
              </Button>
              
              <Button
                onClick={loadSample}
                disabled={isAnalyzing}
                variant="outline"
                size="lg"
              >
                <Beaker className="mr-2 h-5 w-5" />
                Load Sample
              </Button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Protein Analysis */}
            {results.proteinAnalysis && (
              <ProteinAnalysis analysis={results.proteinAnalysis} />
            )}

            {/* Drug Candidates */}
            {results.drugCandidates && results.drugCandidates.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  Potential Drug Candidates
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {results.drugCandidates.map((candidate: any, index: number) => (
                    <DrugCandidate
                      key={index}
                      candidate={candidate}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {results.recommendations && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-bold text-foreground mb-3">
                  Development Recommendations
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {results.recommendations}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!results && !isAnalyzing && (
          <div className="text-center py-16">
            <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
              <FlaskConical className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Ready for Drug Discovery
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter a protein sequence above to discover potential drug candidates using our
              advanced multi-model AI architecture
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Powered by Advanced Deep Learning: GNN + Transformers + Cross Attention</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
