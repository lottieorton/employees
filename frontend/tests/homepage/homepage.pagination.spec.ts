import { test, expect } from "@playwright/test";
import { Homepage } from "../pages/Homepage.js";

test("Clicking pagination buttons navigates through employee pages", async ({
  page,
}) => {
  const home = new Homepage(page);
  await home.goto();

  // Initial state check
  await home.expectPreviousToBeDisabled();
  await expect(page.getByText(/Employees \d+-\d+ of \d+/)).toBeVisible();

  // test navigating through employee list pages
  const nextBtn = page.getByRole("button", { name: "Next" });
  if (await nextBtn.isEnabled()) {
    await home.clickNextBtn();

    // verify updates to URL and employee page info
    await expect(page).toHaveURL(/.*page=2/);
    await expect(page.getByText(/Employees 11-\d+ of \d+/)).toBeVisible();
    await home.expectPreviousToBeEnabled();

    // test clicking back to page 1
    await home.clickPrevBtn();
    await expect(page).toHaveURL(/.*page=1/);
  } else {
    test.skip(
      true,
      `Skipping homepage multi-page employee lists test as only a single page of employees found`,
    );
  }
});
