/// <reference types="node" />
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  workers: 1,
  use: {
    baseURL: process.env.FRONTEND_URL ?? "http://localhost:5173",
    headless: process.env.HEADLESS === "false" ? false : true,
    screenshot: "only-on-failure",
  },
  reporter: "html",
  webServer: [
    {
      command:
        "cd .. && ./mvnw spring-boot:run -Dspring-boot.run.profiles=playwright",
      // Checks a successful request against this endpoint
      url: "http://localhost:8081/employees",
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
    {
      command: "npx cross-env VITE_API_URL=http://localhost:8081 npm run dev",
      url: "http://localhost:5173",
      reuseExistingServer: false,
      timeout: 120 * 1000,
    },
  ],
});
