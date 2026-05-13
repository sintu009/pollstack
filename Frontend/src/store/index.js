import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import pollReducer from "./slices/pollSlice";
import responseReducer from "./slices/responseSlice";
import liveReducer from "./slices/liveSlice";
import templateReducer from "./slices/templateSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    polls: pollReducer,
    responses: responseReducer,
    live: liveReducer,
    templates: templateReducer,
  },
});
