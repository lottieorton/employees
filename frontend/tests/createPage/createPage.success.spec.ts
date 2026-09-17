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
    expect(createdEmployeeId).not.toBeNull();
  } finally {
    // clean up
    if (createdEmployeeId) {
      await request.delete(`/employees/${createdEmployeeId}`);
    }
  }
});
