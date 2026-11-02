export type Brand = { slug: string; name: string; th: string; models: string[]; note: string };

export const BRANDS: Brand[] = [
  {
    slug: "toyota", name: "Toyota", th: "โตโยต้า",
    models: ["Yaris", "Yaris Ativ", "Vios", "Corolla Altis", "Corolla Cross", "Camry", "Fortuner", "Hilux Revo", "Veloz"],
    note: "Toyota เป็นแบรนด์ที่ตลาดรถมือสองต้องการสูง ทั้งรถเก๋งอย่าง Yaris และ Altis ไปจนถึง Fortuner และ Hilux Revo ราคาขายต่อจึงค่อนข้างดี ถ้ามีประวัติเข้าศูนย์ครบจะยิ่งได้ราคาดีขึ้น",
  },
  {
    slug: "honda", name: "Honda", th: "ฮอนด้า",
    models: ["City", "City Hatchback", "Civic", "Accord", "Jazz", "HR-V", "CR-V", "BR-V"],
    note: "Honda City, Civic และ HR-V เป็นรุ่นที่หาซื้อในตลาดมือสองบ่อย คนซื้อจะดูประวัติศูนย์ เลขไมล์ และสภาพภายในเป็นหลัก ส่วนรุ่นไฮบริด (e:HEV) ควรมีประวัติการตรวจเช็กระบบไฮบริดประกอบ",
  },
  {
    slug: "isuzu", name: "Isuzu", th: "อีซูซุ",
    models: ["D-Max", "D-Max Cab4", "D-Max Spark", "D-Max V-Cross", "MU-X"],
    note: "Isuzu D-Max เป็นกระบะที่ใช้งานกันมาก ทั้งใช้ส่วนตัวและใช้ทำงาน เรารับซื้อทุกรูปแบบ ทั้งตอนเดียว แคป และ 4 ประตู รวมถึงรถที่แต่งหรือติดหลังคาแล้ว",
  },
  {
    slug: "mazda", name: "Mazda", th: "มาสด้า",
    models: ["Mazda2", "Mazda3", "CX-3", "CX-30", "CX-5", "CX-8", "BT-50"],
    note: "Mazda2 และ CX-5 ได้รับความนิยมในตลาดมือสอง ปัจจัยหลักที่มีผลต่อราคาคือประวัติเข้าศูนย์ สภาพสีรถ และเลขไมล์",
  },
  {
    slug: "nissan", name: "Nissan", th: "นิสสัน",
    models: ["Almera", "Note", "Kicks e-Power", "Sylphy", "X-Trail", "Navara", "Terra"],
    note: "เรารับซื้อ Nissan ทั้งรถเก๋งในเมืองอย่าง Almera และ Note รุ่น e-Power ไปจนถึงกระบะ Navara และ PPV Terra",
  },
  {
    slug: "mitsubishi", name: "Mitsubishi", th: "มิตซูบิชิ",
    models: ["Mirage", "Attrage", "Xpander", "Xpander Cross", "Pajero Sport", "Triton"],
    note: "Xpander เป็นรถ 7 ที่นั่งที่ครอบครัวในตลาดมือสองต้องการ ส่วน Pajero Sport และ Triton ก็มีตลาดรองรับดี",
  },
  {
    slug: "ford", name: "Ford", th: "ฟอร์ด",
    models: ["Ranger", "Ranger Raptor", "Ranger Wildtrak", "Everest"],
    note: "Ford Ranger และ Everest รุ่นใหม่มีความต้องการในตลาดมือสอง รถที่ดูแลตามระยะและไม่เคยลุยหนักจะได้ราคาดีกว่า",
  },
  {
    slug: "mg", name: "MG", th: "เอ็มจี",
    models: ["MG ZS", "MG ZS EV", "MG5", "MG HS", "MG4 Electric", "MG Extender"],
    note: "เรารับซื้อ MG ทั้งรุ่นเครื่องยนต์และรุ่นไฟฟ้า สำหรับรถ EV สุขภาพแบตเตอรี่และการรับประกันที่เหลืออยู่มีผลต่อราคามาก",
  },
  {
    slug: "suzuki", name: "Suzuki", th: "ซูซูกิ",
    models: ["Swift", "Celerio", "Ciaz", "Ertiga", "XL7"],
    note: "Suzuki Swift และรถคันเล็กประหยัดน้ำมันเป็นที่ต้องการของคนซื้อรถคันแรก รถที่เลขไมล์ไม่สูงและภายในสะอาดจะขายได้ราคาดี",
  },
  {
    slug: "bmw", name: "BMW", th: "บีเอ็มดับเบิลยู",
    models: ["Series 3", "Series 5", "X1", "X3", "X5", "330e", "530e"],
    note: "สำหรับ BMW ประวัติเข้าศูนย์ การรับประกันและแพ็กเกจบำรุงรักษา (BSI) ที่เหลืออยู่มีผลต่อราคาอย่างมาก ถ้ามีเอกสารให้เตรียมไว้ตอนประเมิน",
  },
  {
    slug: "mercedes-benz", name: "Mercedes-Benz", th: "เบนซ์",
    models: ["C-Class", "E-Class", "CLA", "GLA", "GLC", "C 350 e", "E 300 e"],
    note: "เรารับซื้อ Mercedes-Benz ทุกรุ่น ทั้งรุ่นเครื่องยนต์และปลั๊กอินไฮบริด สมุดประวัติศูนย์ครบ รับประกันที่เหลือ และสภาพแบตเตอรี่ไฮบริดคือปัจจัยหลักของราคา",
  },
];

export const brandBySlug = (slug: string) => BRANDS.find((b) => b.slug === slug);
