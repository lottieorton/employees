import { expect, Page } from "@playwright/test";

export interface EmployeeFormData {
  pronouns?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  preferredName?: string;
  emailAddress?: string;
  phoneNumber: string;
  unitNumber?: string;
  streetAddress: string;
  addressLine2?: string;
  city: string;
  stateProvinceRegion?: string;
  postalCode: string;
  country: string;
  startDate: string;
  workSetup?: string;
  employmentType?: string;
}

export class EmployeeForm {
  constructor(private page: Page) {}

  async waitForFormToLoad() {
    await expect(this.page.getByText("Loading form details")).toBeHidden();
  }

  private getDefaultData(): EmployeeFormData {
    return {
      firstName: "Sarah",
      lastName: "Jenkins",
      phoneNumber: "0412 345 678",
      streetAddress: "42 Wallaby Way",
      city: "Sydney",
      stateProvinceRegion: "NSW",
      postalCode: "2000",
      country: "Australia",
      startDate: "2024-01-15",
    };
  }

  async fillForm(overrides: Partial<EmployeeFormData> = {}) {
    const data = { ...this.getDefaultData(), ...overrides };
    await this.waitForFormToLoad();

    // Personal Info
    if (data.pronouns) {
      await this.page
        .getByLabel(/Pronouns/i)
        .selectOption({ label: data.pronouns });
    } else {
      await this.page.getByLabel(/Pronouns/i).selectOption({ index: 1 });
    }
    await this.page.getByLabel(/First Name/i).fill(data.firstName);
    if (data.middleName)
      await this.page.getByLabel(/Middle Name/i).fill(data.middleName);
    await this.page.getByLabel(/Last Name/i).fill(data.lastName);
    if (data.preferredName)
      await this.page.getByLabel(/Preferred Name/i).fill(data.preferredName);

    // Contact Info
    await this.page.getByLabel(/Phone Number/i).fill(data.phoneNumber);
    if (data.unitNumber)
      await this.page.getByLabel(/Unit Number/i).fill(data.unitNumber);
    await this.page.getByLabel(/Street Address/i).fill(data.streetAddress);
    if (data.addressLine2)
      await this.page.getByLabel(/Address Line 2/i).fill(data.addressLine2);
    await this.page.getByLabel(/City/i).fill(data.city);
    if (data.stateProvinceRegion) {
      await this.page
        .getByLabel(/State\/Province\/Region/i)
        .fill(data.stateProvinceRegion);
    }
    await this.page.getByLabel(/Postal Code/i).fill(data.postalCode);
    await this.page.getByLabel(/Country/i).fill(data.country);

    // Role Info
    await this.page.getByLabel(/Role Name/i).selectOption({ index: 1 });
    await this.page.getByLabel(/Seniority/i).selectOption({ index: 1 });
    await this.page.getByLabel(/Department/i).selectOption({ index: 1 });

    // Work Setup
    if (data.workSetup) {
      await this.page.getByLabel(data.workSetup, { exact: true }).check();
    } else {
      await this.page.locator('input[name="workSetup"]').first().check();
    }

    // Employment Type
    if (data.employmentType) {
      await this.page.getByLabel(data.employmentType, { exact: true }).check();
    } else {
      await this.page.locator('input[name="employmentType"]').first().check();
    }

    // Start Date
    await this.page.getByLabel(/Start Date/i).fill(data.startDate);
  }

  async updateMiddleName(name: string) {
    await this.page.getByLabel(/Middle Name/i).fill(name);
  }

  async clickFormBtn(buttonText: string) {
    await this.page.getByRole("button", { name: buttonText }).click();
  }
}
