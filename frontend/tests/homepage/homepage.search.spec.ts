import { test, expect } from "@playwright/test";
import { Homepage } from "../pages/Homepage.js";

test("Searching dynamically updates the URL and filters results", async ({
  page,
}) => {
  const home = new Homepage(page);
  await home.goto();

  await expect(page.getByRole("article").first()).toBeVisible();
  const targetFirstName = await home.getFirstEmployeeFirstName();

  if (!targetFirstName) {
    test.skip(true, "Skipping search test: No employees found.");
  }

  // search
  await home.selectSearchBy("firstName");
  await home.fillSearchInput(targetFirstName);

  // verify URL
  const encodedName = encodeURIComponent(targetFirstName);
  await expect(page).toHaveURL(
    new RegExp(`.*search=${encodedName}&searchBy=firstName`),
  );

  await expect(page.getByRole("article").first()).toBeVisible();
  const filteredFirstName = await home.getFirstEmployeeFirstName();
  expect(filteredFirstName).toBe(targetFirstName);
});
