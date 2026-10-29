# APROAGUA – Financial administration system

Web system for a community water association: customers, water consumption, rates, payments, expenses, invoicing and financial reports.

## Features
- Customer management and consumption readings
- Configurable rates
- Payment registration and invoicing
- Expense (egresos) tracking and financial summary
- Dashboard with charts and reports exportable to **PDF and Excel**
- JWT authentication

## Stack
- **Frontend:** React 18, React Router, Axios, Chart.js, AdminLTE
- **Backend:** Node.js, Express, MySQL (mysql2), JWT, bcryptjs, PDFKit/pdfmake, ExcelJS

## Structure
```
aproagua-backend/    Express API (controllers, middlewares, config)
aproagua-frontend/   React app (pages, components)
```

## Run locally
```bash
# backend
cd aproagua-backend
cp .env.example .env   # then fill in the values
npm install && npm start

# frontend
cd aproagua-frontend && npm install && npm start
```
