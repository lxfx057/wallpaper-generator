import React, { useState, useRef, useEffect } from 'react';
import { Download, Sliders, Sparkles, RefreshCcw, Smartphone, Laptop, Tablet, ArrowLeft, Palette } from 'lucide-react';

const DEVICES = [
  // --- iPhone ---
  { id: 'iphone-16-pro-max', name: 'iPhone 16/15 Pro Max', width: 1320, height: 2868, type: 'phone', category: 'iPhone' },
  { id: 'iphone-16-pro', name: 'iPhone 16/15 Pro', width: 1206, height: 2622, type: 'phone', category: 'iPhone' },
  { id: 'iphone-15-14', name: 'iPhone 15 / 14 / 13', width: 1170, height: 2532, type: 'phone', category: 'iPhone' },
  { id: 'iphone-x', name: 'iPhone X / XS / 11 Pro', width: 1125, height: 2436, type: 'phone', category: 'iPhone' },
  
  // --- iPad ---
  { id: 'ipad-pro-13', name: 'iPad Pro 13" (M4)', width: 2064, height: 2752, type: 'tablet', category: 'iPad' },
  { id: 'ipad-pro-11', name: 'iPad Pro 11"', width: 1668, height: 2420, type: 'tablet', category: 'iPad' },
  { id: 'ipad-air', name: 'iPad Air / 10.9"', width: 1640, height: 2360, type: 'tablet', category: 'iPad' },

  // --- MacBook ---
  { id: 'macbook-pro-16', name: 'MacBook Pro 16"', width: 3456, height: 2234, type: 'desktop', category: 'MacBook' },
  { id: 'macbook-pro-14', name: 'MacBook Pro 14"', width: 3024, height: 1964, type: 'desktop', category: 'MacBook' },
  { id: 'macbook-air', name: 'MacBook Air 13"/15"', width: 2560, height: 1664, type: 'desktop', category: 'MacBook' }
];

export default function App() {
  const [selectedDevice, setSelectedDevice] = useState(null);
  
  // Design States
  const [bgStyle, setBgStyle] = useState('gradient'); // 'solid', 'gradient', 'mesh'
  const [color1, setColor1] = useState('#0f172a');
  const [color2, setColor2] = useState('#38bdf8');
  const [effectType, setEffectType] = useState('glow'); // 'glow', 'waves', 'dots', 'none'
  const [brushColor, setBrushColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(20);
  const [isDrawing, setIsDrawing] = useState(false);

  const canvasRef = useRef(null);

  // Render Canvas when design options or device changes
  useEffect(() => {
    if (!selectedDevice) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = selectedDevice.width;
    canvas.height = selectedDevice.height;
    const ctx = canvas.getContext('2d');

    // 1. Background Fill
    if (bgStyle === 'solid') {
      ctx.fillStyle = color1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (bgStyle === 'gradient') {
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, color1);
      grad.addColorStop(1, color2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (bgStyle === 'mesh') {
      ctx.fillStyle = color1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const radGrad = ctx.createRadialGradient(
        canvas.width * 0.2, canvas.height * 0.2, 50,
        canvas.width * 0.5, canvas.height * 0.5, canvas.width
      );
      radGrad.addColorStop(0, color2);
      radGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 2. Apple-style Procedural Effects
    if (effectType === 'glow') {
      const g = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 3, 10,
        canvas.width / 2, canvas.height / 3, canvas.width * 0.8
      );
      g.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (effectType === 'waves') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = canvas.width * 0.01;
      ctx.beginPath();
      for (let i = 0; i < canvas.height; i += 80) {
        ctx.moveTo(0, i);
        ctx.bezierCurveTo(canvas.width / 3, i + 200, (canvas.width / 3) * 2, i - 200, canvas.width, i);
      }
      ctx.stroke();
    } else if (effectType === 'dots') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      const step = canvas.width * 0.05;
      for (let x = step; x < canvas.width; x += step) {
        for (let y = step; y < canvas.height; y += step) {
          ctx.beginPath();
          ctx.arc(x, y, canvas.width * 0.005, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }, [selectedDevice, bgStyle, color1, color2, effectType]);

  // Freehand drawing handlers
  const startDrawing = (e) => {
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
    if (!isDrawing) return;
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

  // --- SCREEN 1: APPLE DEVICE SELECTION ---
  if (!selectedDevice) {
    return (
      <div className="min-h-screen bg-black text-white font-sans px-6 py-12 flex flex-col items-center">
        <div className="text-center max-w-2xl mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4 bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
            Wallpaper Studio
          </h1>
          <p className="text-slate-400 text-lg">
            Which device would you like to create a wallpaper for? Select your hardware to begin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {['iPhone', 'iPad', 'MacBook'].map((cat) => (
            <div key={cat} className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-6 text-sky-400">
                {cat === 'iPhone' && <Smartphone size={24} />}
                {cat === 'iPad' && <Tablet size={24} />}
                {cat === 'MacBook' && <Laptop size={24} />}
                <h2 className="text-xl font-medium text-white">{cat}</h2>
              </div>
              <div className="flex flex-col gap-3">
                {DEVICES.filter(d => d.category === cat).map(dev => (
                  <button
                    key={dev.id}
                    onClick={() => setSelectedDevice(dev)}
                    className="flex justify-between items-center bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 hover:border-sky-500 text-left px-4 py-3 rounded-xl transition-all group"
                  >
                    <span className="font-medium text-slate-200 group-hover:text-white">{dev.name}</span>
                    <span className="text-xs text-zinc-500 font-mono">{dev.width}×{dev.height}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- SCREEN 2: APPLE DESIGN STUDIO INTERFACE ---
  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col font-sans select-none">
      {/* Apple-style Top Bar */}
      <header className="bg-zinc-900/90 border-b border-zinc-800 px-6 py-4 flex items-center justify-between backdrop-blur-md sticky top-0 z-50">
        <button 
          onClick={() => setSelectedDevice(null)}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
        >
          <ArrowLeft size={16} /> Change Device ({selectedDevice.name})
        </button>

        <div className="flex items-center gap-4">
          <button 
            onClick={downloadWallpaper}
            className="bg-white hover:bg-slate-200 text-black font-medium px-5 py-2 rounded-full text-sm flex items-center gap-2 transition shadow-lg"
          >
            <Download size={16} /> Download Wallpaper
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Sidebar Controls */}
        <aside className="w-full lg:w-80 bg-zinc-950 border-r border-zinc-800 p-6 flex flex-col gap-6 overflow-y-auto">
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-zinc-500 uppercase mb-3 flex items-center gap-2">
              <Palette size={14} /> Background Style
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {['solid', 'gradient', 'mesh'].map((s) => (
                <button
                  key={s}
                  onClick={() => setBgStyle(s)}
                  className={`py-2 text-xs font-medium rounded-lg border capitalize transition ${
                    bgStyle === s ? 'bg-sky-500 text-black border-sky-400' : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-wider text-zinc-500 uppercase mb-3">Color Palette</h3>
            <div className="flex gap-4">
              <label className="flex-1 flex flex-col gap-1 text-xs text-zinc-400">
                Primary
                <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-full h-10 rounded-lg bg-zinc-900 border border-zinc-800 cursor-pointer" />
              </label>
              {bgStyle !== 'solid' && (
                <label className="flex-1 flex flex-col gap-1 text-xs text-zinc-400">
                  Secondary
                  <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-full h-10 rounded-lg bg-zinc-900 border border-zinc-800 cursor-pointer" />
                </label>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-wider text-zinc-500 uppercase mb-3 flex items-center gap-2">
              <Sparkles size={14} /> Apple Effects
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'glow', label: 'Ambient Glow' },
                { id: 'waves', label: 'Liquid Waves' },
                { id: 'dots', label: 'Mesh Grid' },
                { id: 'none', label: 'Clean' }
              ].map((eff) => (
                <button
                  key={eff.id}
                  onClick={() => setEffectType(eff.id)}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border transition text-left ${
                    effectType === eff.id ? 'bg-white text-black border-white' : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                  }`}
                >
                  {eff.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-wider text-zinc-500 uppercase mb-3 flex items-center gap-2">
              <Sliders size={14} /> Freehand Drawing
            </h3>
            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-between text-xs text-zinc-400">
                Brush Color
                <input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} className="w-8 h-8 rounded bg-transparent cursor-pointer" />
              </label>
              <label className="flex flex-col gap-1 text-xs text-zinc-400">
                Brush Size ({brushSize}px)
                <input type="range" min="4" max="60" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="accent-sky-500" />
              </label>
            </div>
          </div>
        </aside>

        {/* Canvas Preview Area */}
        <main className="flex-1 flex items-center justify-center p-8 bg-zinc-900/50 overflow-hidden">
          <div 
            className="relative shadow-2xl rounded-3xl overflow-hidden border-[6px] border-zinc-800 bg-black flex items-center justify-center max-h-[75vh]"
            style={{
              aspectRatio: `${selectedDevice.width} / ${selectedDevice.height}`,
            }}
          >
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={(e) => startDrawing(e.touches[0])}
              onTouchMove={(e) => draw(e.touches[0])}
              onTouchEnd={stopDrawing}
              className="w-full h-full object-contain cursor-crosshair touch-none"
            />
          </div>
        </main>

      </div>
    </div>
  );
}
