import React, { useRef, useEffect } from 'react';
import './DemandGauge.css';

interface Props {
  demand: number;  // 25-90
  color: string;
  level: string;
  confidence: number;
}

const DemandGauge: React.FC<Props> = ({ demand, color, level, confidence }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const currentRef = useRef(demand);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H * 0.72;
    const r = W * 0.38;
    const startAngle = Math.PI;
    const totalAngle = Math.PI;

    const target = demand;
    const speed = 0.03;

    function draw(val: number) {
      ctx.clearRect(0, 0, W, H);

      // Track background arc
      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, startAngle + totalAngle);
      ctx.lineWidth = 16;
      ctx.strokeStyle = '#1e2e4a';
      ctx.lineCap = 'round';
      ctx.stroke();

      // Zone arcs
      const zones = [
        { from: 25, to: 40,  col: '#00e67633' },
        { from: 40, to: 60,  col: '#00e5ff33' },
        { from: 60, to: 75,  col: '#ffab0033' },
        { from: 75, to: 90,  col: '#ff174433' },
      ];
      zones.forEach(({ from, to, col }) => {
        const a1 = startAngle + ((from - 25) / 65) * totalAngle;
        const a2 = startAngle + ((to   - 25) / 65) * totalAngle;
        ctx.beginPath();
        ctx.arc(cx, cy, r, a1, a2);
        ctx.lineWidth = 16;
        ctx.strokeStyle = col;
        ctx.lineCap = 'butt';
        ctx.stroke();
      });

      // Value arc
      const pct = Math.max(0, Math.min(1, (val - 25) / 65));
      const valAngle = startAngle + pct * totalAngle;
      if (pct > 0) {
        const grad = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
        grad.addColorStop(0, '#00e676');
        grad.addColorStop(0.5, '#00e5ff');
        grad.addColorStop(1, color);
        ctx.beginPath();
        ctx.arc(cx, cy, r, startAngle, valAngle);
        ctx.lineWidth = 16;
        ctx.strokeStyle = grad;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // Glow dot at tip
      const tipX = cx + Math.cos(valAngle) * r;
      const tipY = cy + Math.sin(valAngle) * r;
      const glowGrad = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 14);
      glowGrad.addColorStop(0, color + 'ff');
      glowGrad.addColorStop(1, color + '00');
      ctx.beginPath();
      ctx.arc(tipX, tipY, 14, 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(tipX, tipY, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();

      // Tick marks
      for (let i = 0; i <= 8; i++) {
        const angle = startAngle + (i / 8) * totalAngle;
        const inner = r - 22;
        const outer = r - 12;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner);
        ctx.lineTo(cx + Math.cos(angle) * outer, cy + Math.sin(angle) * outer);
        ctx.lineWidth = i % 4 === 0 ? 2 : 1;
        ctx.strokeStyle = '#2a4070';
        ctx.stroke();
      }

      // Labels
      const labelVals = [25, 40, 55, 70, 90];
      ctx.fillStyle = '#4e6080';
      ctx.font = '500 10px Inter';
      ctx.textAlign = 'center';
      labelVals.forEach((lv) => {
        const angle = startAngle + ((lv - 25) / 65) * totalAngle;
        const lx = cx + Math.cos(angle) * (r - 30);
        const ly = cy + Math.sin(angle) * (r - 30);
        ctx.fillText(String(lv), lx, ly);
      });

      // Center value
      ctx.fillStyle = color;
      ctx.font = `800 ${W * 0.12}px Space Grotesk, Inter`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(val.toFixed(1), cx, cy - 8);

      ctx.fillStyle = '#4e6080';
      ctx.font = '500 11px Inter';
      ctx.fillText('units', cx, cy + W * 0.07);
    }

    function animate() {
      const diff = target - currentRef.current;
      if (Math.abs(diff) > 0.05) {
        currentRef.current += diff * speed;
      } else {
        currentRef.current = target;
      }
      draw(currentRef.current);
      if (Math.abs(target - currentRef.current) > 0.05) {
        animRef.current = requestAnimationFrame(animate);
      }
    }

    cancelAnimationFrame(animRef.current);
    animate();
    return () => cancelAnimationFrame(animRef.current);
  }, [demand, color]);

  return (
    <div className="gauge-wrapper">
      <canvas ref={canvasRef} width={260} height={160} className="gauge-canvas" />
      <div className="gauge-level-badge" style={{ background: color + '22', color, border: `1px solid ${color}66` }}>
        {level}
      </div>
      <div className="gauge-confidence">
        <span className="conf-label">Model Confidence</span>
        <div className="conf-bar-track">
          <div className="conf-bar-fill" style={{ width: `${confidence}%`, background: color }} />
        </div>
        <span className="conf-val">{confidence}%</span>
      </div>
    </div>
  );
};

export default DemandGauge;
