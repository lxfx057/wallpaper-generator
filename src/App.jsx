import React, { useState, useRef, useEffect } from 'react';
import { Download, Sparkles, Smartphone, Laptop, Tablet, ArrowLeft, Palette, Sliders, Layers } from 'lucide-react';

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
  
  const [bgStyle, setBgStyle] = useState('mesh');
  const [color1, setColor1] = useState('#0f172a');
  const [color2, setColor2] = useState('#38bdf8');
  const [color3, setColor3] = useState('#818cf8');
  
  const [effectType, setEffectType] = useState('glow'); 
  const [effectIntensity, setEffectIntensity] = useState(50);
  const [effectScale, setEffectScale] = useState(50);
  
  const [brushColor, setBrushColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(24);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeTab, setActiveTab] = useState('style');

  const canvasRef = useRef(null);

  const applyPalette = (p) => {
    setColor1(p.c1);
    setColor2(p.c2);
    setColor3(p.c3);
  };

  useEffect(() => {
    if (!selectedDevice) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = selectedDevice.width;
    canvas.height = selectedDevice.height;
    const ctx = canvas.getContext('2d');

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
      ctx.fillStyle = color1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const g1 = ctx.createRadialGradient(
        canvas.width * 0.3, canvas.height * 0.25, 50,
        canvas.width * 0.3, canvas.height * 0.25, canvas.width * (effectScale / 50) * 0.85
      );
      g1.addColorStop(0, color2);
      g1.addColorStop(1, 'transparent');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const g2 = ctx.createRadialGradient(
        canvas.width * 0.75, canvas.height * 0.75, 50,
        canvas.width * 0.75, canvas.height * 0.75, canvas.width * (effectScale / 50) * 0.9
      );
      g2.addColorStop(0, color3);
      g2.addColorStop(1, 'transparent');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const alpha = effectIntensity / 100;

    if (effectType === 'glow') {
      const centerGlow = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.7
      );
      centerGlow.addColorStop(0, `rgba(255, 255, 255, ${0.4 * alpha})`);
      centerGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } 
    else if (effectType === 'waves') {
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.25 * alpha})`;
      ctx.lineWidth = canvas.width * 0.008;
      const spacing = Math.max(40, canvas.height / (effectScale / 5));
      ctx.beginPath();
      for (let i = -canvas.height * 0.2; i < canvas.height * 1.2; i += spacing) {
        ctx.moveTo(0, i);
        ctx.bezierCurveTo(
          canvas.width * 0.4, i + (effectScale * 3),
          canvas.width * 0.6, i - (effectScale * 3),
          canvas.width, i
        );
      }
      ctx.stroke();
    } 
    else if (effectType === 'dots') {
      ctx.fillStyle = `rgba(255, 255, 255, ${0.3 * alpha})`;
      const step = Math.max(20, canvas.width * (0.06 - (effectScale / 2000)));
      for (let x = step / 2; x < canvas.width; x += step) {
        for (let y = step / 2; y < canvas.height; y += step) {
          ctx.beginPath();
          ctx.arc(x, y, canvas.width * 0.004, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    else if (effectType === 'aurora') {
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, `rgba(56, 189, 248, ${0.4 * alpha})`);
      grad.addColorStop(0.5, 'transparent');
      grad.addColorStop(1, `rgba(129, 140, 248, ${0.4 * alpha})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    else if (effectType === 'prisms') {
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * alpha})`;
      ctx.lineWidth = 2;
      const count = Math.floor(effectScale / 5) + 5;
      for (let i = 0; i < count; i++) {
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, (i * 80 * (effectScale / 50)), 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    else if (effectType === 'noise') {
      const numParticles = Math.floor(canvas.width * canvas.height * 0.0005 * (effectIntensity / 50));
      ctx.fillStyle = `rgba(255, 255, 255, 0.15)`;
      for (let i = 0; i < numParticles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.fillRect(x, y, 2, 2);
      }
    }
    else if (effectType === 'cyber') {
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.5 * alpha})`;
      ctx.lineWidth = 4;
      ctx.strokeRect(canvas.width * 0.1, canvas.height * 0.1, canvas.width * 0.8, canvas.height * 0.8);
      ctx.strokeRect(canvas.width * 0.15, canvas.height * 0.13, canvas.width * 0.7, canvas.height * 0.74);
    }
    else if (effectType === 'stars') {
      const numStars = Math.floor(effectScale * 3);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      for (let i = 0; i < numStars; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const r = Math.random() * 3;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    else if (effectType === 'flare') {
      const flare = ctx.createRadialGradient(
        canvas.width * 0.8, canvas.height * 0.1, 10,
        canvas.width * 0.8, canvas.height * 0.1, canvas.width * 0.9
      );
      flare.addColorStop(0, `rgba(255, 215, 0, ${0.6 * alpha})`);
      flare.addColorStop(1, 'transparent');
      ctx.fillStyle = flare;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

  }, [selectedDevice, bgStyle, color1, color2, color3, effectType, effectIntensity, effectScale]);

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

  // Trigger diretto del download file su iOS e browser moderni
  const downloadWallpaper = () => {
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Apple-Wallpaper-${selectedDevice.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  return (
    <div style={{ backgroundColor: '#000000', color: '#f5f5f7', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif', userSelect: 'none' }}>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .glass-panel {
          background: rgba(22, 22, 26, 0.85);
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
      `}</style>

      {!selectedDevice ? (
        <div className="animate-fade" style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px 80px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '980px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px', fontSize: '13px', color: '#86868b' }}>
              <Sparkles size={14} color="#38bdf8" /> 10+ Pro Effects & Direct File Export
            </div>
            <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 700, letterSpacing: '-0.03em', margin: '0 0 16px', background: 'linear-gradient(180deg, #FFFFFF 0%, #86868B 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Wallpaper Studio Pro
            </h1>
            <p style={{ fontSize: '18px', color: '#86868b', maxWidth: '600px', margin: '0 auto', lineHeight: '1.5' }}>
              Select your Apple hardware to generate custom high-end wallpapers.
            </p>
          </div>

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
                    <span style={{ fontSize: '12px', color: '#86868b' }}>Retina Display Engine</span>
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
                      <span style={{ fontSize: '12px', color: '#86868b', fontFamily: 'monospace', background: 'rgba(255,255,255,0.06)', padding: '4px 8px', borderRadius: '6px' }}>
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

        <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
          
          <header className="glass-panel" style={{ height: '64px', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
            <button 
              onClick={() => setSelectedDevice(null)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: '#86868b', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}
            >
              <ArrowLeft size={16} /> {selectedDevice.name}
            </button>

            <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.5)', padding: '4px', borderRadius: '980px', border: '1px solid rgba(255,255,255,0.1)' }}>
              {[
                { id: 'style', label: 'Palette & Mesh', icon: Palette },
                { id: 'effects', label: '10 Pro Effects', icon: Sparkles },
                { id: 'draw', label: 'Draw', icon: Sliders }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap:
