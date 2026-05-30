import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TASKS = {
  dev: {
    entrypoint: ["node_modules", "next", "dist", "bin", "next"],
    args: ["dev", "--webpack"],
  },
  build: {
    entrypoint: ["node_modules", "next", "dist", "bin", "next"],
    args: ["build", "--webpack"],
  },
  start: {
    entrypoint: ["node_modules", "next", "dist", "bin", "next"],
    args: ["start"],
  },
  lint: {
    entrypoint: ["node_modules", "@biomejs", "biome", "bin", "biome"],
    args: ["check", "."],
  },
  "lint:fix": {
    entrypoint: ["node_modules", "@biomejs", "biome", "bin", "biome"],
    args: ["check", "--write", "."],
  },
  typecheck: {
    entrypoint: ["node_modules", "typescript", "lib", "tsc.js"],
    args: ["--noEmit"],
  },
  test: {
    entrypoint: ["node_modules", "vitest", "vitest.mjs"],
    args: ["run"],
  },
  "test:watch": {
    entrypoint: ["node_modules", "vitest", "vitest.mjs"],
    args: [],
  },
  e2e: {
    entrypoint: ["node_modules", "@playwright", "test", "cli.js"],
    args: ["test"],
  },
  check: {
    sequence: ["lint", "typecheck", "test"],
  },
};

export function resolveTask(name, cwd = process.cwd()) {
  const task = TASKS[name];

  if (!task) {
    throw new Error(`Unknown task "${name}". Available tasks: ${Object.keys(TASKS).join(", ")}`);
  }

  if (task.sequence) {
    return { sequence: [...task.sequence] };
  }

  return {
    entrypoint: path.join(cwd, ...task.entrypoint),
    args: [...task.args],
  };
}

async function runResolvedTask(name) {
  const task = resolveTask(name);

  if (task.sequence) {
    for (const childTask of task.sequence) {
      await runResolvedTask(childTask);
    }
    return;
  }

  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [task.entrypoint, ...task.args], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        FORCE_COLOR: process.env.FORCE_COLOR ?? "1",
      },
      shell: false,
      stdio: "inherit",
      windowsHide: true,
    });

    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(signal ? `${name} stopped by ${signal}` : `${name} failed with code ${code}`),
      );
    });
  });
}

async function main() {
  const taskName = process.argv[2];

  if (!taskName) {
    throw new Error("Usage: node scripts/task-runner.mjs <task>");
  }

  await runResolvedTask(taskName);
}

const currentFile = fileURLToPath(import.meta.url);

if (process.argv[1] && path.resolve(process.argv[1]) === currentFile) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
