import { expect, Page } from "@playwright/test";
import { EmployeeForm } from "./EmployeeForm.js";

export class CreatePage {
  readonly form: EmployeeForm;

  constructor(private page: Page) {
    this.form = new EmployeeForm(page);
  }

  async goto() {
    await this.page.goto("/create");
  }

  async clickCreateEmployeeBtn() {
    await this.form.clickFormBtn("Create Employee");
  }

  async clickCancelBtn() {
    await this.form.clickFormBtn("Cancel");
  }

  async clickBackToTeamLink() {
    await this.page.getByRole("link", { name: "← Back To Team" }).click();
  }

  async submitAndGetCreatedId(): Promise<string | null> {
    const responsePromise = this.page.waitForResponse(
      (res) =>
        res.url().includes("/employees") &&
        res.request().method() === "POST" &&
        res.status() === 201,
    );

    await this.clickCreateEmployeeBtn();

    const response = await responsePromise;
    const responseBody = await response.json();
    return responseBody?.id ?? null;
  }
}
