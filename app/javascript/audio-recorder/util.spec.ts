import "web-streams-polyfill";
import { validateAuthorizationCode } from "./util";

describe("validateAuthorizationCode", () => {
  it("returns true for valid codes", () => {
    expect(validateAuthorizationCode("ABCU")).toBe(13119);
  });

  it("returns false for invalid codes", () => {
    expect(validateAuthorizationCode("ABCD")).toBeNaN();
  });
});
