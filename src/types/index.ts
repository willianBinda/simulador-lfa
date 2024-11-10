export interface GrafoType {
  nodes: { id: number; label: string }[];
  edges: { from: number; to: number; label: string }[];
}
