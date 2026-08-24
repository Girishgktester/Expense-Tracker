# Pocket Ledger

Pocket Ledger is a responsive personal expense tracker for recording everyday spending and seeing useful totals at a glance. It is intentionally small: no account, backend, or setup beyond a static web server is required.

## Features

- Add, edit, and delete expenses
- Validate required fields and positive amounts
- Search and filter by category or month
- See visible spending, current-month spending, and the top category
- Persist records in browser `localStorage`
- Responsive layout with keyboard-friendly controls
- Safe recovery from invalid local data

## Technology

HTML5, CSS3, and vanilla JavaScript. The application is deployed as a static site and stores data locally in the browser.

## Run Locally

From the project directory, start any static server. For example, with Python installed:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in a browser. Opening `index.html` directly also works in modern browsers, but a local server is recommended for a production-like check.

## Data and Privacy

Expenses are stored only in the current browser/device under local storage. Clearing browser site data removes them. No expense data is sent to a server.

## Links

- GitHub repository: To be added after the repository is created.
- Live application: To be added after Vercel deployment.

## Verification

The local verification checklist is maintained in [PLAN.md](PLAN.md). Before submission, test the core workflow locally and again at the deployed public URL.
