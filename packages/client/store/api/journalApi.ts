import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  JournalType,
  PushType,
  RepoNotificationType,
  RepositoryType,
  TaskType,
} from "@client/types";

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
  }),
});

export const {
  useFetchRepositoryQuery,
  useFetchRepositoryByIdQuery,
  useUpdateNotificationsMutation,
} = journalApi;
export default journalApi;
