"use client";
import React, { useEffect, useRef } from "react";
import { Network } from "vis-network";
import "../../app/global.css";
import { GrafoType } from "@/types";

export default function Graph({ nodes, edges }: GrafoType) {
  const networkRef = useRef(null);

  useEffect(() => {
    const data = { nodes, edges };

    const options = {
      nodes: {
        shape: "dot",
        size: 20,
        font: {
          size: 15,
          color: "#000",
        },
        color: {
          border: "#3c3c3c",
          background: "#6fa8dc",
        },
      },
      edges: {
        color: { color: "#848484" },
        font: {
          size: 12,
          align: "horizontal",
        },
        arrows: {
          to: { enabled: true, scaleFactor: 0.5 },
        },
      },
      physics: {
        enabled: true,
      },
    };

    // Inicializar a rede apenas se houver dados
    if (networkRef.current && nodes.length && edges.length) {
      new Network(networkRef.current, data, options);
    }
  }, [nodes, edges]);

  return <div ref={networkRef} className="grafo" />;
}
