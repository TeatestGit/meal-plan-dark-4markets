import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 720 } },
    },
    {
      name: "ipad-gen11",
      use: { ...devices["iPad (gen 11)"] },
    },
    {
      name: "galaxy-tab-s9",
      use: { ...devices["Galaxy Tab S9"] },
    },
    {
      name: "iphone-17-pro",
      use: { ...devices["iPhone 17 Pro"] },
    },
    {
      name: "galaxy-s24",
      use: { ...devices["Galaxy S24"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
