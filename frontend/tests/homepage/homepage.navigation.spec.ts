import { test, expect } from "@playwright/test";
import { Homepage } from "../pages/Homepage.js";

test.beforeEach(async ({ page }) => {
  const home = new Homepage(page);
  await home.goto();
});

test("Navigates to the create user page when user goes to add employee", async ({
  page,
}) => {
  const home = new Homepage(page);
  await home.goto();

  await home.clickAddEmployeeBtn();
  await expect(page).toHaveURL(/.*create/);
  await expect(
    page.getByRole("heading", { name: "Create New Employee" }),
  ).toBeVisible();
});

test("Navigates to a specific user's page when user goes to view an employee", async ({
  page,
}) => {
  const home = new Homepage(page);

  await expect(page.getByRole("article").first()).toBeVisible();
  const expectedPath = await home.clickFirstViewEmployeeBtn();
  await expect(page).toHaveURL(new RegExp(`.*${expectedPath}$`));
  await expect(
    page.getByRole("heading", { name: "Personal Information" }),
  ).toBeVisible();
});
