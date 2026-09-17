import { expect, Page } from "@playwright/test";

export class Homepage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/");
  }

  async clickNextBtn() {
    await this.page
      .getByRole("button", { name: "Next" })
      .click({ force: true });
  }

  async clickPrevBtn() {
    await this.page
      .getByRole("button", { name: "Previous" })
      .click({ force: true });
  }

  async clickAddEmployeeBtn() {
    await this.page.getByRole("button", { name: "+ Add Employee" }).click();
  }

  async clickFirstViewEmployeeBtn() {
    const viewLink = this.page
      .getByRole("article")
      .first()
      .getByRole("link", { name: "View" });

    const href = await viewLink.getAttribute("href");
    await viewLink.click();
    return href;
  }

  async expectPreviousToBeEnabled() {
    await expect(
      this.page.getByRole("button", { name: "Previous" }),
    ).toBeEnabled();
  }

  async expectPreviousToBeDisabled() {
    await expect(
      this.page.getByRole("button", { name: "Previous" }),
    ).toBeDisabled();
  }

  async getFirstEmployeeFirstName(): Promise<string> {
    const firstCard = this.page.getByRole("article").first();
    const fullName = await firstCard.getByRole("heading").textContent();
    if (!fullName) return "";
    return fullName.trim().split(" ")[0] || "";
  }

  async fillSearchInput(term: string) {
    await this.page.getByPlaceholder("Search by name, role, etc").fill(term);
  }

  async selectSearchBy(value: string) {
    await this.page.getByRole("combobox").selectOption(value);
  }
}
