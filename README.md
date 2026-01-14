# 🧬 AI-Powered Drug Discovery Platform  
## Drug–Target Interaction (DTI) Prediction System

<p align="center">
  <img src="https://img.shields.io/badge/AI-Drug%20Discovery-blueviolet?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Deep%20Learning-DTI-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Tailwind-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Backend-Serverless-orange?style=for-the-badge" />
</p>

---

## 🔍 Overview

An **advanced full-stack AI web application** that predicts **potential drug candidates** for a given **protein sequence** using a **deep learning–based Drug–Target Interaction (DTI) model**.

This platform combines **AI research**, **modern frontend engineering**, and **serverless backend infrastructure** to deliver **explainable predictions**, **interactive visualizations**, and a **production-ready dashboard** suitable for **researchers, students, and recruiters**.

---

## ✨ Key Highlights

- Protein sequence–based drug discovery
- Deep Learning–powered DTI prediction
- Explainable AI insights
- Advanced interactive UI dashboard
- Serverless backend architecture
- Resume & research-grade project

---

## 🧠 Problem Statement

Traditional drug discovery is:
- ⏳ Time-consuming  
- 💰 Expensive  
- 🔬 Experiment-heavy  

This system **accelerates early-stage drug discovery** by using **AI to predict protein–drug interactions**, helping researchers **prioritize promising drug candidates faster and more efficiently**.

---

## 🔬 Drug–Target Interaction (DTI) Model

### 🧪 Input
- Protein sequence (FASTA or raw amino acid sequence)

### 🧠 Model Pipeline

Protein Sequence
↓
Sequence Encoding / Embeddings
↓
Deep Learning Network
↓
Interaction Probability
↓
Affinity Classification + Confidence


### 📤 Output
- Prediction score  
- Binding affinity classification  
- Confidence probability (%)  
- Ranked drug candidates  
- Explainable AI insights  
- Downloadable prediction report  

---

## 🧩 Tech Stack

### 🖥️ Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- ShadCN UI
- Interactive charts
- Responsive hooks

### ⚙️ Backend
- Supabase Edge Functions
- Serverless REST API
- Secure environment variables

### 🤖 AI / ML
- Deep Learning DTI model
- Protein sequence embeddings
- Neural network-based interaction prediction
- Post-processing for explainability

---

## 📁 Project Structure

<details>
<summary><strong>Click to expand</strong></summary>

public/

src/
├── components/ui/
│ ├── ProteinInput.tsx
│ ├── ProteinAnalysis.tsx
│ ├── DrugCandidate.tsx
│ ├── DrugComparisonCharts.tsx
│ ├── MetricsDisplay.tsx
│ ├── MoleculeStructure.tsx
│ └── ModelArchitecture.tsx
│
├── hooks/
│ ├── use-mobile.tsx
│ └── use-toast.ts
│
├── integrations/supabase/
│ ├── client.ts
│ └── types.ts
│
├── pages/
│ ├── Index.tsx
│ └── NotFound.tsx
│
├── App.tsx
├── main.tsx
│
supabase/
└── functions/
└── drug-discovery/


</details>

---

## 🔁 Application Workflow

User Input (Protein Sequence)
↓
Serverless API Call
↓
DTI Model Inference
↓
Prediction & Explainability
↓
Interactive UI Visualization


---

## ⚙️ Local Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/drug-discovery-platform.git
cd drug-discovery-platform

npm install

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

npm run dev
