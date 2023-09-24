import { RootState } from "@/lib/create-store"
import { createSlice } from "@reduxjs/toolkit"
import { timelinesAdapter } from "../model/timeline.entity"
import { getAuthUserTimeline } from "../usecases/get-auth-user-timeline.usecase"

export const timelinesSlice = createSlice({
  name: "timelines",
  initialState: timelinesAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getAuthUserTimeline.fulfilled, (state, action) => {
      const timeline = action.payload
      timelinesAdapter.addOne(state, {
        id: timeline.id,
        user: timeline.user,
        messages: timeline.messages.map((m) => m.id),
      })
    })
  },
})

export const selectTimeline = (timelineId: string, state: RootState) =>
  timelinesAdapter.getSelectors().selectById(state.timelines, timelineId)
