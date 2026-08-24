# Pocket Ledger

Pocket Ledger is a simple, responsive expense tracker for recording everyday spending and understanding where money goes. It is a static web application with no account or backend required.

## Project Description

The application lets a user record an expense with a description, amount in INR, date, and category. The dashboard then calculates spending totals, identifies the highest-spending category, and provides search and filtering tools for reviewing the expense history.

All records are stored in the browser using `localStorage`. This keeps the project small, private, and easy to deploy, while meaning that data is specific to the current browser and device.

## Features

- Add expenses with required-field and positive-amount validation
- Edit existing expenses
- Delete expenses with confirmation
- Search by description or category
- Filter by category or month
- View visible spending and current-month totals in INR
- See the top spending category
- Persist records after a page refresh
- Recover safely if stored browser data is invalid
- Use the interface on mobile and desktop
- Navigate forms and actions with a keyboard

## How It Was Built

The project follows a simple client-side architecture:

1. `index.html` defines the semantic dashboard, form fields, filters, summary cards, and expense list.
2. `styles.css` defines the responsive layout, visual design tokens, form states, focus styles, and mobile breakpoints.
3. `app.js` owns application state, validation, local storage, filtering, calculations, rendering, and event handling.
4. The browser loads the static files directly. There is no API server, database, authentication flow, or build step.
5. Vercel serves the project as a static website from the GitHub repository.

## Technology Stack

- React for component-based UI and state updates
- Vite for development server and production bundling
- HTML5 for accessible page structure
- CSS3 for responsive styling and layout
- Modern JavaScript (ES modules) for application behavior
- Browser `localStorage` for persistence
- Git and GitHub for version control and source hosting
- Vercel for public static deployment

## Project Structure

```text
Expense Tracker/
├── index.html    # Vite HTML entry point
├── src/main.jsx  # React dashboard, state, validation, storage, and rendering
├── src/styles.css # Responsive design and component styles
├── package.json  # npm scripts and React/Vite dependencies
├── vite.config.js # Vite React plugin configuration
├── PLAN.md       # Development plan and verification checklist
├── README.md     # Project documentation
├── vercel.json   # Vercel deployment configuration
└── .gitignore    # Ignored local and generated files
```

## Run Locally

### Prerequisites

- Python 3, or another local static web server
- A modern web browser

### Install and start the application

Open PowerShell in the project directory and run:

```powershell
npm install
npm run dev
```

Open the local URL shown by Vite, normally `http://localhost:5173`.

To create a production build:

```powershell
npm run build
```

The project can also be served by a simple static server after building. The older Python command is still useful for the original static files, but the Vite command is the recommended development workflow.

```powershell
python -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) in your browser. Stop the server with `Ctrl+C`.

The project can also be opened directly through `index.html`, but a local server is recommended for testing the same static-file behavior used in deployment.

## How to Use

1. Open the application.
2. In **Add an expense**, enter a description such as `Grocery shopping`.
3. Enter a positive amount in INR, for example `1250.50`.
4. Select the date and an expense category.
5. Select **Save expense**.
6. Review the new record in **Expense history** and the updated summary cards.
7. Use the edit icon to update a record or the delete icon to remove it after confirmation.
8. Use search, category, and month filters to narrow the visible records.

## iPhone Back Tap Quick Add

The app supports a shortcut that asks for a category and amount, then adds the expense automatically.

1. Open the **Shortcuts** app and tap **+**.
2. Add **Choose from Menu** with the options `Food`, `Transport`, `Bills`, `Shopping`, `Health`, `Entertainment`, and `Other`. Store the selected value as `category`.
3. Add **Ask for Input**, choose **Number**, and prompt for `Amount`. Store the result as `amount`.
4. Add a **Text** action containing this URL, replacing the bracketed values with the Shortcut variables:

```text
https://pocket-ledger-kq7bjkjhi-girishgktesters-projects.vercel.app/?quickAdd=1&category=[category]&amount=[amount]
```

5. Add **Open URLs** and pass it the Text action result.
6. Name the shortcut **Quick Expense**.
7. Go to **Settings > Accessibility > Touch > Back Tap > Double Tap** and select **Quick Expense**.

Double-tapping the back of the iPhone will now ask for the category and amount, open Pocket Ledger, and add a `Quick expense` dated today. The URL is cleared after processing so refreshing the page does not add a duplicate.

## Data and Privacy

Expenses are saved locally in the current browser under the storage key `pocket-ledger-expenses-v1`. No expense data is sent to a server. Clearing browser site data removes the saved records, and records do not automatically sync between devices or browsers.

Each expense contains:

```text
id, description, amount, date, category, createdAt
```

## End-to-End Workflow

### Local verification

1. Start the local server and confirm the dashboard loads.
2. Submit the form empty and confirm validation messages appear.
3. Try a zero, negative, or non-numeric amount and confirm it is rejected.
4. Add several valid expenses in different categories and dates.
5. Confirm the records, INR amounts, visible total, monthly total, and top category are correct.
6. Search for a description and category, then test category and month filters.
7. Edit one record and delete another, confirming the delete prompt works.
8. Refresh the browser and confirm the records remain.
9. Resize the browser to mobile width and check that controls and records remain usable.
10. Check the browser console for major errors.

### GitHub and Vercel deployment

The source repository is available at [github.com/Girishgktester/Expense-Tracker](https://github.com/Girishgktester/Expense-Tracker).

To deploy with an existing Vercel account:

1. Sign in to [Vercel](https://vercel.com/).
2. Select **Add New Project**.
3. Import the `Girishgktester/Expense-Tracker` GitHub repository.
4. Keep the project as a static site. No framework preset, build command, or environment variables are required.
5. Select **Deploy**.
6. Open the generated public URL and repeat the core local verification workflow.
7. Test a direct page refresh and confirm the deployed application loads successfully.

## Links

- GitHub repository: [Girishgktester/Expense-Tracker](https://github.com/Girishgktester/Expense-Tracker)
- Live application: To be added after Vercel deployment
- Development plan: [PLAN.md](PLAN.md)

## Assignment Deliverables

- Application name: Pocket Ledger
- Short description: A responsive INR expense tracker with local browser persistence.
- Source code: GitHub repository linked above
- Deployment: Vercel public URL to be added after deployment
- Plan: [PLAN.md](PLAN.md)
- Screenshot: Capture the running dashboard after local or production verification
