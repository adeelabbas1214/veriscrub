# VeriScrub

> **Zero-Trust Visual PII Sanitization & Document Redaction at the Edge**

VeriScrub is an automated, privacy-first web application designed to sanitize identification documents (driver's licenses, passports, employee badges, and identity cards) before they enter downstream enterprise storage, internal review queues, or manual compliance pipelines. 

By offloading computer vision processing to edge transformation pipelines and enforcing asymmetric cryptographic handshakes, VeriScrub ensures raw, unredacted biometric imagery never persists in unencrypted application memory or local disks.

---

## 🎯 What to Upload

VeriScrub is engineered specifically for identification and credential document intake.

### Supported Document Types
- **Government IDs & Driver's Licenses:** State IDs, provincial cards, and driver's licenses with portrait photos.
- **Passport Identity Pages:** Machine-readable zones (MRZ) and text are preserved while the portrait is sanitized.
- **Staff & Corporate Badges:** Access control passes, contractor badges, and visitor credentials.
- **Academic & Institutional IDs:** Campus cards, library cards, and membership credentials.

### File Specifications & Best Practices
- **Supported Formats:** `.png`, `.jpg`, `.jpeg`, `.webp`
- **Recommended Framing:** Clear, well-lit, flat-surface scans or smartphone captures.
- **Biometric Requirement:** The document must contain a visible, forward-facing portrait photo for automated facial boundary detection.
- **Document Integrity:** Keep alphanumeric fields, MRZ text lines, and holograms unobstructed so scanner enhancement modes can retain them for OCR.

---

## ⚡ Key Features

- **Automated Facial PII Redaction:** Computer-vision-powered detection and masking of facial contours.
- **Multiple Processing Modes:**
  - **Gaussian Blur (`1000r`):** High-density Gaussian diffusion that obscures facial geometry, iris patterns, and soft-tissue markers.
  - **Mosaic Pixelation (`35b`):** Destroys spatial gradient data to mitigate AI-based deconvolution and reconstruction attacks.
  - **Scanner Legibility Mode:** Edge sharpening and contrast enhancement designed for OCR legibility while keeping biometrics masked.
- **Zero-Storage Ingestion Pipeline:** Direct client-to-quarantine uploads authorized via short-lived HMAC-SHA1 tokens (`/api/sign-intake`). The application server never writes or retains raw image bytes.
- **Interactive Split-View Inspection:** Dual-plane interactive comparison slider to verify that non-biometric compliance fields remain intact.
- **Direct Stream Downloads:** Client-side binary blob extraction for secure, local export of redacted assets without intermediate server caching.

---

## 🏗️ Architecture & Data Flow

```
                      [ User Browser ]
                             │
     1. Request Signed Token │  ▲ 4. Receive Dynamic
        (Folder / Timestamp) │  │    Transformed Asset URLs
                             ▼  │
               [ Next.js API: /api/sign-intake ]
                             │
                             │ (HMAC-SHA1 Signature Generation)
                             ▼
              [ Cloudinary Edge / Pipeline ]
                             ▲
                             │ 2. Direct Multipart Form Upload
                             │    (Bypasses Node.js Memory)
                      [ User Browser ]
                             │
                             ▼ 3. Real-Time Vision Processing
             [ e_blur_faces / e_pixelate_faces ]
```

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router) & React
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Dark Zero-Trust Aesthetic)
- **Computer Vision & CDN:** Cloudinary Programmable Media Engine
- **Visuals:** Custom HTML5 Canvas Reactive Privacy Mesh & Split Slider
- **Deployment:** Vercel / Self-Hosted Node.js / Docker

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** `v18.17.0` or higher (Node 20+ LTS recommended)
- **Package Manager:** `npm`, `pnpm`, or `yarn`
- **Cloudinary Account:** Active cloud name, API key, and API secret

### 1. Clone & Configure

```bash
git clone https://github.com/adeelabbas1214/veriscrub.git
cd veriscrub
cp .env.example .env.local
```

Set your credentials in `.env.local`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Install & Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Deployment

### Deploy to Vercel

```bash
# Authenticate & Link
npx vercel

# Inject Production Environment Variables
printf "YOUR_CLOUD_NAME" | npx vercel env add CLOUDINARY_CLOUD_NAME production
printf "YOUR_API_KEY" | npx vercel env add CLOUDINARY_API_KEY production
printf "YOUR_API_SECRET" | npx vercel env add CLOUDINARY_API_SECRET production

# Deploy Production Build
npx vercel --prod
```

> **Note on Access:** If the deployment prompts for login, open **Vercel Project Settings → Deployment Protection** and disable **Vercel Authentication**.

---

## 🛡️ Security Best Practices

1. **Keep Secrets Server-Side:** Never expose `CLOUDINARY_API_SECRET` to the frontend or prefix it with `NEXT_PUBLIC_`.
2. **Automated Purging / TTL:** Configure automated lifecycle policies in your Cloudinary upload preset/folder to destroy intake scans after a retention window (e.g., 24 hours).
3. **Signed Uploads Only:** Restrict the ingestion folder to signed API requests only to prevent unauthorized storage abuse.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
EOF
