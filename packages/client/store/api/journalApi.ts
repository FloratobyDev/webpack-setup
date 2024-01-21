import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RepositoryType } from "@client/types";

const journalApi = createApi({
  reducerPath: "journalApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/journal" }),
  endpoints: (builder) => ({
    fetchRepository: builder.query<RepositoryType[], void>({
      query: () => "/repo",
    }),
  }),
});

export const { useFetchRepositoryQuery } = journalApi;
export default journalApi;
