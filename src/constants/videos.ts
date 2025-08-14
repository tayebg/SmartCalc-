export type Video = {
  id: string;
  title: string;
  specializationId: string;
};

export const videos: Video[] = [
  { id: "v1", title: "Intro to Algorithms", specializationId: "l2" },
  { id: "v2", title: "Systems Basics", specializationId: "l3-si" },
  { id: "v3", title: "IA Foundations", specializationId: "m1-ia" },
];
