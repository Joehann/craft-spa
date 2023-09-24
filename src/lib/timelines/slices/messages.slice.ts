import { RootState } from "@/lib/create-store"
import { createSlice } from "@reduxjs/toolkit"
import { messageAdapater } from "../model/message.entity"
import { getAuthUserTimeline } from "../usecases/get-auth-user-timeline.usecase"

export const messageSlice = createSlice({
  name: "messages",
  initialState: messageAdapater.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getAuthUserTimeline.fulfilled, (state, action) => {
      messageAdapater.addMany(state, action.payload.messages)
    })
  },
})

export const selectMessage = (id: string, state: RootState) =>
  messageAdapater.getSelectors().selectById(state.messages, id)
