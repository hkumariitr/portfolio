import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Color, Vector3, Fog, Scene } from "three";
import ThreeGlobe from "three-globe";
import countries from "@/data/globe.json"; // Assuming valid geo data

// Extend so R3F recognizes <primitive object={...} />
extend({ ThreeGlobe });

interface ArcData {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
}

interface GlobeConfig {
  pointSize: number;
  globeColor: string;
  showAtmosphere: boolean;
  atmosphereColor: string;
  atmosphereAltitude: number;
  emissive: string;
  emissiveIntensity: number;
  shininess: number;
  polygonColor: string;
  ambientLight: string;
  directionalLeftLight: string;
  directionalTopLight: string;
  pointLight: string;
  arcTime: number;
  arcLength: number;
  rings: number;
  maxRings: number;
  initialPosition: { lat: number; lng: number };
  autoRotate: boolean;
  autoRotateSpeed: number;
}

interface WorldProps {
  data: ArcData[];
  globeConfig: GlobeConfig;
}

function GlobeScene({ data, globeConfig }: WorldProps) {
  const globeRef = useRef<ThreeGlobe>(null!);
  const { scene } = useThree();

  useEffect(() => {
    const globe = new ThreeGlobe()
      .globeImageUrl("//unpkg.com/three-globe/example/img/earth-night.jpg")
      .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
      .polygonsData(countries.features)
      .polygonCapColor(() => globeConfig.polygonColor || "rgba(200,0,0,0.6)")
      .arcsData(data)
      .arcColor((arc: { color: string }) => arc.color)
      .arcDashLength(globeConfig.arcLength || 0.9)
      .arcDashGap(2)
      .arcDashInitialGap(1)
      .arcDashAnimateTime(globeConfig.arcTime || 10000)
      .pointsData(data)
      .pointColor(() => globeConfig.pointLight || "#ffffff")
      .pointsMerge(true)
      .pointAltitude(0.1)
      .pointRadius(globeConfig.pointSize || 0.25);

    globeRef.current = globe;
    scene.add(globe);

    // Apply auto-rotation if enabled
    if (globeConfig.autoRotate) {
      const animate = () => {
        globe.rotateY(globeConfig.autoRotateSpeed * 0.01);
        requestAnimationFrame(animate);
      };
      animate();
    }

    return () => {
      scene.remove(globe);
    };
  }, [scene, data, globeConfig]);

  return null;
}

export const World: React.FC<WorldProps> = ({ data, globeConfig }) => {
  return (
    <Canvas camera={{ position: [0, 0, 400], fov: 45 }}>
      <color attach="background" args={[globeConfig.globeColor || "#000"]} />
      <fog attach="fog" args={[globeConfig.atmosphereColor || "#000", 400, 1000]} />
      <ambientLight intensity={0.6} color={globeConfig.ambientLight || "#ffffff"} />
      <directionalLight 
        position={[1, 1, 1]} 
        intensity={0.8} 
        color={globeConfig.directionalTopLight || "#ffffff"} 
      />
      <directionalLight 
        position={[-1, 0.5, 1]} 
        intensity={0.5} 
        color={globeConfig.directionalLeftLight || "#ffffff"} 
      />
      <GlobeScene data={data} globeConfig={globeConfig} />
      <OrbitControls 
        enableZoom={false} 
        autoRotate={globeConfig.autoRotate}
        autoRotateSpeed={globeConfig.autoRotateSpeed}
      />
    </Canvas>
  );
};

// Keep the default export for backward compatibility
export default function Globe() {
  const defaultData: ArcData[] = [];
  const defaultConfig: GlobeConfig = {
    pointSize: 0.25,
    globeColor: "#000",
    showAtmosphere: true,
    atmosphereColor: "#000",
    atmosphereAltitude: 0.1,
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(200,0,0,0.6)",
    ambientLight: "#ffffff",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 10000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };

  return <World data={defaultData} globeConfig={defaultConfig} />;
}