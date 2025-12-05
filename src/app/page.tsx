import Tesseract from "@/components/Tesseract";
import {CameraControls} from "@react-three/drei";
import React from "react";

export default function Home() {
  return (
    <div className="flex min-h-screen py-[30px] items-center flex-col bg-zinc-50 font-sans dark:bg-black">
      <p className="max-w-md text-6xl leading-8 text-zinc-200 dark:text-zinc-400">
        Tesseract
      </p>
      <Tesseract/>
    </div>
  );
}




// 'use client'
//
// import React from "react";
// import { Canvas } from '@react-three/fiber';
// import { AsciiRenderer } from "@react-three/drei";
// import { CameraControls } from "@react-three/drei";
// import { CameraControlsImpl } from "@react-three/drei";
// import { Segment } from "@react-three/drei";
// import { Segments } from "@react-three/drei";
// import * as THREE from "three";

