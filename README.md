# Student Expense Tracker

A responsive web application built with React to help students record and manage their daily expenses.

## Features

* Add and manage daily expenses
* Edit and delete expense records
* Categorize expenses
* Search and filter expenses
* Filter expenses by category and month
* Calculate total spending
* View monthly and category-wise spending
* Store expense data using browser LocalStorage
* Responsive and user-friendly interface

## Technologies Used

* React.js
* JavaScript
* HTML
* CSS
* Browser LocalStorage
* Vite

## Project Structure

```text
student-expense-tracker/
├── public/
├── src/
│   ├── App.jsx
│   ├── App.css
│   └── index.css
├── package.json
├── package-lock.json
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/KMALINI/student-expense-tracker.git
```

### 2. Navigate to the project folder

```bash
cd student-expense-tracker
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Open the local URL shown in the terminal to view the application.

## Data Storage

The application uses the browser's **LocalStorage** to maintain expense data. This allows expenses to remain available even after refreshing or reopening the browser on the same device.

## Purpose

This project was developed to practice React concepts such as state management, event handling, array operations, filtering, and browser-based data persistence while building a practical expense management application.
