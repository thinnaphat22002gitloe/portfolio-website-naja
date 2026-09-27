# 🌟 TMRW UNLIMIT — Enterprise Portfolio & CMS Platform

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

แพลตฟอร์มเว็บไซต์ Portfolio และระบบจัดการเนื้อหา (Headless CMS) แบบ Full-Stack ระดับ Enterprise สำหรับนำเสนอผลงาน นวัตกรรมซอฟต์แวร์ งานวิศวกรรมไฟฟ้า โซลูชัน Digital Twin, IoT และ B2B Sales Platform มาพร้อมสถาปัตยกรรม Hybrid (รองรับทั้งแบบเชื่อมต่อฐานข้อมูล หรือรันเป็น Static Site แบบ Zero-Config)

---

## 📑 สารบัญ (Table of Contents)
- [✨ ฟีเจอร์หลัก (Key Features)](#-ฟีเจอร์หลัก-key-features)
- [🛠 เทคโนโลยีที่ใช้ (Tech Stack)](#-เทคโนโลยีที่ใช้-tech-stack)
- [🏛 สถาปัตยกรรมระบบ (Architecture)](#-สถาปัตยกรรมระบบ-architecture)
- [📂 โครงสร้างโฟลเดอร์ (Project Structure)](#-โครงสร้างโฟลเดอร์-project-structure)
- [🚀 วิธีการติดตั้งและรันโปรเจกต์ (Getting Started)](#-วิธีการติดตั้งและรันโปรเจกต์-getting-started)
  - [วิธีที่ 1: ดับเบิลคลิกไฟล์รันอัตโนมัติ (ง่ายที่สุด)](#วิธีที่-1-ดับเบิลคลิกไฟล์รันอัตโนมัติ-ง่ายที่สุด)
  - [วิธีที่ 2: รัน Frontend เท่านั้น (Static / Dev Server)](#วิธีที่-2-รัน-frontend-เท่านั้น-static--dev-server)
  - [วิธีที่ 3: รันแบบ Full-Stack (Frontend + FastAPI Backend)](#วิธีที่-3-รันแบบ-full-stack-frontend--fastapi-backend)
  - [วิธีที่ 4: รันผ่าน Docker Compose](#วิธีที่-4-รันผ่าน-docker-compose)
- [🔐 ข้อมูลการเข้าใช้งานระบบผู้ดูแล (Admin Backoffice)](#-ข้อมูลการเข้าใช้งานระบบผู้ดูแล-admin-backoffice)
- [⚙️ การตั้งค่า Environment Variables](#️-การตั้งค่า-environment-variables)
- [📜 คำสั่งที่ใช้บ่อย (Scripts Reference)](#-คำสั่งที่ใช้บ่อย-scripts-reference)
- [🌐 การ Deploy ขึ้น Production](#-การ-deploy-ขึ้น-production)

---

## ✨ ฟีเจอร์หลัก (Key Features)

### 🎨 หน้าบ้าน (Client-Facing / Public Showcase)
- **Modern UI & Rich Aesthetics**: ดีไซน์ล้ำสมัยด้วย Glassmorphism, Dynamic Gradients และ Micro-interactions
- **Fluid Animations**: ใช้ **Framer Motion** ในการขับเคลื่อน Transition และเลื่อนฉากอย่างนุ่มนวล
- **Interactive Portfolio Showcase**:
  - แสดงผลงานแบบ Interactive Card พร้อม Category Tag และความคืบหน้า
  - Modal รายละเอียดผลงานระดับลึก (Full Details, Key Features, Gallery Slider)
  - ใช้ **React Portal** ป้องกันปัญหา Stacking Context และ Z-Index
- **Dark / Light Mode**: สลับธีมสว่างและธีมมืดได้อย่างสมบูรณ์แบบ พร้อมไอคอนแบบ Animated Toggle Switch
- **Visual Enhancements**:
  - **Animated Background**: แบ็กกราวด์ขยับตามการเคลื่อนไหว
  - **Custom Cursor**: เคอร์เซอร์แบบไดนามิกที่ตอบสนองเมื่อ Hover ปุ่มหรือการ์ด
  - **Scroll Progress Indicator**: แถบวัดเปอร์เซ็นต์การเลื่อนอ่านหน้าเว็บใน Navbar
- **Responsive Layout**: รองรับการใช้งานสมบูรณ์แบบทั้งบนมือถือ, แท็บเล็ต และคอมพิวเตอร์เดสก์ท็อป
- **Contact Form**: แบบฟอร์มติดต่อที่เชื่อมต่อกับระบบหลังบ้านและตรวจสอบความถูกต้องด้วย React Hook Form + Zod

### 💼 ระบบจัดการหลังบ้าน (Admin CMS Backoffice)
- **Secure Authentication**: เข้าสู่ระบบด้วย JWT Token ที่ปลอดภัย
- **Overview Dashboard**: สรุปข้อมูลภาพรวม สถิติ และการติดต่อเข้ามา
- **Projects Management**: เพิ่ม ลบ แก้ไข ข้อมูลโปรเจกต์, รูปภาพปก, รูปแกลเลอรี และลำดับการแสดงผล
- **Services Management**: จัดการข้อมูลบริการและคำอธิบาย
- **Contact Inquiries Inbox**: ตรวจสอบข้อความและอีเมลจากผู้ติดต่อหน้าเว็บ
- **Site Settings**: ปรับแต่งข้อมูล Hero Text, ข้อมูลสถิติ, ข้อมูลติดต่อ และโลโก้ได้ทันที

---

## 🛠 เทคโนโลยีที่ใช้ (Tech Stack)

### Frontend
- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Tooling**: [Vite 5](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) / [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Motion & Interactions**: [Framer Motion](https://www.framer.com/motion/)
- **Routing**: [Wouter](https://github.com/molefrog/wouter) (Minimal & Fast Router)
- **Data Fetching**: [TanStack Query (React Query v5)](https://tanstack.com/query/latest)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

### Backend (`/tmrw-backend`)
- **API Framework**: [FastAPI 0.115](https://fastapi.tiangolo.com/) (Python 3.10+)
- **ASGI Server**: [Uvicorn](https://www.uvicorn.org/)
- **ORM / Database**: [SQLAlchemy 2.0](https://www.sqlalchemy.org/) (SQLite ในช่วง Dev / PostgreSQL ในโหมด Production)
- **Validation**: [Pydantic v2](https://docs.pydantic.dev/)
- **Authentication**: JWT (JSON Web Tokens) + Bcrypt Password Hashing
- **Containerization**: Docker & Docker Compose

---

## 🏛 สถาปัตยกรรมระบบ (Architecture)

โปรเจกต์นี้ได้รับการออกแบบเป็น **Hybrid Resilience Architecture**:
1. **API-Connected Mode**: เมื่อเชื่อมต่อกับ `tmrw-backend` หน้าบ้านจะดึงและบันทึกข้อมูลแบบ Dynamic จากฐานข้อมูล (SQLite / PostgreSQL)
2. **Static Fallback Mode**: หากยังไม่ได้เปิด Backend หรือเมื่อนำไปโฮสต์บน Static Hosting อย่าง GitHub Pages / Vercel ตัวเว็บจะสลับไปใช้ชุดข้อมูลเริ่มต้นใน `src/data/staticContent.ts` โดยอัตโนมัติ ทำให้หน้าเว็บเปิดแสดงผลงานได้เสมอโดยไม่มี Error

```text
[ Browser / Client ]
         │
         ├─── (Dev Proxy / API URL) ────> [ FastAPI Backend (:8000) ]
         │                                       │
         │                                [ SQLite / PostgreSQL ]
         │
         └─── (Fallback Mode) ──────────> [ src/data/staticContent.ts ]
```

---

## 📂 โครงสร้างโฟลเดอร์ (Project Structure)

```text
portfolio-website-naja/
├── public/                     # Static assets (images, icons, logo)
│   ├── logo/                   # โลโก้แบรนด์ TMRW
│   └── picture/                # รูปภาพผลงานโปรเจกต์
├── src/
│   ├── assets/                 # สไตล์และ Assets ภายใน
│   ├── components/
│   │   ├── layout/             # Navbar, Footer, Layout Wrapper
│   │   ├── sections/           # ส่วนต่างๆ ของหน้าแรก (Hero, About, Services, Portfolio, Contact)
│   │   ├── ui/                 # Reusable UI Components (Button, Card, Dialog, Toast, ฯลฯ)
│   │   ├── AnimatedBackground.tsx
│   │   └── CustomCursor.tsx
│   ├── context/                # Admin Auth Context
│   ├── data/
│   │   └── staticContent.ts    # ข้อมูล Fallback Content & รูปโปรเจกต์
│   ├── hooks/                  # Custom Hooks (useTheme, useIntersectionObserver, ฯลฯ)
│   ├── lib/                    # Helper Functions & Utilities
│   ├── pages/
│   │   ├── PublicSite.tsx      # หน้าหลักของเว็บไซต์
│   │   └── admin/              # หน้าควบคุมผู้ดูแล (Dashboard, Projects, Services, Contacts, Settings)
│   ├── types/                  # TypeScript Types Definitions
│   ├── App.tsx                 # Routing Configuration (Wouter)
│   ├── main.tsx                # Application Entry Point
│   └── index.css               # Global CSS & Tailwind Setup
├── tmrw-backend/               # โฟลเดอร์ระบบหลังบ้าน (FastAPI)
│   ├── app/
│   │   ├── api/                # API Routers (v1: auth, projects, services, contacts, settings)
│   │   ├── core/               # App Configuration & Security
│   │   ├── models/             # SQLAlchemy ORM Models
│   │   └── schemas/            # Pydantic Schemas
│   ├── Dockerfile              # Dockerfile สำหรับ Backend
│   ├── requirements.txt        # รายการ Python Packages
│   └── test_api.py             # Automated API Tests
├── docker-compose.yml          # Docker Compose (PostgreSQL + FastAPI)
├── package.json                # Frontend Dependencies & Scripts
├── run-portfolio.bat           # สคริปต์คลิกเดียวสำหรับเปิดเว็บบน Windows
├── vite.config.ts              # การตั้งค่า Vite (Base path, Proxy, Tailwind)
└── README.md                   # คู่มือการใช้งานโปรเจกต์
```

---

## 🚀 วิธีการติดตั้งและรันโปรเจกต์ (Getting Started)

### สิ่งที่ต้องมีในเครื่อง (Prerequisites)
- [Node.js](https://nodejs.org/) (แนะนำเวอร์ชัน **v20 LTS** หรือ **v24 LTS**)
- [Python](https://www.python.org/) 3.10+ *(เฉพาะกรณีต้องการรัน Backend ในเครื่อง)*
- [Docker Desktop](https://www.docker.com/) *(เฉพาะกรณีต้องการรันแบบ Container)*

---

### วิธีที่ 1: ดับเบิลคลิกไฟล์รันอัตโนมัติ (ง่ายที่สุดบน Windows)
1. ดับเบิลคลิกที่ไฟล์ [run-portfolio.bat](run-portfolio.bat)
2. ระบบจะตรวจหา Node.js, ติดตั้ง `node_modules` ให้อัตโนมัติ (หากยังไม่มี) และสั่งรันเซิร์ฟเวอร์
3. เปิดเบราว์เซอร์ไปที่: **`http://localhost:5173/portfolio-website-naja/`**

---

### วิธีที่ 2: รัน Frontend เท่านั้น (Static / Dev Server)
1. ติดตั้ง Dependencies:
   ```bash
   npm install
   ```
2. รันโหมด Development:
   ```bash
   npm run dev
   ```
3. เข้าชมเว็บไซต์ได้ที่:
   👉 **`http://localhost:5173/portfolio-website-naja/`**

---

### วิธีที่ 3: รันแบบ Full-Stack (Frontend + FastAPI Backend)

#### ขั้นตอนที่ 1: รัน Backend
เปิด Terminal ที่ 1:
```bash
cd tmrw-backend
python -m venv venv

# บน Windows:
venv\Scripts\activate
# บน macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
- API Docs (Swagger UI): `http://127.0.0.1:8000/docs`

#### ขั้นตอนที่ 2: รัน Frontend
เปิด Terminal ที่ 2 (ที่โฟลเดอร์หลัก):
```bash
npm run dev
```
*(Vite Dev Server มีการตั้งค่า Reverse Proxy ไปยัง `http://127.0.0.1:8000` ให้อัตโนมัติ)*

---

### วิธีที่ 4: รันผ่าน Docker Compose
หากมี Docker Desktop สามารถสั่งรันทั้ง Database (PostgreSQL) และ Backend ได้ด้วยคำสั่งเดียว:
```bash
# เริ่มรันคอนเทนเนอร์
npm run docker:up
# หรือ docker compose up --build -d

# ดู Logs
npm run docker:logs

# หยุดการทำงาน
npm run docker:down
```

---

## 🔐 ข้อมูลการเข้าใช้งานระบบผู้ดูแล (Admin Backoffice)

สามารถเข้าสู่ระบบจัดการข้อมูลหลังบ้านได้ที่ URL:
👉 **`http://localhost:5173/portfolio-website-naja/admin/login`**

- **Default Email**: `admin@tmrw.unlimited`
- **Default Password**: `changeme123`

*(สามารถแก้ไขรหัสผ่านได้ผ่านทาง Environment Variable หรือหน้า Settings หลังบ้าน)*

---

## ⚙️ การตั้งค่า Environment Variables

### Frontend (`.env` หรือ `.env.production`)
| Variable | Description | Default |
|---|---|---|
| `VITE_BASE_PATH` | Base Path สำหรับ Router & Assets | `/portfolio-website-naja/` (สำหรับ GitHub Pages) หรือ `/` สำหรับ Custom Domain |
| `VITE_API_URL` | URL ของ Backend API | ว่างไว้ (ใช้ Local Proxy) หรือ `https://api.yourdomain.com` |
| `VITE_DEV_API_PROXY` | Proxy Target ในช่วงพัฒนา | `http://127.0.0.1:8000` |

### Backend (`tmrw-backend/.env`)
| Variable | Description | Default |
|---|---|---|
| `APP_ENV` | สภาพแวดล้อม (`development` / `production`) | `development` |
| `DATABASE_URL` | เชื่อมต่อฐานข้อมูล (SQLite หรือ PostgreSQL) | `sqlite:///./tmrw.db` |
| `JWT_SECRET` | Secret key สำหรับถอดรหัส JWT | (ระบุคีย์ความปลอดภัยสูง) |
| `ADMIN_EMAIL` | อีเมลแอดมินเริ่มต้น | `admin@tmrw.unlimited` |
| `ADMIN_PASSWORD` | รหัสผ่านแอดมินเริ่มต้น | `changeme123` |
| `CORS_ORIGINS` | โดเมนที่อนุญาตให้เรียกใช้ API | `http://localhost:5173,http://127.0.0.1:5173` |

---

## 📜 คำสั่งที่ใช้บ่อย (Scripts Reference)

| คำสั่ง | คำอธิบาย |
|---|---|
| `npm run dev` | รัน Vite Development Server สำหรับ Frontend |
| `npm run dev:backend` | รัน FastAPI Backend ด้วย Uvicorn (reload mode) |
| `npm run build` | Build Production Assets สำหรับ Frontend ไปไว้ที่โฟลเดอร์ `/dist` |
| `npm run serve` | พรีวิวผลลัพธ์ Build ก่อนนำไป Deploy |
| `npm run typecheck` | ตรวจสอบ Type ของ TypeScript ทั่วทั้งโปรเจกต์ |
| `npm run deploy` | Build และ Deploy ขึ้น GitHub Pages ผ่าน `gh-pages` |
| `npm run docker:up` | สั่งเปิดระบบ PostgreSQL + Backend ผ่าน Docker Compose |
| `npm run docker:down` | หยุดการทำงานของ Docker Containers ทั้งหมด |
| `npm run docker:logs` | ดู Logs การทำงานของ Backend Container |

---

## 🌐 การ Deploy ขึ้น Production

### 1. Frontend บน Vercel หรือ Cloudflare Pages
1. คัดลอกไฟล์ `.env.production.example` ไปเป็น `.env.production`
2. ตั้งค่า `VITE_BASE_PATH=/` และระบุ `VITE_API_URL=https://your-api.onrender.com`
3. ตั้งค่า Build Command: `npm run build`
4. ตั้งค่า Output Directory: `dist`

### 2. Backend บน Render / Railway
- ในโปรเจกต์มีไฟล์ `render.yaml` และ `tmrw-backend/railway.json` เตรียมไว้ให้แล้ว
- สามารถเชื่อมต่อ GitHub Repository กับ Render แล้วเลือกสร้าง Blueprint ได้ทันที

### 3. Deploy บน GitHub Pages
- รันคำสั่ง:
  ```bash
  npm run deploy
  ```
- ตัวระบบจะ Build และ Push ขึ้น Branch `gh-pages` ให้อัตโนมัติ

---

## 👨‍💻 ผู้พัฒนาและลิขสิทธิ์ (Author & License)
- **TMRW UNLIMIT Team** — We Build Technology That Moves You Forward.
- Contact: `Ruttinon@gmail.com` | `090 669 8821`
- License: MIT License