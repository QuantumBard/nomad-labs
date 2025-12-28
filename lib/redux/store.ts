import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import listingsReducer from "./slices/listingsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    listings: listingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
