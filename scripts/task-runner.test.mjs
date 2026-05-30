import { describe, expect, it } from "vitest";
import { resolveTask } from "./task-runner.mjs";

describe("task runner", () => {
  it("runs TypeScript through the package entrypoint without platform shims", () => {
    const task = resolveTask("typecheck", "C:/repo");

    expect(task.entrypoint.replaceAll("\\", "/")).toBe(
      "C:/repo/node_modules/typescript/lib/tsc.js",
    );
    expect(task.args).toEqual(["--noEmit"]);
  });

  it("composes check from lint, typecheck, and test tasks", () => {
    const task = resolveTask("check", "/repo");

    expect(task.sequence).toEqual(["lint", "typecheck", "test"]);
  });

  it("uses webpack for production builds to avoid Turbopack process-spawn issues", () => {
    const task = resolveTask("build", "/repo");

    expect(task.args).toEqual(["build", "--webpack"]);
  });

  it("uses webpack for the dev server for the same cross-platform process behavior", () => {
    const task = resolveTask("dev", "/repo");

    expect(task.args).toEqual(["dev", "--webpack"]);
  });
});
