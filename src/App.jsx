import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import {
  Activity, Bell, CalendarDays, Check, CheckCircle2, Circle, Clock3,
  Command, Gauge, Headphones, ListTodo, Mic, MicOff, Pause, Play, Plus,
  Search, Sparkles, Target, Trash2, Volume2, VolumeX, X, Zap, Cpu,
  Brain, ShieldAlert, Radio, HelpCircle, AlertCircle, RefreshCw, Layers
} from "lucide-react";

// Utility to create futuristic audio clicks and chimes without external assets
class CyberSoundFX {
  constructor() {
    this.ctx = null;
  }
  
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playBeep(freq = 800, type = 'sine', duration = 0.08, vol = 0.05) {
    try {
      this.init();
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) { console.error(e); }
  }

  playSuccess() {
    try {
      this.init();
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(f, now + i * 0.05);
        gain.gain.setValueAtTime(0.04, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.15);
      });
    } catch(e) {}
  }

  playAiActivate() {
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch(e) {}
  }
}

const sfx = new CyberSoundFX();

const seedTasks = [
  { id: 1, title: "Finish Quantum ML Neural Architecture", category: "Study", priority: "High", time: "19:30", done: false, date: "Today" },
  { id: 2, title: "30 min High-Intensity Cardio Workout", category: "Health", priority: "Medium", time: "20:30", done: false, date: "Today" },
  { id: 3, title: "Review JARVIS Holographic Task Hub UI", category: "Project", priority: "High", time: "21:15", done: true, date: "Today" },
  { id: 4, title: "Read 10 pages of Cybernetics Manual", category: "Personal", priority: "Low", time: "22:30", done: false, date: "Today" },
];

function JarvisScene({ speaking, listening, focusMode, systemStatus }) {
  const mountRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x02050e, 0.045);

    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0x1a3366, 1.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00f3ff, 3, 20);
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);

    const coreLight = new THREE.PointLight(0xff007f, 2, 10);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // 3. Core Hologram Group
    const jarvisGroup = new THREE.Group();
    scene.add(jarvisGroup);

    // Outer Polyhedron
    const headGeo = new THREE.IcosahedronGeometry(1.5, 3);
    const headMat = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const head = new THREE.Mesh(headGeo, headMat);
    jarvisGroup.add(head);

    // Inner Core Structure
    const innerGeo = new THREE.IcosahedronGeometry(1.15, 2);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x0066ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    jarvisGroup.add(inner);

    // Orbital Ring 1
    const ringGeo1 = new THREE.TorusGeometry(1.85, 0.015, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x00f3ff, transparent: true, opacity: 0.75 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    jarvisGroup.add(ring1);

    // Orbital Ring 2
    const ringGeo2 = new THREE.TorusGeometry(2.15, 0.012, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x7000ff, transparent: true, opacity: 0.55 });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 2.5;
    jarvisGroup.add(ring2);

    // Orbital Ring 3 (Outer Focus Ring)
    const ringGeo3 = new THREE.TorusGeometry(2.5, 0.008, 16, 120);
    const ringMat3 = new THREE.MeshBasicMaterial({ color: 0xff007f, transparent: true, opacity: 0.4 });
    const ring3 = new THREE.Mesh(ringGeo3, ringMat3);
    ring3.rotation.z = Math.PI / 4;
    jarvisGroup.add(ring3);

    // Central Glowing Arc Reactor Sphere
    const coreGeo = new THREE.SphereGeometry(0.35, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xe0ffff, transparent: true, opacity: 0.95 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    jarvisGroup.add(core);

    // Orbiting Telemetry Nodes
    const nodesGroup = new THREE.Group();
    const nodeGeo = new THREE.SphereGeometry(0.04, 12, 12);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
    for (let i = 0; i < 8; i++) {
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      const angle = (i / 8) * Math.PI * 2;
      node.position.set(Math.cos(angle) * 1.85, Math.sin(angle) * 1.85, 0);
      nodesGroup.add(node);
    }
    ring1.add(nodesGroup);

    // Particle Swarm Vortex
    const particleCount = 1100;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x00f3ff);
    const color2 = new THREE.Color(0x7000ff);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.0 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      positions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      const mixedColor = color1.clone().lerp(color2, Math.random());
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.022,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Tracking Event Listener
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mousePos.current = { x, y };
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 4. Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();

      // Smooth Mouse Tilt Parallax
      camera.position.x += (mousePos.current.x * 0.8 - camera.position.x) * 0.04;
      camera.position.y += (mousePos.current.y * 0.5 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      // Core Dynamic Rotation
      jarvisGroup.rotation.y = t * 0.15;
      jarvisGroup.rotation.x = Math.sin(t * 0.2) * 0.1;

      head.rotation.z = -t * 0.08;
      head.rotation.y = t * 0.05;
      inner.rotation.z = t * 0.12;

      ring1.rotation.z = t * 0.25;
      ring2.rotation.x = t * 0.18;
      ring3.rotation.y = -t * 0.15;

      particles.rotation.y = t * 0.02;

      // State-driven Audio / Speech / Listening Animations
      let pulseSpeed = 2.5;
      let pulseScale = 0.05;

      if (speaking) {
        pulseSpeed = 10.0;
        pulseScale = 0.22;
        headMat.color.setHex(0x00ffff);
        coreMat.color.setHex(0xffffff);
        pointLight.color.setHex(0x00ffff);
        pointLight.intensity = 4.5;
      } else if (listening) {
        pulseSpeed = 6.0;
        pulseScale = 0.18;
        headMat.color.setHex(0xff007f);
        coreMat.color.setHex(0xff3399);
        pointLight.color.setHex(0xff007f);
        pointLight.intensity = 4.0;
      } else if (focusMode) {
        pulseSpeed = 1.5;
        pulseScale = 0.08;
        headMat.color.setHex(0x7000ff);
        coreMat.color.setHex(0x00f3ff);
        pointLight.color.setHex(0x7000ff);
        pointLight.intensity = 3.0;
      } else {
        headMat.color.setHex(0x00f3ff);
        coreMat.color.setHex(0xe0ffff);
        pointLight.color.setHex(0x00f3ff);
        pointLight.intensity = 2.5;
      }

      // Pulsing Scale logic
      const scaleVal = 1 + Math.sin(t * pulseSpeed) * pulseScale;
      core.scale.setScalar(scaleVal);
      inner.scale.setScalar(1 + Math.cos(t * pulseSpeed * 0.8) * (pulseScale * 0.5));

      // Camera Focus Mode Transition
      const targetCamZ = focusMode ? 5.8 : 7.5;
      camera.position.z += (targetCamZ - camera.position.z) * 0.03;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 5. Responsive Resizing
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [speaking, listening, focusMode, systemStatus]);

  return <div className={`jarvis-3d-canvas ${focusMode ? "focus-active" : ""}`} ref={mountRef} aria-hidden="true" />;
}

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("jarvis-cyber-tasks")) || seedTasks;
    } catch {
      return seedTasks;
    }
  });

  const [filter, setFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("General");
  const [newTaskPriority, setNewTaskPriority] = useState("Medium");
  const [newTaskTime, setNewTaskTime] = useState("12:00");

  const [time, setTime] = useState(new Date());
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [focusSeconds, setFocusSeconds] = useState(25 * 60);
  const [toast, setToast] = useState({ text: "", type: "info" });

  // AI Chat & Assistant State
  const [aiHistory, setAiHistory] = useState([
    { role: "assistant", text: "JARVIS AI online. Systems nominal. How may I optimize your workflow today?" }
  ]);
  const [aiInput, setAiInput] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);

  const recognitionRef = useRef(null);
  const searchInputRef = useRef(null);
  const quickAddRef = useRef(null);

  // Sync LocalStorage
  useEffect(() => {
    localStorage.setItem("jarvis-cyber-tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Clock Update
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Pomodoro Focus Countdown
  useEffect(() => {
    if (!focusMode || focusSeconds <= 0) return;
    const id = setInterval(() => {
      setFocusSeconds((s) => {
        if (s <= 1) {
          setFocusMode(false);
          sfx.playSuccess();
          notify("Focus session completed! Great job.", "success");
          return 25 * 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [focusMode, focusSeconds]);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Avoid hotkeys when typing in input/textarea
      if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) return;

      if (e.key === "/") {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        quickAddRef.current?.focus();
      } else if (e.code === "Space") {
        e.preventDefault();
        toggleFocusMode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusMode, focusSeconds]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.done).length;
    const pending = total - done;
    const percent = total ? Math.round((done / total) * 100) : 0;
    return { total, done, pending, percent };
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesFilter = filter === "All" || (filter === "Completed" ? t.done : !t.done);
      const matchesCat = categoryFilter === "All" || t.category === categoryFilter;
      const matchesQuery = t.title.toLowerCase().includes(query.toLowerCase()) ||
                           t.category.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesCat && matchesQuery;
    });
  }, [tasks, filter, categoryFilter, query]);

  const notify = (text, type = "info") => {
    setToast({ text, type });
    sfx.playBeep(type === "error" ? 300 : 900, "sine", 0.1);
    window.clearTimeout(window.toastTimer);
    window.toastTimer = window.setTimeout(() => setToast({ text: "", type: "info" }), 3200);
  };

  const addTask = () => {
    const title = newTaskTitle.trim();
    if (!title) {
      notify("Please enter a task description.", "error");
      return;
    }
    const newTask = {
      id: Date.now(),
      title,
      category: newTaskCategory,
      priority: newTaskPriority,
      time: newTaskTime || "Anytime",
      done: false,
      date: "Today",
    };
    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle("");
    sfx.playBeep(1100, "sine", 0.1);
    notify("Task integrated into active command queue.", "success");
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const newState = !t.done;
          if (newState) sfx.playSuccess();
          else sfx.playBeep(600, "sine", 0.08);
          return { ...t, done: newState };
        }
        return t;
      })
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    sfx.playBeep(400, "sawtooth", 0.08);
    notify("Task purged from queue.");
  };

  const toggleFocusMode = () => {
    if (!focusMode && focusSeconds === 0) setFocusSeconds(25 * 60);
    setFocusMode((v) => !v);
    sfx.playAiActivate();
  };

  const speak = (text) => {
    if (!("speechSynthesis" in window)) {
      notify("Speech synthesis unverified in browser environment.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 0.92;
    setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const startVoiceCommand = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      notify("Voice recognition API unavailable in current client.", "error");
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    sfx.playAiActivate();
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
      notify("JARVIS audio receptors listening...", "info");
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
      notify("Audio input unrecognized. Try again.", "error");
    };

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript.trim();
      notify(`Voice input detected: "${transcript}"`);
      handleVoiceAction(transcript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleVoiceAction = (cmd) => {
    const lower = cmd.toLowerCase();
    if (lower.startsWith("add") || lower.startsWith("create") || lower.startsWith("remind me to")) {
      const cleanTask = cmd.replace(/^(add|create|remind me to)\s+/i, "");
      setNewTaskTitle(cleanTask);
      notify(`Drafted task: ${cleanTask}`);
    } else if (lower.includes("brief") || lower.includes("status")) {
      const briefMsg = `Systems online. You have ${stats.pending} pending tasks and ${stats.done} completed tasks. Focus core is at ${Math.round((focusSeconds/60))} minutes.`;
      speak(briefMsg);
    } else if (lower.includes("focus") || lower.includes("start timer")) {
      setFocusMode(true);
      speak("Activating quantum focus mode.");
    } else {
      // Send directly to Gemini AI
      callGeminiAi(cmd);
    }
  };

  const callGeminiAi = async (userPrompt) => {
    if (!userPrompt.trim()) return;

    // Add user prompt to local AI chat
    const updatedHistory = [...aiHistory, { role: "user", text: userPrompt }];
    setAiHistory(updatedHistory);
    setAiInput("");
    setIsAiThinking(true);
    sfx.playBeep(750, "sine", 0.05);

    try {
      const systemInstructionText = `
You are JARVIS, an advanced futuristic AI Assistant integrated into a high-tech Task Hub.
Task context: Total tasks = ${stats.total}, Pending = ${stats.pending}, Completed = ${stats.done}.
Active task list summary: ${JSON.stringify(tasks.map(t => ({ title: t.title, done: t.done, category: t.category })))}
Be concise, articulate, futuristic yet warm, ultra-helpful, and crisp.
`;

      const apiKey = ""; // Canvas runtime automatically supplies API key
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

      const payload = {
        contents: updatedHistory.map((msg) => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.text }],
        })),
        systemInstruction: {
          parts: [{ text: systemInstructionText }],
        },
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "JARVIS primary core returned empty signal telemetry.";

      setAiHistory((prev) => [...prev, { role: "assistant", text: reply }]);
      speak(reply);
    } catch (err) {
      console.error("Gemini API Error:", err);
      const errMsg = "I encountered an interference signal connecting to my primary neural core.";
      setAiHistory((prev) => [...prev, { role: "assistant", text: errMsg }]);
      notify(errMsg, "error");
    } finally {
      setIsAiThinking(false);
    }
  };

  // AI Helper Shortcut: Auto Breakdown Tasks
  const handleAiBreakdown = () => {
    const prompt = `Break down my current high priority tasks into 3 rapid actionable sub-steps.`;
    callGeminiAi(prompt);
  };

  // AI Helper Shortcut: Optimize Schedule
  const handleAiOptimize = () => {
    const prompt = `Based on my current active tasks list, recommend an optimal chronological sequence for completing them efficiently today.`;
    callGeminiAi(prompt);
  };

  const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className={`jarvis-app ${focusMode ? "mode-focus" : ""}`}>
      {/* Background 3D Holographic Scene */}
      <JarvisScene speaking={speaking} listening={listening} focusMode={focusMode} systemStatus={stats.percent} />

      {/* Cyber Grid Overlay & Vignette */}
      <div className="cyber-overlay" />

      {/* Top Header Navigation */}
      <header className="topbar">
        <div className="brand-group">
          <div className="arc-reactor-logo">
            <Sparkles size={18} className="spin-slow" />
          </div>
          <div className="brand-titles">
            <div className="brand-main">
              J.A.R.V.I.S. <span className="version-badge">v3.8</span>
            </div>
            <span className="brand-sub">QUANTUM TASK HUB</span>
          </div>
        </div>

        <div className="status-indicator">
          <span className={`status-pulse ${listening ? "listening" : focusMode ? "focus" : "online"}`} />
          <span className="status-text">
            {listening ? "RECEPTORS ACTIVE" : focusMode ? "FOCUS QUANTUM CORE" : "SYSTEM ONLINE"}
          </span>
        </div>

        <div className="clock-widget">
          <div className="clock-time">
            {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </div>
          <div className="clock-date">
            {time.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
          </div>
        </div>
      </header>

      {/* Dashboard Main Layout */}
      <main className="dashboard-grid">
        {/* Hero Welcome Banner */}
        <section className="hero-banner glass-panel">
          <div className="hero-content">
            <div className="cyber-tag">
              <Zap size={14} /> COMMAND INTERFACE
            </div>
            <h1>
              Greetings, Commander.<br />
              <span className="gradient-text">All systems operational.</span>
            </h1>
            <p>
              Real-time task synchronization, neural AI schedule assistance, and deep focus mode ready for deployment.
            </p>
          </div>
          <div className="hero-controls">
            <button
              className="cyber-btn glass"
              onClick={() => speak(`Systems nominal. ${stats.pending} tasks pending. Completion rate is at ${stats.percent} percent.`)}
            >
              <Volume2 size={16} /> SYSTEM BRIEF
            </button>
            <button
              className="cyber-btn primary"
              onClick={() => quickAddRef.current?.focus()}
            >
              <Plus size={16} /> NEW MISSION
            </button>
          </div>
        </section>

        {/* Dynamic Telemetry Stats */}
        <section className="stats-container">
          <div className="stat-card glass-panel">
            <div className="stat-icon cyan"><ListTodo size={20} /></div>
            <div className="stat-info">
              <span className="stat-label">ACTIVE TASKS</span>
              <strong className="stat-val">{stats.pending}</strong>
              <small className="stat-sub">In queue</small>
            </div>
          </div>

          <div className="stat-card glass-panel">
            <div className="stat-icon purple"><CheckCircle2 size={20} /></div>
            <div className="stat-info">
              <span className="stat-label">COMPLETION</span>
              <strong className="stat-val">{stats.percent}%</strong>
              <small className="stat-sub">{stats.done} finished</small>
            </div>
          </div>

          <div className="stat-card glass-panel">
            <div className="stat-icon magenta"><Target size={20} /></div>
            <div className="stat-info">
              <span className="stat-label">FOCUS SESSION</span>
              <strong className="stat-val">{fmtTime(focusSeconds)}</strong>
              <small className="stat-sub">{focusMode ? "Timer engaged" : "Ready to launch"}</small>
            </div>
          </div>

          <div className="stat-card glass-panel">
            <div className="stat-icon green"><Activity size={20} /></div>
            <div className="stat-info">
              <span className="stat-label">SYSTEM PULSE</span>
              <strong className="stat-val">99.8%</strong>
              <small className="stat-sub">Latency 12ms</small>
            </div>
          </div>
        </section>

        {/* Main Work Area: Tasks Queue + Side AI & Focus Controls */}
        <section className="main-content-split">
          {/* Left Column: Tasks Queue */}
          <div className="glass-panel task-queue-panel">
            <div className="panel-header">
              <div>
                <span className="panel-kicker">QUEUE PROTOCOL</span>
                <h2>Active Mission Logs</h2>
              </div>
              <button
                className="icon-action-btn"
                title="Purge Completed Tasks"
                onClick={() => {
                  setTasks((p) => p.filter((t) => !t.done));
                  notify("Purged completed tasks.");
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Quick Add Task Bar */}
            <div className="quick-add-bar">
              <Plus size={18} className="add-icon" />
              <input
                ref={quickAddRef}
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                placeholder="Log new mission or task (Ctrl+N)..."
                className="quick-input"
              />

              <select
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value)}
                className="cyber-select"
              >
                <option value="General">General</option>
                <option value="Study">Study</option>
                <option value="Project">Project</option>
                <option value="Health">Health</option>
                <option value="Personal">Personal</option>
              </select>

              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
                className="cyber-select"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <input
                type="time"
                value={newTaskTime}
                onChange={(e) => setNewTaskTime(e.target.value)}
                className="cyber-time-input"
              />

              <button
                className={`voice-mic-btn ${listening ? "listening" : ""}`}
                onClick={startVoiceCommand}
                title="Voice Task Input"
              >
                {listening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>

              <button className="cyber-btn primary sm" onClick={addTask}>
                ADD
              </button>
            </div>

            {/* Filters and Search Bar */}
            <div className="filter-controls">
              <div className="pill-tabs">
                {["All", "Pending", "Completed"].map((f) => (
                  <button
                    key={f}
                    className={`tab-btn ${filter === f ? "active" : ""}`}
                    onClick={() => {
                      setFilter(f);
                      sfx.playBeep(800, "sine", 0.04);
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="category-select-wrapper">
                <Layers size={14} />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="cyber-select category"
                >
                  <option value="All">All Categories</option>
                  <option value="Study">Study</option>
                  <option value="Project">Project</option>
                  <option value="Health">Health</option>
                  <option value="Personal">Personal</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="search-box">
                <Search size={14} />
                <input
                  ref={searchInputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search tasks (Press '/')..."
                />
              </div>
            </div>

            {/* Task Item List */}
            <div className="task-list-scroller">
              {visibleTasks.map((task) => (
                <article key={task.id} className={`task-card ${task.done ? "is-done" : ""}`}>
                  <button
                    className="check-box-btn"
                    onClick={() => toggleTask(task.id)}
                    aria-label={`Mark ${task.title} as ${task.done ? "pending" : "done"}`}
                  >
                    {task.done ? <Check size={14} /> : <Circle size={16} />}
                  </button>

                  <div className="task-body">
                    <span className="task-title">{task.title}</span>
                    <div className="task-meta">
                      <span className="badge category">{task.category}</span>
                      <span className={`badge priority ${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>

                  <div className="task-time-stamp">
                    <Clock3 size={13} />
                    <span>{task.time}</span>
                  </div>

                  <button
                    className="task-delete-btn"
                    onClick={() => deleteTask(task.id)}
                    aria-label={`Delete ${task.title}`}
                  >
                    <X size={15} />
                  </button>
                </article>
              ))}

              {!visibleTasks.length && (
                <div className="empty-state">
                  <CheckCircle2 size={32} className="empty-icon" />
                  <p>No active tasks match current parameters.</p>
                  <small>Clear search filters or add a new mission log.</small>
                </div>
              )}
            </div>
          </div>

          {/* Right Side Column: AI Assistant & Focus Quantum Timer */}
          <aside className="side-column">
            {/* Gemini AI Voice & Chat Panel */}
            <div className="glass-panel ai-panel">
              <div className="panel-kicker">
                <Brain size={14} /> GEMINI NEURAL INTERFACE
              </div>
              <h2>JARVIS AI Assistant</h2>

              {/* Chat Messages Window */}
              <div className="ai-chat-scroller">
                {aiHistory.map((msg, i) => (
                  <div key={i} className={`chat-bubble ${msg.role}`}>
                    <span className="chat-speaker">
                      {msg.role === "assistant" ? "JARVIS" : "COMMANDER"}
                    </span>
                    <p>{msg.text}</p>
                  </div>
                ))}
                {isAiThinking && (
                  <div className="chat-bubble assistant thinking">
                    <RefreshCw size={14} className="spin-slow" /> Processing neural telemetry...
                  </div>
                )}
              </div>

              {/* Quick AI Action Shortcuts */}
              <div className="ai-quick-actions">
                <button className="mini-chip" onClick={handleAiBreakdown}>
                  <Cpu size={12} /> Auto-Breakdown
                </button>
                <button className="mini-chip" onClick={handleAiOptimize}>
                  <Sparkles size={12} /> Optimize Schedule
                </button>
              </div>

              {/* AI Chat Input Box */}
              <div className="ai-input-group">
                <input
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && callGeminiAi(aiInput)}
                  placeholder="Ask JARVIS or give a command..."
                />
                <button className="cyber-btn primary sm" onClick={() => callGeminiAi(aiInput)}>
                  SEND
                </button>
              </div>
            </div>

            {/* Deep Work Quantum Focus Timer Panel */}
            <div className="glass-panel focus-panel">
              <div className="panel-header compact">
                <div>
                  <span className="panel-kicker">QUANTUM FOCUS</span>
                  <h2>Pomodoro Core</h2>
                </div>
                <Gauge size={18} className="text-cyan" />
              </div>

              <div className="timer-display">{fmtTime(focusSeconds)}</div>

              <div className="timer-btn-group">
                <button className="cyber-btn primary" onClick={toggleFocusMode}>
                  {focusMode ? <Pause size={16} /> : <Play size={16} />}
                  {focusMode ? "PAUSE CORE" : "ENGAGE FOCUS"}
                </button>
                <button
                  className="cyber-btn glass"
                  onClick={() => {
                    setFocusMode(false);
                    setFocusSeconds(25 * 60);
                    sfx.playBeep(400, "sine", 0.05);
                  }}
                >
                  RESET
                </button>
              </div>
            </div>

            {/* Accessibility & Audio Controls */}
            <div className="glass-panel accessibility-panel">
              <span className="panel-kicker">INTERFACE UTILITIES</span>
              <div className="utility-row">
                <span>
                  <Headphones size={14} /> Voice Speech
                </span>
                <button
                  className="mini-chip"
                  onClick={() => speak("JARVIS voice synthesizer operating at optimal clarity.")}
                >
                  TEST AUDIOMETRY
                </button>
              </div>
              <div className="utility-row">
                <span>
                  <Bell size={14} /> Desktop Alerts
                </span>
                <button
                  className="mini-chip"
                  onClick={() => {
                    if ("Notification" in window) {
                      Notification.requestPermission().then((p) =>
                        notify(p === "granted" ? "Notifications enabled." : "Permission denied.")
                      );
                    } else notify("Browser notifications unsupported.");
                  }}
                >
                  PERMISSIONS
                </button>
              </div>
            </div>
          </aside>
        </section>
      </main>

      {/* Futuristic Cyber Footer */}
      <footer className="topbar footer-bar">
        <span>JARVIS COMMAND CORE v3.8</span>
        <span>LOCAL STORAGE ENCRYPTED</span>
        <span>
          KEYBINDINGS: <kbd>/</kbd> SEARCH · <kbd>CTRL+N</kbd> NEW TASK · <kbd>SPACE</kbd> FOCUS TIMER
        </span>
      </footer>

      {/* Toast Notification Container */}
      {toast.text && (
        <div className={`toast-notification ${toast.type}`}>
          <AlertCircle size={16} />
          <span>{toast.text}</span>
        </div>
      )}

      {/* Embedded Complete Cyber Styling */}
      <style>{`
        /* --- Root Variables & Theme Colors --- */
        :root {
          --bg-dark: #02050e;
          --neon-cyan: #00f3ff;
          --neon-blue: #0066ff;
          --neon-purple: #7000ff;
          --neon-magenta: #ff007f;
          --panel-glass: rgba(6, 15, 34, 0.72);
          --panel-border: rgba(0, 243, 255, 0.22);
          --text-main: #e0f2fe;
          --text-muted: #64748b;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        body, html, #root {
          width: 100%;
          min-height: 100vh;
          background-color: var(--bg-dark);
          color: var(--text-main);
          overflow-x: hidden;
        }

        /* --- 3D Background Canvas & Overlay --- */
        .jarvis-app {
          position: relative;
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: radial-gradient(circle at 50% 20%, #081b3e 0%, var(--bg-dark) 80%);
        }

        .jarvis-3d-canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 1;
          pointer-events: none;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cyber-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
                      linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
          background-size: 100% 3px, 6px 100%;
          pointer-events: none;
          z-index: 2;
          opacity: 0.6;
        }

        /* --- Glassmorphic Containers --- */
        .glass-panel {
          background: var(--panel-glass);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--panel-border);
          border-radius: 12px;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 0 12px rgba(0, 243, 255, 0.05);
          padding: 20px;
          transition: all 0.3s ease;
        }

        .glass-panel:hover {
          border-color: rgba(0, 243, 255, 0.4);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.6), inset 0 0 16px rgba(0, 243, 255, 0.08);
        }

        /* --- Topbar & Navigation --- */
        .topbar {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 32px;
          background: rgba(2, 5, 14, 0.8);
          border-bottom: 1px solid var(--panel-border);
          backdrop-filter: blur(12px);
        }

        .brand-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .arc-reactor-logo {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--neon-cyan) 0%, var(--neon-blue) 70%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          box-shadow: 0 0 15px var(--neon-cyan);
        }

        .spin-slow {
          animation: spin 10s linear infinite;
        }

        @keyframes spin { 100% { transform: rotate(360deg); } }

        .brand-main {
          font-weight: 800;
          font-size: 1.1rem;
          letter-spacing: 2px;
          color: #fff;
        }

        .version-badge {
          font-size: 0.65rem;
          padding: 2px 6px;
          background: rgba(0, 243, 255, 0.15);
          border: 1px solid var(--neon-cyan);
          border-radius: 4px;
          color: var(--neon-cyan);
          vertical-align: middle;
        }

        .brand-sub {
          font-size: 0.65rem;
          letter-spacing: 3px;
          color: var(--text-muted);
          display: block;
        }

        /* --- Status Indicators --- */
        .status-indicator {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 14px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          font-size: 0.75rem;
          letter-spacing: 1.5px;
        }

        .status-pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--neon-cyan);
          box-shadow: 0 0 10px var(--neon-cyan);
          animation: pulse 2s infinite;
        }

        .status-pulse.listening { background: var(--neon-magenta); box-shadow: 0 0 12px var(--neon-magenta); }
        .status-pulse.focus { background: var(--neon-purple); box-shadow: 0 0 12px var(--neon-purple); }

        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

        .clock-widget {
          text-align: right;
        }

        .clock-time {
          font-family: monospace;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--neon-cyan);
          text-shadow: 0 0 8px rgba(0, 243, 255, 0.4);
        }

        .clock-date {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        /* --- Dashboard Grid Layout --- */
        .dashboard-grid {
          position: relative;
          z-index: 5;
          max-width: 1440px;
          margin: 0 auto;
          padding: 24px 32px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
        }

        /* --- Hero Banner --- */
        .hero-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, rgba(0, 243, 255, 0.08) 0%, rgba(112, 0, 255, 0.05) 100%);
        }

        .cyber-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.7rem;
          letter-spacing: 2px;
          color: var(--neon-cyan);
          margin-bottom: 8px;
        }

        .hero-content h1 {
          font-size: 1.8rem;
          line-height: 1.2;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .gradient-text {
          background: linear-gradient(90deg, var(--neon-cyan), var(--neon-purple));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-content p {
          color: #94a3b8;
          font-size: 0.9rem;
          max-width: 600px;
        }

        .hero-controls {
          display: flex;
          gap: 12px;
        }

        /* --- Cyber Buttons --- */
        .cyber-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .cyber-btn.glass {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.15);
          color: var(--text-main);
        }

        .cyber-btn.glass:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--neon-cyan);
          color: var(--neon-cyan);
        }

        .cyber-btn.primary {
          background: linear-gradient(90deg, var(--neon-cyan), var(--neon-blue));
          color: #02050e;
          box-shadow: 0 0 15px rgba(0, 243, 255, 0.3);
        }

        .cyber-btn.primary:hover {
          box-shadow: 0 0 25px rgba(0, 243, 255, 0.6);
          transform: translateY(-1px);
        }

        .cyber-btn.sm {
          padding: 6px 12px;
          font-size: 0.75rem;
        }

        /* --- Stats Cards Container --- */
        .stats-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
        }

        .stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon.cyan { background: rgba(0, 243, 255, 0.1); color: var(--neon-cyan); border: 1px solid rgba(0, 243, 255, 0.3); }
        .stat-icon.purple { background: rgba(112, 0, 255, 0.1); color: var(--neon-purple); border: 1px solid rgba(112, 0, 255, 0.3); }
        .stat-icon.magenta { background: rgba(255, 0, 127, 0.1); color: var(--neon-magenta); border: 1px solid rgba(255, 0, 127, 0.3); }
        .stat-icon.green { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); }

        .stat-label {
          font-size: 0.65rem;
          letter-spacing: 1.5px;
          color: var(--text-muted);
          display: block;
        }

        .stat-val {
          font-size: 1.4rem;
          font-weight: 800;
          color: #fff;
        }

        .stat-sub {
          font-size: 0.7rem;
          color: var(--text-muted);
          display: block;
        }

        /* --- Split Main Layout --- */
        .main-content-split {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 20px;
        }

        @media (max-width: 1024px) {
          .main-content-split {
            grid-template-columns: 1fr;
          }
        }

        /* --- Panel Headers --- */
        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .panel-header.compact { margin-bottom: 8px; }

        .panel-kicker {
          font-size: 0.65rem;
          letter-spacing: 2px;
          color: var(--neon-cyan);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .panel-header h2 {
          font-size: 1.2rem;
          font-weight: 700;
        }

        .icon-action-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-muted);
          padding: 6px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .icon-action-btn:hover {
          color: var(--neon-magenta);
          border-color: var(--neon-magenta);
        }

        /* --- Quick Add Bar --- */
        .quick-add-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 8px 12px;
          border-radius: 8px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .add-icon { color: var(--neon-cyan); }

        .quick-input {
          flex: 1;
          min-width: 160px;
          background: transparent;
          border: none;
          color: #fff;
          font-size: 0.85rem;
          outline: none;
        }

        .cyber-select, .cyber-time-input {
          background: rgba(6, 15, 34, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: var(--text-main);
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 0.75rem;
          outline: none;
        }

        .cyber-select:focus, .cyber-time-input:focus {
          border-color: var(--neon-cyan);
        }

        .voice-mic-btn {
          background: rgba(255, 0, 127, 0.1);
          border: 1px solid rgba(255, 0, 127, 0.3);
          color: var(--neon-magenta);
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .voice-mic-btn.listening {
          background: var(--neon-magenta);
          color: #fff;
          box-shadow: 0 0 12px var(--neon-magenta);
          animation: pulse 1s infinite;
        }

        /* --- Filters & Search Bar --- */
        .filter-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .pill-tabs {
          display: flex;
          background: rgba(0, 0, 0, 0.4);
          padding: 3px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .tab-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          padding: 5px 12px;
          font-size: 0.75rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab-btn.active {
          background: rgba(0, 243, 255, 0.15);
          color: var(--neon-cyan);
          font-weight: 700;
        }

        .category-select-wrapper {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-muted);
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 6px 10px;
          border-radius: 6px;
        }

        .search-box input {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 0.75rem;
          outline: none;
          width: 140px;
        }

        /* --- Task Cards Scroller --- */
        .task-list-scroller {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 480px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .task-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .task-card:hover {
          background: rgba(0, 243, 255, 0.03);
          border-color: rgba(0, 243, 255, 0.2);
        }

        .task-card.is-done {
          opacity: 0.5;
        }

        .task-card.is-done .task-title {
          text-decoration: line-through;
        }

        .check-box-btn {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 1px solid var(--neon-cyan);
          background: transparent;
          color: var(--neon-cyan);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .check-box-btn:hover {
          background: rgba(0, 243, 255, 0.2);
        }

        .task-body {
          flex: 1;
        }

        .task-title {
          font-size: 0.85rem;
          font-weight: 600;
          display: block;
          margin-bottom: 4px;
        }

        .task-meta {
          display: flex;
          gap: 6px;
        }

        .badge {
          font-size: 0.6rem;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .badge.category {
          background: rgba(255, 255, 255, 0.08);
          color: #94a3b8;
        }

        .badge.priority.high { background: rgba(255, 0, 127, 0.2); color: var(--neon-magenta); border: 1px solid rgba(255, 0, 127, 0.4); }
        .badge.priority.medium { background: rgba(0, 243, 255, 0.2); color: var(--neon-cyan); border: 1px solid rgba(0, 243, 255, 0.4); }
        .badge.priority.low { background: rgba(100, 116, 139, 0.2); color: #cbd5e1; }

        .task-time-stamp {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .task-delete-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: color 0.2s;
        }

        .task-delete-btn:hover {
          color: var(--neon-magenta);
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: var(--text-muted);
        }

        .empty-icon {
          margin-bottom: 8px;
          color: var(--neon-cyan);
          opacity: 0.6;
        }

        /* --- Side Column Panels --- */
        .side-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* AI Assistant Panel */
        .ai-panel {
          display: flex;
          flex-direction: column;
          height: 340px;
        }

        .ai-chat-scroller {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin: 12px 0;
          padding-right: 4px;
        }

        .chat-bubble {
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 0.75rem;
          line-height: 1.4;
          max-width: 90%;
        }

        .chat-bubble.assistant {
          background: rgba(0, 243, 255, 0.08);
          border: 1px solid rgba(0, 243, 255, 0.2);
          align-self: flex-start;
        }

        .chat-bubble.user {
          background: rgba(112, 0, 255, 0.15);
          border: 1px solid rgba(112, 0, 255, 0.3);
          align-self: flex-end;
        }

        .chat-speaker {
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 1px;
          color: var(--neon-cyan);
          display: block;
          margin-bottom: 2px;
        }

        .ai-quick-actions {
          display: flex;
          gap: 6px;
          margin-bottom: 8px;
        }

        .mini-chip {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-main);
          font-size: 0.65rem;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s;
        }

        .mini-chip:hover {
          border-color: var(--neon-cyan);
          color: var(--neon-cyan);
        }

        .ai-input-group {
          display: flex;
          gap: 6px;
        }

        .ai-input-group input {
          flex: 1;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          padding: 6px 10px;
          color: #fff;
          font-size: 0.75rem;
          outline: none;
        }

        /* Focus Panel */
        .focus-panel {
          text-align: center;
        }

        .timer-display {
          font-family: monospace;
          font-size: 2.8rem;
          font-weight: 800;
          color: var(--neon-purple);
          text-shadow: 0 0 20px rgba(112, 0, 255, 0.5);
          margin: 12px 0;
        }

        .timer-btn-group {
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        /* Utility Panel */
        .utility-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        /* --- Footer & Toast --- */
        .footer-bar {
          margin-top: auto;
          font-size: 0.65rem;
          color: var(--text-muted);
          letter-spacing: 1px;
        }

        kbd {
          background: rgba(255, 255, 255, 0.1);
          padding: 2px 4px;
          border-radius: 3px;
          color: var(--neon-cyan);
        }

        .toast-notification {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 100;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 18px;
          background: rgba(6, 15, 34, 0.95);
          border: 1px solid var(--neon-cyan);
          border-radius: 8px;
          box-shadow: 0 0 20px rgba(0, 243, 255, 0.3);
          font-size: 0.8rem;
          color: #fff;
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .toast-notification.error {
          border-color: var(--neon-magenta);
          box-shadow: 0 0 20px rgba(255, 0, 127, 0.3);
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}