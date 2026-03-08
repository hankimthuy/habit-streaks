---
name: Multi-language Implementation
description: Guidelines and rules for implementing and maintaining multi-language support (English and Vietnamese) in the application.
---

# Multi-Language Implementation Skill

This skill guides the AI on how to apply and maintain multi-language (i18n) support in the Next.js application, specifically for English (`en`) and Vietnamese (`vi`).

## 1. Rules and Conventions

- **Default Language**: English (`en`).
- **Supported Languages**: English (`en`), Vietnamese (`vi`).
- **Translation Keys**: Use camelCase for translation keys (e.g., `welcomeMessage`, `submitButton`).
- **Structure**: Group translations logically by feature or page (e.g., `common`, `auth`, `dashboard`, `settings`).
- **No Hardcoded Strings**: All user-facing text must be externalized into translation files.
- **Type Safety**: If using a library that supports type-safe translations (like `next-intl` or `react-i18next` with TS), always ensure types are updated when new keys are added.

## 2. File Creation Flow (For New Pages/Components)

When the user asks to create a new page or component:
1. **Identify User-Facing Text**: Extract all visible text strings.
2. **Update Translation Files**: Add the new keys to both `en` and `vi` translation JSON/TS files.
   - Example: If creating a `Profile` page, ensure `en/profile.json` and `vi/profile.json` are created or updated.
3. **Integrate i18n Hooks**: Use the appropriate translation hook (e.g., `useTranslations` from `next-intl` or `useTranslation` from `react-i18next`) in the component.

## 3. Testing Requirements

For any new page or component with multi-language support, the AI MUST ensure both unit and e2e test foundations are laid out:

### Unit Tests
- Create a `.test.tsx` file for the new component.
- Mock the translation hook/provider so the component can render in tests.
- Verify that the correct translation keys are passed and rendered.

### E2E Tests (Playwright/Cypress)
- Ensure E2E tests are capable of switching locales (e.g., testing `/en/profile` and `/vi/profile`).
- If E2E is not fully setup, create a placeholder/todo outline in a relevant `tests/e2e` directory explaining how to test the language switch.

## 4. Implementation Checklist for AI

Whenever adding a new feature with i18n:
- [ ] Added keys to English translation file.
- [ ] Added keys to Vietnamese translation file.
- [ ] Replaced hardcoded text in UI with translation function calls.
- [ ] Handled pluralization or interpolation correctly if needed.
- [ ] Created or updated unit tests to accommodate i18n mock.
