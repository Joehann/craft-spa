import { describe, it } from "vitest"

describe("Feature: Retrieving authenticated user's timeline", () => {
  it("Example: Alice is authenticated and can see her timeline", async () => {
    //Arrange (given)
    givenAuthenticatedUserId("Alice")
    givenExistingTimeline({
      user: "Alice",
      messages: [
        {
          text: "Hello it's Bob",
          author: "Bob",
          publishedAt: new Date("2023-05-16T12:06:00.000Z"),
        },
        {
          text: "Hello it's Alice",
          author: "Alice",
          publishedAt: new Date("2023-05-16T12:05:00.000Z"),
        },
      ],
    })

    //Act (when)
    await whenRetrievingAuthenticatedUserTimeline()

    //Assert (then)
    thenTheReceivedTimelineShouldBe({
      messages: [
        {
          text: "Hello it's Bob",
          author: "Bob",
          publishedAt: new Date("2023-05-16T12:06:00.000Z"),
        },
        {
          text: "Hello it's Alice",
          author: "Alice",
          publishedAt: new Date("2023-05-16T12:05:00.000Z"),
        },
      ],
    })
  })
})
