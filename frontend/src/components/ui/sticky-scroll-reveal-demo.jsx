"use client";
import React from "react";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { Dices, Bot, Share2, Palette, Wand2, Download } from "lucide-react";

const content = [
  {
    title: "Drag & Drop Editor",
    description:
      "Effortlessly design with our intuitive drag-and-drop canvas. Move, resize, and arrange elements with precision. No design experience needed - just drag, drop, and create stunning visuals in minutes.",
    content: (
      <div className="h-full w-full bg-linear-to-br from-cyan-500 to-emerald-500 flex items-center justify-center p-10">
        <div className="flex flex-col items-center space-y-4">
          <Dices size={64} className="text-white" />
          <p className="text-white text-center font-semibold">Intuitive Interface</p>
        </div>
      </div>
    ),
  },
  {
    title: "AI-Powered Assistance",
    description:
      "Enhance your designs with cutting-edge AI tools. Remove backgrounds instantly, apply intelligent filters, get smart design suggestions, and let AI help you create professional-quality graphics effortlessly.",
    content: (
      <div className="h-full w-full bg-linear-to-br from-pink-500 to-indigo-500 flex items-center justify-center p-10">
        <div className="flex flex-col items-center space-y-4">
          <Bot size={64} className="text-white" />
          <p className="text-white text-center font-semibold">Smart Tools</p>
        </div>
      </div>
    ),
  },
  {
    title: "Export with Ease",
    description:
      "Export your creations to PNG, PDF, or SVG with a single click. High-resolution output ensures your designs look perfect everywhere - from web to print. Share directly to social media or download for later use.",
    content: (
      <div className="h-full w-full bg-linear-to-br from-orange-500 to-yellow-500 flex items-center justify-center p-10">
        <div className="flex flex-col items-center space-y-4">
          <Share2 size={64} className="text-white" />
          <p className="text-white text-center font-semibold">Multiple Formats</p>
        </div>
      </div>
    ),
  },
  {
    title: "Professional Templates",
    description:
      "Start with professionally designed templates for social media, presentations, posters, and more. Customize colors, fonts, and layouts to match your brand. Save time while maintaining creative control.",
    content: (
      <div className="h-full w-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center p-10">
        <div className="flex flex-col items-center space-y-4">
          <Palette size={64} className="text-white" />
          <p className="text-white text-center font-semibold">Ready-to-Use Templates</p>
        </div>
      </div>
    ),
  },
  {
    title: "Magic Design Tools",
    description:
      "Access powerful design tools including shape creation, text effects, image filters, and layer management. Our magic wand tool automatically enhances your designs with a single click.",
    content: (
      <div className="h-full w-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center p-10">
        <div className="flex flex-col items-center space-y-4">
          <Wand2 size={64} className="text-white" />
          <p className="text-white text-center font-semibold">Advanced Features</p>
        </div>
      </div>
    ),
  },
  {
    title: "Instant Downloads",
    description:
      "Get your designs immediately with our fast export engine. Choose your preferred format and resolution. Download to your device or save to cloud storage for easy access anywhere.",
    content: (
      <div className="h-full w-full bg-linear-to-br from-green-500 to-teal-500 flex items-center justify-center p-10">
        <div className="flex flex-col items-center space-y-4">
          <Download size={64} className="text-white" />
          <p className="text-white text-center font-semibold">Quick & Easy</p>
        </div>
      </div>
    ),
  },
];

export default function StickyScrollRevealDemo() {
  return (
    <div className="w-full">
      <StickyScroll content={content} />
    </div>
  );
}
