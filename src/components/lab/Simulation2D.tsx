import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RefreshCw } from "lucide-react";

interface Simulation2DProps {
  projectData?: any;
  onDataChange?: (data: any) => void;
}

const Simulation2D = ({ projectData, onDataChange }: Simulation2DProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
  }>>([]);

  const [isPlaying, setIsPlaying] = useState(true);
  const [particleCount, setParticleCount] = useState(30);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      const colors = ["#7c3aed", "#10b981", "#f97316", "#06b6d4", "#ec4899"];
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          radius: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };
    initParticles();

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      // Clear canvas with fade effect
      ctx.fillStyle = "rgba(10, 10, 15, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (isPlaying) {
        // Update and draw particles
        particlesRef.current.forEach((particle, i) => {
          // Update position
          particle.x += particle.vx * speed;
          particle.y += particle.vy * speed;

          // Bounce off walls
          if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

          // Keep particles in bounds
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));

          // Draw particle with glow effect
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.radius * 2
          );
          gradient.addColorStop(0, particle.color);
          gradient.addColorStop(0.5, particle.color + "80");
          gradient.addColorStop(1, particle.color + "00");

          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius * 2, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          // Draw solid particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();

          // Draw connections
          particlesRef.current.forEach((otherParticle, j) => {
            if (i >= j) return;
            
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = `rgba(124, 58, 237, ${1 - distance / 150})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          });
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isPlaying, particleCount, speed]);

  const handleReset = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const colors = ["#7c3aed", "#10b981", "#f97316", "#06b6d4", "#ec4899"];
    particlesRef.current = [];
    
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <canvas
        ref={canvasRef}
        className="flex-1 rounded-xl border border-border shadow-lg bg-[#0a0a0f]"
        style={{ minHeight: "400px" }}
      />

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Particle Count: {particleCount}</label>
          <Slider
            value={[particleCount]}
            onValueChange={(value) => {
              setParticleCount(value[0]);
              handleReset();
            }}
            min={10}
            max={100}
            step={10}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Speed: {speed.toFixed(1)}x</label>
          <Slider
            value={[speed]}
            onValueChange={(value) => setSpeed(value[0])}
            min={0.1}
            max={3}
            step={0.1}
          />
        </div>

        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isPlaying ? "Pause" : "Play"}
          </Button>

          <Button variant="outline" size="sm" onClick={handleReset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Simulation2D;
