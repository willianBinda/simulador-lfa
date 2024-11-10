export const geraGrafo = () => {
  const nodes = [
    { id: 1, label: "Node 1" },
    { id: 2, label: "Node 2" },
    { id: 3, label: "Node 3" },
    { id: 4, label: "Node 4" },
    { id: 5, label: "Node 5" },
  ];

  const edges = [
    { from: 1, to: 2, label: "Edge 1-2" },
    { from: 1, to: 3, label: "Edge 1-3" },
    { from: 2, to: 4, label: "Edge 2-4" },
    { from: 2, to: 5, label: "Edge 2-5" },
  ];

  return {
    nodes,
    edges,
  };
};
