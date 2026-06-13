import json
import re
import unicodedata

from sqlalchemy.orm import Session, joinedload

from app.models import (
    AboutCard,
    AdminUser,
    ContactSubmission,
    Project,
    ProjectFeature,
    ProjectImage,
    ProjectTag,
    Service,
    SiteSettings,
    Stat,
)


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii")
    slug = ascii_value.lower()
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    return slug.strip("-") or "project"


def build_image_path(prefix: str, index: int) -> str:
    return f"/picture/{prefix}{index}.png"


def build_project_images(project: Project) -> list[str]:
    uploaded = [
        image.url
        for image in sorted(getattr(project, "images", []), key=lambda item: item.sort_order)
        if "placeholder-" not in image.url
    ]
    if uploaded:
        return uploaded
    return [
        build_image_path(project.image_prefix, project.image_start_index + offset)
        for offset in range(project.image_count)
    ]


PROJECTS_SEED = [
    {
        "project_id": "01",
        "title": "AppQ Customer Portal",
        "category": "Client-Facing Web Application",
        "short_desc": "เปิดประสบการณ์ใหม่ในการติดตามสินทรัพย์วิศวกรรมไฟฟ้าผ่าน Digital Twin และ Real-time Monitoring ที่เข้าถึงง่ายเพียงปลายนิ้วสัมผัส",
        "full_desc": """แพลตฟอร์มหน้าบ้าน (Portal) สำหรับลูกค้าองค์กร เพื่อใช้ในการเข้าถึงข้อมูล ตรวจสอบสถานะ และติดตามการทำงานของสินทรัพย์วิศวกรรมไฟฟ้าและข้อมูลพลังงานแบบ Real-time

ผู้ใช้สามารถเข้าถึงหน้าพอร์ทัลนี้ได้ง่ายผ่านการสแกน QR Code ประจำอุปกรณ์ หรือการกรอก Project Key ตัวระบบโดดเด่นด้านการจัดการข้อมูลและการแสดงผลด้วยกราฟิก (Data Visualization) ที่เข้าใจง่าย ช่วยเพิ่มความโปร่งใสและยกระดับบริการหลังการขายให้แก่ผู้ใช้งานระดับองค์กร""",
        "features": [
            "Multi-Method Portal Access: เข้าถึงผ่าน QR Code, ค้นหาชื่อโครงการ หรือ Project Key",
            "Interactive Digital Twin Dashboard: จำลองโครงสร้างระบบไฟฟ้าในรูปแบบดิจิทัล",
            "Real-time Data Visualization: กราฟแสดงผลข้อมูลพลังงานรายอุปกรณ์ พร้อมระบบ Filter ยืดหยุ่น",
            "Automated Alarm & Notification: ระบบแจ้งเตือนเหตุขัดข้องทางวิศวกรรมแบบ Real-time",
            "Commercial Documents History: ศูนย์รวมประวัติใบเสนอราคาและเอกสารโครงการ",
        ],
        "tags": ["React.js", "Tailwind CSS", "Data Visualization", "QR-Driven"],
        "gradient": "from-[#ff8c35]/20 to-[#e8405a]/20",
        "image_count": 6,
        "image_prefix": "AppQ Customer Portal",
        "image_start_index": 1,
    },
    {
        "project_id": "02",
        "title": "AppQ Premium Workspace",
        "category": "B2B Sales Operations Platform",
        "short_desc": "ยกระดับงานขายวิศวกรรมสู่ยุคดิจิทัลด้วยระบบออกใบเสนอราคาอัตโนมัติที่แม่นยำ รวดเร็ว และเชื่อมต่ออย่างไร้รอยต่อผ่าน LINE",
        "full_desc": """แพลตฟอร์มบริหารจัดการงานขายและออกใบเสนอราคาอัตโนมัติสำหรับธุรกิจวิศวกรรมพลังงานและระบบควบคุมอุตสาหกรรม (SCADA)

ออกแบบระบบให้รองรับลูปการทำงานตั้งแต่การล็อกอินผ่าน LINE, การจัดการแพ็กเกจสินค้า, การนำเสนอสไลด์ฟีเจอร์ซอฟต์แวร์ ไปจนถึงการเจนใบเสนอราคาอย่างเป็นทางการในรูปแบบ PDF/Excel พร้อมระบบอนุมัติและลงลายมือชื่อดิจิทัล ช่วยเพิ่มความรวดเร็วและแม่นยำในกระบวนการขายขององค์กร""",
        "features": [
            "LINE Integration: เข้าสู่ระบบและเชื่อมต่อบัญชีผ่าน LINE API",
            "Sales Admin Dashboard: ติดตามตัวชี้วัดสำคัญ ยอดขาย และรายการรออนุมัติ",
            "Dynamic Product Management: จัดการแพ็กเกจสินค้าตามขนาดองค์กรอย่างยืดหยุ่น",
            "Interactive Presentation CMS: ระบบจัดการและนำเสนอสไลด์ฟีเจอร์สินค้าบนเว็บ",
            "Automated Quotation Generator: สร้างใบเสนอราคา PDF/Excel พร้อมลายเซ็นดิจิทัลในคลิกเดียว",
        ],
        "tags": ["Next.js", "Tailwind CSS", "PDF Generation", "LINE API"],
        "gradient": "from-[#6c63ff]/20 to-[#00d4ff]/20",
        "image_count": 12,
        "image_prefix": "AppQ Premium Workspace",
        "image_start_index": 1,
    },
    {
        "project_id": "03",
        "title": "EMS Platform Engineering Service",
        "category": "Engineering & Asset Management",
        "short_desc": "ปฏิวัติงานซ่อมบำรุงด้วยระบบบริหารจัดการสินทรัพย์อัจฉริยะ เปลี่ยนงานเอกสารที่ซับซ้อนให้เป็นข้อมูลดิจิทัลที่ตรวจสอบได้ทันที",
        "full_desc": """แพลตฟอร์มบริหารจัดการงานวิศวกรรมและการซ่อมบำรุงระบบไฟฟ้าแบบครบวงจร ออกแบบมาเพื่อเปลี่ยนกระบวนการทำงานของวิศวกรและช่างหน้างานให้อยู่ในรูปแบบดิจิทัล (Digital Transformation)

รองรับการจัดระเบียบโครงสร้างข้อมูลวิศวกรรม, การจัดการสินทรัพย์แผงวงจรและมิเตอร์, รวมถึงระบบสร้าง QR Code อัจฉริยะเพื่อให้ลูกค้าเข้าถึงข้อมูลสถานะอุปกรณ์ได้ทันทีแบบ Real-time""",
        "features": [
            "Admin Dashboard: สรุปภาพรวมลูกค้า โครงการ และสินทรัพย์ทั้งหมด",
            "Asset Management: ระบบควบคุมอุปกรณ์ไฟฟ้าแบบลำดับขั้น (Project -> Panel -> Loop -> Meter)",
            "Smart QR Center: สร้าง Dynamic QR Code สำหรับอุปกรณ์แต่ละชิ้นโดยเฉพาะ",
            "Digital Report Center: ออกรายงานการตรวจสอบ PM/MA อัตโนมัติ ลดการใช้กระดาษ",
            "Data Sync System: เชื่อมโยงข้อมูลกับระบบ AppQ เพื่อความแม่นยำของฐานข้อมูล",
        ],
        "tags": ["React.js", "Asset Management", "IoT Integration", "B2B SaaS"],
        "gradient": "from-[#00d4ff]/20 to-[#ff6b9d]/20",
        "image_count": 5,
        "image_prefix": "EMS Platform Engineering Service",
        "image_start_index": 1,
    },
    {
        "project_id": "04",
        "title": "CORE DATA (Master Data Hub)",
        "category": "Web Application / Backoffice Dashboard & Data Management System",
        "short_desc": "พัฒนาระบบจัดการฐานข้อมูลกลางและแผงควบคุมหลังบ้าน เพื่อทำหน้าที่เป็นศูนย์กลางข้อมูล (Single Source of Truth) ขององค์กร",
        "full_desc": """พัฒนาระบบจัดการฐานข้อมูลกลาง (Master Data Hub) และแผงควบคุมหลังบ้าน (Backoffice) เพื่อทำหน้าที่เป็นศูนย์กลางข้อมูล (Single Source of Truth) ขององค์กร รองรับการเชื่อมต่อและซิงค์ข้อมูลผ่าน API ร่วมกับแอปพลิเคชันภายนอก (AppQ) ช่วยให้ทีมบริหารจัดการและตรวจสอบข้อมูลได้อย่างมีประสิทธิภาพในจุดเดียว""",
        "features": [
            "Data Hub Dashboard: หน้าแสดงผลและติดตามสถานะภาพรวมของข้อมูล 4 ส่วนสำคัญ ได้แก่ ข้อมูลลูกค้า (Customers), โครงการ (Projects), งานติดตั้ง/ซ่อมบำรุง (Jobs) และรายงานผลการทำงาน (Reports)",
            "Customer Management: ระบบจัดการและแก้ไขฐานข้อมูลลูกค้า (CRUD Operation) พร้อมระบบคัดกรองข้อมูล",
            "API Integration: รองรับการดึงข้อมูลและเชื่อมต่อระบบภายนอก พร้อมหน้าคู่มือ API (API Docs) สำหรับนักพัฒนา",
            "UI/UX Design: ออกแบบแผงควบคุมที่เน้นความเรียบง่าย สแกนข้อมูลง่าย และเข้าถึงระบบจัดการข้อมูลลูกค้าได้อย่างรวดเร็ว",
        ],
        "tags": ["Backoffice", "API First", "Data Management", "Dashboard", "RESTful API"],
        "gradient": "from-[#a855f7]/20 to-[#6c63ff]/20",
        "image_count": 2,
        "image_prefix": "Core-data-",
        "image_start_index": 0,
    },
    {
        "project_id": "05",
        "title": "Intelligent Production Monitoring & Admin Control Platform",
        "category": "Desktop Application (.exe) & Web Dashboard / Operations & Data Management System",
        "short_desc": "ระบบบริหารจัดการและติดตามประสิทธิภาพการผลิตในโรงงานอัจฉริยะ (Smart Factory) แบบครบวงจร",
        "full_desc": """ระบบบริหารจัดการและติดตามประสิทธิภาพการผลิตในโรงงานอัจฉริยะ (Smart Factory) แบบครบวงจร โดยพัฒนาตัวแอปพลิเคชันแยกออกเป็น 2 ส่วนหลักเพื่อตอบโจทย์การใช้งานจริงในองค์กร ได้แก่ โปรแกรมเดสก์ท็อป (.exe) ในรูปแบบ Dark Mode สำหรับติดตั้งเพื่อเปิดมอนิเตอร์สถานะหน้าสายการผลิตโดยตรง และ ระบบเว็บแดชบอร์ดหลังบ้าน (Web Portal) สำหรับทีมผู้บริหารและแอดมิน เพื่อควบคุมสิทธิ์ ตั้งค่าเป้าหมาย และวิเคราะห์ข้อมูลในภาพรวมได้อย่างปลอดภัยและรวดเร็ว""",
        "features": [
            "Cross-Platform Delivery (.exe & Web): สถาปัตยกรรมระบบที่แยกการทำงานแบบ Hybrid",
            "Real-time Production Monitor Dashboard: แผงควบคุมดีไซน์ Dark Mode แสดงสถานะเครื่องจักร",
            "Centralized Admin Panel & Authentication: ระบบความปลอดภัยหลังบ้านที่ต้องผ่านหน้าล็อกอิน",
            "Bulk Data Import & KPI Settings: ระบบรองรับการนำเข้าข้อมูลดิบปริมาณมากผ่านการอัปโหลดไฟล์ Excel",
        ],
        "tags": ["Desktop App", "Web Dashboard", "Excel Integration", "Dark Mode", "Industrial UI"],
        "gradient": "from-primary/20 to-secondary/20",
        "image_count": 5,
        "image_prefix": "Intelligent Production Monitoring & Admin Control Platform",
        "image_start_index": 1,
    },
    {
        "project_id": "06",
        "title": "Enterprise Power Platform Solutions",
        "category": "Internal Enterprise Web Application / Process Automation & Business Intelligence (BI) Dashboard",
        "short_desc": "แพลตฟอร์มแอปพลิเคชันและแดชบอร์ดอัจฉริยะภายในองค์กร พัฒนาขึ้นบน Microsoft Power Platform",
        "full_desc": """แพลตฟอร์มแอปพลิเคชันและแดชบอร์ดอัจฉริยะภายในองค์กร พัฒนาขึ้นบน Microsoft Power Platform เพื่อขับเคลื่อนองค์กรสู่การเป็น Paperless Digital Workplace และ Smart Factory เต็มรูปแบบสำหรับผู้ใช้งานในระบบ Microsoft 365 โดยเปลี่ยนกระบวนการทำงานที่เคยใช้กระดาษและระบบแมนนวลให้เป็นออนไลน์ 100% แก้ไขปัญหาเรื่องเอกสารสูญหายได้อย่างเด็ดขาด""",
        "features": [
            "Paperless FA Online Approval Workflow: ระบบฟอร์มขออนุมัติตัวอย่างผลิตภัณฑ์ (First Article) บน Power Apps",
            "Smart Factory Production Dashboard: หน้าจอแดชบอร์ดสไตล์ Dark Mode สำหรับมอนิเตอร์สถานะไลน์การผลิต",
            "Admin Control Panel & KPI Settings: ระบบควบคุมหลังบ้านสำหรับผู้ดูแลระบบ",
            "Material Inventory & Variance Analytics: หน้าจอรายงานเชิงวิเคราะห์ข้อมูลสต็อกและปริมาณการใช้วัตถุดิบ",
            "OSLR Multimedia Hub & EMR: แพลตฟอร์มทวิภาคที่รวม 2 โมดูลหลัก (SOP Video & Equipment Maintenance Record)",
        ],
        "tags": ["Microsoft Power Platform", "Power Apps", "Power Automate", "Power BI", "Low-Code"],
        "gradient": "from-[#7e22ce]/20 to-[#3b82f6]/20",
        "image_count": 5,
        "image_prefix": "Power Platform",
        "image_start_index": 1,
    },
]


def seed_database(db: Session) -> None:
    if db.query(SiteSettings).first():
        return

    typewriter_words = json.dumps(
        [
            "That Moves You Forward",
            "Scales With Your Business",
            "Delivers Real Results",
            "Solves Complex Problems",
        ]
    )
    social_links = json.dumps(
        [
            {"platform": "github", "label": "GitHub", "href": "#"},
            {"platform": "linkedin", "label": "LinkedIn", "href": "#"},
            {"platform": "instagram", "label": "Instagram", "href": "#"},
            {"platform": "email", "label": "Email", "href": "mailto:Ruttinon@gmail.com"},
        ]
    )

    db.add(
        SiteSettings(
            hero_badge="Software Development · Thailand",
            hero_headline="We Build Technology",
            hero_description="เราเชื่อว่าเทคโนโลยีควรเป็นเครื่องมือที่ทุกคนเข้าถึงได้ — ตั้งแต่เว็บไซต์ ระบบหลังบ้าน แอปพลิเคชัน ไปจนถึงระบบ AI ที่ช่วยแก้ปัญหาในชีวิตจริง",
            typewriter_words=typewriter_words,
            contact_email="Ruttinon@gmail.com",
            contact_phone="090 669 8821",
            contact_address="Bangkok, Thailand",
            working_hours="Mon — Fri, 9AM — 6PM",
            social_links=social_links,
            logo_url="/logo/LOGO UNBG2.png",
        )
    )

    about_cards = [
        ("01", "Startup-Friendly", "Rocket", "สนับสนุนธุรกิจยุคใหม่และสตาร์ทอัพให้เริ่มต้นได้อย่างรวดเร็วและง่ายดาย ด้วยรากฐานเทคโนโลยีที่เหมาะสม"),
        ("02", "Automation First", "Zap", "ลดขั้นตอนการทำงานที่ซ้ำซ้อนด้วยระบบอัตโนมัติอัจฉริยะ ที่ออกแบบมาเพื่อตอบโจทย์ธุรกิจของคุณโดยเฉพาะ"),
        ("03", "AI-Driven", "Brain", "ขับเคลื่อนการใช้งาน AI และเทคโนโลยีอุบัติใหม่อย่างสร้างสรรค์และมีคุณภาพ เพื่อแก้ปัญหาที่สำคัญ"),
        ("04", "Performance Boost", "TrendingUp", "สร้างซอฟต์แวร์ที่ช่วยเพิ่มประสิทธิภาพการทำงานให้กับองค์กร ทีม และบุคคลได้อย่างชัดเจน"),
        ("05", "User-Centered Design", "Users", "ออกแบบระบบที่ใช้งานง่าย เข้าถึงได้ และเป็นมิตรกับผู้ใช้งานทุกกลุ่มอย่างแท้จริง"),
        ("06", "Built to Scale", "Maximize", "พัฒนาเทคโนโลยีโดยคำนึงถึงการเติบโตในอนาคต — ระบบที่สามารถปรับเปลี่ยนและขยายตัวตามความต้องการที่เพิ่มขึ้น"),
    ]
    for index, (card_id, title, icon_name, description) in enumerate(about_cards):
        db.add(
            AboutCard(
                card_id=card_id,
                title=title,
                icon_name=icon_name,
                description=description,
                sort_order=index,
            )
        )

    stats = [
        ("4+", "Projects Completed"),
        ("100%", "Client Satisfaction"),
        ("24/7", "Support & Service"),
    ]
    for index, (value, label) in enumerate(stats):
        db.add(Stat(value=value, label=label, sort_order=index))

    services = [
        ("01", "Digital Twin & IoT Platform", "ออกแบบและพัฒนาแพลตฟอร์มจำลองสินทรัพย์ดิจิทัล พร้อมระบบติดตามพลังงานและสถานะอุปกรณ์แบบ Real-time เพื่อการบริหารจัดการที่แม่นยำ"),
        ("02", "Sales Automation Systems", "พัฒนาระบบจัดการงานขายและออกใบเสนอราคาอัตโนมัติ (Automated Quotation) ครบวงจร ช่วยเพิ่มความรวดเร็วและลดข้อผิดพลาดให้ทีมขาย B2B"),
        ("03", "Engineering Asset Management", "ระบบบริหารจัดการงานวิศวกรรมและการซ่อมบำรุง (PM/MA) ที่เปลี่ยนงานเอกสารให้เป็นดิจิทัล พร้อมระบบ QR Code ติดตามสินทรัพย์หน้างาน"),
        ("04", "Master Data & API Integration", "บริการรวมศูนย์ข้อมูลองค์กร (Master Data Hub) เพื่อสร้างแหล่งข้อมูลที่ถูกต้องเพียงหนึ่งเดียว พร้อมระบบเชื่อมต่อ API กับแพลตฟอร์มภายนอก"),
        ("05", "Interactive Data Visualization", "เปลี่ยนข้อมูลดิบที่ซับซ้อนให้เป็นกราฟและแดชบอร์ดที่สวยงาม เข้าใจง่าย ช่วยให้คุณวิเคราะห์และตัดสินใจทางธุรกิจได้อย่างมีประสิทธิภาพ"),
    ]
    for index, (service_id, title, description) in enumerate(services):
        db.add(
            Service(
                service_id=service_id,
                title=title,
                description=description,
                sort_order=index,
            )
        )

    for index, project_data in enumerate(PROJECTS_SEED):
        project = Project(
            project_id=project_data["project_id"],
            slug=slugify(project_data["title"]),
            title=project_data["title"],
            category=project_data["category"],
            short_desc=project_data["short_desc"],
            full_desc=project_data["full_desc"],
            gradient=project_data["gradient"],
            image_prefix=project_data["image_prefix"],
            image_start_index=project_data["image_start_index"],
            image_count=project_data["image_count"],
            sort_order=index,
        )
        db.add(project)
        db.flush()

        for feature_index, feature in enumerate(project_data["features"]):
            db.add(ProjectFeature(project_id=project.id, content=feature, sort_order=feature_index))

        for tag in project_data["tags"]:
            db.add(ProjectTag(project_id=project.id, tag=tag))

    db.commit()


def project_to_dict(project: Project) -> dict:
    images = build_project_images(project)
    image_count = len(images) if images else project.image_count
    return {
        "id": project.project_id,
        "slug": project.slug,
        "title": project.title,
        "category": project.category,
        "desc": project.short_desc,
        "fullDesc": project.full_desc,
        "features": [feature.content for feature in sorted(project.features, key=lambda item: item.sort_order)],
        "tags": [tag.tag for tag in project.tags],
        "gradient": project.gradient,
        "imageCount": image_count,
        "imagePrefix": project.image_prefix,
        "imageStartIndex": project.image_start_index,
        "coverImage": images[0] if images else "",
        "images": images,
    }


def build_site_content(db: Session) -> dict:
    settings = db.query(SiteSettings).first()
    if not settings:
        raise RuntimeError("Site settings are not seeded")

    about_cards = (
        db.query(AboutCard)
        .filter(AboutCard.is_active.is_(True))
        .order_by(AboutCard.sort_order.asc())
        .all()
    )
    stats = db.query(Stat).order_by(Stat.sort_order.asc()).all()
    services = (
        db.query(Service)
        .filter(Service.is_active.is_(True))
        .order_by(Service.sort_order.asc())
        .all()
    )
    projects = (
        db.query(Project)
        .options(joinedload(Project.features), joinedload(Project.tags), joinedload(Project.images))
        .filter(Project.is_published.is_(True))
        .order_by(Project.sort_order.asc())
        .all()
    )
    social_links = json.loads(settings.social_links)

    return {
        "logoUrl": getattr(settings, "logo_url", None) or "/logo/LOGO UNBG2.png",
        "hero": {
            "badge": settings.hero_badge,
            "headline": settings.hero_headline,
            "description": settings.hero_description,
            "typewriterWords": json.loads(settings.typewriter_words),
            "ctaPrimary": "นัดหมายขอรับคำปรึกษา",
            "ctaSecondary": "ดูบริการของเรา",
        },
        "about": {
            "sectionLabel": "01 — ABOUT US",
            "title": "Driving Business with Digital Innovation",
            "subtitle": "เราคือทีมผู้เชี่ยวชาญที่มุ่งมั่นเปลี่ยนไอเดียให้กลายเป็นระบบที่ใช้งานได้จริง ลดความซับซ้อน และเพิ่มขีดความสามารถในการแข่งขัน",
            "cards": [
                {
                    "id": card.card_id,
                    "title": card.title,
                    "icon": card.icon_name,
                    "description": card.description,
                }
                for card in about_cards
            ],
            "stats": [{"value": stat.value, "label": stat.label} for stat in stats],
        },
        "services": {
            "sectionLabel": "02 — SERVICES",
            "title": "Expertise & Solutions",
            "description": "เราเปลี่ยนวิสัยทัศน์ของคุณให้เป็นจริงด้วยบริการพัฒนาซอฟต์แวร์แบบครบวงจร ตั้งแต่การวางโครงสร้างไอเดียไปจนถึงการ Deploy และการดูแลระบบที่พร้อมเติบโตไปกับธุรกิจของคุณในระยะยาว",
            "items": [
                {
                    "id": service.service_id,
                    "title": service.title,
                    "description": service.description,
                }
                for service in services
            ],
        },
        "portfolio": {
            "sectionLabel": "03 — PORTFOLIO",
            "title": "Latest Work",
            "description": "สัมผัสประสบการณ์นวัตกรรมดิจิทัลที่เราสร้างสรรค์ขึ้น เพื่อตอบโจทย์ความต้องการที่ท้าทายของธุรกิจยุคใหม่",
            "projects": [project_to_dict(project) for project in projects],
        },
        "contact": {
            "sectionLabel": "04 — CONTACT",
            "title": "Let's Talk About Your Project",
            "description": "พร้อมที่จะเริ่มโปรเจกต์ใหม่หรือยัง? ติดต่อเราเพื่อรับคำปรึกษาฟรี และมาร่วมกันสร้างสิ่งใหม่ๆ ไปด้วยกัน",
            "info": {
                "email": settings.contact_email,
                "phone": settings.contact_phone,
                "address": settings.contact_address,
                "workingHours": settings.working_hours,
            },
        },
        "social": social_links,
    }


def get_published_projects(db: Session) -> list[dict]:
    projects = (
        db.query(Project)
        .options(joinedload(Project.features), joinedload(Project.tags), joinedload(Project.images))
        .filter(Project.is_published.is_(True))
        .order_by(Project.sort_order.asc())
        .all()
    )
    return [project_to_dict(project) for project in projects]


def get_project_by_slug(db: Session, slug: str) -> dict | None:
    project = (
        db.query(Project)
        .options(joinedload(Project.features), joinedload(Project.tags), joinedload(Project.images))
        .filter(Project.slug == slug, Project.is_published.is_(True))
        .first()
    )
    if not project:
        return None
    return project_to_dict(project)


def create_contact_submission(db: Session, payload: dict, ip_address: str | None) -> ContactSubmission:
    submission = ContactSubmission(
        first_name=payload["firstName"],
        last_name=payload["lastName"],
        email=str(payload["email"]),
        company=payload.get("company"),
        service=payload["service"],
        message=payload["message"],
        ip_address=ip_address,
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission


def count_recent_submissions(db: Session, ip_address: str | None, hours: int = 1) -> int:
    if not ip_address:
        return 0

    from datetime import datetime, timedelta

    since = datetime.utcnow() - timedelta(hours=hours)
    return (
        db.query(ContactSubmission)
        .filter(
            ContactSubmission.ip_address == ip_address,
            ContactSubmission.created_at >= since,
        )
        .count()
    )
