# 🌟 Modern Portfolio Website

เว็บไซต์ Portfolio ส่วนตัวที่ออกแบบมาอย่างทันสมัย รองรับการแสดงผลทุกหน้าจอ (Responsive Design) และมี Animation ที่ลื่นไหล

## 🚀 ฟีเจอร์หลัก (Key Features)
- **Modern UI/UX**: ดีไซน์สวยงาม ทันสมัย เน้นประสบการณ์ผู้ใช้ที่ดี
- **Fully Responsive**: รองรับการใช้งานทั้งบน มือถือ, แท็บเล็ต และคอมพิวเตอร์
- **Smooth Animations**: ใช้ Framer Motion สำหรับการเคลื่อนไหวที่นุ่มนวล
- **Dynamic Content**: แยกส่วนการทำงานชัดเจน ง่ายต่อการแก้ไขข้อมูล
- **Interactive Elements**: มีส่วนโต้ตอบกับผู้ใช้ เช่น แบบฟอร์มติดต่อ, Carousel ผลงาน และ Skills bar
- **🌞 Dark / 🌙 Dark & Light Mode**: สลับโหมดสว่าง/มืดที่สวยงามพร้อม Toggle Switch แบบ Animated
- **Animated Background**: พื้นหลังที่เคลื่อนไหวอย่างราบรื่น
- **Portfolio Modal**: แสดงผลงานด้วย React Portal เพื่อป้องกันปัญหา Stacking Context
- **Scroll to Top**: ปุ่มช่วยเลื่อนขึ้นด้านบน
- **High Contrast Text**: ข้อความที่อ่านง่ายในทุกโหมด
- **Custom Cursor**: เคอร์เซอร์แบบกำหนดเอง
- **Navbar with Scroll Progress Bar: Navbar ที่เปลี่ยนสีตามการเลื่อน
- **Scroll to Section on Refresh: รีเฟรชแล้วเด้งไปหน้าแรกทุกครั้ง
- **Mobile Menu**: เมนูสำหรับมือถือที่สวยงาม

## 🛠 เทคโนโลยีที่ใช้ (Tech Stack)

### Core
- **React 18**: Library หลักในการสร้าง User Interface
- **TypeScript**: เพิ่มความปลอดภัยในการเขียน Code ด้วย Static Typing
- **Vite**: เครื่องมือ Build Tool ยุคใหม่ที่ทำให้การพัฒนารวดเร็วมาก

### Styling & UI
- **Tailwind CSS 4.0**: สำหรับการจัดการ Style ด้วย Utility-first CSS
- **Shadcn UI & Radix UI**: ชุด Component สำเร็จรูปที่มีมาตรฐานการเข้าถึงสูง (Accessibility)
- **Lucide React & React Icons**: สำหรับ Icon ต่างๆ ในเว็บไซต์
- **Framer Motion**: สำหรับสร้าง Animation และ Transition ต่างๆ

### Other Tools
- **Wouter**: สำหรับการจัดการ Routing (เส้นทางหน้าเว็บ)
- **React Hook Form & Zod**: สำหรับจัดการและตรวจสอบความถูกต้องของแบบฟอร์ม
- **Embla Carousel**: สำหรับส่วนแสดงผลงานแบบสไลด์

## 📂 โครงสร้างโฟลเดอร์ที่สำคัญ
- `src/components/sections`: เก็บส่วนต่างๆ ของหน้าเว็บ (Hero, About, Portfolio, ฯลฯ)
- `src/components/layout`: Navbar และ Layout Components
- `src/components/ui`: เก็บ UI Component พื้นฐาน (Button, Input, Card, ฯลฯ)
- `src/assets`: เก็บไฟล์รูปภาพและ Static Assets
- `src/lib`: เก็บไฟล์ Utility ต่างๆ เช่น การตั้งค่า Tailwind Merge
- `src/components/AnimatedBackground.tsx**: Component สำหรับพื้นหลัง
- `src/components/CustomCursor.tsx**: Component สำหรับเคอร์เซอร์

## 💻 วิธีการติดตั้งและรันโปรเจกต์
1. ติดตั้ง dependencies:
   ```bash
   npm install
   ```
2. รันโปรเจกต์ในโหมดพัฒนา:
   ```bash
   npm run dev
   ```
3. Build โปรเจกต์เพื่อนำไปใช้งานจริง:
   ```bash
   npm run build
   ```
4. Deploy to GitHub Pages (Optional):
   - Project มีการตั้งค่า Deploy ด้วย GitHub Actions แล้ว สามารถ Push ไปที่ Branch main เพื่อ Deploy อัตโนมัติ

---
พัฒนาโดย **thinnaphat22002gitloe** ✨ Updated fonts and styling!