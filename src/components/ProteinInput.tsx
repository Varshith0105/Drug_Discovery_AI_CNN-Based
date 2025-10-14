import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ProteinInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const ProteinInput = ({ value, onChange, disabled }: ProteinInputProps) => {
  return (
    <div className="space-y-3">
      <Label htmlFor="protein-sequence" className="text-base font-semibold text-foreground">
        Protein Sequence Input
      </Label>
      <Textarea
        id="protein-sequence"
        placeholder="Enter protein sequence (e.g., MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRVGDGTQDNLSGAEKAVQVKVKALPDAQFEVVHSLAKWKRQTLGQHDFSAGEGLYTHMKALRPDEDRLSPLHSVYVDQWDWERVMGDGERQFSTLKSTVEAIWAGIKATEAAVSEEFGLAPFLPDQIHFVHSQELLSRYPDLDAKGRERAIAKDLGAVFLVGIGGKLSDGHRHDVRAPDYDDWSTPSELGHAGLNGDILVWNPVLEDAFELSSMGIRVDADTLKHQLALTGDEDRLELEWHQALLRGEMPQTIGGGIGQSRLTMLLLQLPHIGQVQAGVWPAAVRESVPSLL"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="min-h-[200px] font-mono text-sm bg-secondary/50 border-border focus:border-primary transition-all"
      />
      <p className="text-xs text-muted-foreground">
        Enter a valid protein amino acid sequence for drug discovery analysis
      </p>
    </div>
  );
};
