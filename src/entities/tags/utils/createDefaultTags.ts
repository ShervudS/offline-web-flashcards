import type { TTag } from "../types";

export const buildDefaultTags = (): TTag[] => {
  const curDateTime = Date.now();
  const createdAt = new Date().toISOString();

  return [
    {
      id: `${curDateTime}-1`,
      name: "General",
      value: "general",
      color: "#3b82f6",
      createdAt,
    },
    {
      id: `${curDateTime}-2`,
      name: "Vocabulary",
      value: "vocabulary",
      color: "#10b981",
      createdAt,
    },
    {
      id: `${curDateTime}-3`,
      name: "Grammar",
      value: "grammar",
      color: "#f59e0b",
      createdAt,
    },
  ];
};
