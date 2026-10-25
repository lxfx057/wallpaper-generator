import React, { useState, useRef, useEffect } from 'react';
import { Download, Sparkles, RefreshCw, Smartphone, Laptop, Tablet, ArrowLeft, Palette, Sliders, Layers, Check, Eyedropper } from 'lucide-react';

const DEVICES = [
  // --- iPhone ---
  { id: 'iphone-16-pro-max', name: 'iPhone 16 / 15 Pro Max', width: 1320, height: 2868, type: 'phone', category: 'iPhone', aspect: '9/19.5' },
  { id: 'iphone-16-pro', name: 'iPhone 16 / 15 Pro', width: 1206, height: 2622, type: 'phone', category: 'iPhone', aspect: '9/19.5' },
  { id: 'iphone-15-14', name: 'iPhone 15 / 14 / 13', width: 1170, height: 2532, type: 'phone', category: 'iPhone', aspect: '9/19.5' },
  { id: 'iphone-x', name: 'iPhone X / XS / 11 Pro', width: 1125, height: 2436, type: 'phone', category: 'iPhone', aspect: '9/19.5' },
  
  // --- iPad ---
  { id: 'ipad-pro-13', name: 'iPad Pro 13" (M4)', width: 2064, height: 2752, type: 'tablet', category: 'iPad', aspect: '3/4' },
  { id: 'ipad-pro-11', name: 'iPad Pro 11"', width: 1668, height: 2420, type: 'tablet', category: 'iPad', aspect: '3/4' },
  { id: 'ipad-air', name: 'iPad Air / 10.9"', width: 1640, height: 2360, type: 'tablet', category: 'iPad', aspect: '3/4' },

  // --- MacBook ---
  { id: 'macbook-pro-16', name: 'MacBook Pro 16"', width: 3456, height: 2234, type: 'desktop', category: 'MacBook', aspect: '16/10' },
  { id: 'macbook-pro-14', name: 'MacBook Pro 14"', width: 3024, height: 1964, type: 'desktop', category: 'MacBook', aspect: '16/10' },
  { id: 'macbook-air', name: 'MacBook Air 13"/15"', width: 2560, height: 1664, type: 'desktop', category: 'MacBook', aspect: '16/10' }
];

const PRESET_PALETTES = [
  { name: 'Aurora', c1: '#0f172a', c2: '#38bdf8', c3: '#818cf8' },
  { name: 'Sunset Vapor', c1: '#31103f', c2: '#ff4b5c', c3: '#ffb562' },
  { name: 'Deep Space', c1: '#000000', c2: '#1e1b4b', c3: '#4338ca' },
  { name: 'Apple Emerald', c1: '#022c22', c2: '#10b981', c3: '#6ee7b7' },
  { name: 'Midnight Gold', c1: '#18181b', c2: '#b45309', c3: '#fef08a' },
];

export default function App() {
  const [selectedDevice, setSelectedDevice] = useState(null);
  
  // Design Parameters
  const [bgStyle, setBgStyle] = useState('mesh'); // 'solid', 'linear', 'mesh'
  const [color1, setColor1] = useState('#0f172a');
  const [color2, setColor2] = useState('#38bdf8');
  const [color3, setColor3] = useState('#818cf8');
  const [effectType, setEffectType] = useState('glow'); // 'glow', 'waves', 'dots', 'none'
  const [blurAmount, setBlurAmount] = useState(0);
  
  // Brush Tool
  const [brushColor, setBrushColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(24);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeTab, setActiveTab] = useState('style'); // 'style', 'effects', 'draw'

  const canvasRef = useRef(null);

  // Apply Palette Preset
  const applyPalette = (p) => {
    setColor1(p.c1);
    setColor2(p.c2);
    setColor3(p.c3);
  };

  // Render Engine
  useEffect(() => {
    if (!selectedDevice) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = selectedDevice.width;
    canvas.height = selectedDevice.height;
    const ctx = canvas.getContext('2d');

    // 1. Base Background Render
    if (bgStyle === 'solid') {
      ctx.fillStyle = color1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (bgStyle === 'linear') {
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, color1);
      grad.addColorStop(0.5, color2);
      grad.addColorStop(1, color3);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (bgStyle === 'mesh') {
      // Dark Base
      ctx.fillStyle = color1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Primary Sphere Glow
      const g1 = ctx.createRadialGradient(
        canvas.width * 0.3, canvas.height * 0.25, 50,
        canvas.width * 0.3, canvas.height * 0.25, canvas.width * 0.85
      );
      g1.addColorStop(0, color2);
      g1.addColorStop(1, 'transparent');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Secondary Sphere Glow
      const g2 = ctx.createRadialGradient(
        canvas.width * 0.75, canvas.height * 0.75, 50,
        canvas.width * 0.75, canvas.height * 0.75, canvas.width * 0.9
      );
      g2.addColorStop(0, color3);
      g2.addColorStop(1, 'transparent');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 2. Apple Procedural Overlay Effects
    if (effectType === 'glow') {
      const centerGlow = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.7
      );
      centerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
      centerGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (effectType === 'waves') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = canvas.width * 0.008;
      ctx.beginPath();
      for (let i = -canvas.height * 0.2; i < canvas.height * 1.2; i += canvas.height * 0.08) {
        ctx.moveTo(0, i);
        ctx.bezierCurveTo(
          canvas.width * 0.4, i + canvas.height * 0.15,
          canvas.width * 0.6, i - canvas.height * 0.15,
          canvas.width, i
        );
      }
      ctx.stroke();
    } else if (effectType === 'dots') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      const step = canvas.width * 0.04;
      for (let x = step / 2; x < canvas.width; x += step) {
        for (let y = step / 2; y < canvas.height; y += step) {
          ctx.beginPath();
          ctx.arc(x, y, canvas.width * 0.003, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

  }, [selectedDevice, bgStyle, color1, color2, color3, effectType]);

  // Freehand Drawing
  const startDrawing = (e) => {
    if (activeTab !== 'draw') return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.beginPath();
    ctx.moveTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize * scaleX;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || activeTab !== 'draw') return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.lineTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const downloadWallpaper = () => {
    const canvas = canvasRef.current;
    const imageURI = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `Apple-Wallpaper-${selectedDevice.id}.png`;
    link.href = imageURI;
    link.click();
  };

  return (
    <div style={{ backgroundColor: '#000000', color: '#f5f5f7', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif', userSelect: 'none' }}>
      
      {/* Dynamic CSS Styles Inline */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .animate-fade { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .glass-panel {
          background: rgba(22, 22, 26, 0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .btn-apple {
          background: #ffffff;
          color: #000000;
          font-weight: 600;
          border-radius: 980px;
          transition: all 0.2s ease;
        }
        .btn-apple:hover {
          transform: scale(1.03);
          background: #e8e8ed;
        }
        .btn-apple:active {
          transform: scale(0.98);
        }
      `}</style>

      {/* --- PAGE 1: APPLE HARDWARE SELECTION SCREEN --- */}
      {!selectedDevice ? (
        <div className="animate-fade" style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px 80px' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '980px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px', fontSize: '13px', color: '#86868b' }}>
              <Sparkles size={14} color="#38bdf8" /> Pro Wallpaper Engine for iOS & macOS
            </div>
            <h1 style={{ fontSize: ' clamp(36px, 6vw, 64px)', fontWeight: 700, letterSpacing: '-0.03em', margin: '0 0 16px', background: 'linear-gradient(180deg, #FFFFFF 0%, #86868B 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Wallpaper Studio
            </h1>
            <p style={{ fontSize: '18px', color: '#86868b', maxWidth: '600px', margin: '0 auto', lineHeight: '1.5' }}>
              Select your Apple device to generate precision-fitted 8K wallpapers designed specifically for your screen.
            </p>
          </div>

          {/* Grid Categories */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {['iPhone', 'iPad', 'MacBook'].map((cat) => (
              <div key={cat} className="glass-panel" style={{ borderRadius: '24px', padding: '28px' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                    {cat === 'iPhone' && <Smartphone size={22} />}
                    {cat === 'iPad' && <Tablet size={22} />}
                    {cat === 'MacBook' && <Laptop size={22} />}
                  </div>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>{cat}</h2>
                    <span style={{ fontSize: '12px', color: '#86868b' }}>Ultra Retina Display</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {DEVICES.filter(d => d.category === cat).map(dev => (
                    <button
                      key={dev.id}
                      onClick={() => setSelectedDevice(dev)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 18px',
                        borderRadius: '16px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        color: '#f5f5f7',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease',
                        width: '100%'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.borderColor = '#38bdf8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                      }}
                    >
                      <span style={{ fontWeight: 500, fontSize: '15px' }}>{dev.name}</span>
                      <span style={{ fontSize: '12px', color: '#86868b', fontFamily: 'SFMono-Regular, Consolas, monospace', background: 'rgba(255,255,255,0.06)', padding: '4px 8px', borderRadius: '6px' }}>
                        {dev.width}×{dev.height}
                      </span>
                    </button>
                  ))}
                </div>

              </div>
            ))}
          </div>

        </div>
      ) : (

        /* --- PAGE 2: STUDIO EDITOR WORKSPACE --- */
        <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
          
          {/* Studio Top Navigation */}
          <header className="glass-panel" style={{ height: '64px', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
            
            <button 
              onClick={() => setSelectedDevice(null)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: '#86868b', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#86868b'}
            >
              <ArrowLeft size={16} /> {selectedDevice.name}
            </button>

            {/* Editor Tabs */}
            <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.5)', padding: '4px', borderRadius: '980px', border: '1px solid rgba(255,255,255,0.1)' }}>
              {[
                { id: 'style', label: 'Color & Mesh', icon: Palette },
                { id: 'effects', label: 'Apple Effects', icon: Sparkles },
                { id: 'draw', label: 'Freehand Draw', icon: Sliders }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '980px',
                      border: 'none',
                      background: isActive ? '#ffffff' : 'transparent',
                      color: isActive ? '#000000' : '#86868b',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Icon size={14} /> {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Export Action */}
            <button onClick={downloadWallpaper} className="btn-apple" style={{ padding: '8px 20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: 'none' }}>
              <Download size={16} /> Save High-Res
            </button>
          </header>

          {/* Editor Body */}
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            
            {/* Sidebar Inspector Panel */}
            <aside className="glass-panel" style={{ width: '340px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto', borderTop: 'none', borderBottom: 'none' }}>
              
              {/* TAB 1: COLOR & MESH */}
              {activeTab === 'style' && (
                <>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '12px' }}>
                      Style Mode
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                      {['solid', 'linear', 'mesh'].map((s) => (
                        <button
                          key={s}
                          onClick={() => setBgStyle(s)}
                          style={{
                            padding: '10px 0',
                            borderRadius: '12px',
                            border: bgStyle === s ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.08)',
                            background: bgStyle === s ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.03)',
                            color: bgStyle === s ? '#38bdf8' : '#f5f5f7',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            textTransform: 'capitalize'
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '12px' }}>
                      Pro Presets
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {PRESET_PALETTES.map((p) => (
                        <button
                          key={p.name}
                          onClick={() => applyPalette(p)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            cursor: 'pointer'
                          }}
                        >
                          <span style={{ fontSize: '13px', color: '#f5f5f7' }}>{p.name}</span>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: p.c1 }} />
                            <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: p.c2 }} />
                            <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: p.c3 }} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '12px' }}>
                      Custom Color Nodes
                    </label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <label style={{ flex: 1, fontSize: '12px', color: '#86868b', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        Base Color
                        <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} style={{ width: '100%', height: '38px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', cursor: 'pointer' }} />
                      </label>
                      {bgStyle !== 'solid' && (
                        <label style={{ flex: 1, fontSize: '12px', color: '#86868b', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          Glow Node 1
                          <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} style={{ width: '100%', height: '38px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', cursor: 'pointer' }} />
                        </label>
                      )}
                      {bgStyle === 'mesh' && (
                        <label style={{ flex: 1, fontSize: '12px', color: '#86868b', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          Glow Node 2
                          <input type="color" value={color3} onChange={(e) => setColor3(e.target.value)} style={{ width: '100%', height: '38px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', cursor: 'pointer' }} />
                        </label>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* TAB 2: APPLE PROCEDURAL EFFECTS */}
              {activeTab === 'effects' && (
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '12px' }}>
                    Procedural Overlays
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { id: 'glow', title: 'Ambient Center Glow', desc: 'Soft lighting aura inspired by iOS' },
                      { id: 'waves', title: 'Liquid Waves', desc: 'macOS Sonoma fluid vector curves' },
                      { id: 'dots', title: 'Retina Grid', desc: 'Precision dot matrix pattern' },
                      { id: 'none', title: 'Pure Minimal', desc: 'No overlay effects' }
                    ].map((eff) => (
                      <button
                        key={eff.id}
                        onClick={() => setEffectType(eff.id)}
                        style={{
                          textAlign: 'left',
                          padding: '14px',
                          borderRadius: '14px',
                          border: effectType === eff.id ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.06)',
                          background: effectType === eff.id ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255,255,255,0.02)',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#f5f5f7', marginBottom: '4px' }}>{eff.title}</div>
                        <div style={{ fontSize: '12px', color: '#86868b' }}>{eff.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: DRAWING TOOLS */}
              {activeTab === 'draw' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <label style={{ fontSize: '12px', color: '#86868b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Brush Color
                    <input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', cursor: 'pointer' }} />
                  </label>

                  <label style={{ fontSize: '12px', color: '#86868b', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    Brush Size ({brushSize}px)
                    <input type="range" min="4" max="80" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} style={{ accentColor: '#38bdf8' }} />
                  </label>

                  <p style={{ fontSize: '12px', color: '#86868b', lineHeight: '1.4', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px' }}>
                    💡 Draw freely directly on the screen mockup on the right using touch or mouse gestures.
                  </p>
                </div>
              )}

            </aside>

            {/* Screen Preview Canvas Area with Apple Device Frame Mockup */}
            <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: 'radial-gradient(circle at center, rgba(30, 30, 35, 1) 0%, rgba(0,0,0,1) 100%)', position: 'relative' }}>
              
              {/* Apple Hardware Shell Frame */}
              <div 
                style={{
                  position: 'relative',
                  maxHeight: '75vh',
                  aspectRatio: selectedDevice.aspect,
                  borderRadius: selectedDevice.type === 'phone' ? '48px' : selectedDevice.type === 'tablet' ? '28px' : '16px',
                  border: '8px solid #27272a',
                  boxShadow: '0 25px 80px rgba(0, 0, 0, 0.9), 0 0 40px rgba(56, 189, 248, 0.1)',
                  overflow: 'hidden',
                  background: '#000000'
                }}
              >
                {/* Dynamic Island for iPhone */}
                {selectedDevice.type === 'phone' && (
                  <div style={{ position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)', width: '90px', height: '24px', background: '#000000', borderRadius: '20px', zIndex: 20 }} />
                )}

                {/* Canvas Render */}
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={(e) => startDrawing(e.touches[0])}
                  onTouchMove={(e) => draw(e.touches[0])}
                  onTouchEnd={stopDrawing}
                  style={{ width: '100%', height: '100%', display: 'block', cursor: activeTab === 'draw' ? 'crosshair' : 'default', touchAction: 'none' }}
                />
              </div>

            </main>

          </div>
        </div>
      )}

    </div>
  );
}
