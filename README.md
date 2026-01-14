🧬 AI-Powered Drug Discovery Platform
Drug–Target Interaction (DTI) Prediction System

An advanced full-stack AI application that predicts potential drug candidates for a given protein sequence using a deep learning–based Drug–Target Interaction (DTI) model.
The platform integrates modern frontend engineering, serverless backend APIs, and explainable AI outputs, making it suitable for research, academic, and portfolio demonstration.

📌 Project Overview

Input: Protein sequence (FASTA / raw amino acid sequence)

Output:

Predicted drug candidates

Prediction score

Binding affinity classification

Confidence probability

Model explainability

Comparative graphs

Downloadable report

Architecture: Frontend (React + Tailwind) + Serverless Backend + ML Model

Deployment Ready: GitHub + Vercel / Netlify

🚀 Key Features
🔬 AI / ML Capabilities

Deep Learning–based Drug–Target Interaction prediction

Sequence-based inference (no manual feature engineering required)

Multiple output metrics:

Prediction score

Confidence %

Affinity classification

Explainable AI insights

Drug comparison visualizations

🖥️ Frontend Capabilities

Advanced dashboard-style UI

Protein sequence validation

Real-time inference feedback

Interactive charts & metrics

Molecular structure visualization

Responsive & mobile-friendly design

🔐 Backend & Platform

Serverless function for inference

Secure environment variables

Modular architecture for scalability

Ready for role-based authentication

🧠 Tech Stack
Frontend

React + TypeScript

Vite

Tailwind CSS

ShadCN UI components

Charting libraries (Recharts / Chart.js)

Responsive hooks & utility helpers

Backend

Supabase Edge Functions

Serverless inference endpoint

REST-based communication

Secure .env configuration

AI / ML

Deep Learning DTI model

Protein sequence embeddings

Neural network–based interaction prediction

Post-processing for interpretability

📂 Project Structure (Explained)
public/
│
src/
├── components/
│   └── ui/
│       ├── DrugCandidate.tsx          # Displays predicted drug details
│       ├── DrugComparisonCharts.tsx   # Comparison & confidence graphs
│       ├── MetricsDisplay.tsx         # Prediction metrics & scores
│       ├── ModelArchitecture.tsx      # DL model visualization
│       ├── MoleculeStructure.tsx      # Molecular structure UI
│       ├── ProteinAnalysis.tsx        # Sequence analysis insights
│       └── ProteinInput.tsx           # Protein sequence input form
│
├── hooks/
│   ├── use-mobile.tsx                 # Responsive UI detection
│   └── use-toast.ts                   # Notification handling
│
├── integrations/
│   └── supabase/
│       ├── client.ts                  # Supabase client setup
│       └── types.ts                   # Typed Supabase schema
│
├── lib/
│   └── utils.ts                       # Shared helper utilities
│
├── pages/
│   ├── Index.tsx                      # Main dashboard page
│   └── NotFound.tsx                   # 404 fallback page
│
├── App.tsx                            # App routing & layout
├── main.tsx                           # React entry point
├── index.css                          # Global styles
├── App.css                            # App-specific styles
└── vite-env.d.ts
│
supabase/
├── functions/
│   └── drug-discovery/                # Serverless ML inference API
│       └── index.ts
├── config.toml
│
.env                                   # Environment variables
tailwind.config.ts                     # Tailwind configuration
vite.config.ts                         # Vite configuration
tsconfig.json                          # TypeScript config
package.json
README.md

🔬 Drug Discovery Model – Technical Explanation
🔹 Problem Statement

Predict drug–target interactions using protein sequence information, enabling early-stage identification of potential drug candidates.

🔹 Model Input

Protein sequence (FASTA or raw amino acid string)

Sequence length normalization

Tokenization & embedding

🔹 Model Architecture (High-Level)
Protein Sequence
      ↓
Sequence Encoding (Embeddings)
      ↓
Deep Neural Network (DTI Model)
      ↓
Interaction Probability
      ↓
Post-Processing & Ranking


Core Components:

Embedding layer for protein sequences

Deep neural layers (CNN / RNN / Transformer-based)

Fully connected prediction head

Sigmoid / Softmax activation for confidence scoring

🔹 Model Output

Prediction Score (0–1)

Classification (High / Medium / Low Affinity)

Confidence Probability (%)

Ranked list of drug candidates

Explainability metrics (attention / importance scores)

🔹 Explainable AI

Feature contribution analysis

Attention-based residue importance

Visualization-ready outputs for frontend charts

🔌 API Workflow
Frontend (ProteinInput.tsx)
        ↓
Supabase Edge Function
        ↓
DTI Model Inference
        ↓
JSON Response
        ↓
UI Visualization & Report Generation

Sample API Response
{
  "drug_candidates": ["Remdesivir", "Favipiravir"],
  "prediction_score": 0.87,
  "classification": "High Affinity",
  "confidence": 92.4,
  "explanation": "Strong interaction observed in binding residues",
  "graphs": {
    "binding_scores": [0.65, 0.72, 0.87]
  }
}

⚙️ Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/your-username/drug-discovery-platform.git
cd drug-discovery-platform

2️⃣ Install Dependencies
npm install

3️⃣ Environment Setup

Create .env file:

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

4️⃣ Run Development Server
npm run dev

🌐 Deployment

Frontend: Vercel / Netlify

Backend: Supabase Edge Functions

Version Control: GitHub

🎯 Resume & Research Impact

✔ Full-stack AI system
✔ Real-world drug discovery use case
✔ Explainable deep learning
✔ Serverless cloud architecture
✔ Scalable & production-ready design

🔮 Future Enhancements

Multi-protein batch inference

3D molecular docking visualization

SHAP-based explanations

OAuth authentication

Model versioning & monitoring

CI/CD integration

👨‍💻 Author's

Varshith Julakanti
AI / ML Engineer | Drug Discovery | Deep Learning
Likita Reddy Bojja
AI / ML Engineer | Drug Discovery | Deep Learning
Bala Arun Polishetty
AI / ML Engineer | Drug Discovery | Deep Learning
