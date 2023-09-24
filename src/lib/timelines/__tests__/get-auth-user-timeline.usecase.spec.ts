import { FakeAuthGateway } from "@/lib/auth/infra/fake-auth.gateway"
import { createStore } from "@/lib/create-store"
import { describe, expect, it } from "vitest"
import { FakeTimelineGateway } from "../infra/fake-timeline.gateway"
import { selectMessage } from "../slices/messages.slice"
import { selectTimeline } from "../slices/timelines.slice"
import { getAuthUserTimeline } from "../usecases/get-auth-user-timeline.usecase"

describe("Feature: Retrieving authenticated user's timeline", () => {
  it("Example: Alice is authenticated and can see her timeline", async () => {
    //Arrange (given)
    givenAuthenticatedUserIs("Alice")
    givenExistingTimeline({
      id: "alice-timeline-id",
      user: "Alice",
      messages: [
        {
          id: "msg1-id",
          text: "Hello it's Bob",
          author: "Bob",
          publishedAt: "2023-05-16T12:06:00.000Z",
        },
        {
          id: "msg2-id",
          text: "Hello it's Alice",
          author: "Alice",
          publishedAt: "2023-05-16T12:05:00.000Z",
        },
      ],
    })

    //Act (when)
    await whenRetrievingAuthenticatedUserTimeline()

    //Assert (then)
    thenTheReceivedTimelineShouldBe({
      id: "alice-timeline-id",
      user: "Alice",
      messages: [
        {
          id: "msg1-id",
          text: "Hello it's Bob",
          author: "Bob",
          publishedAt: "2023-05-16T12:06:00.000Z",
        },
        {
          id: "msg2-id",
          text: "Hello it's Alice",
          author: "Alice",
          publishedAt: "2023-05-16T12:05:00.000Z",
        },
      ],
    })
  })
})

//Création du store
const authGateway = new FakeAuthGateway()
const timelineGateway = new FakeTimelineGateway()
const store = createStore({ authGateway, timelineGateway })

//Functions
const givenAuthenticatedUserIs = (user: string) => {
  authGateway.authUser = user
}

const givenExistingTimeline = (timeline: {
  id: string
  user: string
  messages: {
    id: string
    text: string
    author: string
    publishedAt: string
  }[]
}) => {
  timelineGateway.timelinesByUser.set("Alice", timeline)
}

const whenRetrievingAuthenticatedUserTimeline = async () => {
  await store.dispatch(getAuthUserTimeline())
}

const thenTheReceivedTimelineShouldBe = (expectedTimeline: {
  id: string
  user: string
  messages: {
    id: string
    text: string
    author: string
    publishedAt: string
  }[]
}) => {
  const authUserTimeline = selectTimeline(expectedTimeline.id, store.getState())
  expect(authUserTimeline).toEqual({
    id: expectedTimeline.id,
    user: expectedTimeline.user,
    messages: expectedTimeline.messages.map((m) => m.id),
  })

  expectedTimeline.messages.forEach((msg) => {
    expect(selectMessage(msg.id, store.getState())).toEqual(msg)
  })
}
