export const NODE_SIZE = 160;
export const INTRO_LENGTH = 0.85;
export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export const ease = (value) => { const t = clamp(value); return t * t * (3 - 2 * t); };
const lerp = (from, to, progress) => from + (to - from) * progress;

// Nodes and connectors share fixed world coordinates; scrolling only moves the camera.
export function createWorkflow(projects) {
  const levels = [340, 340, 190, 190, 340, 490, 340, 190, 190, 340];
  const nodes = projects.map((project, index) => ({ ...project, x: 260 + index * 560, y: levels[index % levels.length] }));
  const edges = nodes.slice(0, -1).map((node, index) => {
    const next = nodes[index + 1], x1 = node.x + NODE_SIZE / 2, x2 = next.x - NODE_SIZE / 2;
    return { id: `${node.id}-${next.id}`, x1, y1: node.y, x2, y2: next.y,
      d: `M ${x1} ${node.y} C ${x1 + 200} ${node.y}, ${x2 - 200} ${next.y}, ${x2} ${next.y}` };
  });
  return { nodes, edges, width: Math.max(720, (nodes.at(-1)?.x || 260) + 260), height: 920 };
}

export function executionAt(progress, count) {
  const time = clamp(progress) * (count + INTRO_LENGTH);
  const zoom = ease((time - 0.15) / (INTRO_LENGTH - 0.15));
  const position = clamp(time - INTRO_LENGTH, 0, Math.max(0, count - 0.001));
  const index = Math.floor(position), phase = progress >= 1 ? 1 : position - index;
  return { time, zoom, index, phase, overview: time < INTRO_LENGTH,
    traveling: phase > 0.58 && index < count - 1,
    completed: time >= INTRO_LENGTH && phase >= 0.28 };
}

export function cameraAt(progress, graph, viewport) {
  const state = executionAt(progress, graph.nodes.length), node = graph.nodes[state.index];
  if (!node) return { x: 0, y: 0, scale: 1 };
  const next = graph.nodes[state.index + 1] || node, travel = ease((state.phase - 0.58) / 0.42);
  const fit = Math.min((viewport.width - 64) / graph.width, (viewport.height - 90) / graph.height);
  const focus = Math.max(0.38, Math.min(1.3, (viewport.width - 48) / 360, (viewport.height - 150) / 380));
  const scale = lerp(fit, focus, state.zoom);
  const centerX = lerp(graph.width / 2, lerp(node.x, next.x, travel), state.zoom);
  const centerY = lerp(430, lerp(node.y, next.y, travel) + 60, state.zoom);
  return { x: viewport.width / 2 - centerX * scale, y: viewport.height * 0.43 - centerY * scale, scale };
}

export function edgeProgress(progress, index, count) {
  return clamp((progress * (count + INTRO_LENGTH) - INTRO_LENGTH - index - 0.38) / 0.62);
}

export function pointOnEdge(edge, progress) {
  const t = clamp(progress), u = 1 - t;
  return { x: u ** 3 * edge.x1 + 3 * u ** 2 * t * (edge.x1 + 200) + 3 * u * t ** 2 * (edge.x2 - 200) + t ** 3 * edge.x2,
    y: u ** 3 * edge.y1 + 3 * u ** 2 * t * edge.y1 + 3 * u * t ** 2 * edge.y2 + t ** 3 * edge.y2 };
}
