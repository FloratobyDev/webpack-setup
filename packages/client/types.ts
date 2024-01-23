export type PageTypes = {
  ANALYTICS: string;
  JOURNAL: string;
  SETTINGS: string;
  PROFILE: string;
};

export const Pages: PageTypes = {
  ANALYTICS: "/analytics",
  JOURNAL: "/",
  SETTINGS: "/settings",
  PROFILE: "/profile",
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

export type NotificationType = {
  id: string;
  push_id: string;
  repo_id: string;
  user_id: string;
  description: string;
  has_interacted: boolean;
  has_seen: boolean;
  created_at: string;
};

export type RepositoryType = {
  name: string;
  id: string;
  hasAlerts: boolean;
  user_id: string;
  description: string;
  notifications: NotificationType[];
};

export type CommitType = {
  commit_sha: string;
  description: string;
};

export type PushType = {
  created_at: string;
  commits: CommitType[];
  has_interacted: boolean;
  has_seen: boolean;
  notification_id: number;
  push_id: number;
};

export type JournalType = {
  title: string;
  content: string;
  commits: CommitType[];
  tasks: TaskType[];
};
