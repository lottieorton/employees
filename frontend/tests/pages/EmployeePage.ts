import { APIRequestContext, expect, Page } from "@playwright/test";
import { EmployeeForm } from "./EmployeeForm.js";

const defaultEmployee = {
  firstName: "Sam",
  lastName: "Rivera",
  middleName: "Jordan",
  phoneNumber: "+61498765432",
  preferredName: "Al",
  workSetup: "HYBRID",
  pronouns: "HE_HIM",
  employmentType: "Full-Time Permanent",
  startDate: "2026-05-10",
  isCurrentlyEmployed: true,
};

const defaultAddress = {
  streetAddress: "45 Ocean Drive",
  city: "Sydney",
  stateProvinceRegion: "NSW",
  postalCode: "2000",
  country: "Australia",
};

export class EmployeePage {
  readonly form: EmployeeForm;

  constructor(private page: Page) {
    this.form = new EmployeeForm(page);
  }

  async goto(id: string) {
    await this.page.goto(`/${id}`);
  }

  async clickEditBtn() {
    await this.page.getByRole("button", { name: "Edit" }).click();
  }

  async clickSaveChangesBtn() {
    await this.form.clickFormBtn("Save Changes");
  }

  async clickDeleteBtn() {
    await this.form.clickFormBtn("Delete Employee");
  }

  async clickBackToTeamLink() {
    await this.page.getByRole("link", { name: "← Back To Team" }).click();
  }

  async createTestEmployee(
    request: APIRequestContext,
    overrides = {},
  ): Promise<string> {
    // Grab a role id from database
    const roleResponse = await request.get("http://localhost:8080/roles");
    if (!roleResponse.ok()) {
      throw new Error(
        `Failed to fetch roles: ${roleResponse.status()} ${await roleResponse.text()}`,
      );
    }
    const roleResult = await roleResponse.json();

    // Create Address and grab id
    const addressResponse = await request.post(
      "http://localhost:8080/addresses",
      {
        data: defaultAddress,
      },
    );
    if (!addressResponse.ok()) {
      throw new Error(
        `Failed to create address: ${addressResponse.status()} ${await addressResponse.text()}`,
      );
    }
    const addressResult = await addressResponse.json();

    // Create Employee
    const employeeResponse = await request.post(
      "http://localhost:8080/employees",
      {
        data: {
          ...defaultEmployee,
          ...overrides,
          roleId: roleResult[0].id,
          addressId: addressResult.id,
        },
      },
    );
    if (!employeeResponse.ok()) {
      throw new Error(
        `Failed to seed test employee: ${employeeResponse.status()} ${await employeeResponse.text()}`,
      );
    }

    const result = await employeeResponse.json();

    if (!result.id) {
      throw new Error(`No employee id returned`);
    }

    return result.id;
  }
}
