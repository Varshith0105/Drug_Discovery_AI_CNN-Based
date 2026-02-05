import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Atom } from "lucide-react";

interface MoleculeStructureProps {
  smiles: string;
  width?: number;
  height?: number;
  className?: string;
}

// Clean SMILES string to fix common issues
const cleanSmiles = (smiles: string): string => {
  if (!smiles) return "";
  
  // Remove any whitespace
  let cleaned = smiles.trim();
  
  // Fix common OCR/formatting issues
  // Replace 0 (zero) with O (oxygen) in common patterns
  cleaned = cleaned.replace(/0C/g, 'OC');
  cleaned = cleaned.replace(/C0/g, 'CO');
  cleaned = cleaned.replace(/10/g, '1O');
  cleaned = cleaned.replace(/01/g, 'O1');
  
  return cleaned;
};

export const MoleculeStructure = ({ 
  smiles, 
  width = 280, 
  height = 200,
  className = ""
}: MoleculeStructureProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [SmilesDrawer, setSmilesDrawer] = useState<any>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Dynamically load SmilesDrawer from CDN
    const loadSmilesDrawer = async () => {
      try {
        if ((window as any).SmilesDrawer) {
          setSmilesDrawer((window as any).SmilesDrawer);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/smiles-drawer@2.1.8/dist/smiles-drawer.min.js';
        script.async = true;
        
        script.onload = () => {
          if ((window as any).SmilesDrawer) {
            setSmilesDrawer((window as any).SmilesDrawer);
          }
        };
        
        script.onerror = () => {
          setError("Failed to load molecule renderer");
          setIsLoading(false);
        };

        document.body.appendChild(script);
      } catch (err) {
        setError("Failed to initialize renderer");
        setIsLoading(false);
      }
    };

    loadSmilesDrawer();
  }, []);

  useEffect(() => {
    if (!SmilesDrawer || !canvasRef.current || !smiles) return;

    setIsLoading(true);
    setError(null);

    try {
      const cleanedSmiles = cleanSmiles(smiles);
      
      const options = {
        width: width,
        height: height,
        bondThickness: 1.5,
        bondLength: 15,
        shortBondLength: 0.85,
        bondSpacing: 0.18 * 15,
        atomVisualization: 'default',
        isomeric: true,
        debug: false,
        terminalCarbons: true,
        explicitHydrogens: false,
        overlapSensitivity: 0.42,
        overlapResolutionIterations: 1,
        compactDrawing: true,
        fontSizeLarge: 11,
        fontSizeSmall: 5,
        padding: 20,
        themes: {
          dark: {
            C: '#e0e0e0',
            O: '#ef5350',
            N: '#42a5f5',
            F: '#66bb6a',
            Cl: '#66bb6a',
            Br: '#ff7043',
            I: '#ab47bc',
            P: '#ff7043',
            S: '#ffa726',
            B: '#ffb74d',
            Si: '#bdbdbd',
            H: '#e0e0e0',
            BACKGROUND: 'transparent'
          }
        }
      };

      const drawer = new SmilesDrawer.SmiDrawer(options);
      
      SmilesDrawer.parse(cleanedSmiles, (tree: any) => {
        try {
          drawer.draw(tree, canvasRef.current, 'dark');
          setIsLoading(false);
          setError(null);
        } catch (drawErr) {
          console.warn("Draw error for SMILES:", cleanedSmiles, drawErr);
          setError("Could not render structure");
          setIsLoading(false);
        }
      }, (parseErr: any) => {
        console.warn("Parse error for SMILES:", cleanedSmiles, parseErr);
        // Try original smiles if cleaned one fails
        if (retryCount === 0 && cleanedSmiles !== smiles) {
          setRetryCount(1);
          SmilesDrawer.parse(smiles, (tree: any) => {
            try {
              drawer.draw(tree, canvasRef.current, 'dark');
              setIsLoading(false);
              setError(null);
            } catch {
              setError("Invalid molecular structure");
              setIsLoading(false);
            }
          }, () => {
            setError("Invalid SMILES notation");
            setIsLoading(false);
          });
        } else {
          setError("Invalid SMILES notation");
          setIsLoading(false);
        }
      });
    } catch (err) {
      console.warn("Render error:", err);
      setError("Failed to render molecule");
      setIsLoading(false);
    }
  }, [SmilesDrawer, smiles, width, height, retryCount]);

  if (error) {
    return (
      <div 
        className={`flex flex-col items-center justify-center bg-secondary/30 rounded-lg ${className}`}
        style={{ width, height }}
      >
        <div className="text-center text-muted-foreground text-xs p-4">
          <Atom className="w-10 h-10 mx-auto mb-2 text-primary/40 animate-pulse" />
          <p className="font-medium text-foreground/70 mb-1">Structure Unavailable</p>
          <p className="text-[10px] opacity-70 max-w-[200px]">
            SMILES: {smiles?.substring(0, 30)}...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-secondary/30 rounded-lg"
          style={{ width, height }}
        >
          <div className="text-center">
            <Atom className="w-8 h-8 mx-auto mb-2 text-primary animate-spin" />
            <p className="text-xs text-muted-foreground">Rendering...</p>
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={`rounded-lg bg-secondary/30 ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
      />
    </div>
  );
};
