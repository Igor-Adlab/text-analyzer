export const getObjectDepth = (o: Record<string, any>) =>
  Object(o) === o ? 1 + Math.max(-1, ...Object.values(o).map(getObjectDepth)) : 0;
