export type Zone = { key: string; name: string; intro: string };
export type District = { slug: string; th: string; en: string; zone: string };

export const ZONES: Zone[] = [
  {
    key: "inner",
    name: "กรุงเทพฯ ชั้นใน",
    intro:
      "ย่านธุรกิจและที่อยู่อาศัยหนาแน่น ที่จอดรถหายากและรถติดเกือบทั้งวัน หลายคนจึงขายรถส่วนตัวแล้วหันไปใช้รถไฟฟ้า หรือเปลี่ยนเป็นรถคันเล็กลง เรานัดดูรถได้ทั้งที่ลานจอดคอนโด อาคารสำนักงาน หรือหน้าบ้าน",
  },
  {
    key: "north",
    name: "กรุงเทพฯ ฝั่งเหนือ",
    intro:
      "ย่านบ้านเดี่ยว ทาวน์โฮม และหมู่บ้านจัดสรรตามแนววิภาวดี พหลโยธิน และรามอินทรา ครอบครัวที่นี่มักใช้รถเก๋งและ SUV ขนาดกลาง และขายรถคันเดิมเมื่อจะอัปเกรดเป็นรถครอบครัวคันใหญ่ขึ้น",
  },
  {
    key: "sukhumvit",
    name: "สุขุมวิท–บางนา",
    intro:
      "ย่านคอนโดและหมู่บ้านตามแนวสุขุมวิท ศรีนครินทร์ และบางนา–ตราด มีทั้งรถยุโรป รถญี่ปุ่น และรถ EV เราประเมินราคาให้ได้ทุกแบรนด์ และนัดดูรถในลานจอดคอนโดได้",
  },
  {
    key: "east",
    name: "กรุงเทพฯ ฝั่งตะวันออก",
    intro:
      "ย่านที่อยู่อาศัยขยายตัวเร็ว ตั้งแต่บางกะปิ รามคำแหง มีนบุรี ไปจนถึงลาดกระบังและหนองจอก มีรถกระบะและรถอเนกประสงค์ใช้งานจริงจำนวนมาก เรารับซื้อทั้งรถเก๋ง กระบะ และ PPV",
  },
  {
    key: "thonburi",
    name: "ฝั่งธนบุรี",
    intro:
      "ฝั่งตะวันตกของแม่น้ำเจ้าพระยา ตั้งแต่ย่านเก่าอย่างคลองสานและบางกอกน้อย ไปจนถึงบางแค ตลิ่งชัน และบางขุนเทียน ไม่ต้องขับรถข้ามสะพานมาเอง ทีมงานเดินทางไปดูรถถึงที่",
  },
];

const d = (slug: string, th: string, en: string, zone: string): District => ({ slug, th, en, zone });

export const DISTRICTS: District[] = [
  // ชั้นใน
  d("phra-nakhon", "พระนคร", "Phra Nakhon", "inner"),
  d("pom-prap-sattru-phai", "ป้อมปราบศัตรูพ่าย", "Pom Prap Sattru Phai", "inner"),
  d("samphanthawong", "สัมพันธวงศ์", "Samphanthawong", "inner"),
  d("bang-rak", "บางรัก", "Bang Rak", "inner"),
  d("pathum-wan", "ปทุมวัน", "Pathum Wan", "inner"),
  d("ratchathewi", "ราชเทวี", "Ratchathewi", "inner"),
  d("phaya-thai", "พญาไท", "Phaya Thai", "inner"),
  d("dusit", "ดุสิต", "Dusit", "inner"),
  d("din-daeng", "ดินแดง", "Din Daeng", "inner"),
  d("huai-khwang", "ห้วยขวาง", "Huai Khwang", "inner"),
  d("sathon", "สาทร", "Sathon", "inner"),
  d("bang-kho-laem", "บางคอแหลม", "Bang Kho Laem", "inner"),
  d("yan-nawa", "ยานนาวา", "Yan Nawa", "inner"),
  // เหนือ
  d("bang-sue", "บางซื่อ", "Bang Sue", "north"),
  d("chatuchak", "จตุจักร", "Chatuchak", "north"),
  d("lat-phrao", "ลาดพร้าว", "Lat Phrao", "north"),
  d("bang-khen", "บางเขน", "Bang Khen", "north"),
  d("lak-si", "หลักสี่", "Lak Si", "north"),
  d("don-mueang", "ดอนเมือง", "Don Mueang", "north"),
  d("sai-mai", "สายไหม", "Sai Mai", "north"),
  d("bueng-kum", "บึงกุ่ม", "Bueng Kum", "north"),
  d("wang-thonglang", "วังทองหลาง", "Wang Thonglang", "north"),
  // สุขุมวิท–บางนา
  d("khlong-toei", "คลองเตย", "Khlong Toei", "sukhumvit"),
  d("watthana", "วัฒนา", "Watthana", "sukhumvit"),
  d("phra-khanong", "พระโขนง", "Phra Khanong", "sukhumvit"),
  d("bang-na", "บางนา", "Bang Na", "sukhumvit"),
  d("suan-luang", "สวนหลวง", "Suan Luang", "sukhumvit"),
  d("prawet", "ประเวศ", "Prawet", "sukhumvit"),
  // ตะวันออก
  d("bang-kapi", "บางกะปิ", "Bang Kapi", "east"),
  d("saphan-sung", "สะพานสูง", "Saphan Sung", "east"),
  d("khan-na-yao", "คันนายาว", "Khan Na Yao", "east"),
  d("min-buri", "มีนบุรี", "Min Buri", "east"),
  d("khlong-sam-wa", "คลองสามวา", "Khlong Sam Wa", "east"),
  d("nong-chok", "หนองจอก", "Nong Chok", "east"),
  d("lat-krabang", "ลาดกระบัง", "Lat Krabang", "east"),
  // ธนบุรี
  d("thon-buri", "ธนบุรี", "Thon Buri", "thonburi"),
  d("khlong-san", "คลองสาน", "Khlong San", "thonburi"),
  d("bangkok-yai", "บางกอกใหญ่", "Bangkok Yai", "thonburi"),
  d("bangkok-noi", "บางกอกน้อย", "Bangkok Noi", "thonburi"),
  d("bang-phlat", "บางพลัด", "Bang Phlat", "thonburi"),
  d("taling-chan", "ตลิ่งชัน", "Taling Chan", "thonburi"),
  d("thawi-watthana", "ทวีวัฒนา", "Thawi Watthana", "thonburi"),
  d("phasi-charoen", "ภาษีเจริญ", "Phasi Charoen", "thonburi"),
  d("nong-khaem", "หนองแขม", "Nong Khaem", "thonburi"),
  d("bang-khae", "บางแค", "Bang Khae", "thonburi"),
  d("chom-thong", "จอมทอง", "Chom Thong", "thonburi"),
  d("rat-burana", "ราษฎร์บูรณะ", "Rat Burana", "thonburi"),
  d("thung-khru", "ทุ่งครุ", "Thung Khru", "thonburi"),
  d("bang-khun-thian", "บางขุนเทียน", "Bang Khun Thian", "thonburi"),
  d("bang-bon", "บางบอน", "Bang Bon", "thonburi"),
];

export const zoneOf = (key: string) => ZONES.find((z) => z.key === key)!;
export const districtBySlug = (slug: string) => DISTRICTS.find((x) => x.slug === slug);
