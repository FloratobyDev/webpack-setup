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

const journalApi = createApi({
  reducerPath: "journalApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/journal" }),
  tagTypes: ["Repository"],
  endpoints: (builder) => ({
    fetchRepository: builder.query<RepositoryType[], void>({
      query: () => "/repo",
    }),
    fetchRepositoryById: builder.query<AllTypes, string>({
      query: (id) => {
        return {
          url: `/repo/${id}`,
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
          url: `repo/notifications`,
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
          url: `repo/notifications/${notificationInfo.notification_id}/interacted`,
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
          url: `/repo/checklists/${checklistInfo.checklistId}`,
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
          url: `/repo/tasks/${taskInfo.id}/state`,
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
          url: `/repo/tasks/create`,
          method: "POST",
          body: {
            newTask,
            rest,
          },
        };
      },
    }),
    fetchCalendarDatesByMonth: builder.query<
      {
        date: string;
        count: number;
      }[],
      string
    >({
      query: (month) => {
        return {
          url: `/repo/calendar/${month}`,
          method: "GET",
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
} = journalApi;
export default journalApi;
