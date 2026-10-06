import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { DiagramNode, DiagramEdge } from "@/lib/diagramTypes";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCw, ZoomIn, ZoomOut, Flame, AlertCircle } from "lucide-react";

interface Simulation3DProps {
  projectData: { nodes: DiagramNode[]; edges: DiagramEdge[] };
  onBackToDesigner?: () => void;
}

export default function Simulation3D({ projectData }: Simulation3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const [isHeating, setIsHeating] = useState(true);
  const flameLightRef = useRef<THREE.PointLight | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Cenário e Luzes de Laboratório
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f141c);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 4, 8);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    containerRef.current.replaceChildren(renderer.domElement);

    // Iluminação
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 2);
    spotLight.position.set(5, 10, 5);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // Bancada de Laboratório (Mesa de cerâmica industrial)
    const benchGeo = new THREE.BoxGeometry(12, 0.4, 6);
    const benchMat = new THREE.MeshStandardMaterial({ 
      color: 0x1e293b, 
      roughness: 0.3,
      metalness: 0.1 
    });
    const bench = new THREE.Mesh(benchGeo, benchMat);
    bench.position.y = -0.2;
    bench.receiveShadow = true;
    scene.add(bench);

    // Grid de alinhamento modular na bancada
    const grid = new THREE.GridHelper(12, 24, 0x38bdf8, 0x334155);
    grid.position.y = 0.01;
    scene.add(grid);

    // 2. Mapeamento dos Blocos 2D para Aparelhos 3D
    const nodeObjects = new Map<string, THREE.Group>();
    const nodes = projectData.nodes || [];
    const count = nodes.length;

    nodes.forEach((node, idx) => {
      const group = new THREE.Group();
      // Distribui os equipamentos na bancada com base na posição X do 2D ou índice
      const posX = count > 1 ? ((idx / (count - 1)) - 0.5) * 6 : 0;
      group.position.set(posX, 0, 0);

      const label = node.label.toLowerCase();

      if (label.includes("fogo") || label.includes("bunsen") || label.includes("aquec") || node.type === "process") {
        // --- BICO DE BUNSEN ---
        const base = new THREE.Mesh(
          new THREE.CylinderGeometry(0.5, 0.6, 0.2, 32),
          new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 })
        );
        const tube = new THREE.Mesh(
          new THREE.CylinderGeometry(0.1, 0.1, 1.2, 16),
          new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 })
        );
        tube.position.y = 0.7;
        group.add(base, tube);

        // Chama de fogo (Cone translúcido azul + laranja)
        const flameGeo = new THREE.ConeGeometry(0.2, 0.8, 16);
        const flameMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 });
        const flame = new THREE.Mesh(flameGeo, flameMat);
        flame.position.y = 1.7;
        group.add(flame);

        const flameLight = new THREE.PointLight(0xf97316, 2, 4);
        flameLight.position.y = 1.8;
        group.add(flameLight);
        flameLightRef.current = flameLight;
      } else {
        // --- BÉQUER / FRASCO DE VIDRO ---
        // Vidro exterior
        const glassGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.4, 32, 1, true);
        const glassMat = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.4,
          roughness: 0.1,
          transmission: 0.9,
          thickness: 0.5,
        });
        const glass = new THREE.Mesh(glassGeo, glassMat);
        glass.position.y = 0.7;

        // Fundo do béquer
        const bottom = new THREE.Mesh(
          new THREE.CylinderGeometry(0.6, 0.6, 0.05, 32),
          glassMat
        );
        bottom.position.y = 0.025;

        // Líquido interno (com cor baseada na substância)
        let liquidColor = 0x0284c7; // Azul padrão
        if (label.includes("ácido") || label.includes("hcl")) liquidColor = 0xef4444;
        if (label.includes("base") || label.includes("naoh")) liquidColor = 0xa855f7;
        if (label.includes("vinagre")) liquidColor = 0xfacc15;
        if (label.includes("água") || label.includes("h2o")) liquidColor = 0x38bdf8;

        const liquidGeo = new THREE.CylinderGeometry(0.56, 0.56, 0.9, 32);
        const liquidMat = new THREE.MeshStandardMaterial({
          color: liquidColor,
          roughness: 0.2,
          transparent: true,
          opacity: 0.85,
        });
        const liquid = new THREE.Mesh(liquidGeo, liquidMat);
        liquid.position.y = 0.47;

        group.add(glass, bottom, liquid);
      }

      scene.add(group);
      nodeObjects.set(node.id, group);
    });

    // 3. Tubulações de Conexão Física (Mangueiras entre recipientes)
    (projectData.edges || []).forEach(edge => {
      const sourceObj = nodeObjects.get(edge.source);
      const targetObj = nodeObjects.get(edge.target);
      if (sourceObj && targetObj) {
        const p1 = new THREE.Vector3(sourceObj.position.x, 1.4, 0);
        const p2 = new THREE.Vector3(
          (sourceObj.position.x + targetObj.position.x) / 2,
          2.2,
          0.3
        );
        const p3 = new THREE.Vector3(targetObj.position.x, 1.4, 0);

        const curve = new THREE.CatmullRomCurve3([p1, p2, p3]);
        const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.06, 8, false);
        const tubeMat = new THREE.MeshStandardMaterial({ 
          color: 0x94a3b8, 
          transparent: true, 
          opacity: 0.7 
        });
        const pipe = new THREE.Mesh(tubeGeo, tubeMat);
        scene.add(pipe);
      }
    });

    // Loop de Animação (Oscilação da chama e vapor)
    let reqId: number;
    let clock = new THREE.Clock();
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      if (flameLightRef.current) {
        flameLightRef.current.intensity = 1.5 + Math.sin(time * 15) * 0.5;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(reqId);
      renderer.dispose();
    };
  }, [projectData]);

  return (
    <div className="h-full flex flex-col relative">
      <div ref={containerRef} className="w-full h-full rounded-xl overflow-hidden border border-border" />
      <div className="absolute top-4 left-4 bg-background/80 backdrop-blur p-2 rounded-lg border border-border text-xs space-y-1">
        <p className="font-semibold text-primary">Simulação Física 3D</p>
        <p className="text-muted-foreground">{projectData.nodes?.length || 0} aparelhos conectados</p>
      </div>
    </div>
  );
}
