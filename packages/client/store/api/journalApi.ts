import {
  ChecklistType,
  CommitType,
  JournalType,
  PushType,
  RepositoryType,
  TaskType,
} from "@client/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type AllTypes = {
  repositories: RepositoryType[];
  groupedResults: PushType[];
  commits: CommitType[];
  journals: JournalType[];
  tasks: TaskType[];
  checklist: ChecklistType[];
};

const journalApi = createApi({
  reducerPath: "journalApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/journal" }),
  endpoints: (builder) => ({
    fetchRepository: builder.query<AllTypes, void>({
      query: () => "/repo",
    }),
    fetchRepositoryById: builder.query<AllTypes, string>({
      query: (id) => `/repo/${id}`,
    }),
  }),
});

export const { useFetchRepositoryQuery, useFetchRepositoryByIdQuery } =
  journalApi;
export default journalApi;
