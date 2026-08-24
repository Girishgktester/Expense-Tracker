# Pocket Ledger: Development Plan

## Application

Pocket Ledger is a responsive personal expense tracker for recording everyday spending and understanding spending patterns without creating an account.

## Problem and Users

People need a quick way to record daily spending without the overhead of a full finance product. The target users are individuals tracking personal expenses on desktop or mobile.

## MVP Features

- Add, edit, and delete expenses
- Validate description, positive amount, date, and category
- Search expenses
- Filter by month and category
- Display visible spending, current-month totals, and category summaries
- Persist data after refresh with browser `localStorage`
- Handle empty and corrupted storage states gracefully
- Responsive, keyboard-friendly interface with success and error messages

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- Browser `localStorage`
- GitHub for source control
- Vercel for static hosting

## Data Model

Each expense contains `id`, `description`, `amount`, `date`, `category`, and `createdAt`. Categories are Food, Transport, Bills, Shopping, Health, Entertainment, and Other. The MVP uses INR for display.

Data remains on the current browser/device. There is no backend, authentication, cross-device sync, or server backup.

## Project Structure

- `index.html` - semantic dashboard, form, filters, and list
- `styles.css` - responsive layout, design tokens, states, and accessibility styling
- `app.js` - state, validation, storage, calculations, filtering, rendering, and events
- `PLAN.md` - this approved development plan
- `README.md` - setup, usage, repository, and deployment documentation
- `.gitignore` - editor, OS, and local tooling exclusions

## Development and Delivery Steps

1. Review this plan before coding.
2. Implement the static dashboard and expense workflow.
3. Verify validation, CRUD actions, filtering, summaries, empty states, persistence, and corrupted-storage recovery locally.
4. Review the browser console and keyboard/mobile layouts.
5. Complete the README and capture a running-app screenshot.
6. Push the complete project to a public GitHub repository.
7. Deploy the repository to Vercel.
8. Update the README with the actual GitHub and live URLs.
9. Verify the production URL after refresh and test the core workflow.
10. Perform a senior-engineer review and fix critical/high issues before submission.

## Verification Checklist

- Application starts through a local static server.
- Invalid blank, negative, and non-numeric inputs are rejected.
- Valid records render with correct dates, categories, and INR amounts.
- Add, edit, delete, confirmation, search, category filtering, and month filtering work.
- Visible totals, current-month total, and top category update correctly.
- Records survive refresh, while malformed saved data resets safely.
- The layout works on mobile and desktop, with no major console errors.
- The deployed URL works publicly and supports direct refresh.
- Repository contains source code, `README.md`, `PLAN.md`, and `.gitignore` without secrets.
