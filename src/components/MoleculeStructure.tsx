import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

interface MoleculeStructureProps {
  smiles: string;
  width?: number;
  height?: number;
  className?: string;
}

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
      
      SmilesDrawer.parse(smiles, (tree: any) => {
        drawer.draw(tree, canvasRef.current, 'dark');
        setIsLoading(false);
      }, () => {
        setError("Invalid SMILES notation");
        setIsLoading(false);
      });
    } catch (err) {
      setError("Failed to render molecule");
      setIsLoading(false);
    }
  }, [SmilesDrawer, smiles, width, height]);

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-secondary/30 rounded-lg ${className}`}
        style={{ width, height }}
      >
        <div className="text-center text-muted-foreground text-xs">
          <AlertCircle className="w-6 h-6 mx-auto mb-1 text-destructive/50" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <Skeleton 
          className="absolute inset-0 rounded-lg" 
          style={{ width, height }}
        />
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
