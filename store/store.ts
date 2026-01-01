import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import listingsReducer from "./features/listings/listingsSlice";
import authReducer from "./features/auth/authSlice";
import businessReducer from "./features/business/businessSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    listings: listingsReducer,
    auth: authReducer,
    business: businessReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
