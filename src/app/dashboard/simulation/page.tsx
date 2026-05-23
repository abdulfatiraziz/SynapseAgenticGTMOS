"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  MessageSquare,
  FileText,
  Terminal, 
  Check, 
  X, 
  CheckCircle, 
  Database, 
  Network, 
  GitBranch, 
  RefreshCw, 
  Layers, 
  AlertCircle,
  HelpCircle,
  Activity,
  Zap,
  Cpu,
  Mail,
  TrendingUp,
  ZoomIn,
  ZoomOut,
  Maximize,
  Maximize2,
  Minimize2,
  Trash2,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { 
  playbooks as defaultPlaybooks, 
  playbookOverviews as defaultPlaybookOverviews, 
  Playbook, 
  VisualNode, 
  Connection, 
  PlaybookOverview 
} from '@/data/playbooksData';

// Map string icons to React components
const iconMap: Record<string, any> = {
  zap: Zap,
  cpu: Cpu,
  network: Network,
  message: MessageSquare,
  database: Database,
  // Type fallbacks
  trigger: Zap,
  agent: Cpu,
  tool: Network,
  gate: MessageSquare,
  db: Database
};

export default function SimulationPage() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [playbooksList, setPlaybooksList] = useState<Playbook[]>(defaultPlaybooks);
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook>(defaultPlaybooks[0]);
  const [activeOverviewTab, setActiveOverviewTab] = useState<"strategy" | "orchestration" | "integration" | "safeguards">("strategy");
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [currentNodeGlow, setCurrentNodeGlow] = useState<string | null>(null);
  const [awaitingApproval, setAwaitingApproval] = useState(false);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Design Mode states
  const [isDesignMode, setIsDesignMode] = useState(false);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragStartOffset, setDragStartOffset] = useState({ x: 0, y: 0 });

  // Custom Node form states
  const [newNodeLabel, setNewNodeLabel] = useState("");
  const [newNodeType, setNewNodeType] = useState<VisualNode["type"]>("agent");
  const [newNodeSubtext, setNewNodeSubtext] = useState("");

  // Custom Connection builder states
  const [connFrom, setConnFrom] = useState("");
  const [connTo, setConnTo] = useState("");
  const [connType, setConnType] = useState<Connection["type"]>("delegate");

  // Editing existing node modal state
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingNodeLabel, setEditingNodeLabel] = useState("");
  const [editingNodeSubtext, setEditingNodeSubtext] = useState("");
  const [editingNodeType, setEditingNodeType] = useState<VisualNode["type"]>("agent");

  // Whiteboard Zoom & Pan State
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.0);
  const [isPanning, setIsPanning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const panStartRef = useRef({ x: 0, y: 0 });
  const canvasPanelRef = useRef<HTMLDivElement>(null);

  // Initialize and load custom playbooks from Supabase API / LocalStorage fallbacks
  useEffect(() => {
    async function loadPlaybooks() {
      try {
        // Attempt database query
        const res = await fetch('/api/playbooks');
        const data = await res.json();
        let dbCustom: Playbook[] = [];
        if (data.success && data.playbooks) {
          dbCustom = data.playbooks;
        }

        // Pull local storage overrides
        const localRaw = localStorage.getItem('synapse_custom_playbooks');
        const localCustom: Playbook[] = localRaw ? JSON.parse(localRaw) : [];

        // Filter duplicates, prioritizing cloud database over local backups
        const mergedCustom = [...dbCustom];
        for (const lp of localCustom) {
          if (!mergedCustom.some(dp => dp.id === lp.id)) {
            mergedCustom.push(lp);
          }
        }

        if (mergedCustom.length > 0) {
          // Merge static defaults with all fetched customs
          const fullList = [...defaultPlaybooks];
          for (const cp of mergedCustom) {
            const index = fullList.findIndex(p => p.id === cp.id);
            if (index !== -1) {
              fullList[index] = cp; // Override static P1-P20 if customized
            } else {
              fullList.push(cp); // Insert new custom playbooks
            }
          }
          setPlaybooksList(fullList);
          
          // Select correct initial playbook
          const savedActiveId = localStorage.getItem('synapse_active_playbook_id');
          const found = fullList.find(p => p.id === savedActiveId);
          if (found) {
            setSelectedPlaybook(found);
          } else {
            setSelectedPlaybook(fullList[0]);
          }
        }
      } catch (err) {
        console.warn('[Simulation] Failed to fetch custom playbooks, using local offline fallbacks', err);
      }
    }
    loadPlaybooks();
  }, []);

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  // Auto scroll console to bottom without pushing/scrolling the main window
  useEffect(() => {
    if (consoleEndRef.current) {
      const container = consoleEndRef.current.parentElement;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "smooth"
        });
      }
    }
  }, [consoleLogs]);

  // Reset simulation when changing playbooks
  const handlePlaybookChange = (pb: Playbook) => {
    if (isRunning) return;
    setSelectedPlaybook(pb);
    localStorage.setItem('synapse_active_playbook_id', pb.id);
    setCurrentStepIndex(-1);
    setConsoleLogs([`Playbook '${pb.name}' selected. Ready for simulation.`]);
    setCurrentNodeGlow(null);
    setAwaitingApproval(false);
  };

  const handleCategoryChange = (cat: string) => {
    if (isRunning) return;
    setActiveCategory(cat);
    
    // Auto-select the first playbook in the filtered list
    const filtered = cat === "ALL" 
      ? playbooksList 
      : playbooksList.filter(pb => pb.category === cat);
    if (filtered.length > 0) {
      setSelectedPlaybook(filtered[0]);
      setCurrentStepIndex(-1);
      setConsoleLogs([`Category [${cat}] selected. Playbook '${filtered[0].name}' set as active.`]);
      setCurrentNodeGlow(null);
      setAwaitingApproval(false);
    }
  };

  const triggerSimulation = () => {
    if (isRunning) return;
    if (selectedPlaybook.steps.length === 0) {
      setConsoleLogs([`⚠ Playbook has 0 sequence steps. Please enter Design Mode to add steps.`]);
      return;
    }
    setIsRunning(true);
    setCurrentStepIndex(0);
    setConsoleLogs([`🚀 Initializing Playbook Pipeline: ${selectedPlaybook.name}...`]);
    setAwaitingApproval(false);
  };

  useEffect(() => {
    if (!isRunning || currentStepIndex < 0) return;

    const currentStep = selectedPlaybook.steps[currentStepIndex];
    if (!currentStep) {
      // Completed!
      setConsoleLogs(prev => [...prev, "✔ Playbook Pipeline completed successfully."]);
      setIsRunning(false);
      setCurrentNodeGlow(null);
      return;
    }

    setCurrentNodeGlow(currentStep.nodeId);
    
    // Log write delay
    const timer = setTimeout(() => {
      setConsoleLogs(prev => [...prev, `[${currentStep.nodeId.toUpperCase()}] ${currentStep.log}`]);
      
      if (currentStep.actionType === "hitl") {
        setAwaitingApproval(true);
      } else {
        // Proceed automatically
        setCurrentStepIndex(prev => prev + 1);
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [isRunning, currentStepIndex, selectedPlaybook]);

  const handleSlackApprove = () => {
    setAwaitingApproval(false);
    setConsoleLogs(prev => [...prev, "💬 [OPERATOR Slack Approval Received] - GTM Motion resumed by admin action."]);
    setCurrentStepIndex(prev => prev + 1);
  };

  const handleSlackDeny = () => {
    setAwaitingApproval(false);
    setConsoleLogs(prev => [...prev, "❌ [OPERATOR Slack Rejected] - Pipeline execution cancelled by operator."]);
    setIsRunning(false);
    setCurrentNodeGlow(null);
  };

  // Drag-and-drop start for visual node
  const handleNodeDragStart = (e: React.MouseEvent, nodeId: string) => {
    if (!isDesignMode) return;
    e.stopPropagation(); // Stop background canvas panning
    setDraggedNodeId(nodeId);
    const node = selectedPlaybook.nodes.find(n => n.id === nodeId);
    if (node) {
      setDragStartOffset({
        x: e.clientX - node.x * zoom,
        y: e.clientY - node.y * zoom
      });
    }
  };

  // Node editing handlers
  const handleNodeDoubleClick = (node: VisualNode) => {
    if (!isDesignMode) return;
    setEditingNodeId(node.id);
    setEditingNodeLabel(node.label);
    setEditingNodeSubtext(node.subText || "");
    setEditingNodeType(node.type);
  };

  const handleSaveNodeEdit = () => {
    if (!editingNodeId) return;
    setSelectedPlaybook(prev => ({
      ...prev,
      nodes: prev.nodes.map(n => n.id === editingNodeId ? {
        ...n,
        label: editingNodeLabel,
        subText: editingNodeSubtext,
        type: editingNodeType,
        icon: editingNodeType === 'trigger' ? 'zap' : editingNodeType === 'agent' ? 'cpu' : editingNodeType === 'tool' ? 'network' : editingNodeType === 'gate' ? 'message' : 'database'
      } : n)
    }));
    setEditingNodeId(null);
  };

  // Whiteboard Canvas Interaction coordinates map
  const getPathCoords = (fromNodeId: string, toNodeId: string) => {
    const fromNode = selectedPlaybook.nodes.find(n => n.id === fromNodeId);
    const toNode = selectedPlaybook.nodes.find(n => n.id === toNodeId);
    if (!fromNode || !toNode) return "";

    const width = 160;
    const height = 68;

    // 1. Downward path check (fromNode is above toNode in the tiered coordinate layout)
    if (fromNode.y < toNode.y) {
      // Bottom-center of fromNode
      const x1 = fromNode.x + width / 2;
      const y1 = fromNode.y + height;
      // Top-center of toNode
      const x2 = toNode.x + width / 2;
      const y2 = toNode.y;
      const dy = (y2 - y1) * 0.5;
      return `M ${x1} ${y1} C ${x1} ${y1 + dy}, ${x2} ${y2 - dy}, ${x2} ${y2}`;
    }

    // 2. Loopback/Upward path check (fromNode is below toNode, representing feedback flow)
    if (fromNode.y > toNode.y) {
      // Top-center of database/source node
      const x1 = fromNode.x + width / 2;
      const y1 = fromNode.y;

      if (fromNodeId === "hubspot" || fromNodeId.endsWith("_db") || fromNodeId === "p1_db") {
        // Top-center of target strategic agent node
        const x2 = toNode.x + width / 2;
        const y2 = toNode.y;
        // High sweeping upward Bezier arc curving outward to the right
        return `M ${x1} ${y1} C ${x1 + 120} ${y1 - 180}, ${x2 + 120} ${y2 - 100}, ${x2} ${y2}`;
      } else {
        // Smooth upward S-curve connecting top-center of lower node to bottom-center of upper node
        const x2 = toNode.x + width / 2;
        const y2_bottom = toNode.y + height;
        const dy = (y1 - y2_bottom) * 0.5;
        return `M ${x1} ${y1} C ${x1} ${y1 - dy}, ${x2} ${y2_bottom + dy}, ${x2} ${y2_bottom}`;
      }
    }

    // 3. Horizontal same-layer flow (fromNode.y === toNode.y)
    // Right-center of fromNode
    const x1 = fromNode.x + width;
    const y1 = fromNode.y + height / 2;
    // Left-center of toNode
    const x2 = toNode.x;
    const y2 = toNode.y + height / 2;
    const dx = Math.abs(x2 - x1) * 0.5;
    return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
  };

  // Panning & Zoom handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (awaitingApproval) return;
    if (draggedNodeId) return;
    setIsPanning(true);
    panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // If a node is currently dragged, update coordinates
    if (draggedNodeId) {
      const newX = Math.round((e.clientX - dragStartOffset.x) / zoom);
      const newY = Math.round((e.clientY - dragStartOffset.y) / zoom);

      // Bound within canvas boundaries
      const isMaster = selectedPlaybook.category === "Master";
      const boundedX = Math.max(0, Math.min(newX, isMaster ? 1350 : 900));
      const boundedY = Math.max(0, Math.min(newY, isMaster ? 580 : 380));

      setSelectedPlaybook(prev => ({
        ...prev,
        nodes: prev.nodes.map(n => n.id === draggedNodeId ? { ...n, x: boundedX, y: boundedY } : n)
      }));
      return;
    }

    if (!isPanning || awaitingApproval) return;
    setPan({
      x: e.clientX - panStartRef.current.x,
      y: e.clientY - panStartRef.current.y
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggedNodeId(null);
  };

  const handleMouseLeave = () => {
    setIsPanning(false);
    setDraggedNodeId(null);
  };

  // Touch support for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    if (awaitingApproval || e.touches.length !== 1) return;
    setIsPanning(true);
    const touch = e.touches[0];
    panStartRef.current = { x: touch.clientX - pan.x, y: touch.clientY - pan.y };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPanning || awaitingApproval || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPan({
      x: touch.clientX - panStartRef.current.x,
      y: touch.clientY - panStartRef.current.y
    });
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
  };

  const zoomIn = () => {
    setZoom(prev => Math.min(parseFloat((prev + 0.1).toFixed(2)), 1.8));
  };

  const zoomOut = () => {
    setZoom(prev => Math.max(parseFloat((prev - 0.1).toFixed(2)), 0.5));
  };

  const resetView = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  // Dynamic non-passive wheel listener to prevent body scroll while zooming
  useEffect(() => {
    const canvas = canvasPanelRef.current;
    if (!canvas) return;

    const handleNativeWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = 0.04;
      let newZoom = zoom;
      if (e.deltaY < 0) {
        newZoom = Math.min(zoom + zoomFactor, 1.8);
      } else {
        newZoom = Math.max(zoom - zoomFactor, 0.5);
      }
      setZoom(parseFloat(newZoom.toFixed(2)));
    };

    canvas.addEventListener("wheel", handleNativeWheel, { passive: false });
    return () => {
      canvas.removeEventListener("wheel", handleNativeWheel);
    };
  }, [zoom]);

  // Design Mode Operations
  const handleCreatePlaybook = () => {
    const name = prompt("Enter custom playbook name (e.g. 'P21: Enterprise ABM Warm Outreach'):");
    if (!name) return;
    const desc = prompt("Enter short description:") || "Custom visual GTM playbook";
    
    let defaultCat: Playbook["category"] = "PLG";
    const catInput = prompt("Enter category (PLG, SLG, Community, Partner, Master):", "PLG");
    if (catInput && ["PLG", "SLG", "Community", "Partner", "Master"].includes(catInput)) {
      defaultCat = catInput as Playbook["category"];
    }

    const newPb: Playbook = {
      id: `custom_${Date.now()}`,
      name,
      category: defaultCat,
      description: desc,
      nodes: [],
      connections: [],
      steps: []
    };

    setPlaybooksList(prev => [...prev, newPb]);
    setSelectedPlaybook(newPb);
    setConsoleLogs([`Custom playbook '${name}' initialized. Create nodes and steps to build your flow.`]);
  };

  const handleDeletePlaybook = async (id: string) => {
    if (!confirm("Are you sure you want to delete this playbook?")) return;
    
    // Attempt delete from Database if service role key is active
    try {
      const res = await fetch(`/api/playbooks?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}` // Frontend proxy helper
        }
      });
      const data = await res.json();
      if (!data.success) {
        console.warn('[Simulation] Database delete unavailable, removing locally only');
      }
    } catch {
      // Offline fallback ignore
    }

    const remaining = playbooksList.filter(pb => pb.id !== id);
    setPlaybooksList(remaining);
    
    // Update local storage backup
    const localRaw = localStorage.getItem('synapse_custom_playbooks');
    const localList: Playbook[] = localRaw ? JSON.parse(localRaw) : [];
    localStorage.setItem('synapse_custom_playbooks', JSON.stringify(localList.filter(pb => pb.id !== id)));

    if (remaining.length > 0) {
      setSelectedPlaybook(remaining[0]);
      localStorage.setItem('synapse_active_playbook_id', remaining[0].id);
    }
  };

  // Add new visual node
  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeLabel) return;

    const nodeId = `node_${Date.now().toString().slice(-6)}`;
    const iconName = newNodeType === 'trigger' ? 'zap' : newNodeType === 'agent' ? 'cpu' : newNodeType === 'tool' ? 'network' : newNodeType === 'gate' ? 'message' : 'database';

    const node: VisualNode = {
      id: nodeId,
      label: newNodeLabel,
      type: newNodeType,
      icon: iconName,
      x: 100, // Spawn coordinates
      y: 100,
      subText: newNodeSubtext || undefined
    };

    setSelectedPlaybook(prev => ({
      ...prev,
      nodes: [...prev.nodes, node]
    }));

    setNewNodeLabel("");
    setNewNodeSubtext("");
  };

  // Delete node and clean up connected paths
  const handleDeleteNode = (nodeId: string) => {
    setSelectedPlaybook(prev => ({
      ...prev,
      nodes: prev.nodes.filter(n => n.id !== nodeId),
      connections: prev.connections.filter(c => c.from !== nodeId && c.to !== nodeId),
      steps: prev.steps.filter(s => s.nodeId !== nodeId)
    }));
  };

  // Add connection link
  const handleAddConnection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connFrom || !connTo || connFrom === connTo) return;

    // Check if connection already exists
    const exists = selectedPlaybook.connections.some(c => c.from === connFrom && c.to === connTo);
    if (exists) return alert("Connection already exists between these nodes.");

    const conn: Connection = {
      from: connFrom,
      to: connTo,
      type: connType
    };

    setSelectedPlaybook(prev => ({
      ...prev,
      connections: [...prev.connections, conn]
    }));

    setConnFrom("");
    setConnTo("");
  };

  const handleDeleteConnection = (from: string, to: string) => {
    setSelectedPlaybook(prev => ({
      ...prev,
      connections: prev.connections.filter(c => !(c.from === from && c.to === to))
    }));
  };

  // Add sequence step
  const handleAddStep = () => {
    if (selectedPlaybook.nodes.length === 0) return alert("Please add at least 1 node first.");
    const defaultNodeId = selectedPlaybook.nodes[0].id;
    
    setSelectedPlaybook(prev => ({
      ...prev,
      steps: [...prev.steps, {
        nodeId: defaultNodeId,
        log: "New sequence operation details...",
        actionType: "think"
      }]
    }));
  };

  const handleUpdateStep = (index: number, field: string, value: any) => {
    setSelectedPlaybook(prev => {
      const stepsCopy = [...prev.steps];
      if (field === "nodeId") stepsCopy[index].nodeId = value;
      else if (field === "log") stepsCopy[index].log = value;
      else if (field === "actionType") stepsCopy[index].actionType = value;
      else if (field === "hitl_agent") {
        stepsCopy[index].hitlDetails = {
          agent: value,
          request: stepsCopy[index].hitlDetails?.request || ""
        };
      } else if (field === "hitl_request") {
        stepsCopy[index].hitlDetails = {
          agent: stepsCopy[index].hitlDetails?.agent || "",
          request: value
        };
      }
      return { ...prev, steps: stepsCopy };
    });
  };

  const handleDeleteStep = (index: number) => {
    setSelectedPlaybook(prev => ({
      ...prev,
      steps: prev.steps.filter((_, idx) => idx !== index)
    }));
  };

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === selectedPlaybook.steps.length - 1) return;

    setSelectedPlaybook(prev => {
      const stepsCopy = [...prev.steps];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const temp = stepsCopy[index];
      stepsCopy[index] = stepsCopy[targetIndex];
      stepsCopy[targetIndex] = temp;
      return { ...prev, steps: stepsCopy };
    });
  };

  // Save Playbook to cloud API (guarded with Bearer key helper) / LocalStorage fallback
  const handleSavePlaybook = async () => {
    // 1. Sync React parent lists state
    setPlaybooksList(prev => prev.map(pb => pb.id === selectedPlaybook.id ? selectedPlaybook : pb));

    // 2. Write to LocalStorage (local backup)
    const localRaw = localStorage.getItem('synapse_custom_playbooks');
    const localList: Playbook[] = localRaw ? JSON.parse(localRaw) : [];
    const filteredLocal = localList.filter(pb => pb.id !== selectedPlaybook.id);
    filteredLocal.push(selectedPlaybook);
    localStorage.setItem('synapse_custom_playbooks', JSON.stringify(filteredLocal));

    // 3. Post to API Route
    try {
      const res = await fetch('/api/playbooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}` // Uses proxy token or local bypass
        },
        body: JSON.stringify(selectedPlaybook)
      });
      const data = await res.json();
      if (data.success) {
        alert("Playbook saved and synced to database successfully!");
      } else {
        alert(`Saved locally! (Database Offline Fallback active: ${data.error || 'Unauthorized'})`);
      }
    } catch (err: any) {
      console.warn('[Simulation] API Save failed, fallback to local storage successful', err.message);
      alert("Saved locally! (Network Offline Fallback active)");
    }
  };

  const toggleDesignMode = () => {
    if (isRunning) return;
    setIsDesignMode(prev => !prev);
    setCurrentStepIndex(-1);
    setCurrentNodeGlow(null);
    setAwaitingApproval(false);
    setConsoleLogs([`Swapped to ${!isDesignMode ? 'Design Mode' : 'Simulation Mode'}.`]);
  };

  return (
    <div className="simulator-container">
      {/* Top Banner Row */}
      <header className="header-row">
        <div>
          <h1 className="title-glow">GTM Flow Simulator</h1>
          <p className="subtitle">Model multi-agent loops, API tool delegations, and Slack approvals</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            className={`mode-toggle-btn ${isDesignMode ? 'design-active' : ''}`}
            onClick={toggleDesignMode}
            disabled={isRunning}
          >
            {isDesignMode ? (
              <>
                <Layers size={14} /> Design Mode (Active)
              </>
            ) : (
              <>
                <Play size={14} /> Simulation Mode
              </>
            )}
          </button>
          
          {isDesignMode && (
            <button 
              className="save-playbook-btn"
              onClick={handleSavePlaybook}
            >
              <Check size={14} /> Save Playbook
            </button>
          )}

          <div className="status-badge">
            <Activity size={14} className="active-icon" />
            <span>Interactive Sandbox</span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="simulator-grid">
        {/* Left Side: Playbooks list / Design Mode Tools */}
        <section className="side-panel glass-panel">
          <div className="section-header">
            <h3>{isDesignMode ? "Visual Design HUD" : "Active Playbooks"}</h3>
            <p>{isDesignMode ? "Build and modify workflow coordinate grids" : "Select a playbook flow below to simulate"}</p>
          </div>

          {!isDesignMode ? (
            <>
              {/* Category pills */}
              <div className="category-tabs">
                {["ALL", "PLG", "SLG", "Community", "Partner", "Master"].map(cat => (
                  <button
                    key={cat}
                    className={`category-tab ${activeCategory === cat ? "active" : ""}`}
                    onClick={() => handleCategoryChange(cat)}
                    disabled={isRunning}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Static + Custom Playbooks scroll list */}
              <div className="playbook-list">
                {playbooksList
                  .filter(pb => activeCategory === "ALL" || pb.category === activeCategory)
                  .map(pb => (
                    <button 
                      key={pb.id}
                      className={`playbook-btn ${selectedPlaybook.id === pb.id ? "active" : ""}`}
                      onClick={() => handlePlaybookChange(pb)}
                      disabled={isRunning}
                    >
                      <strong>{pb.name}</strong>
                      <p>{pb.description.slice(0, 75)}...</p>
                    </button>
                  ))}
              </div>

              <div className="trigger-container">
                <button 
                  className={`trigger-action-btn ${isRunning ? 'running' : ''}`}
                  onClick={triggerSimulation}
                  disabled={isRunning}
                >
                  {isRunning ? (
                    <>
                      <RefreshCw size={16} className="spin-icon" /> Running Simulation...
                    </>
                  ) : (
                    <>
                      <Play size={16} fill="currentColor" /> Trigger GTM Playbook
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            // --- DESIGN MODE TOOLBAR ---
            <div className="design-toolbar scrollable-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, overflowY: 'auto' }}>
              
              {/* Playbook Level Actions */}
              <div className="design-sec" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.75rem' }}>
                <button 
                  className="toolbar-btn"
                  onClick={handleCreatePlaybook}
                  style={{
                    width: '100%',
                    background: 'rgba(99, 102, 241, 0.12)',
                    border: '1px dashed rgba(99, 102, 241, 0.35)',
                    color: '#818cf8',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem'
                  }}
                >
                  + Add Custom Playbook
                </button>
                {selectedPlaybook.id.startsWith("custom_") && (
                  <button 
                    className="toolbar-btn text-red"
                    onClick={() => handleDeletePlaybook(selectedPlaybook.id)}
                    style={{
                      width: '100%',
                      background: 'rgba(239, 68, 68, 0.08)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      color: '#ef4444',
                      padding: '0.5rem',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      marginTop: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <Trash2 size={12} /> Delete Current Playbook
                  </button>
                )}
              </div>

              {/* Node Adding Panel */}
              <div className="design-sec" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#e4e4e7', textTransform: 'uppercase' }}>Add Visual Node</h4>
                <form onSubmit={handleAddNode} style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <input 
                    type="text" 
                    placeholder="Node Label (e.g. CMO Agent)" 
                    value={newNodeLabel}
                    onChange={e => setNewNodeLabel(e.target.value)}
                    style={{
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '6px',
                      color: '#fff',
                      padding: '0.4rem',
                      fontSize: '0.7rem'
                    }}
                    required
                  />
                  <input 
                    type="text" 
                    placeholder="Subtext (e.g. Strategy Lead)" 
                    value={newNodeSubtext}
                    onChange={e => setNewNodeSubtext(e.target.value)}
                    style={{
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '6px',
                      color: '#fff',
                      padding: '0.4rem',
                      fontSize: '0.7rem'
                    }}
                  />
                  <select 
                    value={newNodeType}
                    onChange={e => setNewNodeType(e.target.value as any)}
                    style={{
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '6px',
                      color: '#fff',
                      padding: '0.4rem',
                      fontSize: '0.7rem'
                    }}
                  >
                    <option value="trigger">Trigger Event (Red)</option>
                    <option value="agent">Strategic Agent (Indigo)</option>
                    <option value="tool">Connection Tool (Blue)</option>
                    <option value="gate">Slack Gate (Amber)</option>
                    <option value="db">HubSpot DB (Emerald)</option>
                  </select>
                  <button 
                    type="submit"
                    style={{
                      background: '#4f46e5',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#fff',
                      padding: '0.4rem',
                      fontSize: '0.72rem',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Place Node Card
                  </button>
                </form>
              </div>

              {/* Connections Connector Panel */}
              <div className="design-sec" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#e4e4e7', textTransform: 'uppercase' }}>Link Path Connection</h4>
                {selectedPlaybook.nodes.length < 2 ? (
                  <p style={{ margin: 0, fontSize: '0.65rem', color: '#71717a' }}>Place at least 2 nodes to draw link paths.</p>
                ) : (
                  <form onSubmit={handleAddConnection} style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    <select 
                      value={connFrom}
                      onChange={e => setConnFrom(e.target.value)}
                      style={{
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '6px',
                        color: '#fff',
                        padding: '0.4rem',
                        fontSize: '0.7rem'
                      }}
                      required
                    >
                      <option value="">-- Select Source Node --</option>
                      {selectedPlaybook.nodes.map(n => (
                        <option key={n.id} value={n.id}>{n.label}</option>
                      ))}
                    </select>
                    <select 
                      value={connTo}
                      onChange={e => setConnTo(e.target.value)}
                      style={{
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '6px',
                        color: '#fff',
                        padding: '0.4rem',
                        fontSize: '0.7rem'
                      }}
                      required
                    >
                      <option value="">-- Select Target Node --</option>
                      {selectedPlaybook.nodes.map(n => (
                        <option key={n.id} value={n.id}>{n.label}</option>
                      ))}
                    </select>
                    <select 
                      value={connType}
                      onChange={e => setConnType(e.target.value as any)}
                      style={{
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '6px',
                        color: '#fff',
                        padding: '0.4rem',
                        fontSize: '0.7rem'
                      }}
                    >
                      <option value="trigger">Trigger Route (Red)</option>
                      <option value="delegate">Delegation Route (Indigo)</option>
                      <option value="query">Gateway Query (Blue)</option>
                      <option value="approve">HITL Approval (Amber)</option>
                      <option value="sync">DB Sync Commit (Emerald)</option>
                    </select>
                    <button 
                      type="submit"
                      style={{
                        background: '#10b981',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#fff',
                        padding: '0.4rem',
                        fontSize: '0.72rem',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      Link Connection
                    </button>
                  </form>
                )}
              </div>

              {/* Connections List Cleaner */}
              <div className="design-sec">
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#e4e4e7', textTransform: 'uppercase' }}>Active Paths ({selectedPlaybook.connections.length})</h4>
                {selectedPlaybook.connections.length === 0 ? (
                  <p style={{ margin: 0, fontSize: '0.65rem', color: '#71717a' }}>No link paths drawn yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '150px', overflowY: 'auto' }}>
                    {selectedPlaybook.connections.map((c, i) => {
                      const fromNode = selectedPlaybook.nodes.find(n => n.id === c.from);
                      const toNode = selectedPlaybook.nodes.find(n => n.id === c.to);
                      return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.35rem', borderRadius: '5px', border: '1px solid rgba(255,255,255,0.04)' }}>
                          <span style={{ fontSize: '0.65rem', color: '#e4e4e7' }}>{fromNode?.label || c.from} → {toNode?.label || c.to}</span>
                          <button 
                            onClick={() => handleDeleteConnection(c.from, c.to)}
                            style={{ background: 'transparent', border: 'none', color: '#ef4444', marginLeft: 'auto', cursor: 'pointer' }}
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}
        </section>

        {/* Center: Whiteboard Canvas Node Grid */}
        <section 
          ref={canvasPanelRef}
          className={`canvas-panel glass-panel ${isPanning ? 'panning' : ''} ${isFullscreen ? 'fullscreen' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="canvas-grid-bg"></div>
          
          {/* Whiteboard HUD controls overlay */}
          <div className="canvas-hud">
            <button className="hud-btn" onClick={zoomOut} title="Zoom Out" aria-label="Zoom Out">
              <ZoomOut size={14} />
            </button>
            <span className="hud-scale">{Math.round(zoom * 100)}%</span>
            <button className="hud-btn" onClick={zoomIn} title="Zoom In" aria-label="Zoom In">
              <ZoomIn size={14} />
            </button>
            <div className="hud-divider"></div>
            <button className="hud-btn reset" onClick={resetView} title="Recenter View" aria-label="Recenter View">
              <Maximize size={14} />
            </button>
            <div className="hud-divider"></div>
            <button 
              className={`hud-btn ${isFullscreen ? 'active' : ''}`} 
              onClick={toggleFullscreen} 
              title={isFullscreen ? "Exit Fullscreen" : "Enlarge Fullscreen"} 
              aria-label={isFullscreen ? "Exit Fullscreen" : "Enlarge Fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          </div>

          <div 
            className="canvas-wrapper"
            style={{ 
              transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
              transformOrigin: selectedPlaybook.category === "Master" ? "735px 290px" : "500px 200px",
              width: selectedPlaybook.category === "Master" ? "1470px" : "1000px",
              height: selectedPlaybook.category === "Master" ? "650px" : "400px",
              transition: isPanning || draggedNodeId ? "none" : "transform 0.15s cubic-bezier(0.1, 0.8, 0.25, 1)"
            }}
          >
            {/* SVG Connections overlay behind nodes */}
            <svg 
              className="connections-svg" 
              width={selectedPlaybook.category === "Master" ? 1470 : 1000} 
              height={selectedPlaybook.category === "Master" ? 650 : 400}
            >
              <defs>
                <linearGradient id="grad-trigger" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#fca5a5" />
                </linearGradient>
                <linearGradient id="grad-delegate" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#c7d2fe" />
                </linearGradient>
                <linearGradient id="grad-query" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#93c5fd" />
                </linearGradient>
                <linearGradient id="grad-approve" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#fde68a" />
                </linearGradient>
                <linearGradient id="grad-sync" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#6ee7b7" />
                </linearGradient>
              </defs>
              {selectedPlaybook.connections.map((c, i) => {
                const isPathActive = isRunning && (() => {
                  if (selectedPlaybook.category === "Master") {
                    const fromNode = selectedPlaybook.nodes.find(n => n.id === c.from);
                    const toNode = selectedPlaybook.nodes.find(n => n.id === c.to);
                    if (!fromNode || !toNode) return false;

                    if (fromNode.y === 30 && toNode.y === 160) return currentStepIndex >= 1;
                    if (fromNode.y === 160 && toNode.y === 290) return currentStepIndex >= 2;
                    if (fromNode.y === 290 && toNode.y === 420) return currentStepIndex >= 3;
                    if (fromNode.y === 420 && toNode.y === 290) return currentStepIndex >= 4;
                    if (fromNode.y === 290 && toNode.y === 160) return currentStepIndex >= 5;
                    if (fromNode.y === 160 && toNode.y === 30) return currentStepIndex >= 6;
                    if (fromNode.y === 30 && toNode.id === "slack_gate") return currentStepIndex >= 7;
                    if (fromNode.id === "slack_gate" && toNode.id === "hubspot") return currentStepIndex >= 8;
                    if (fromNode.id === "hubspot" && toNode.y === 30) return currentStepIndex >= 9;
                    return false;
                  }

                  const connIndex = selectedPlaybook.connections.indexOf(c);
                  if (connIndex === -1) return false;
                  if (connIndex === selectedPlaybook.connections.length - 1) {
                    return currentStepIndex >= selectedPlaybook.steps.length - 1;
                  }
                  
                  return currentStepIndex > connIndex;
                })();
                
                const gradientId = `grad-${c.type || 'delegate'}`;

                return (
                  <g key={i}>
                    <path 
                      d={getPathCoords(c.from, c.to)}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.05)"
                      strokeWidth="3"
                    />
                    {isPathActive && (
                      <path 
                        d={getPathCoords(c.from, c.to)}
                        fill="none"
                        stroke={`url(#${gradientId})`}
                        strokeWidth="3"
                        className="active-connector-pulse"
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Render Visual Node Cards */}
            {selectedPlaybook.nodes.map(node => {
              const IconComponent = iconMap[node.icon] || Cpu;
              const isGlow = currentNodeGlow
                ? currentNodeGlow.split(',').map(s => s.trim()).includes(node.id)
                : false;
              const isStepDone = isRunning && 
                selectedPlaybook.steps.slice(0, currentStepIndex).some(s => 
                  s.nodeId.split(',').map(x => x.trim()).includes(node.id)
                ) &&
                currentStepIndex !== -1;
              
              let typeClass = "";
              if (node.type === "trigger") typeClass = "node-trigger";
              if (node.type === "agent") typeClass = "node-agent";
              if (node.type === "tool") typeClass = "node-tool";
              if (node.type === "gate") typeClass = "node-gate";
              if (node.type === "db") typeClass = "node-db";

              return (
                <div 
                  key={node.id}
                  className={`node-card ${typeClass} ${isGlow ? 'glow' : ''} ${isStepDone ? 'done' : ''} ${isDesignMode ? 'draggable-mode' : ''}`}
                  style={{ left: node.x, top: node.y }}
                  onMouseDown={(e) => handleNodeDragStart(e, node.id)}
                  onDoubleClick={() => handleNodeDoubleClick(node)}
                  title={isDesignMode ? "Hold drag coordinate. Double-click to edit parameters." : undefined}
                >
                  <div className="node-icon-wrap">
                    <IconComponent size={16} />
                  </div>
                  <div className="node-content">
                    <span className="node-lbl">
                      {node.type === "agent" && "🤖 "}
                      {node.type === "tool" && "🔧 "}
                      {node.label}
                    </span>
                    <span className="node-sub">{node.subText}</span>
                  </div>
                  {isGlow && <span className="node-active-pulse"></span>}
                  {isStepDone && <span className="node-check-done">✓</span>}
                  
                  {isDesignMode && (
                    <button 
                      className="delete-node-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNode(node.id);
                      }}
                      title="Delete Node"
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Inline Editing Node Dialog overlay */}
          {isDesignMode && editingNodeId && (
            <div className="edit-modal-backdrop" onClick={() => setEditingNodeId(null)}>
              <div className="edit-modal-content glass-panel" onClick={e => e.stopPropagation()}>
                <h3 style={{ margin: '0 0 1rem 0', color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>Modify Node Metadata</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div className="edit-field">
                    <label style={{ fontSize: '0.68rem', color: '#a1a1aa', display: 'block', marginBottom: '0.25rem' }}>Label Name</label>
                    <input 
                      type="text" 
                      value={editingNodeLabel} 
                      onChange={e => setEditingNodeLabel(e.target.value)}
                      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff', padding: '0.5rem', fontSize: '0.75rem', width: '100%' }}
                    />
                  </div>
                  <div className="edit-field">
                    <label style={{ fontSize: '0.68rem', color: '#a1a1aa', display: 'block', marginBottom: '0.25rem' }}>Subtext Description</label>
                    <input 
                      type="text" 
                      value={editingNodeSubtext} 
                      onChange={e => setEditingNodeSubtext(e.target.value)}
                      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff', padding: '0.5rem', fontSize: '0.75rem', width: '100%' }}
                    />
                  </div>
                  <div className="edit-field">
                    <label style={{ fontSize: '0.68rem', color: '#a1a1aa', display: 'block', marginBottom: '0.25rem' }}>Node Color Type</label>
                    <select 
                      value={editingNodeType}
                      onChange={e => setEditingNodeType(e.target.value as any)}
                      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#fff', padding: '0.5rem', fontSize: '0.75rem', width: '100%' }}
                    >
                      <option value="trigger">Trigger Event (Red)</option>
                      <option value="agent">Strategic Agent (Indigo)</option>
                      <option value="tool">Connection Tool (Blue)</option>
                      <option value="gate">Slack Gate (Amber)</option>
                      <option value="db">HubSpot DB (Emerald)</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button 
                      onClick={() => setEditingNodeId(null)}
                      style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: '#a1a1aa', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '0.5rem', fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveNodeEdit}
                      style={{ flex: 1, background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Right Side: Logs panel OR Sequence step editor when in Design Mode */}
        <section className="console-panel glass-panel">
          <div className="section-header">
            <div className="flex-align">
              <Terminal size={14} className="console-header-icon" />
              <h3>{isDesignMode ? "Sequence Steps Editor" : "System Execution Logs"}</h3>
            </div>
            <span className="console-status-label">{isRunning ? "EXECUTION RUNNING" : isDesignMode ? "DESIGN" : "STANDBY"}</span>
          </div>

          {!isDesignMode ? (
            // --- SIMULATION RUN LOGS ---
            <div className="console-logs-container">
              {consoleLogs.map((log, i) => {
                const isAgentToAgent = log.includes("✉") || log.includes("received") || log.includes("delegating") || log.includes("handover") || log.includes("handshake");
                const isTool = log.includes("[Tool Gateway]") || log.includes("API") || log.includes("invoking") || log.includes("POSTing") || log.includes("Triggering");
                const isSuccess = log.includes("✔") || log.includes("completed successfully") || log.includes("LIVE") || log.includes("live") || log.includes("active") || log.includes("posted") || log.includes("synced") || log.includes("scheduled");
                let logClass = "console-log-line";
                if (isAgentToAgent) logClass += " log-agent-to-agent";
                else if (isTool) logClass += " log-tool-call";
                else if (isSuccess) logClass += " log-success";

                return (
                  <div key={i} className={logClass}>
                    <span className="line-prefix">▶</span> {log}
                  </div>
                );
              })}
              <div ref={consoleEndRef} />
            </div>
          ) : (
            // --- SEQUENCE STEPS EDITOR ---
            <div className="steps-editor-container" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, overflowY: 'auto', maxHeight: '420px', paddingRight: '0.25rem' }}>
              {selectedPlaybook.steps.length === 0 ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#71717a', fontSize: '0.75rem' }}>
                  No simulation logs defined. Add sequential steps mapping coordinates below.
                </div>
              ) : (
                selectedPlaybook.steps.map((step, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      background: 'rgba(255,255,255,0.02)', 
                      border: '1px solid rgba(255,255,255,0.04)', 
                      borderRadius: '8px', 
                      padding: '0.6rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ fontSize: '0.7rem', color: '#a1a1aa', fontWeight: 600 }}>Step {idx + 1}</span>
                      
                      {/* Step reordering controls */}
                      <button onClick={() => handleMoveStep(idx, 'up')} disabled={idx === 0} style={{ background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer', padding: '0.1rem' }} title="Move Up"><ArrowUp size={10} /></button>
                      <button onClick={() => handleMoveStep(idx, 'down')} disabled={idx === selectedPlaybook.steps.length - 1} style={{ background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer', padding: '0.1rem' }} title="Move Down"><ArrowDown size={10} /></button>
                      
                      <button 
                        onClick={() => handleDeleteStep(idx)}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', marginLeft: 'auto', cursor: 'pointer', padding: '0.1rem' }}
                        title="Delete Step"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>

                    {/* Step Node selection */}
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <select
                        value={step.nodeId}
                        onChange={e => handleUpdateStep(idx, 'nodeId', e.target.value)}
                        style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '5px', color: '#fff', fontSize: '0.65rem', padding: '0.2rem' }}
                      >
                        {selectedPlaybook.nodes.map(n => (
                          <option key={n.id} value={n.id}>{n.label}</option>
                        ))}
                      </select>

                      <select
                        value={step.actionType}
                        onChange={e => handleUpdateStep(idx, 'actionType', e.target.value)}
                        style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '5px', color: '#fff', fontSize: '0.65rem', padding: '0.2rem' }}
                      >
                        <option value="think">Think (Agent)</option>
                        <option value="call_tool">Call Tool (API)</option>
                        <option value="hitl">Slack Gate (HITL)</option>
                        <option value="done">Completed (Sync)</option>
                      </select>
                    </div>

                    {/* Step log text */}
                    <textarea
                      placeholder="Write system console log output for this step..."
                      value={step.log}
                      onChange={e => handleUpdateStep(idx, 'log', e.target.value)}
                      rows={2}
                      style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '5px', color: '#fff', fontSize: '0.65rem', padding: '0.35rem', resize: 'vertical' }}
                    />

                    {/* Slack Gate hitlDetails fields */}
                    {step.actionType === "hitl" && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0.35rem', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '4px', border: '1px solid rgba(245, 158, 11, 0.15)' }}>
                        <input 
                          type="text"
                          placeholder="HITL Requester Agent Label"
                          value={step.hitlDetails?.agent || ""}
                          onChange={e => handleUpdateStep(idx, 'hitl_agent', e.target.value)}
                          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', color: '#fff', fontSize: '0.62rem', padding: '0.2rem' }}
                        />
                        <input 
                          type="text"
                          placeholder="Slack Approval Context details"
                          value={step.hitlDetails?.request || ""}
                          onChange={e => handleUpdateStep(idx, 'hitl_request', e.target.value)}
                          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', color: '#fff', fontSize: '0.62rem', padding: '0.2rem' }}
                        />
                      </div>
                    )}
                  </div>
                ))
              )}

              <button
                className="add-step-btn"
                onClick={handleAddStep}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px dashed rgba(255,255,255,0.15)',
                  borderRadius: '8px',
                  color: '#e4e4e7',
                  padding: '0.5rem',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  marginTop: '0.25rem'
                }}
              >
                + Add Playbook sequence step
              </button>
            </div>
          )}

          {/* Interactive Slack human approval Gate overlay */}
          {awaitingApproval && (
            <div id="gtm-hitl-approvals" className="slack-approval-overlay animated-fade">
              <div className="slack-card">
                <div className="slack-card-header">
                  <div className="slack-team">
                    <MessageSquare className="slack-logo" size={16} />
                    <span>Slack Gate: <strong>#gtm-hitl-approvals</strong></span>
                  </div>
                  <span className="slack-alert-badge">Action Gated</span>
                </div>
                <div className="slack-card-body">
                  <p className="slack-warn"><strong>{selectedPlaybook.steps[currentStepIndex]?.hitlDetails?.agent || "Agent Requesting Action"}:</strong></p>
                  <p className="slack-desc">"{selectedPlaybook.steps[currentStepIndex]?.hitlDetails?.request || selectedPlaybook.steps[currentStepIndex]?.log}"</p>
                </div>
                <div className="slack-card-footer">
                  <button className="slack-action-btn reject" onClick={handleSlackDeny}>
                    <X size={14} /> Reject Execution
                  </button>
                  <button className="slack-action-btn approve" onClick={handleSlackApprove}>
                    <Check size={14} /> Approve Action
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Playbook Overview Panel */}
      <section className="overview-panel glass-panel animated-fade">
        <div className="panel-header">
          <div className="title-row">
            <Layers size={18} className="panel-icon" />
            <div>
              <h3>{"Playbook Strategy & Technical Specifications"}</h3>
              <p>{"Active Framework: "}<strong>{selectedPlaybook.name}</strong>{" (" + selectedPlaybook.category + " Motion)"}</p>
            </div>
          </div>
          <div className="overview-tabs">
            {(
              [
                { id: "strategy", label: "Strategic Overview", icon: TrendingUp },
                { id: "orchestration", label: "Agent Orchestration", icon: Cpu },
                { id: "integration", label: "API & Integrations", icon: Network },
                { id: "safeguards", label: "Guardrails & HITL", icon: AlertCircle }
              ] as const
            ).map(t => (
              <button
                key={t.id}
                className={`overview-tab ${activeOverviewTab === t.id ? "active" : ""}`}
                onClick={() => setActiveOverviewTab(t.id)}
              >
                <t.icon size={14} className="tab-icon" />
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="overview-content">
          {activeOverviewTab === "strategy" && (
            <div className="tab-pane animated-fade">
              <div className="pane-grid">
                <div className="pane-column">
                  <span className="badge badge-strategy">{"GTM Hypothesis"}</span>
                  <p className="pane-text">
                    {defaultPlaybookOverviews[selectedPlaybook.id]?.strategy.hypothesis || "Dynamic GTM value proposition and positioning strategy."}
                  </p>
                </div>
                <div className="pane-column">
                  <span className="badge badge-trigger">{"Trigger Condition"}</span>
                  <p className="pane-text">
                    {defaultPlaybookOverviews[selectedPlaybook.id]?.strategy.trigger || "Active event telemetry or workflow webhook."}
                  </p>
                </div>
                <div className="pane-column">
                  <span className="badge badge-outcome">{"High-Value Target Outcomes"}</span>
                  <p className="pane-text">
                    {defaultPlaybookOverviews[selectedPlaybook.id]?.strategy.outcomes || "Pipeline creation, customer retention, or co-marketing campaigns."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeOverviewTab === "orchestration" && (
            <div className="tab-pane animated-fade">
              <div className="pane-grid">
                <div className="pane-column">
                  <span className="badge badge-strategic">{"Strategic Coordinator"}</span>
                  <p className="pane-text">
                    {defaultPlaybookOverviews[selectedPlaybook.id]?.orchestration.strategicRole || "Overseeing agent coordinating GTM signals."}
                  </p>
                  <p className="pane-subtext">
                    {"Responsibility: Strategic alignment, health analytics, and executive pipeline dashboards."}
                  </p>
                </div>
                <div className="pane-column">
                  <span className="badge badge-operational">{"Operational Subagent"}</span>
                  <p className="pane-text">
                    {defaultPlaybookOverviews[selectedPlaybook.id]?.orchestration.operationalRole || "Operational subagent executing specific workflow queries."}
                  </p>
                  <p className="pane-subtext">
                    {"Responsibility: Running scraping waterfalls, updating database objects, and drafting target copy."}
                  </p>
                </div>
                <div className="pane-column">
                  <span className="badge badge-hitl">{"Human-in-the-Loop Gateway"}</span>
                  <p className="pane-text">
                    {defaultPlaybookOverviews[selectedPlaybook.id]?.orchestration.hitlGateway || "Awaiting operator sign-off before executing real tool mutations."}
                  </p>
                  <p className="pane-subtext">
                    {"Responsibility: Reviewing discount caps, validating target emails, and confirming budgets."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeOverviewTab === "integration" && (
            <div className="tab-pane animated-fade">
              <div className="pane-grid scroll-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
                {(defaultPlaybookOverviews[selectedPlaybook.id]?.integrations || []).map((item: any, idx: number) => (
                  <div className="pane-column-card" key={idx}>
                    <span className="card-badge">{item.tool}</span>
                    <p className="card-text">{"Configured to: " + item.purpose}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeOverviewTab === "safeguards" && (
            <div className="tab-pane animated-fade">
              <div className="pane-grid">
                <div className="pane-column">
                  <span className="badge badge-compliance">{"Active Compliance Boundaries"}</span>
                  <p className="pane-text">
                    {defaultPlaybookOverviews[selectedPlaybook.id]?.safeguards.boundaries || "Automated security bounds and domain exclusion rules."}
                  </p>
                </div>
                <div className="pane-column">
                  <span className="badge badge-gate-criteria">{"Slack Approval Criteria"}</span>
                  <p className="pane-text">
                    {defaultPlaybookOverviews[selectedPlaybook.id]?.safeguards.hitlCriteria || "Manual sign-off on campaign launches and opportunity creations."}
                  </p>
                </div>
                <div className="pane-column">
                  <span className="badge badge-timeout">{"Timeout & Safe Defaults"}</span>
                  <p className="pane-text">
                    {defaultPlaybookOverviews[selectedPlaybook.id]?.safeguards.timeoutDefaults || "30-minute response SLA. Reverts to safe 'Denied' state upon expiration."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        .simulator-container {
          padding-bottom: 80px;
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animated-fade {
          animation: fadeIn 0.25s ease-out;
        }
        .title-glow {
          margin: 0;
          font-size: 1.85rem;
          font-weight: 600;
          letter-spacing: -0.025em;
          background: linear-gradient(to right, #ffffff, #a1a1aa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .subtitle {
          margin: 0.35rem 0 0 0;
          color: #a1a1aa;
          font-size: 0.875rem;
        }
        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 1.5rem;
        }
        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(99, 102, 241, 0.1);
          color: #818cf8;
          padding: 0.45rem 1rem;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 600;
          border: 1px solid rgba(99, 102, 241, 0.2);
        }
        .active-icon {
          animation: pulse-glow 2s infinite;
        }
        @keyframes pulse-glow {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }

        /* Mode & Save Toggles */
        .mode-toggle-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #a1a1aa;
          padding: 0.45rem 1rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
        }
        .mode-toggle-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.07);
          color: #f4f4f5;
          border-color: rgba(255, 255, 255, 0.15);
        }
        .mode-toggle-btn.design-active {
          background: rgba(139, 92, 246, 0.15);
          color: #a78bfa;
          border-color: rgba(139, 92, 246, 0.35);
          box-shadow: 0 0 12px rgba(139, 92, 246, 0.15);
        }
        .mode-toggle-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .save-playbook-btn {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.35);
          padding: 0.45rem 1rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
          box-shadow: 0 0 12px rgba(16, 185, 129, 0.15);
        }
        .save-playbook-btn:hover {
          background: rgba(16, 185, 129, 0.25);
          border-color: rgba(16, 185, 129, 0.5);
          transform: translateY(-1px);
        }

        .simulator-grid {
          display: grid;
          grid-template-columns: 280px 1fr 340px;
          gap: 1.25rem;
          min-height: 520px;
        }
        .glass-panel {
          background: rgba(30, 30, 36, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 1.25rem;
          backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
        }
        .section-header {
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          padding-bottom: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .section-header h3 {
          margin: 0;
          font-size: 0.9rem;
          color: #f4f4f5;
          font-weight: 600;
        }
        .section-header p {
          margin: 0.2rem 0 0 0;
          font-size: 0.7rem;
          color: #71717a;
        }

        /* HORIZONTAL PILL TABS */
        .category-tabs {
          display: flex;
          gap: 0.35rem;
          margin-bottom: 1rem;
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          padding: 0.25rem;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .category-tabs::-webkit-scrollbar {
          display: none;
        }
        .category-tab {
          flex: 1;
          background: transparent;
          border: none;
          color: #71717a;
          padding: 0.35rem 0.5rem;
          font-size: 0.68rem;
          font-weight: 600;
          border-radius: 7px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          text-align: center;
        }
        .category-tab:hover {
          color: #e4e4e7;
          background: rgba(255, 255, 255, 0.03);
        }
        .category-tab.active {
          color: #ffffff;
          background: rgba(99, 102, 241, 0.2);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        .category-tab:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* PLAYBOOKS LIST */
        .playbook-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
          overflow-y: auto;
          max-height: 380px;
          scrollbar-width: thin;
        }
        .playbook-btn {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.25s;
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .playbook-btn:hover {
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(255, 255, 255, 0.06);
        }
        .playbook-btn.active {
          background: rgba(99, 102, 241, 0.08);
          border-color: rgba(99, 102, 241, 0.25);
        }
        .playbook-btn strong {
          display: block;
          font-size: 0.78rem;
          color: #e4e4e7;
          margin-bottom: 0.15rem;
        }
        .playbook-btn p {
          margin: 0;
          font-size: 0.65rem;
          color: #71717a;
          line-height: 1.35;
        }
        .playbook-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .trigger-container {
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          padding-top: 1rem;
          margin-top: 1rem;
        }
        .trigger-action-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          border: 1px solid rgba(99, 102, 241, 0.4);
          color: #ffffff;
          border-radius: 10px;
          padding: 0.75rem;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.25);
        }
        .trigger-action-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
        }
        .trigger-action-btn:disabled {
          opacity: 0.5;
          transform: none;
          box-shadow: none;
          cursor: not-allowed;
        }
        .spin-icon {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* CANVAS PANEL & WHITEBOARD CANVAS */
        .canvas-panel {
          flex: 1;
          position: relative;
          min-height: 480px;
          overflow: hidden;
          background: rgba(18, 18, 22, 0.6);
          cursor: grab;
          user-select: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .canvas-panel.fullscreen {
          position: fixed;
          inset: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          z-index: 1000 !important;
          border-radius: 0 !important;
          border: none !important;
          background: #060810 !important;
        }
        .canvas-panel.panning {
          cursor: grabbing;
        }
        .canvas-grid-bg {
          position: absolute;
          inset: 0;
          background-size: 24px 24px;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          pointer-events: none;
        }
        .canvas-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          will-change: transform;
        }
        
        /* Glassmorphic Whiteboard HUD */
        .canvas-hud {
          position: absolute;
          bottom: 1.25rem;
          right: 1.25rem;
          display: flex;
          align-items: center;
          background: rgba(30, 30, 36, 0.75);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 0.35rem;
          z-index: 50;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          pointer-events: auto;
        }
        .hud-btn {
          background: transparent;
          border: none;
          color: #a1a1aa;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .hud-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.05);
        }
        .hud-btn.active {
          color: #818cf8;
          background: rgba(99, 102, 241, 0.15);
        }
        .hud-scale {
          font-size: 0.65rem;
          color: #71717a;
          font-weight: 600;
          padding: 0 0.5rem;
          min-width: 44px;
          text-align: center;
        }
        .hud-divider {
          width: 1px;
          height: 16px;
          background: rgba(255, 255, 255, 0.08);
          margin: 0 0.25rem;
        }

        .connections-svg {
          position: absolute;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 1;
        }
        .active-connector-pulse {
          stroke-dasharray: 8, 8;
          animation: path-flow-anim 30s linear infinite;
        }
        @keyframes path-flow-anim {
          from { stroke-dashoffset: 500; }
          to { stroke-dashoffset: 0; }
        }

        /* Draggable visual node card styles */
        .node-card {
          position: absolute;
          width: 160px;
          height: 68px;
          background: rgba(20, 20, 25, 0.7);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 0.65rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          z-index: 5;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        }
        .node-card.draggable-mode {
          cursor: move;
          border-style: dashed;
        }
        .node-card:hover {
          border-color: rgba(255, 255, 255, 0.15);
          box-shadow: 0 6px 16px rgba(0,0,0,0.35);
        }

        /* Color classes reflecting node categories */
        .node-trigger {
          border-left: 3px solid #ef4444;
          box-shadow: inset 2px 0 0 rgba(239, 68, 68, 0.05);
        }
        .node-agent {
          border-left: 3px solid #6366f1;
          box-shadow: inset 2px 0 0 rgba(99, 102, 241, 0.05);
        }
        .node-tool {
          border-left: 3px solid #3b82f6;
          box-shadow: inset 2px 0 0 rgba(59, 130, 246, 0.05);
        }
        .node-gate {
          border-left: 3px solid #f59e0b;
          box-shadow: inset 2px 0 0 rgba(245, 158, 11, 0.05);
        }
        .node-db {
          border-left: 3px solid #10b981;
          box-shadow: inset 2px 0 0 rgba(16, 185, 129, 0.05);
        }

        /* Inactive node default border states */
        .node-trigger:not(.glow):not(.done) { border-color: #ef4444; }
        .node-agent:not(.glow):not(.done) { border-color: #6366f1; }
        .node-tool:not(.glow):not(.done) { border-color: #3b82f6; }
        .node-gate:not(.glow):not(.done) { border-color: #f59e0b; }
        .node-db:not(.glow):not(.done) { border-color: #10b981; }

        /* Dynamic Glow border configurations */
        .node-trigger.glow { border-color: #ef4444; box-shadow: 0 0 15px rgba(239, 68, 68, 0.4); }
        .node-agent.glow { border-color: #818cf8; box-shadow: 0 0 15px rgba(99, 102, 241, 0.4); }
        .node-tool.glow { border-color: #60a5fa; box-shadow: 0 0 15px rgba(59, 130, 246, 0.4); }
        .node-gate.glow { border-color: #fbbf24; box-shadow: 0 0 15px rgba(245, 158, 11, 0.4); }
        .node-db.glow { border-color: #34d399; box-shadow: 0 0 15px rgba(16, 185, 129, 0.4); }

        .node-card.done {
          border-color: rgba(16, 185, 129, 0.4);
          background: rgba(16, 185, 129, 0.04);
        }

        .node-icon-wrap {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a1a1aa;
          flex-shrink: 0;
        }
        .node-trigger .node-icon-wrap { color: #fca5a5; background: rgba(239, 68, 68, 0.05); }
        .node-agent .node-icon-wrap { color: #c7d2fe; background: rgba(99, 102, 241, 0.05); }
        .node-tool .node-icon-wrap { color: #93c5fd; background: rgba(59, 130, 246, 0.05); }
        .node-gate .node-icon-wrap { color: #fde68a; background: rgba(245, 158, 11, 0.05); }
        .node-db .node-icon-wrap { color: #6ee7b7; background: rgba(16, 185, 129, 0.05); }

        .node-content {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          min-width: 0;
        }
        .node-lbl {
          font-size: 0.72rem;
          font-weight: 600;
          color: #f4f4f5;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .node-sub {
          font-size: 0.6rem;
          color: #71717a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .node-active-pulse {
          position: absolute;
          inset: -1px;
          border-radius: 12px;
          border: 1.5px solid currentColor;
          opacity: 0;
          animation: card-pulse-anim 1.8s infinite;
          pointer-events: none;
        }
        .node-trigger .node-active-pulse { color: #ef4444; }
        .node-agent .node-active-pulse { color: #818cf8; }
        .node-tool .node-active-pulse { color: #60a5fa; }
        .node-gate .node-active-pulse { color: #fbbf24; }
        .node-db .node-active-pulse { color: #34d399; }

        @keyframes card-pulse-anim {
          0% { transform: scale(1.0); opacity: 0.8; }
          100% { transform: scale(1.08); opacity: 0; }
        }
        .node-check-done {
          position: absolute;
          top: -6px;
          left: -6px;
          width: 15px;
          height: 15px;
          background: #10b981;
          color: #ffffff;
          border-radius: 50%;
          font-size: 9px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
        }

        /* Delete Node Card control overlay button */
        .delete-node-btn {
          position: absolute;
          top: -6px;
          right: -6px;
          width: 16px;
          height: 16px;
          background: #ef4444;
          color: #ffffff;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 0 6px rgba(239, 68, 68, 0.4);
          transition: transform 0.15s ease;
          z-index: 10;
        }
        .delete-node-btn:hover {
          transform: scale(1.2);
        }

        /* Editing Modal styles */
        .edit-modal-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }
        .edit-modal-content {
          width: 280px;
          background: rgba(22, 22, 28, 0.95) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        /* SYSTEM CONSOLE LOG PANEL & RICH LOG STYLINGS */
        .console-panel {
          position: relative;
          min-height: 480px;
        }
        .console-logs-container {
          flex: 1;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          padding: 1rem;
          font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
          font-size: 0.68rem;
          line-height: 1.6;
          overflow-y: auto;
          scrollbar-width: thin;
          max-height: 420px;
        }
        .console-status-label {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: #a1a1aa;
          padding: 0.25rem 0.65rem;
          border-radius: 6px;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        .console-log-line {
          color: #a1a1aa;
          margin-bottom: 0.55rem;
          word-break: break-word;
        }
        .line-prefix {
          color: #71717a;
          margin-right: 0.35rem;
        }
        .log-agent-to-agent {
          color: #c7d2fe;
          background: rgba(129, 140, 248, 0.04);
          border-left: 2px solid #818cf8;
          padding-left: 0.4rem;
        }
        .log-tool-call {
          color: #93c5fd;
          background: rgba(59, 130, 246, 0.04);
          border-left: 2px solid #3b82f6;
          padding-left: 0.4rem;
        }
        .log-success {
          color: #6ee7b7;
          background: rgba(16, 185, 129, 0.04);
          border-left: 2px solid #10b981;
          padding-left: 0.4rem;
        }

        /* SLACK HUMAN-IN-THE-LOOP DIALOG OVERLAY CARD */
        .slack-approval-overlay {
          position: absolute;
          inset: 0;
          background: rgba(6, 8, 16, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.25rem;
          z-index: 60;
        }
        .slack-card {
          width: 100%;
          background: #1a1d21;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          overflow: hidden;
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideUp {
          from { transform: translateY(8px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .slack-card-header {
          background: #121417;
          padding: 0.65rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .slack-team {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.72rem;
          color: #d1d2d3;
        }
        .slack-logo {
          color: #e01e5a;
        }
        .slack-alert-badge {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.25);
          border-radius: 4px;
          padding: 0.15rem 0.45rem;
          font-size: 0.58rem;
          font-weight: 700;
        }
        .slack-card-body {
          padding: 1rem;
        }
        .slack-warn {
          margin: 0 0 0.35rem 0;
          font-size: 0.7rem;
          color: #e8e8e8;
        }
        .slack-desc {
          margin: 0;
          font-size: 0.72rem;
          color: #abacad;
          line-height: 1.45;
          font-family: inherit;
        }
        .slack-card-footer {
          background: #121417;
          padding: 0.65rem 1rem;
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .slack-action-btn {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          border: none;
          border-radius: 6px;
          padding: 0.4rem 0.8rem;
          font-size: 0.68rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .slack-action-btn.reject {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        .slack-action-btn.reject:hover {
          background: rgba(239, 68, 68, 0.18);
        }
        .slack-action-btn.approve {
          background: #007a5a;
          color: #ffffff;
        }
        .slack-action-btn.approve:hover {
          background: #148567;
        }

        /* PLAYBOOK SPECIFICATIONS DRAWER TABBED PANELS */
        .overview-panel {
          margin-top: 1.5rem;
          padding: 1.5rem;
        }
        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          padding-bottom: 1rem;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .title-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .panel-icon {
          color: #818cf8;
        }
        .panel-header h3 {
          margin: 0;
          font-size: 0.95rem;
          color: #f4f4f5;
          font-weight: 600;
        }
        .panel-header p {
          margin: 0.2rem 0 0 0;
          font-size: 0.72rem;
          color: #71717a;
        }
        .overview-tabs {
          display: flex;
          gap: 0.5rem;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.04);
          padding: 0.25rem;
          border-radius: 10px;
        }
        .overview-tab {
          background: transparent;
          border: none;
          color: #71717a;
          padding: 0.4rem 0.85rem;
          font-size: 0.7rem;
          font-weight: 600;
          border-radius: 7px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .overview-tab:hover {
          color: #e4e4e7;
        }
        .overview-tab.active {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.04);
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        .tab-icon {
          opacity: 0.7;
        }
        .overview-tab.active .tab-icon {
          color: #818cf8;
          opacity: 1;
        }

        .overview-content {
          min-height: 100px;
        }
        .pane-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .pane-column {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .badge {
          align-self: flex-start;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }
        .badge-strategy { background: rgba(99, 102, 241, 0.12); color: #818cf8; }
        .badge-trigger { background: rgba(239, 68, 68, 0.12); color: #fca5a5; }
        .badge-outcome { background: rgba(16, 185, 129, 0.12); color: #6ee7b7; }
        
        .badge-strategic { background: rgba(99, 102, 241, 0.12); color: #c7d2fe; }
        .badge-operational { background: rgba(59, 130, 246, 0.12); color: #93c5fd; }
        .badge-hitl { background: rgba(245, 158, 11, 0.12); color: #fde68a; }
        
        .badge-compliance { background: rgba(239, 68, 68, 0.12); color: #fca5a5; }
        .badge-gate-criteria { background: rgba(245, 158, 11, 0.12); color: #fde68a; }
        .badge-timeout { background: rgba(16, 185, 129, 0.12); color: #6ee7b7; }

        .pane-text {
          margin: 0;
          font-size: 0.76rem;
          color: #d4d4d8;
          line-height: 1.45;
        }
        .pane-subtext {
          margin: 0;
          font-size: 0.65rem;
          color: #71717a;
          line-height: 1.4;
        }

        .pane-column-card {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 10px;
          padding: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          transition: border-color 0.2s;
        }
        .pane-column-card:hover {
          border-color: rgba(255, 255, 255, 0.06);
        }
        .card-badge {
          align-self: flex-start;
          font-size: 0.62rem;
          font-weight: 700;
          color: #818cf8;
          background: rgba(99, 102, 241, 0.1);
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
        }
        .card-text {
          margin: 0;
          font-size: 0.7rem;
          color: #a1a1aa;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
}
