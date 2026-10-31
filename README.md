# Uride Boston — Coming Soon & Driver Pre-Registration

Official web portal and driver pre-registration landing page for **Uride**, an upcoming driver-centric rideshare platform preparing for a limited pilot launch in **Greater Boston, Massachusetts, USA**.

---

## 📌 Project Overview

* **Product:** Uride
* **Operating Entity:** Happy Driver Rideshare Inc. (Allston, MA)
* **Target Audience:** Greater Boston rideshare drivers (Uber, Lyft, Taxi, Livery, and prospective drivers).
* **Core Value Proposition:** An app built for the driver — honest fares and 100% of ride earnings transferred directly to the driver after each completed ride.

---

## 🚀 Key Features

1. **Driver Pre-Registration Form:**
   * Collects driver name, mobile number, email, Boston neighborhood, vehicle make/model/year, driving background, and availability.
   * Real-time client-side validation and responsive mobile layout.

2. **Scannable QR Code & Social Sharing Hub:**
   * Automatically generates a scannable QR code on the page for instant phone camera scanning.
   * "Download QR Code" (PNG) and "Copy Page Link" buttons for promotional flyers.
   * One-click social sharing links for **WhatsApp**, **Facebook**, **X (Twitter)**, and **Instagram** (with native mobile Web Share API fallback).

3. **Footer Policies & FAQ Accordion:**
   * Clean, accessible accordions explaining:
     * How the 100% earning transfer model works.
     * Itemized deductions (standard bank transaction charges and commercial insurance).
     * Boston pilot launch geographic scope.
     * Non-exclusive driver policy (freedom to drive on other platforms).
     * Massachusetts vehicle and license requirements.

4. **Multi-Channel Data Capture & Export:**
   * **Real-time Email Alerts:** Submissions are automatically dispatched to `brandaovicente4@gmail.com`.
   * **Google Sheets Auto-Sync:** Supported via Google Apps Script (`google_sheet_integration.js`).
   * **Built-In Admin Roster:** Accessible via the "Driver Roster & Export" link in the footer.
   * **1-Click CSV Export:** Downloads all captured applicant records directly into an Excel-compatible spreadsheet.

---

## 📂 File Structure

```text
UrideBostonWeb/
├── index.html                  # Main semantic HTML5 landing page
├── style.css                   # Custom modern design system (Electric Blue, Navy, Orange)
├── app.js                      # Form logic, QR code renderer, email dispatch & CSV export
├── google_sheet_integration.js # Google Apps Script template for live Google Sheet logging
├── Dockerfile                  # Container definition for Google Cloud Run deployment
├── nginx.conf                  # Nginx configuration listening on Cloud Run port 8080
├── assets/
│   ├── logo-transparent.png    # Official Uride logo mark (caption removed, transparent)
│   ├── logo-icon.png           # Square app icon
│   ├── logo.png                # Original trimmed logo
│   └── qrcode.min.js           # Lightweight offline QR code generator (zero CDN dependencies)
├── .gitignore                  # Excludes private tax/business documents and logs
└── README.md                   # Project documentation & deployment guide
```

---

## ☁️ Google Cloud Run Deployment Guide

This project is configured for automated CI/CD deployment on **Google Cloud Run** connected to this GitHub repository.

### 1. Prerequisites
* **GCP Project ID:** `uridebostonweb`
* **GitHub Repository:** `sausin5317/UrideBostonWeb` (Branch: `main`)

### 2. Deployment Steps in Google Cloud Console
1. Open the [Google Cloud Run Console](https://console.cloud.google.com/run?project=uridebostonweb).
2. Click **"Deploy container"** (or **"Create Service"**).
3. Select **"Continuously deploy from a repository"** and click **"Set up with Cloud Build"**:
   * **Repository Provider:** GitHub
   * **Repository:** `sausin5317/UrideBostonWeb`
   * **Branch:** `^main$`
   * **Build Type:** `Dockerfile` (Source path: `/Dockerfile`)
4. Configure the **Recommended Production Settings**:

| Setting | Recommended Value | Reason |
| :--- | :--- | :--- |
| **Service Name** | `uride-boston-web` | Service identifier |
| **Region** | `us-east4` (N. Virginia) or `us-east1` (S. Carolina) | Closest GCP data centers to Boston |
| **Min Instances** | `0` | Scales to 0 when idle ($0 cost) |
| **Max Instances** | `3` to `5` | Handles traffic spikes without runaway spend |
| **Memory** | `256 MiB` | Ultra-lightweight for static Nginx |
| **CPU** | `1` (or `0.5`) | CPU allocated only during request processing |
| **Ingress** | `All` | Publicly reachable from internet |
| **Authentication** | `Allow unauthenticated invocations` | Required for public landing page |

5. Click **"Create"**. Cloud Build will build the container image and deploy the live URL (e.g., `https://uride-boston-web-xxxx.a.run.app`).

### 3. Custom Domain Setup (e.g., `urideadu.com`)
1. In Cloud Run, navigate to **Manage Custom Domains** -> **Add Mapping**.
2. Select the service `uride-boston-web`.
3. Enter your verified domain name (e.g., `urideadu.com` or `www.urideadu.com`).
4. Update your DNS registrar with the provided `CNAME` or `A`/`AAAA` records.
5. Google Cloud will automatically provision and renew a free SSL/TLS certificate.

---

## 📊 Driver Data Access & Administration

### Option A: Email Delivery
Every submission is sent directly to **`brandaovicente4@gmail.com`**.
> *Note on First Run:* The very first submission sends an activation email from `formsubmit.co` to confirm the destination address. Once clicked, all future submissions arrive automatically.

### Option B: Built-in Admin Portal & CSV Export
1. Scroll to the bottom of the landing page.
2. Click **"Driver Roster & Export"** in the footer.
3. View all registered applicants in a table.
4. Click **"Export to Excel (CSV)"** to download the roster spreadsheet.

### Option C: Google Sheets Integration
To automatically append every new submission into a live Google Sheet:
1. Open Google Sheets logged into `brandaovicente4@gmail.com`.
2. Go to **Extensions → Apps Script**.
3. Paste the code from [`google_sheet_integration.js`](./google_sheet_integration.js).
4. Click **Deploy → New deployment → Web app** (Access: Anyone).
5. Copy the generated Web App URL and paste it into the **"Driver Roster & Export"** modal on the website.

---

## 💻 Local Development

To run or test locally:
1. Clone the repository:
   ```bash
   git clone https://github.com/sausin5317/UrideBostonWeb.git
   cd UrideBostonWeb
   ```
2. Open `index.html` directly in any web browser, or serve using any static server:
   ```bash
   # Using Python
   python -m http.server 8080

   # Or using Node.js / npx
   npx serve .
   ```
3. Open `http://localhost:8080` in your browser.

---

## ⚖️ License & Copyright
&copy; 2026–2027 Uride / Happy Driver Rideshare Inc. All rights reserved. Registered in the Commonwealth of Massachusetts.
