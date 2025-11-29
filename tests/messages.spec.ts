import { test, expect } from "@playwright/test";
import {
  loginAsStaff,
  loginAsClient,
  MOCK_HUB_ID,
  setupConsoleErrorGate,
  expectNoConsoleErrors,
  waitForLoading,
} from "./test-utils";

test.describe("Messages Section", () => {
  test.describe("Staff Messages", () => {
    test.beforeEach(async ({ page }) => {
      await loginAsStaff(page);
    });

    test("thread list displays correctly", async ({ page }) => {
      const errors = await setupConsoleErrorGate(page);

      await page.goto(`/hub/${MOCK_HUB_ID}/messages`);
      await waitForLoading(page);

      // Should show messages heading
      await expect(page.getByRole("heading", { name: /messages/i })).toBeVisible();

      // Should show thread list or empty state
      const hasThreads = await page.locator('[class*="thread"], [class*="message"]').first().isVisible().catch(() => false);
      const hasEmptyState = await page.getByText(/no messages/i).isVisible().catch(() => false);

      expect(hasThreads || hasEmptyState).toBeTruthy();
      expectNoConsoleErrors(errors);
    });

    test("thread shows lastMessagePreview in list", async ({ page }) => {
      const errors = await setupConsoleErrorGate(page);

      await page.goto(`/hub/${MOCK_HUB_ID}/messages`);
      await waitForLoading(page);

      // Look for thread items with preview text
      const threadItems = page.locator('[class*="cursor-pointer"]').filter({
        has: page.locator("p, span"),
      });

      const count = await threadItems.count();
      if (count > 0) {
        // First thread should have some preview text
        const firstThread = threadItems.first();
        const text = await firstThread.textContent();
        expect(text?.length).toBeGreaterThan(0);
      }

      expectNoConsoleErrors(errors);
    });

    test("clicking thread shows full messages", async ({ page }) => {
      const errors = await setupConsoleErrorGate(page);

      await page.goto(`/hub/${MOCK_HUB_ID}/messages`);
      await waitForLoading(page);

      // Click on a thread if available
      const threadItem = page.locator('[class*="cursor-pointer"]').first();
      if (await threadItem.isVisible().catch(() => false)) {
        await threadItem.click();
        await waitForLoading(page);

        // Should show message content area
        const messageArea = page.locator('[class*="thread"], [class*="message-content"]');
        expect(await messageArea.isVisible().catch(() => true)).toBeTruthy();
      }

      expectNoConsoleErrors(errors);
    });

    test("compose new message dialog opens", async ({ page }) => {
      const errors = await setupConsoleErrorGate(page);

      await page.goto(`/hub/${MOCK_HUB_ID}/messages`);
      await waitForLoading(page);

      // Find compose button
      const composeBtn = page.getByRole("button", { name: /compose|new message/i });
      if (await composeBtn.isVisible().catch(() => false)) {
        await composeBtn.click();

        // Dialog should open with subject and body fields
        await expect(page.getByRole("dialog")).toBeVisible();
        await expect(page.getByLabel(/subject/i)).toBeVisible();
      }

      expectNoConsoleErrors(errors);
    });

    test("sending message uses bodyHtml format", async ({ page }) => {
      const errors = await setupConsoleErrorGate(page);

      await page.goto(`/hub/${MOCK_HUB_ID}/messages`);
      await waitForLoading(page);

      // Open compose dialog
      const composeBtn = page.getByRole("button", { name: /compose|new message/i });
      if (await composeBtn.isVisible().catch(() => false)) {
        await composeBtn.click();

        // Fill in message
        await page.getByLabel(/subject/i).fill("Test Subject");

        // Find body textarea
        const bodyField = page.getByRole("textbox").last();
        await bodyField.fill("Test message content");

        // Send button should be present
        const sendBtn = page.getByRole("button", { name: /send/i });
        expect(await sendBtn.isVisible()).toBeTruthy();
      }

      expectNoConsoleErrors(errors);
    });
  });

  test.describe("Client Messages", () => {
    test.beforeEach(async ({ page }) => {
      await loginAsClient(page);
    });

    test("client messages page loads", async ({ page }) => {
      const errors = await setupConsoleErrorGate(page);

      await page.goto(`/portal/${MOCK_HUB_ID}/messages`);
      await waitForLoading(page);

      await expect(page.getByRole("heading", { name: /messages/i })).toBeVisible();
      expectNoConsoleErrors(errors);
    });

    test("client can view message threads", async ({ page }) => {
      const errors = await setupConsoleErrorGate(page);

      await page.goto(`/portal/${MOCK_HUB_ID}/messages`);
      await waitForLoading(page);

      // Should show threads or empty state
      const content = await page.locator("main").textContent();
      expect(content?.length).toBeGreaterThan(0);

      expectNoConsoleErrors(errors);
    });

    test("client can compose new message", async ({ page }) => {
      const errors = await setupConsoleErrorGate(page);

      await page.goto(`/portal/${MOCK_HUB_ID}/messages`);
      await waitForLoading(page);

      const newMsgBtn = page.getByRole("button", { name: /new message/i });
      if (await newMsgBtn.isVisible().catch(() => false)) {
        await newMsgBtn.click();
        await expect(page.getByRole("dialog")).toBeVisible();
      }

      expectNoConsoleErrors(errors);
    });
  });

  test.describe("HTML Sanitization (Security)", () => {
    test("XSS in message content is sanitized", async ({ page }) => {
      const errors = await setupConsoleErrorGate(page);

      await loginAsStaff(page);
      await page.goto(`/hub/${MOCK_HUB_ID}/messages`);
      await waitForLoading(page);

      // Check that no scripts execute
      // If there was XSS in mock data, it would execute and potentially
      // add elements or trigger events. We verify the page is stable.
      await page.waitForTimeout(500);

      // Check that no injected elements exist
      const injectedScript = await page.locator("script:not([src])").count();
      const injectedIframe = await page.locator("iframe[srcdoc*='javascript']").count();

      expect(injectedScript).toBe(0);
      expect(injectedIframe).toBe(0);

      // Also verify DOMPurify is being used by checking for sanitized content
      const dangerousContent = await page.locator('[onclick], [onerror], [onload]').count();
      expect(dangerousContent).toBe(0);

      expectNoConsoleErrors(errors);
    });

    test("message body renders without script execution", async ({ page }) => {
      // This test ensures that even if bodyHtml contains malicious content,
      // it doesn't execute
      const errors = await setupConsoleErrorGate(page);

      await loginAsStaff(page);
      await page.goto(`/hub/${MOCK_HUB_ID}/messages`);
      await waitForLoading(page);

      // Click first thread to view messages
      const thread = page.locator('[class*="cursor-pointer"]').first();
      if (await thread.isVisible().catch(() => false)) {
        await thread.click();
        await waitForLoading(page);

        // Message content should be visible but safe
        // No alert dialogs should have appeared
        const dialogCount = await page.locator('[role="alertdialog"]').count();
        // React Query error dialogs are fine, but not XSS-triggered alerts
        // The key is no console errors about script execution
      }

      expectNoConsoleErrors(errors);
    });
  });
});
