import {
  ChecklistType,
  JournalType,
  PushType,
  RepoNotificationType,
  RepositoryType,
  TaskType,
} from "@client/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type AllTypes = {
  pushes: PushType[];
  journals: JournalType[];
  tasks: TaskType[];
  notifications: NotificationType[];
  bookmarkedJournals: JournalType[];
};

type NotificationType = {
  id: number;
  repo_id: number;
};

type AddTaskReturnType = {
  id: number;
  checklists: ChecklistType[];
};

type AddTaskInputType = {
  newTask: TaskType;
  rest: any;
};

type UpdateChecklistInputType = {
  checklistId: string;
  isDone: boolean;
  taskId: string;
};

type AddJournalType = {
  journal: JournalType;
  rest: any;
};

const journalApi = createApi({
  reducerPath: "journalApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/journal" }),
  tagTypes: ["Repository"],
  endpoints: (builder) => ({
    fetchRepository: builder.query<RepositoryType[], void>({
      query: () => "/repositories",
    }),
    fetchRepositoryById: builder.query<AllTypes, string>({
      query: (id) => {
        return {
          url: `/repositories/${id}`,
          method: "GET",
        };
      },
      providesTags: (result, error, id) => {
        const repoId = `repo-${id}`;
        return [{ type: "Repository", id: repoId }];
      },
      keepUnusedDataFor: 3600,
    }),
    updateNotifications: builder.mutation<void, RepoNotificationType[]>({
      // invalidatesTags: (result, error, notificationInfo) => {
      //   return [{ type: "Repository", id: `repo-${notificationInfo[0].repo_id}` }];
      // },
      query: (notificationInfo) => {
        return {
          url: `/notifications`,
          method: "PATCH",
          body: notificationInfo,
        };
      },
    }),
    updateNotificationHasInteracted: builder.mutation<
      void,
      {
        push_id: number;
        notification_id: number;
      }
    >({
      query: (notificationInfo) => {
        return {
          url: `/notifications/${notificationInfo.notification_id}`,
          method: "PATCH",
          body: {
            push_id: notificationInfo.push_id,
          },
        };
      },
    }),
    updateChecklist: builder.mutation<
      ChecklistType & {
        task_id: string;
      },
      UpdateChecklistInputType
    >({
      query: (checklistInfo) => {
        return {
          url: `/checklists/${checklistInfo.checklistId}`,
          method: "PATCH",
          body: {
            isDone: checklistInfo.isDone,
            taskId: checklistInfo.taskId,
          },
        };
      },
    }),
    updateTaskState: builder.mutation<
      TaskType,
      {
        id: string;
        state: string;
      }
    >({
      query: (taskInfo) => {
        return {
          url: `/tasks/${taskInfo.id}`,
          method: "PATCH",
          body: {
            state: taskInfo.state,
          },
        };
      },
    }),
    addTasks: builder.mutation<AddTaskReturnType, AddTaskInputType>({
      query: ({ newTask, rest }) => {
        return {
          url: `/tasks`,
          method: "POST",
          body: {
            newTask,
            rest,
          },
        };
      },
    }),
    fetchCalendarDatesByMonth: builder.query<Array<string>, string>({
      query: (month) => {
        return {
          url: `/calendar/${month}`,
          method: "GET",
        };
      },
    }),
    addJournal: builder.mutation<JournalType, AddJournalType>({
      query: (journal) => {
        return {
          url: "/journals",
          method: "POST",
          body: {
            journal: journal.journal,
            rest: journal.rest,
          },
        };
      },
    }),
    removeBookmark: builder.mutation<JournalType, number>({
      query: (bookmarkId) => {
        return {
          url: `/bookmarks`,
          method: "DELETE",
          params: {
            bookmarkId,
          },
        };
      },
    }),
    addBookmark: builder.mutation<
      JournalType,
      {
        journalId: number;
        repoId: number;
      }
    >({
      query: (bookmarkInfo) => {
        return {
          url: `/bookmarks`,
          method: "POST",
          body: {
            ...bookmarkInfo,
          },
        };
      },
    }),
  }),
});

export const {
  useFetchRepositoryQuery,
  useFetchRepositoryByIdQuery,
  useUpdateNotificationsMutation,
  useAddTasksMutation,
  useUpdateChecklistMutation,
  useUpdateTaskStateMutation,
  useUpdateNotificationHasInteractedMutation,
  useFetchCalendarDatesByMonthQuery,
  useAddJournalMutation,
  useAddBookmarkMutation,
  useRemoveBookmarkMutation,
} = journalApi;
export default journalApi;
