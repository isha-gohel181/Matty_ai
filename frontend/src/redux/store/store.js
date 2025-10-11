import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slice/user/user.slice.js";
import activityReducer from "../slice/activity/activity.slice.js";
import adminReducer from "../slice/admin/admin.slice.js";
import designReducer from "../slice/design/design.slice.js"; // Imported the new reducer

export const store = configureStore({
  reducer: {
    user: userReducer,
    activity: activityReducer,
    admin: adminReducer,
    design: designReducer, // Added the new reducer
  },
});