import { log } from "..";

jest.spyOn(global.console, "log");

describe("@nezuko/logger", () => {
  it("prints a message", () => {
    log("hello");
    expect(console.log).toHaveBeenCalled();
  });
});
