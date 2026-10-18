import React, { useState } from 'react';
import { Activity, ShieldAlert, CheckCircle, Database } from 'lucide-react';

export default function App() {
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [finalState, setFinalState] = useState(null);

  const startSwarm = () => {
    setIsRunning(true);
    setLogs([]);
    setFinalState(null);

    const eventSource = new EventSource("http://localhost:8000/trigger-swarm");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.done) {
        eventSource.close();
        setIsRunning(false);
        return;
      }

      setLogs((prev) => [...prev, data]);
      if (data.state) setFinalState(data.state);
    };

    eventSource.onerror = () => {
      eventSource.close();
      setIsRunning(false);
    };
  };

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-center border-b border-gray-800 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-cyan-400 uppercase">ChronoAnchor</h1>
          <p className="text-gray-500 font-mono text-sm mt-1">Multi-Agent Arbitration Swarm // Port of Singapore</p>
        </div>
        <button 
          onClick={startSwarm} 
          disabled={isRunning}
          className={`px-6 py-3 rounded bg-cyan-900/30 border border-cyan-500 text-cyan-400 font-bold uppercase tracking-widest transition ${isRunning ? 'opacity-50 cursor-not-allowed' : 'hover:bg-cyan-500 hover:text-black shadow-[0_0_15px_rgba(0,210,255,0.4)]'}`}
        >
          {isRunning ? "Swarm Active..." : "Simulate Geofence Breach"}
        </button>
      </header>

      <div className="grid grid-cols-3 gap-8">
        {/* Left Column: Live Agent Graph */}
        <div className="col-span-1 space-y-4">
          <h2 className="text-xs text-gray-500 uppercase tracking-widest mb-4">Neural Architecture</h2>
          
          <AgentNode name="Optical Forensics Agent" active={logs[logs.length-1]?.agent === "optical"} icon={<Database size={18}/>} />
          <div className="w-0.5 h-6 bg-gray-800 ml-6"></div>
          
          <AgentNode name="Acoustic Integrity Agent" active={logs[logs.length-1]?.agent === "acoustic"} icon={<Activity size={18}/>} />
          <div className="w-0.5 h-6 bg-gray-800 ml-6"></div>
          
          <AgentNode name="Legal RAG Agent" active={logs[logs.length-1]?.agent === "legal"} icon={<ShieldAlert size={18}/>} />
          <div className="w-0.5 h-6 bg-gray-800 ml-6"></div>
          
          <AgentNode name="Master Arbiter" active={logs[logs.length-1]?.agent === "arbiter"} icon={<CheckCircle size={18}/>} />
        </div>

        {/* Right Column: Live Telemetry & Output */}
        <div className="col-span-2 flex flex-col space-y-6">
          <div className="bg-[#0a0a0a] border border-gray-800 p-6 rounded h-64 overflow-y-auto font-mono text-sm">
            <h2 className="text-xs text-gray-500 uppercase tracking-widest mb-4">Live Execution Stream</h2>
            {logs.map((log, i) => (
              <div key={i} className={`mb-2 ${log.agent === 'System' ? 'text-gray-500' : 'text-green-400'}`}>
                <span className="text-gray-600">[{new Date().toISOString().split('T')[1].slice(0,-1)}]</span> {log.message}
              </div>
            ))}
            {isRunning && <div className="text-cyan-400 mt-4 animate-pulse">_</div>}
          </div>

          {finalState && (
            <div className={`p-6 rounded border ${finalState.fraud_detected ? 'bg-red-950/20 border-red-900 text-red-500' : 'bg-green-950/20 border-green-900 text-green-500'}`}>
              <h2 className="text-xs uppercase tracking-widest mb-2 text-white">Final Arbiter State Resolution</h2>
              <p className="font-bold text-lg">{finalState.final_action}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AgentNode({ name, active, icon }) {
  return (
    <div className={`p-4 border rounded flex items-center gap-4 transition-all duration-300 ${active ? 'border-cyan-400 bg-cyan-950/30 text-cyan-400 shadow-[0_0_20px_rgba(0,210,255,0.2)]' : 'border-gray-800 text-gray-500 bg-[#0a0a0a]'}`}>
      {icon}
      <span className="font-mono text-sm uppercase tracking-wide">{name}</span>
    </div>
  );
}