export interface GrafoType {
  nodes: { id: number; label: string }[];
  edges: { from: number; to: number; label: string }[];
}

export interface GR {
  [key: string]: string[];
}
