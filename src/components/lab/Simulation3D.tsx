import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { RotateCw, ZoomIn, ZoomOut, Play, Pause, RefreshCw } from "lucide-react";

interface Simulation3DProps {
  projectData?: any;
  onDataChange?: (data: any) => void;
}

const Simulation3D = ({ projectData, onDataChange }: Simulation3DProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number | null>(null);
  const objectsRef = useRef<THREE.Mesh[]>([]);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.01);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x7c3aed, 2, 100);
    pointLight.position.set(0, 3, 0);
    scene.add(pointLight);

    // Create demonstration objects
    const geometry1 = new THREE.BoxGeometry(1, 1, 1);
    const material1 = new THREE.MeshPhongMaterial({ 
      color: 0x7c3aed,
      emissive: 0x7c3aed,
      emissiveIntensity: 0.3
    });
    const cube = new THREE.Mesh(geometry1, material1);
    cube.position.x = -2;
    scene.add(cube);
    objectsRef.current.push(cube);

    const geometry2 = new THREE.TorusGeometry(0.7, 0.3, 16, 100);
    const material2 = new THREE.MeshPhongMaterial({ 
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 0.3
    });
    const torus = new THREE.Mesh(geometry2, material2);
    torus.position.x = 0;
    scene.add(torus);
    objectsRef.current.push(torus);

    const geometry3 = new THREE.IcosahedronGeometry(0.8, 0);
    const material3 = new THREE.MeshPhongMaterial({ 
      color: 0xf97316,
      emissive: 0xf97316,
      emissiveIntensity: 0.3,
      wireframe: false
    });
    const icosahedron = new THREE.Mesh(geometry3, material3);
    icosahedron.position.x = 2;
    scene.add(icosahedron);
    objectsRef.current.push(icosahedron);

    // Add grid helper
    const gridHelper = new THREE.GridHelper(10, 10, 0x7c3aed, 0x444444);
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    // Mouse interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = () => { isDragging = true; };
    const onMouseUp = () => { isDragging = false; };
    
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        
        objectsRef.current.forEach(obj => {
          obj.rotation.y += deltaX * 0.01;
          obj.rotation.x += deltaY * 0.01;
        });
      }
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z += e.deltaY * 0.01;
      camera.position.z = Math.max(2, Math.min(10, camera.position.z));
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('wheel', onWheel);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      if (isPlaying) {
        objectsRef.current.forEach((obj, index) => {
          obj.rotation.x += rotationSpeed;
          obj.rotation.y += rotationSpeed * (index + 1) * 0.5;
        });
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [isPlaying, rotationSpeed]);

  const handleReset = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0, 5);
      cameraRef.current.rotation.set(0, 0, 0);
    }
    objectsRef.current.forEach(obj => {
      obj.rotation.set(0, 0, 0);
    });
  };

  const handleZoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.max(2, cameraRef.current.position.z - 0.5);
    }
  };

  const handleZoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.min(10, cameraRef.current.position.z + 0.5);
    }
  };

  const handleRotationSpeedChange = () => {
    setRotationSpeed(prev => prev === 0.01 ? 0.03 : prev === 0.03 ? 0.05 : 0.01);
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div 
        ref={containerRef} 
        className="flex-1 rounded-xl overflow-hidden border border-border shadow-lg"
        style={{ minHeight: "400px" }}
      />
      
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {isPlaying ? "Pause" : "Play"}
        </Button>
        
        <Button variant="outline" size="sm" onClick={handleZoomIn}>
          <ZoomIn className="w-4 h-4 mr-2" />
          Zoom In
        </Button>
        
        <Button variant="outline" size="sm" onClick={handleZoomOut}>
          <ZoomOut className="w-4 h-4 mr-2" />
          Zoom Out
        </Button>
        
        <Button variant="outline" size="sm" onClick={handleRotationSpeedChange}>
          <RotateCw className="w-4 h-4 mr-2" />
          Speed: {rotationSpeed === 0.01 ? "Slow" : rotationSpeed === 0.03 ? "Medium" : "Fast"}
        </Button>
        
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default Simulation3D;
