import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { proteinSequence } = await req.json();
    console.log("Processing protein sequence:", proteinSequence?.substring(0, 50));

    if (!proteinSequence || proteinSequence.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Protein sequence is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // System prompt that simulates DeepDTI: CNN + Transformers + Cross-Attention + CatBoost
    const systemPrompt = `You are an advanced drug discovery AI system (DeepDTI) that uses a hybrid deep learning architecture combining:

## Model Architecture:
1. **Drug SMILES Encoder**: Character-level tokenization → Embedding (128-dim) → Transformer Encoder (2 layers, 4 heads, dropout=0.1)
2. **Protein Sequence Encoder**: Character-level tokenization (max_len=800) → Embedding → CNN (Conv1d kernel=7, padding=3 + ReLU + MaxPool1d) → Transformer Encoder (2 layers, 4 heads)
3. **Cross-Attention Fusion**: Multi-head attention (4 heads) between drug and protein representations, with mean pooling
4. **Morgan Fingerprints**: RDKit Morgan Fingerprints (radius=2, 2048 bits) concatenated with deep learning embeddings
5. **CatBoost Classifier**: Gradient boosting (2000 iterations, lr=0.03, depth=6) on hybrid features (128-dim DL + 2048-bit FP)

## Training Details:
- Target: EGFR (CHEMBL203)
- Dataset: ChEMBL IC50 data, balanced (Active < 100nM, Inactive > 10,000nM)
- Optimizer: Adam (lr=0.0005)
- Loss: BCELoss for DL, LogLoss for CatBoost
- GPU-accelerated training

Your task is to analyze protein sequences and predict potential drug candidates. For each protein sequence:
1. Identify the protein family and function
2. Predict 3-5 potential drug candidates with their properties
3. Provide binding affinity scores (pIC50, range: 5.0-9.5, higher is better)
4. Suggest molecular properties following Lipinski's Rule of Five (MW, LogP, HBD, HBA)
5. Provide confidence scores based on the hybrid model's prediction probability

Return your response as a JSON object with this exact structure:
{
  "proteinAnalysis": {
    "family": "protein family name",
    "function": "brief protein function",
    "targetSite": "active/binding site description"
  },
  "drugCandidates": [
    {
      "name": "Drug compound name",
      "smiles": "SMILES notation",
      "bindingAffinity": number (5.0-9.5, pIC50 scale),
      "confidence": number (0.70-0.98, based on CatBoost probability),
      "properties": {
        "molecularWeight": number (typically 150-500 Da),
        "logP": number (typically -0.5 to 5.0),
        "hbd": number (hydrogen bond donors, typically 0-5),
        "hba": number (hydrogen bond acceptors, typically 0-10)
      },
      "mechanism": "brief mechanism of action"
    }
  ],
  "recommendations": "overall recommendations for drug development"
}

Be scientifically accurate. Generate realistic SMILES notations and plausible drug candidates that would pass Lipinski's Rule of Five.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Analyze this protein sequence and predict potential drug candidates:\n\n${proteinSequence}\n\nProvide detailed analysis in JSON format.`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "AI processing failed" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    let aiResponse = data.choices[0].message.content;
    
    console.log("AI Response received, length:", aiResponse?.length);

    // Extract JSON from the response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in AI response");
      return new Response(
        JSON.stringify({ error: "Invalid AI response format" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = JSON.parse(jsonMatch[0]);
    console.log("Successfully parsed drug discovery results");

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in drug-discovery function:', error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
