import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera, Text } from '@react-three/drei';
import * as THREE from 'three';
import { ThemeMode } from '../types';

// Fix for TypeScript errors: Property '...' does not exist on type 'JSX.IntrinsicElements'
// We need to augment both global JSX (for older setups) and React.JSX (for newer setups)
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      group: any;
      boxGeometry: any;
      meshStandardMaterial: any;
      planeGeometry: any;
      pointLight: any;
      lineSegments: any;
      bufferGeometry: any;
      bufferAttribute: any;
      lineBasicMaterial: any;
      sphereGeometry: any;
      meshBasicMaterial: any;
      circleGeometry: any;
      spotLight: any;
      color: any;
      fog: any;
      ambientLight: any;
      directionalLight: any;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      group: any;
      boxGeometry: any;
      meshStandardMaterial: any;
      planeGeometry: any;
      pointLight: any;
      lineSegments: any;
      bufferGeometry: any;
      bufferAttribute: any;
      lineBasicMaterial: any;
      sphereGeometry: any;
      meshBasicMaterial: any;
      circleGeometry: any;
      spotLight: any;
      color: any;
      fog: any;
      ambientLight: any;
      directionalLight: any;
    }
  }
}

interface BridgeViewerProps {
  theme: ThemeMode;
  onZoomChange?: (zoom: number) => void;
  controlAction?: 'zoomIn' | 'zoomOut' | 'reset' | null;
  onControlActionHandled?: () => void;
}

// --- CONSTANTS ---
const BRIDGE_LENGTH = 600;
const DECK_WIDTH = 14;
const DECK_Y = 5;
const PYLON_HEIGHT = 50;
const PYLON_POSITIONS = [-100, 100]; // X positions of the two main towers
const CABLES_PER_SIDE = 12;

// --- SUB-COMPONENTS ---

const Water = ({ isNight }: { isNight: boolean }) => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[2000, 2000]} />
      <meshStandardMaterial 
        color={isNight ? "#020617" : "#0ea5e9"} 
        roughness={0.1}
        metalness={0.8}
        emissive={isNight ? "#0f172a" : "#000000"}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

const Pylon = ({ x, isNight }: { x: number, isNight: boolean }) => {
  const color = isNight ? "#64748b" : "#e2e8f0";
  return (
    <group position={[x, 0, 0]}>
      {/* Foundation */}
      <mesh position={[0, DECK_Y / 2, 0]}>
        <boxGeometry args={[4, DECK_Y + 10, DECK_WIDTH + 4]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      
      {/* Tower Legs */}
      <mesh position={[0, PYLON_HEIGHT / 2, 6]}>
        <boxGeometry args={[3, PYLON_HEIGHT, 2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, PYLON_HEIGHT / 2, -6]}>
        <boxGeometry args={[3, PYLON_HEIGHT, 2]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Cross beams */}
      <mesh position={[0, PYLON_HEIGHT * 0.4, 0]}>
        <boxGeometry args={[2.5, 2, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, PYLON_HEIGHT * 0.8, 0]}>
        <boxGeometry args={[2.5, 2, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Warning Light on Top */}
      <mesh position={[0, PYLON_HEIGHT, 0]}>
        <sphereGeometry args={[0.5]} />
        <meshBasicMaterial color="red" />
      </mesh>
      {isNight && <pointLight position={[0, PYLON_HEIGHT, 0]} color="red" intensity={2} distance={20} />}
    </group>
  );
};

const Cables = ({ isNight }: { isNight: boolean }) => {
  const points = useMemo(() => {
    const p = [];
    
    // Create cables for each pylon
    PYLON_POSITIONS.forEach(pylonX => {
      // Fan/Harp arrangement
      const cableSpacingOnDeck = 12;
      
      // Define vertical span for cable attachment on tower
      // PYLON_HEIGHT is 50. Let's attach between 35 and 48.
      const towerAttachTop = PYLON_HEIGHT - 2; 
      const towerAttachBottom = PYLON_HEIGHT * 0.7; 

      for (let i = 1; i <= CABLES_PER_SIDE; i++) {
        // Semi-Fan arrangement to prevent crossing:
        // The further out the cable is on the deck (higher i), 
        // the higher it should be attached on the tower.
        const t = (i - 1) / (CABLES_PER_SIDE - 1); // 0 to 1
        const towerY = towerAttachBottom + t * (towerAttachTop - towerAttachBottom);

        // Left side of pylon
        const deckX_L = pylonX - (i * cableSpacingOnDeck + 10);
        
        // Right side of pylon
        const deckX_R = pylonX + (i * cableSpacingOnDeck + 10);

        // Connect to both sides of the deck width (z axis)
        [-1, 1].forEach(side => {
            const z = (DECK_WIDTH / 2 - 0.5) * side;
            
            // From Tower Left Leg to Deck Left
            p.push(
                new THREE.Vector3(pylonX, towerY, z), 
                new THREE.Vector3(deckX_L, DECK_Y, z)
            );

            // From Tower Right Leg to Deck Right
            p.push(
                new THREE.Vector3(pylonX, towerY, z), 
                new THREE.Vector3(deckX_R, DECK_Y, z)
            );
        });
      }
    });
    return p;
  }, [isNight]);

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(v => [v.x, v.y, v.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color={isNight ? "#64748b" : "#94a3b8"} opacity={0.8} transparent linewidth={1} />
    </lineSegments>
  );
};

const Deck = ({ isNight }: { isNight: boolean }) => {
  return (
    <group>
      {/* Main Road Surface */}
      <mesh position={[0, DECK_Y, 0]}>
        <boxGeometry args={[BRIDGE_LENGTH, 1, DECK_WIDTH]} />
        <meshStandardMaterial color={isNight ? "#1e293b" : "#334155"} roughness={0.8} />
      </mesh>
      
      {/* Railings */}
      <mesh position={[0, DECK_Y + 1, DECK_WIDTH/2]}>
        <boxGeometry args={[BRIDGE_LENGTH, 1, 0.5]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
      <mesh position={[0, DECK_Y + 1, -DECK_WIDTH/2]}>
        <boxGeometry args={[BRIDGE_LENGTH, 1, 0.5]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>

      {/* Street Lights */}
      {Array.from({ length: 20 }).map((_, i) => {
        const x = -BRIDGE_LENGTH/2 + i * (BRIDGE_LENGTH/20) + 15;
        if (Math.abs(x - PYLON_POSITIONS[0]) < 10 || Math.abs(x - PYLON_POSITIONS[1]) < 10) return null;
        return (
            <group key={i} position={[x, DECK_Y, 0]}>
                <mesh position={[0, 4, 0]}>
                     <boxGeometry args={[0.2, 8, 0.2]} />
                     <meshStandardMaterial color="#64748b" />
                </mesh>
                <mesh position={[0, 8, 0]}>
                     <boxGeometry args={[0.5, 0.2, DECK_WIDTH - 2]} />
                     <meshStandardMaterial color="#64748b" />
                </mesh>
                {/* Bulbs */}
                <mesh position={[0, 7.8, 4]}>
                    <boxGeometry args={[1, 0.2, 0.5]} />
                    <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={isNight ? 2 : 0} />
                </mesh>
                {isNight && <pointLight position={[0, 7, 4]} color="#fef08a" intensity={1.5} distance={25} decay={2} />}
                
                <mesh position={[0, 7.8, -4]}>
                    <boxGeometry args={[1, 0.2, 0.5]} />
                    <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={isNight ? 2 : 0} />
                </mesh>
                {isNight && <pointLight position={[0, 7, -4]} color="#fef08a" intensity={1.5} distance={25} decay={2} />}
            </group>
        )
      })}
    </group>
  );
};

const Car = ({ startX, speed, zLane, color, isNight }: { startX: number, speed: number, zLane: number, color: string, isNight: boolean }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.position.x += speed * delta * 10;
      if (ref.current.position.x > BRIDGE_LENGTH / 2) {
        ref.current.position.x = -BRIDGE_LENGTH / 2;
      } else if (ref.current.position.x < -BRIDGE_LENGTH / 2) {
        ref.current.position.x = BRIDGE_LENGTH / 2;
      }
    }
  });

  return (
    <group ref={ref} position={[startX, DECK_Y + 1, zLane]}>
      <mesh>
        <boxGeometry args={[4, 1.5, 2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Headlights */}
      {isNight && speed > 0 && (
         <>
            <spotLight position={[2, 0, 0.5]} angle={0.5} penumbra={0.5} intensity={5} color="#fff" target-position={[10, 0, 0.5]} />
            <mesh position={[2.01, 0, 0.5]} rotation={[0, Math.PI/2, 0]}>
                <circleGeometry args={[0.2]} />
                <meshBasicMaterial color="#fff" />
            </mesh>
            <mesh position={[2.01, 0, -0.5]} rotation={[0, Math.PI/2, 0]}>
                <circleGeometry args={[0.2]} />
                <meshBasicMaterial color="#fff" />
            </mesh>
         </>
      )}
      {/* Taillights */}
      {isNight && speed > 0 && (
          <>
            <mesh position={[-2.01, 0, 0.5]} rotation={[0, -Math.PI/2, 0]}>
                <circleGeometry args={[0.2]} />
                <meshBasicMaterial color="#ef4444" />
            </mesh>
            <mesh position={[-2.01, 0, -0.5]} rotation={[0, -Math.PI/2, 0]}>
                <circleGeometry args={[0.2]} />
                <meshBasicMaterial color="#ef4444" />
            </mesh>
            <pointLight position={[-2.5, 0, 0]} color="#ef4444" intensity={1} distance={5} />
          </>
      )}
    </group>
  );
};

const CameraController = ({ 
    action, 
    onHandled 
}: { 
    action: 'zoomIn' | 'zoomOut' | 'reset' | null, 
    onHandled: () => void 
}) => {
    const { camera, controls } = useThree();
    // Use OrbitControls ref if available via context, but easier to manipulate camera directly
    
    useEffect(() => {
        if (!action) return;

        const currentPos = camera.position.clone();
        const target = new THREE.Vector3(0, 0, 0); // Assuming looking at center
        const direction = currentPos.clone().sub(target).normalize();
        const distance = currentPos.distanceTo(target);

        if (action === 'zoomIn') {
             const newDist = Math.max(distance - 20, 20);
             const newPos = target.add(direction.multiplyScalar(newDist));
             camera.position.lerp(newPos, 0.5); // Instant jump for responsiveness, or use simple set
             camera.position.copy(newPos);
        } else if (action === 'zoomOut') {
             const newDist = Math.min(distance + 20, 400);
             const newPos = target.add(direction.multiplyScalar(newDist));
             camera.position.copy(newPos);
        } else if (action === 'reset') {
            camera.position.set(0, 50, 150);
            camera.lookAt(0, 0, 0);
        }
        
        onHandled();
    }, [action, camera, onHandled]);

    return null;
}


// --- MAIN COMPONENT ---

export const BridgeViewer: React.FC<BridgeViewerProps> = ({ 
    theme, 
    onZoomChange,
    controlAction,
    onControlActionHandled
}) => {
  const isNight = theme === ThemeMode.NIGHT;
  
  // Background color
  const bgColor = isNight ? '#020617' : '#bae6fd';
  const fogColor = isNight ? '#020617' : '#bae6fd';

  return (
    <div className="w-full h-full relative">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 40, 120]} fov={50} />
        
        <color attach="background" args={[bgColor]} />
        <fog attach="fog" args={[fogColor, 20, 350]} />
        
        {/* Lights */}
        <ambientLight intensity={isNight ? 0.2 : 0.6} color={isNight ? "#1e1b4b" : "#ffffff"} />
        <directionalLight 
            position={[100, 100, 50]} 
            intensity={isNight ? 0.2 : 1.5} 
            castShadow 
            shadow-mapSize={[2048, 2048]}
            color={isNight ? "#6366f1" : "#fff7ed"}
        />
        
        {isNight && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}

        {/* Scene Objects */}
        <group>
          <Water isNight={isNight} />
          
          <Deck isNight={isNight} />
          
          {PYLON_POSITIONS.map((x, i) => (
             <Pylon key={i} x={x} isNight={isNight} />
          ))}

          <Cables isNight={isNight} />

          {/* Cars */}
          <Car startX={-100} speed={2} zLane={3} color="#f87171" isNight={isNight} />
          <Car startX={0} speed={2.5} zLane={3} color="#fbbf24" isNight={isNight} />
          <Car startX={-200} speed={1.8} zLane={3} color="#cbd5e1" isNight={isNight} />
          
          <Car startX={100} speed={-2} zLane={-3} color="#60a5fa" isNight={isNight} />
          <Car startX={50} speed={-2.2} zLane={-3} color="#34d399" isNight={isNight} />
        </group>

        {/* Controls */}
        <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            enableRotate={true}
            maxPolarAngle={Math.PI / 2 - 0.05} // Don't go below ground
            minDistance={10}
            maxDistance={300}
            onChange={(e) => {
                if (e?.target?.object?.position && onZoomChange) {
                     // Calculate a rough zoom percentage based on distance
                     const dist = e.target.object.position.distanceTo(new THREE.Vector3(0,0,0));
                     const pct = Math.max(0, Math.min(100, ((300 - dist) / (300 - 10)) * 100));
                     onZoomChange(Math.round(pct));
                }
            }}
        />

        {controlAction && (
             <CameraController 
                 action={controlAction} 
                 onHandled={() => onControlActionHandled && onControlActionHandled()} 
             />
        )}

      </Canvas>
    </div>
  );
};