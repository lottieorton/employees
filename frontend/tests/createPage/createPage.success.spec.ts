import { test, expect } from "@playwright/test";
import { CreatePage } from "../pages/CreatePage.js";

test("Fills form, creates employee and redirects home", async ({
  page,
  request,
}) => {
  const createPage = new CreatePage(page);
  await createPage.goto();

  await createPage.form.fillForm();

  const createdEmployeeId = await createPage.submitAndGetCreatedId();

  try {
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { name: "Team" })).toBeVisible();
    expect(createdEmployeeId).not.toBeNull();
  } finally {
    // clean up
    if (createdEmployeeId) {
      await request.delete(
        `http://localhost:8081/employees/${createdEmployeeId}`,
      );
    }
  }
});
