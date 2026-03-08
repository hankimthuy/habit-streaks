# Testing Next-Intl Components

When building new features for `habit-streaks` that rely on multi-language support (English `en` and Vietnamese `vi`), follow these testing practices to ensure robust continuous integration.

## 1. Unit Testing (Jest/React Testing Library)

Since components utilize `useTranslations` from `next-intl`, they must abstract the hook context for the tests to compile and run properly. 

### Provider Wrapping
Wrap any localized components inside the `<NextIntlClientProvider>` within your tests.

```tsx
import { render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import messages from "../../messages/en.json";
import MyComponent from "./MyComponent";

describe("MyComponent Profile", () => {
  it("renders correctly in English", () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <MyComponent />
      </NextIntlClientProvider>
    );
    // assertions...
  });
});
```

### Mocking next-intl
Alternatively, if you strictly want to unit test the component behavior without worrying about JSON context loading, you can mock the module globally in `jest.setup.ts`.

```ts
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));
```

## 2. End-to-End (E2E) Testing (Playwright / Cypress)

Our approach utilizes a `NEXT_LOCALE` cookie. To test different languages in E2E frameworks, you must manually inject the cookie into the browser context before navigating.

### Playwright Example

```ts
import { test, expect } from '@playwright/test';

test('Dashboard appears in Vietnamese', async ({ page, context }) => {
  // Set the cookie before accessing the site
  await context.addCookies([
    {
      name: 'NEXT_LOCALE',
      value: 'vi',
      domain: 'localhost',
      path: '/',
    }
  ]);

  await page.goto('/');
  await expect(page.locator('h1')).toContainText('FlowStreaks');
  // Add specific Vietnamese assertions
});
```

## Review
Always verify that any new key added to `en.json` is mirrored inside `vi.json`. E2E tests will fail at runtime if a translation string is entirely missing from the loaded dictionary and unhandled by the UI structure.
