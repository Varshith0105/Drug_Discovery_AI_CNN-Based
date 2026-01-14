import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProteinInput } from "@/components/ProteinInput";
import { DrugCandidate } from "@/components/DrugCandidate";
import { ProteinAnalysis } from "@/components/ProteinAnalysis";
import { ModelArchitecture } from "@/components/ModelArchitecture";
import { MetricsDisplay } from "@/components/MetricsDisplay";
import { DrugComparisonCharts } from "@/components/DrugComparisonCharts";
import { Loader2, Sparkles, FlaskConical, Beaker, Brain, Dna, Microscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const SAMPLE_SEQUENCE = "MRPSGTAGAALLALLAALCPASRALEEKKVCQGTSNKLTQLGTFEDHFLSLQRMFNNCEVVLGNLEITYVQRNYDLSFLKTIQEVAGYVLIALNTVERIPLENLQIIRGNMYYENSYALAVLSNYDANKTGLKELPMRNLQEILHGAVRFSNNPALCNVESIQWRDIVSSDFLSNMSMDFQNHLGSCQKCDPSCPNGSCWGAGEENCQKLTKIICAQQCSGRCRGKSPSDCCHNQCAAGCTGPRESDCLVCRKFRDEATCKDTCPPLMLYNPTTYQMDVNPEGKYSFGATCVKKCPRNYVVTDHGSCVRACGADSYEMEEDGVRKCKKCEGPCRKVCNGIGIGEFKDSLSINATNIKHFKNCTSISGDLHILPVAFRGDSFTHTPPLDPQELDILKTVKEITGFLLIQAWPENRTDLHAFENLEIIRGRTKQHGQFSLAVVSLNITSLGLRSLKEISDGDVIISGNKNLCYANTINWKKLFGTSGQKTKIISNRGENSCKATGQVCHALCSPEGCWGPEPRDCVSCRNVSRGRECVDKCNLLEGEPREFVENSECIQCHPECLPQAMNITCTGRGPDNCIQCAHYIDGPHCVKTCPAGVMGENNTLVWKYADAGHVCHLCHPNCTYGCTGPGLEGCPTNGPKIPSIATGMVGALLLLLVVALGIGLFMRRRHIVRKRTLRRLLQERELVEPLTPSGEAPNQALLRILKETEFKKIKVLGSGAFGTVYKGLWIPEGEKVKIPVAIKELREATSPKANKEILDEAYVMASVDNPHVCRLLGICLTSTVQLITQLMPFGCLLDYVREHKDNIGSQYLLNWCVQIAKGMNYLEDRRLVHRDLAARNVLVKTPQHVKITDFGLAKLLGAEEKEYHAEGGKVPIKWMALESILHRIYTHQSDVWSYGVTVWELMTFGSKPYDGIPASEISSILEKGERLPQPPICTIDVYMIMVKCWMIDADSRPKFRELIIEFSKMARDPQRYLVIQGDERMHLPSPTDSNFYRALMDEEDMDDVVDADEYLIPQQGFFSSPSTSRTPLLSSLSATSNNSTVACIDRNGLQSCPIKEDSFLQRYSSDPTGALTEDSIDDTFLPVPEYINQSVPKRPAGSVQNPVYHNQPLNPAPSRDPHYQDPHSTAVGNPEYLNTVQPTCVNSTFDSPAHWAQKGSHQISLDNPDYQQDFFPKEAKPNGIFKGSTAENAEYLRVAPQSSEFIGA";

const Index = () => {
  const [proteinSequence, setProteinSequence] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const loadSample = () => {
    setProteinSequence(SAMPLE_SEQUENCE);
    toast({
      title: "EGFR Protein Loaded",
      description: "Sample EGFR (CHEMBL203) protein sequence loaded for testing",
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg shadow-glow">
                <FlaskConical className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Drug Discovery AI
                </h1>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Brain className="w-3 h-3" />
                  DeepDTI: CNN + Transformers + Cross-Attention + CatBoost
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Dna className="w-3 h-3 mr-1" />
                EGFR Target
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Microscope className="w-3 h-3 mr-1" />
                ChEMBL Data
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Model Architecture Section */}
        <div className="mb-8">
          <ModelArchitecture />
        </div>

        {/* Metrics Section */}
        <div className="mb-8">
          <MetricsDisplay />
        </div>

        {/* Input Section */}
        <div className="mb-8">
          <div className="bg-card border border-border rounded-lg p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Dna className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Protein Sequence Input</h2>
            </div>
            
            <ProteinInput
              value={proteinSequence}
              onChange={setProteinSequence}
              disabled={isAnalyzing}
            />
            
            <div className="flex gap-3 mt-4">
              <Button
                onClick={analyzePr}
                disabled={isAnalyzing || !proteinSequence.trim()}
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all shadow-glow"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Running DeepDTI Pipeline...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Predict Drug Candidates
                  </>
                )}
              </Button>
              
              <Button
                onClick={loadSample}
                disabled={isAnalyzing}
                variant="outline"
                size="lg"
                className="hover:border-primary/50"
              >
                <Beaker className="mr-2 h-5 w-5" />
                Load EGFR Sample
              </Button>
            </div>
            
            {proteinSequence && (
              <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                <span>Sequence Length: <strong className="text-foreground">{proteinSequence.length}</strong> amino acids</span>
                <span>|</span>
                <span>Encoding: <strong className="text-foreground">Character-level Tokenization</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Protein Analysis */}
            {results.proteinAnalysis && (
              <ProteinAnalysis analysis={results.proteinAnalysis} />
            )}

            {/* Comparison Charts */}
            {results.drugCandidates && results.drugCandidates.length > 0 && (
              <DrugComparisonCharts candidates={results.drugCandidates} />
            )}

            {/* Drug Candidates */}
            {results.drugCandidates && results.drugCandidates.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  Predicted Drug Candidates
                  <Badge className="ml-2 bg-primary/20 text-primary border-primary/50">
                    {results.drugCandidates.length} Found
                  </Badge>
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
                <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
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
            <div className="inline-block p-4 bg-gradient-to-br from-primary/20 to-accent/10 rounded-full mb-4 shadow-glow">
              <FlaskConical className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Ready for Drug-Target Interaction Prediction
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              Enter a protein sequence to predict potential drug candidates using our
              DeepDTI hybrid architecture
            </p>
            <div className="flex justify-center gap-2 flex-wrap">
              <Badge variant="outline">Transformer Encoder</Badge>
              <Badge variant="outline">CNN Feature Extraction</Badge>
              <Badge variant="outline">Cross-Attention Fusion</Badge>
              <Badge variant="outline">CatBoost Classifier</Badge>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              DeepDTI: Deep Learning for Drug-Target Interaction Prediction
            </p>
            <div className="flex gap-4">
              <span>PyTorch</span>
              <span>•</span>
              <span>RDKit</span>
              <span>•</span>
              <span>CatBoost</span>
              <span>•</span>
              <span>ChEMBL</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
