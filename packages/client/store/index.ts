import { configureStore } from "@reduxjs/toolkit";
import journalApi from "./api/journalApi";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    [journalApi.reducerPath]: journalApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(journalApi.middleware),
});

setupListeners(store.dispatch);

export { useFetchRepositoryQuery, useFetchRepositoryByIdQuery } from "./api/journalApi";
