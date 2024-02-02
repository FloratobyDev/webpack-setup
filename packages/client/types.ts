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

export type ProgressType = {
  OPEN: string;
  INPROGRESS: string;
  DONE: string;
};

export const ProgressValues: ProgressType = {
  OPEN: "Open",
  INPROGRESS: "In-Progress",
  DONE: "Done",
};

export type ActivityType = {
  JOURNAL: string;
  BOOKMARK: string;
};

export const ActivityValues: ActivityType = {
  JOURNAL: "Journal",
  BOOKMARK: "Bookmark",
};

export type ChecklistType = {
  content: string;
  is_done: boolean;
  id: string;
};

export type TaskType = {
  title: string;
  checklists: ChecklistType[];
  difficulty: string;
  state: string;
  id: string;
  due_date?: string;
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

export type RepoNotificationType = {
  id: number;
  repo_id: number;
};

export type RepositoryType = {
  name: string;
  id: string;
  hasAlerts: boolean;
  user_id: string;
  description: string;
  notifications: RepoNotificationType[];
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
  created_at?: string;
  id?: number;
  published_at?: string;
  status: string;
  title: string;
  content: string;
  commits: CommitType[];
  tasks: TaskType[];
};
