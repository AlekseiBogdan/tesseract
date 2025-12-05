'use client'

import Tesseract from "@/components/Tesseract";
import React, {useRef, useEffect} from "react";

import { animate, splitText, stagger, createScope } from 'animejs';

export default function Home() {

  const root = useRef(null);
  const scope = useRef(null);

  useEffect(() => {

    // @ts-ignore
    scope.current = createScope({ root }).add( self => {

        const { chars } = splitText('p', {
          chars: { wrap: 'clip' },
        });

        animate(chars, {
          y: [
            { to: ['-10%', '10%'] },
            { to: '-10%', delay: 500, ease: 'in(3)' }
          ],
          duration: 1000,
          ease: 'out(3)',
          delay: stagger(50),
          loop: true,
        });
      });

    // @ts-ignore
    return () => scope.current.revert()

  }, []);

  return (
    <div ref={root} className="flex overflow-visible min-h-screen py-[30px] items-center flex-col bg-zinc-50 font-sans dark:bg-black">
      <p className="max-w-md text-6xl text-zinc-200 dark:text-zinc-400">
        Tesseract
      </p>
      <Tesseract/>
    </div>
  );
}

