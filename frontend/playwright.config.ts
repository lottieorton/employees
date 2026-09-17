/// <reference types="node" />
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: process.env.FRONTEND_URL ?? "http://localhost:5173",
    headless: process.env.HEADLESS === "false" ? false : true,
    screenshot: "only-on-failure",
  },
  reporter: "html",
});
