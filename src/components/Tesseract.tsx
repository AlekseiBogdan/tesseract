'use client'

import React, { useRef, useMemo } from "react";
import { Canvas } from '@react-three/fiber';
import {CameraControls, CameraControlsImpl} from "@react-three/drei";
import * as THREE from "three";
import { AsciiRenderer } from "@react-three/drei";

const { ACTION } = CameraControlsImpl;

export const Tesseract = () => {
  const meshRef = useRef<THREE.LineSegments>(null);

  const generateTesseractVertices = () => {
    const vertices4D: { x: number; y: number; z: number; w: number }[] = [];
    for (const x of [-1, 1]) {
      for (const y of [-1, 1]) {
        for (const z of [-1, 1]) {
          for (const w of [-1, 1]) {
            vertices4D.push({ x, y, z, w });
          }
        }
      }
    }
    return vertices4D;
  };

  const project4Dto3D = (v: { x: number; y: number; z: number; w: number }, distance = 2.5) => {
    const wFactor = 1 / (distance - v.w);
    return new THREE.Vector3(v.x * wFactor, v.y * wFactor, v.z * wFactor);
  };

  const generateEdges = (vertices4D: { x: number; y: number; z: number; w: number }[]) => {
    const edges = [];
    for (let i = 0; i < vertices4D.length; i++) {
      for (let j = i + 1; j < vertices4D.length; j++) {
        let diffCount = 0;
        if (vertices4D[i].x !== vertices4D[j].x) diffCount++;
        if (vertices4D[i].y !== vertices4D[j].y) diffCount++;
        if (vertices4D[i].z !== vertices4D[j].z) diffCount++;
        if (vertices4D[i].w !== vertices4D[j].w) diffCount++;

        if (diffCount === 1) {
          edges.push([i, j]);
        }
      }
    }
    return edges;
  };

  const { geometry } = useMemo(() => {
    const vertices4D = generateTesseractVertices();
    const vertices3D = vertices4D.map(v => project4Dto3D(v));
    const edges = generateEdges(vertices4D);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(edges.length * 2 * 3);

    let index = 0;
    edges.forEach(([a, b]) => {
      positions[index++] = vertices3D[a].x;
      positions[index++] = vertices3D[a].y;
      positions[index++] = vertices3D[a].z;

      positions[index++] = vertices3D[b].x;
      positions[index++] = vertices3D[b].y;
      positions[index++] = vertices3D[b].z;
    });

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const pointsGeometry = new THREE.BufferGeometry();
    const pointsPositions = new Float32Array(vertices3D.length * 3);

    vertices3D.forEach((v, i) => {
      pointsPositions[i * 3] = v.x;
      pointsPositions[i * 3 + 1] = v.y;
      pointsPositions[i * 3 + 2] = v.z;
    });

    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(pointsPositions, 3));

    return { vertices3D, edges, geometry, pointsGeometry };
  }, []);

  return (
    <div id="canvas-container" className="w-[100vw] h-[90vh]">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        {/*<AsciiRenderer/>*/}
        <color attach="background" args={['black']}/>
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1}/>
        <pointLight position={[-10, -10, -10]}/>
        <ambientLight intensity={0.3}/>
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00ffcc" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff0066" />

        <lineSegments geometry={geometry} ref={meshRef}>
          <lineBasicMaterial color="#ffffff" linewidth={1} />
        </lineSegments>

        <points geometry={geometry}>
          <pointsMaterial
            size={0.08}
            sizeAttenuation={true}
            color="grey"
          />
        </points>

        <mesh ref={meshRef}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial transparent={true} opacity={0} />
        </mesh>

        <CameraControls
          mouseButtons={{
            left: ACTION.ROTATE,
            middle: ACTION.DOLLY,
            right: ACTION.TRUCK,
            wheel: ACTION.DOLLY,
          }}
          touches={{
            one: ACTION.TOUCH_ROTATE,
            two: ACTION.TOUCH_DOLLY_TRUCK,
            three: ACTION.TOUCH_DOLLY_TRUCK,
          }}
        />
      </Canvas>
    </div>
  );
};

export default Tesseract;