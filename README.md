# PDF Report Generation System

## Overview
This project is a **config-driven PDF Report Generation System** that generates PDF reports from pre-existing assessment data. The system is designed to handle **different types of assessments** without any code modification — all new assessments, fields, or layouts can be added via configuration.

**Backend:** Node.js, Express, Puppeteer  
**Frontend:** React, TailwindCSS, shadcn/ui  

---

## Features
- Generate PDF reports based on `session_id`.
- Support multiple assessment types with different layouts.
- Fully **config-driven** (no code changes needed for new assessments).
- Serve PDFs via HTTP for frontend download.
- Frontend page to generate and download PDFs.

---

## Tech Stack
- **Backend:** Node.js, Express, Puppeteer, Handlebars
- **Frontend:** React, TailwindCSS, shadcn/ui
- **Others:** lodash, jsonpath

---

## Backend Setup

1. Install dependencies
```bash
cd backend
npm install
```

2. Run the server 
```bash
node src/index.js
```

3. API Endpoint
```
GET /generate-report?session_id=<SESSION_ID>
```
- Generates PDF for the given session_id
- Saves PDF in reports/

4. Serve PDF locally
```
app.use("/reports", express.static(path.join(__dirname, "reports")));
```


## Frontend Setup
1. Install Dependencies
```
cd frontend
npm install
```

2. Run the frontend
```
npm run dev
```

3.Usage
- Enter a session_id in the input box.
- Click Generate PDF.
- A Download PDF button appears for the generated report.

## How to add new config 
[Notion Doc](https://reflective-justice-22d.notion.site/PDF-Report-System-Adding-New-Assessment-Config-27a9e804dffe8053be81f2bd0a762ac2)




