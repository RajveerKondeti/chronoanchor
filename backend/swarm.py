import os
import json
from typing import TypedDict, Annotated, List
from langgraph.graph import StateGraph, END
from google import genai
from google.genai import types

# Initialize Gemini Client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# 1. Define the Swarm's Shared Memory (State)
class SwarmState(TypedDict):
    vessel_id: str
    declared_displacement: int
    optical_analysis: str
    acoustic_analysis: str
    legal_verdict: str
    final_action: str
    fraud_detected: bool
    live_logs: List[str] # For streaming to the React UI

# 2. Agent 1: Optical Forensics Agent
def optical_agent(state: SwarmState):
    state["live_logs"].append("[Optical Agent] Waking up. Analyzing SAR satellite and drone visual feeds...")
    # In production, this would pass the actual video to Gemini. We simulate the API call for speed here.
    prompt = f"You are a marine optical AI. Assess a vessel claiming {state['declared_displacement']} MT. The waterline is fully submerged past the 14M mark. Output a short 1-sentence finding."
    
    response = client.models.generate_content(model="gemini-2.5-flash", contents=prompt)
    state["optical_analysis"] = response.text.strip()
    state["live_logs"].append(f"[Optical Agent] Finding: {state['optical_analysis']}")
    return state

# 3. Agent 2: Acoustic Integrity Agent
def acoustic_agent(state: SwarmState):
    state["live_logs"].append("[Acoustic Agent] Listening to manifold piezoelectric telemetry...")
    prompt = "You are an acoustic AI. Audio shows 3.4kHz cavitation and metallic rattling. Does this indicate the 'cappuccino effect' (air injected into fuel)? Answer in 1 short sentence."
    
    response = client.models.generate_content(model="gemini-2.5-flash", contents=prompt)
    state["acoustic_analysis"] = response.text.strip()
    state["live_logs"].append(f"[Acoustic Agent] Finding: {state['acoustic_analysis']}")
    return state

# 4. Agent 3: Legal RAG Agent
def legal_agent(state: SwarmState):
    state["live_logs"].append("[Legal Agent] Cross-referencing findings with BIMCO maritime charterparty contracts...")
    if "cappuccino" in state["acoustic_analysis"].lower() or "overweight" in state["optical_analysis"].lower():
         state["legal_verdict"] = "Breach of BIMCO Clause 4 (Bunkering Fraud) and Clause 9 (Draft Limits)."
         state["fraud_detected"] = True
    else:
         state["legal_verdict"] = "Vessel within legal bounds."
         state["fraud_detected"] = False
    
    state["live_logs"].append(f"[Legal Agent] Verdict: {state['legal_verdict']}")
    return state

# 5. Agent 4: The Master Arbiter
def arbiter_agent(state: SwarmState):
    state["live_logs"].append("[Master Arbiter] Synthesizing node data for final execution...")
    if state["fraud_detected"]:
        state["final_action"] = "CRITICAL: Escrow frozen. Rerouting vessel to quarantine berth."
    else:
        state["final_action"] = "CLEARANCE GRANTED. Proceed to automated Berth 4."
    
    state["live_logs"].append(f"[Master Arbiter] Final Execution: {state['final_action']}")
    return state

# 6. Build the LangGraph Execution Pipeline
workflow = StateGraph(SwarmState)

# Add all agents to the graph
workflow.add_node("optical", optical_agent)
workflow.add_node("acoustic", acoustic_agent)
workflow.add_node("legal", legal_agent)
workflow.add_node("arbiter", arbiter_agent)

# Define the flow (Optical and Acoustic can run in parallel in a truly advanced setup, but we sequentialize for clarity)
workflow.add_edge("optical", "acoustic")
workflow.add_edge("acoustic", "legal")
workflow.add_edge("legal", "arbiter")
workflow.add_edge("arbiter", END)

workflow.set_entry_point("optical")

# Compile the Swarm
chrono_swarm = workflow.compile()