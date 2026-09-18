import { expect, test } from "@playwright/test";
import { EmployeePage } from "../pages/EmployeePage.js";

test.describe("EmployeePage", () => {
  test("Toggles into edit mode, updates form and saves changes", async ({
    page,
    request,
  }) => {
    const employeePage = new EmployeePage(page);
    const testEmployeeId = await employeePage.createTestEmployee(request, {
      firstName: "Michael",
      lastName: "Delfino",
      preferredName: "Mike",
    });

    try {
      await employeePage.goto(testEmployeeId);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "Michael (Mike) Delfino",
      );
      await expect(
        page
          .getByRole("heading", { name: "Middle Name", exact: true })
          .locator("+ p"),
      ).toHaveText("Jordan");

      // toggle into edit mode
      await employeePage.clickEditBtn();
      await expect(page.getByRole("button", { name: "View" })).toBeVisible();

      // update middlename and submit form
      await employeePage.form.updateMiddleName("C");
      await employeePage.clickSaveChangesBtn();

      await expect(page.getByRole("button", { name: "Edit" })).toBeVisible();
      await expect(
        page
          .getByRole("heading", { name: "Middle Name", exact: true })
          .locator("+ p"),
      ).toHaveText("C");
    } finally {
      // clean up
      await request.delete(`http://localhost:8081/employees/${testEmployeeId}`);
    }
  });

  test("Toggles into edit mode, deletes employee and navigates to homepage", async ({
    page,
    request,
  }) => {
    const employeePage = new EmployeePage(page);
    const testEmployeeId = await employeePage.createTestEmployee(request);

    await employeePage.goto(testEmployeeId);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // toggle into edit mode
    await employeePage.clickEditBtn();
    await expect(page.getByRole("button", { name: "View" })).toBeVisible();

    // delete employee
    await employeePage.clickDeleteBtn();

    await expect(page).toHaveURL("/");
    await expect(page.getByRole("heading", { name: "Team" })).toBeVisible();
  });

  test("Clicks `Back To Team` navigating to homepage", async ({
    page,
    request,
  }) => {
    const employeePage = new EmployeePage(page);

    const testEmployeeId = await employeePage.createTestEmployee(request);

    try {
      await employeePage.goto(testEmployeeId);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

      await employeePage.clickBackToTeamLink();

      await expect(page).toHaveURL("/");
      await expect(page.getByRole("heading", { name: "Team" })).toBeVisible();
    } finally {
      await request.delete(`http://localhost:8081/employees/${testEmployeeId}`);
    }
  });
});
