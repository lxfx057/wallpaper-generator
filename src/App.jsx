import React, { useState, useRef, useEffect } from 'react';
import { DEVICES } from './constants/devices';
import { Download, Palette, Brush, RefreshCw, Smartphone } from 'lucide-react';

export default function App() {
  const [selectedDevice, setSelectedDevice] = useState(DEVICES[0]);
  const [bgColor, setBgColor] = useState('#0f172a');
  const [brushColor, setBrushColor] = useState('#38bdf8');
  const [brushSize, setBrushSize] = useState(16);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const canvasRef = useRef(null);

  // Inizializza e ridimensiona la tela in base al dispositivo scelto
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = selectedDevice.width;
    canvas.height = selectedDevice.height;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [selectedDevice, bgColor]);

  // Gestione Disegno Touch / Mouse
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.beginPath();
    ctx.moveTo(
      (e.clientX - rect.left) * scaleX,
      (e.clientY - rect.top) * scaleY
    );
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

    ctx.lineTo(
      (e.clientX - rect.left) * scaleX,
      (e.clientY - rect.top) * scaleY
    );
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Pulisci tela
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  // Download Sfondo
  const downloadWallpaper = () => {
    const canvas = canvasRef.current;
    const imageURI = canvas.toDataURL('image/png');
    
    const link = document.createElement('a');
    link.download = `wallpaper-${selectedDevice.id}.png`;
    link.href = imageURI;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* Navbar / Controlli */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 flex flex-wrap gap-4 items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <Smartphone className="text-sky-400" size={24} />
          <h1 className="font-bold text-lg tracking-tight">WallGen Studio</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Selezione Dispositivo */}
          <select 
            value={selectedDevice.id} 
            onChange={(e) => setSelectedDevice(DEVICES.find(d => d.id === e.target.value))}
            className="bg-slate-800 text-slate-200 border border-slate-700 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-sky-500"
          >
            {DEVICES.map(device => (
              <option key={device.id} value={device.id}>
                {device.name} ({device.width}x{device.height})
              </option>
            ))}
          </select>

          {/* Sfondo */}
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-sm">
            <Palette size={16} className="text-slate-400" />
            <span>Sfondo:</span>
            <input 
              type="color" 
              value={bgColor} 
              onChange={(e) => setBgColor(e.target.value)} 
              className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent"
            />
          </div>

          {/* Pennello */}
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-sm">
            <Brush size={16} className="text-slate-400" />
            <span>Pennello:</span>
            <input 
              type="color" 
              value={brushColor} 
              onChange={(e) => setBrushColor(e.target.value)} 
              className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent"
            />
          </div>

          <button 
            onClick={clearCanvas} 
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-lg text-sm flex items-center gap-1.5 transition border border-slate-700"
          >
            <RefreshCw size={15} /> Pulisci
          </button>

          <button 
            onClick={downloadWallpaper} 
            className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-1.5 transition"
          >
            <Download size={16} /> Salva Sfondo
          </button>
        </div>
      </header>

      {/* Area Workspace / Anteprima Canvas */}
      <main className="flex-1 flex items-center justify-center p-4 overflow-hidden bg-slate-950">
        <div 
          className="relative shadow-2xl rounded-2xl overflow-hidden border-4 border-slate-800 bg-black flex items-center justify-center max-h-[75vh]"
          style={{
            aspectRatio: `${selectedDevice.width} / ${selectedDevice.height}`,
            maxHeight: '70vh'
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
  );
}
