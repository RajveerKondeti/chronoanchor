# ChronoAnchor ⚓
### Autonomous Multimodal Maritime Pre-Clearance & Dispute Arbiter Swarm
> **Google Cloud AI Builder Cup — JAPAC Edition**  
> **Theme:** Manufacturing: Intelligent Operations & Industrial Efficiency / Sustainability & Social Impact  
> **Deployment Target:** Google Cloud Run & Vertex AI  

---

## 1. Executive Summary & Problem Context

Over 80% of global physical commerce moves by sea. In transshipment hubs across the JAPAC corridor—most notably the Singapore Strait—vessels experience an average **36 to 72-hour anchorage idle time** upon entering port territorial waters. 

This delay is driven by the **cross-border physical-to-digital trust vacuum**:
- Four distinct, mutually suspicious counterparties (**Port Authorities, Terminal Operators, Bunker Fuel Suppliers, and Maritime Insurers**) must reconcile physical vessel state against analog paperwork.
- Digital manifests, Bills of Lading (BoL), and Bunker Delivery Notes (BDN) are routinely forged or subject to physical drift during ocean transit.
- Persistent fraud vectors, such as the **"cappuccino effect"** (injecting compressed air into bunker fuel manifolds to falsely inflate mass-flow readings by up to 8%), cost buyers tens of thousands of dollars per bunkering call.

The resulting operational drag generates **$22 billion annually in demurrage costs** and burns hundreds of thousands of tons of auxiliary fuel off metropolitan coastlines.

---

## 2. The Solution: Zero-Trust Physical Ground-Truthing

**ChronoAnchor** replaces post-arrival analog manual surveying with a **pre-arrival multi-agent arbitration swarm**. 

Instead of trusting self-reported digital forms, ChronoAnchor passively inspects the inbound vessel 50 nautical miles out using native multimodal reasoning on Google Cloud:
1. **Hydrodynamic Waterline Displacement Inference (Visual):** Zero-shot spatial inspection of coastal drone/SAR video over vessel draft marks. Calculates true metric tonnage displacement directly against naval hydrostatic tables to catch undeclared cargo and structural ballast tampering.
2. **Acoustic Cavitation Detection (Acoustic):** Real-time acoustic frequency analysis of fuel transfer lines. Identifies the distinct 3.4 kHz cavitation signature and cyclic pressure flutter characteristic of two-phase air-bubble injection ("cappuccino bunkering").
3. **Deterministic Legal Consensus:** Cross-references sensory anomalies against governing maritime charterparties (e.g., BIMCO standard clauses) to execute binding escrow holds or automated quarantine routing.

---

## 3. System Architecture

```text
                   [Inbound Maritime Telemetry]
          (Drone Waterline Feed & Acoustic Manifold Audio)
                                 │
                                 ▼
            ┌─────────────────────────────────────────┐
            │        Google Cloud Run Backend         │
            │     (FastAPI + Server-Sent Events)      │
            └────────────────────┬────────────────────┘
                                 │
                                 ▼
    ┌─────────────────────────────────────────────────────────┐
    │                 LangGraph Agent Swarm                   │
    │                                                         │
    │   ┌─────────────────────────┐                           │
    │   │  Optical Forensics AI   │ ◄─── Hull Waterline Video │
    │   └────────────┬────────────┘                           │
    │                │                                        │
    │   ┌────────────▼────────────┐                           │
    │   │ Acoustic Integrity AI   │ ◄─── Manifold Audio Feed  │
    │   └────────────┬────────────┘                           │
    │                │                                        │
    │   ┌────────────▼────────────┐                           │
    │   │     Legal RAG AI        │ ◄─── BIMCO Charterparties │
    │   └────────────┬────────────┘                           │
    │                │                                        │
    │   ┌────────────▼────────────┐                           │
    │   │     Master Arbiter      │ ───► Programmatic Escrow  │
    │   └─────────────────────────┘      & Berth Allocation   │
    └────────────────────┬────────────────────────────────────┘
                         │
        Google Vertex AI │ (Gemini 2.5 Flash / Pydantic)
                         │
                         ▼
            ┌─────────────────────────────────────────┐
            │        React Digital Twin Console       │
            │        (Real-Time SSE Streaming)        │
            └─────────────────────────────────────────┘
```

---

## 4. Key Agent Roles & Workflow

| Agent Node | Responsibility | Telemetry Ingested |
| :--- | :--- | :--- |
| **Optical Forensics Agent** | Isolates draft marks and detects waterline displacement discrepancies relative to declared cargo manifests. | MP4 Drone Flyby / High-Res CCTV |
| **Acoustic Integrity Agent** | Analyzes pipeline resonance to identify two-phase cavitation, micro-aeration, and laminar flow degradation. | WAV / MP3 Manifold Contact Sensor |
| **Legal RAG Agent** | Evaluates detected physical anomalies against BIMCO Standard Clauses (Clause 4 bunkering fraud & Clause 9 draft compliance). | Vectorized Maritime Legal Corpus |
| **Master Arbiter** | Synthesizes upstream confidence intervals, resolves edge-case disputes, and triggers deterministic downstream actions. | Consolidated Swarm State |

---

## 5. Technology Stack

- **Foundational Models:** Google Gemini 2.5 Flash via `google-genai` SDK
- **Agent Orchestration:** LangGraph (StateGraph multi-actor cyclic execution)
- **Backend Framework:** FastAPI, Uvicorn, SSE-Starlette (Server-Sent Events)
- **Data Validation:** Pydantic (Strict Schema Enforcement)
- **Frontend / Digital Twin:** React 19, Vite, Tailwind CSS v4, Lucide Icons
- **Cloud Infrastructure:** Google Cloud Run, Container Registry / Artifact Registry

---

## 6. Repository Layout
```text
chronoanchor/
├── .gitignore               # Root git exclusion file (protects secrets & node_modules)
├── README.md                # System documentation & architectural overview
├── backend/
│   ├── .env                 # API keys & configuration (NEVER COMMITTED)
│   ├── Dockerfile           # Production container specification for Cloud Run
│   ├── requirements.txt     # Python backend dependencies
│   ├── main.py              # FastAPI server exposing SSE streaming endpoints
│   └── swarm.py             # LangGraph state machine & multi-agent definitions
├── frontend/
│   ├── package.json         # Node manifest and dependencies
│   ├── vite.config.js       # Vite configuration with Tailwind CSS v4 plugin
│   ├── index.html           # Single-page application entry point
│   └── src/
│       ├── App.jsx          # Live Agent Swarm command console
│       ├── index.css        # Tailwind v4 theme configuration
│       └── main.jsx         # React DOM mount point
└── media/
    ├── drone_draft.mp4      # Test payload: Vessel hull & draft mark footage
    └── manifold_audio.mp3   # Test payload: Acoustic manifold flow recording
```

---

## 7. Local Setup & Execution Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm
- A valid Google Gemini API Key (from [Google AI Studio](https://aistudio.google.com/))

---

### Step 1: Backend Configuration

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # Windows PowerShell
   python -m venv .venv
   .venv\Scripts\activate
   
   # macOS / Linux
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables by creating a `.env` file in the `backend/` folder:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

5. Launch the backend server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   *The API will be live at `http://127.0.0.1:8000`.*

### Step 2: Frontend Configuration

1. Open a new terminal session and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the Vite development server:
   ```bash
   npm run dev
   ```
   *The Command Console will be accessible at `http://localhost:5173`.*

### Step 3: Trigger the Live Swarm Demonstration

1. Open your browser to `http://localhost:5173`.
2. Ensure both terminal windows (frontend and backend) are running concurrently.
3. Click **SIMULATE GEOFENCE BREACH**.
4. Observe the neural architecture nodes dynamically light up on the left while live agent reasoning traces stream via SSE directly into the execution terminal on the right.
5. Review the final deterministic arbitration outcome (e.g., escrow freeze, berth routing).

---

## 8. Google Cloud Deployment (Cloud Run)

To containerize and deploy the backend service to Google Cloud Run:

```bash
# 1. Authenticate with Google Cloud
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# 2. Build and submit container image via Cloud Build
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/chronoanchor-backend ./backend

# 3. Deploy container to Cloud Run
gcloud run deploy chronoanchor-backend \
    --image gcr.io/YOUR_PROJECT_ID/chronoanchor-backend \
    --platform managed \
    --region asia-southeast1 \
    --allow-unauthenticated \
    --set-env-vars GEMINI_API_KEY="YOUR_API_KEY"
```