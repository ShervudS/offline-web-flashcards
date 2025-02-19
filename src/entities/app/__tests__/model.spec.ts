import { describe, it, expect, beforeEach } from "vitest";
import { allSettled, fork } from "effector";

import { startedApp, $isAppInit } from "../model";

describe("App Model", () => {
  beforeEach(() => {
    $isAppInit.reset();
  });

  it("should have $isAppInit false by default", () => {
    const scope = fork();

    expect(scope.getState($isAppInit)).toEqual(false);
  });

  it("should set $isAppInit to true when startedApp is triggered", async () => {
    const scope = fork();

    await allSettled(startedApp, { scope });

    expect(scope.getState($isAppInit)).toEqual(true);
  });
});
