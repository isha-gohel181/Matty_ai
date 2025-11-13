import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slice/user/user.slice.js";
import activityReducer from "../slice/activity/activity.slice.js";
import adminReducer from "../slice/admin/admin.slice.js";
import designReducer from "../slice/design/design.slice.js";
import imageReducer from "../slice/image/image.slice.js";
import templateReducer from "../slice/template/template.slice.js";
import favoriteReducer from "../slice/favorite/favorite.slice.js";
import analyticsReducer from "../slice/analytics/analytics.slice.js";
import aiReducer from "../slice/ai/ai.slice.js";
import apiKeyReducer from "../slice/apiKey/apiKey.slice.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
    activityLog: activityReducer,
    admin: adminReducer,
    design: designReducer,
    image: imageReducer,
    template: templateReducer,
    favorite: favoriteReducer,
    analytics: analyticsReducer,
    ai: aiReducer,
    apiKey: apiKeyReducer,
  },
});