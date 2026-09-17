import { test, expect } from "@playwright/test";
import { CreatePage } from "../pages/CreatePage.js";

test.beforeEach(async ({ page }) => {
  const createPage = new CreatePage(page);
  await createPage.goto();
});

test("Clicks cancel btn on form and navigates to the home page", async ({
  page,
}) => {
  const createPage = new CreatePage(page);
  await createPage.clickCancelBtn();
  await expect(page).toHaveURL("/");
});

test("Clicks 'Back To Team' btn on form and navigates to the homepage", async ({
  page,
}) => {
  const createPage = new CreatePage(page);
  await createPage.clickBackToTeamLink();
  await expect(page).toHaveURL("/");
});
