export const getRandomItems = <T>(array: T[], limit: number): T[] => {
  if (!array || array.length === 0) return [];

  return [...array].sort(() => 0.5 - Math.random()).slice(0, limit);
};
