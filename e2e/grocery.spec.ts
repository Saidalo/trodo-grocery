import { expect, test } from "@playwright/test";

test("add, complete, filter and remove items", async ({ page }) => {
    const suffix = Date.now();
    const milk = `Milk ${suffix}`;
    const yogurt = `Yogurt ${suffix}`;

    await page.goto("/");

    // Regular item
    await page.getByLabel("Name").fill(milk);
    await page.getByLabel("Price (€)").fill("1.50");
    await page.getByRole("button", { name: "Add item" }).click();
    await expect(page.getByText(milk)).toBeVisible();

    // Perishable item: expiration date is required
    await page.getByLabel("Name").fill(yogurt);
    await page.getByLabel("Price (€)").fill("2");
    await page.getByLabel("Type").selectOption("PERISHABLE");
    await page.getByRole("button", { name: "Add item" }).click();
    await expect(page.getByText("Expiration date is required")).toBeVisible();
    await page.getByLabel("Expiration date").fill("2030-01-01");
    await page.getByRole("button", { name: "Add item" }).click();
    await expect(page.getByText(yogurt)).toBeVisible();

    // Mark done and hide completed
    await page.getByLabel(`Mark ${milk} as done`).check();
    await page.getByLabel("Hide completed").check();
    await expect(page.getByText(milk)).toBeHidden();
    await page.getByLabel("Hide completed").uncheck();

    // Data survives a reload
    await page.reload();
    await expect(page.getByLabel(`Mark ${milk} as done`)).toBeChecked();

    // Remove both
    await page.getByLabel(`Remove ${milk}`).click();
    await page.getByLabel(`Remove ${yogurt}`).click();
    await expect(page.getByText(milk)).toBeHidden();
    await expect(page.getByText(yogurt)).toBeHidden();
});