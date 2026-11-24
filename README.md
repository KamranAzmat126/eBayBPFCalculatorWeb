# eBay BPF & Selling Fee Calculator

A web-based calculator that helps eBay sellers estimate selling fees, Buyer Protection Fees (BPF) and product profitability before listing.

🌐 **[Live Website](https://ebayfeecalculator.net)**

## Features

- **Private Seller:** BPF, listing price, advertising fees, profit and margin calculations.
- **Business Seller:** Selling fees, VAT, advertising costs, profit, margin and ROI.
- Dynamic eBay category and subcategory selection.
- Instant calculation results with a detailed fee breakdown.
- Responsive user interface.

## Tech Stack

- HTML5, CSS3 and JavaScript
- JavaScript ES Modules
- REST API and JSON
- Cloudflare Workers
- Git and GitHub

## Architecture

The application uses a serverless architecture that separates the frontend from the calculation engine.

```text
Public Frontend
      |
      v
Cloudflare Worker API
      |
      v
Private Calculation Engine
      |
      v
JSON Results
```

The frontend is hosted separately from the backend. Core calculation logic and fee-rate data are maintained in a private GitHub repository.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/categories` | Load categories |
| POST | `/api/private` | Private seller calculations |
| POST | `/api/business` | Business seller calculations |
| GET | `/health` | API health check |

## Run Locally

```bash
git clone https://github.com/KamranAzmat126/eBayBPFCalculatorWeb.git
cd eBayBPFCalculatorWeb
py -m http.server 8000
```

Open `http://localhost:8000` in your browser.

An internet connection is required to use the deployed calculation API.

## Project Links

- **Live Application:** https://ebayfeecalculator.net
- **Frontend Repository:** https://github.com/KamranAzmat126/eBayBPFCalculatorWeb
- **Backend:** Private repository

## Disclaimer

An independent tool, not affiliated with or endorsed by eBay. Calculations are estimates; actual fees may vary according to applicable eBay policies and seller circumstances.

*Developed as an independent full-stack and serverless application project.*
