import { describe, expect, it } from "vitest";
import { isValidEmail } from "./validation";

describe("isValidEmail", () => {
  it("accepts a well-formed email", () => {
    expect(isValidEmail("adaeze@example.com")).toBe(true);
  });

  it("accepts an email with surrounding whitespace", () => {
    expect(isValidEmail("  adaeze@example.com  ")).toBe(true);
  });

  it.each(["", "not-an-email", "missing-domain@", "@missing-local.com", "no-at-sign.com", "spaces in@email.com"])(
    "rejects %j",
    (value) => {
      expect(isValidEmail(value)).toBe(false);
    }
  );
});
