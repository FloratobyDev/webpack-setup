export type PageTypes = {
  ANALYTICS: string;
  JOURNAL: string;
  SETTINGS: string;
};

export const Pages: PageTypes = {
  ANALYTICS: "analytics",
  JOURNAL: "journal",
  SETTINGS: "settings",
};

export const DifficultyTypes = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
};

export const ProgressType = {
  OPEN: "Open",
  INPROGRESS: "In-Progress",
  DONE: "Done",
};

export type ChecklistType = {
  description: string;
  checked: boolean;
  checklistId: string;
};

export type TaskType = {
  name: string;
  checklist: ChecklistType[];
  difficulty: string;
  progress: string;
  taskId: string;
};

export type RepositoryType = {
  name: string;
  repoId: string;
  repositoryInfo: {
    description: string;
    languages: string[];
  };
};

export type CommitType = {
  message: string;
  date: string;
  commit_sha: string;
};

export type PushType = {
  pushId: string;
  pushAt: string;
  commits: CommitType[];
  has_interacted: boolean;
};

export type JournalType = {
  title: string;
  content: string;
  commits: CommitType[];
  tasks: TaskType[];
};
