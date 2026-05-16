import { expect, test } from "@playwright/test";

test("home should render", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Pulsefolio" })).toBeVisible();
});
