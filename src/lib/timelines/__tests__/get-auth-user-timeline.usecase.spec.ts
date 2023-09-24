import { FakeAuthGateway } from "@/lib/auth/infra/fake-auth.gateway"
import { createStore } from "@/lib/create-store"
import { describe, expect, it } from "vitest"
import { FakeTimelineGateway } from "../infra/fake-timeline.gateway"
import { getAuthUserTimeline } from "../usecases/get-auth-user-timeline.usecase"

describe("Feature: Retrieving authenticated user's timeline", () => {
  it("Example: Alice is authenticated and can see her timeline", async () => {
    //Arrange (given)
    givenAuthenticatedUserIs("Alice")
    givenExistingTimeline({
      user: "Alice",
      messages: [
        {
          text: "Hello it's Bob",
          author: "Bob",
          publishedAt: "2023-05-16T12:06:00.000Z",
        },
        {
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
      user: "Alice",
      messages: [
        {
          text: "Hello it's Bob",
          author: "Bob",
          publishedAt: "2023-05-16T12:06:00.000Z",
        },
        {
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
  user: string
  messages: {
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
  user: string
  messages: {
    text: string
    author: string
    publishedAt: string
  }[]
}) => {
  const authUserTimeline = store.getState()
  expect(authUserTimeline).toEqual(expectedTimeline)
}
