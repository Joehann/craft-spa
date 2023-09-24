import { combineReducers } from "@reduxjs/toolkit"
import { messageSlice } from "./slices/messages.slice"
import { timelinesSlice } from "./slices/timelines.slice"

export const reducer = combineReducers({
  [timelinesSlice.name]: timelinesSlice.reducer,
  [messageSlice.name]: messageSlice.reducer,
})
