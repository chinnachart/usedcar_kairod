# สร้างไฟล์ CRM ใหม่: python3 business/tools/build_crm.py business/RodWai-CRM.xlsx
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import CellIsRule, FormulaRule
from openpyxl.utils import get_column_letter
import sys

OUT = sys.argv[1]
N = 1000  # rows supported
F = "Sarabun"
BLUE = "0B5CFF"; ORANGE = "FF7A00"; NAVY = "0F1420"; SOFT = "E8F0FF"; CREAM = "FFF4E3"

wb = Workbook()
hdr_font = Font(name=F, bold=True, color="FFFFFF", size=11)
hdr_fill = PatternFill("solid", fgColor=BLUE)
calc_fill = PatternFill("solid", fgColor="F3F6FB")
input_font = Font(name=F, color="0000FF", size=11)
base = Font(name=F, size=11)
bold = Font(name=F, bold=True, size=11)
title = Font(name=F, bold=True, size=16, color=BLUE)
thin = Side(style="thin", color="D5DCE6")
box = Border(left=thin, right=thin, top=thin, bottom=thin)
wrap = Alignment(wrap_text=True, vertical="top")

def header(ws, cols, row=1):
    for i, (name, width, note) in enumerate(cols, 1):
        c = ws.cell(row=row, column=i, value=name)
        c.font = hdr_font; c.fill = hdr_fill
        c.alignment = Alignment(wrap_text=True, vertical="center", horizontal="center")
        c.border = box
        ws.column_dimensions[get_column_letter(i)].width = width
    ws.row_dimensions[row].height = 36
    ws.freeze_panes = ws.cell(row=row + 1, column=2)

def dv_list(ws, rng, items):
    dv = DataValidation(type="list", formula1='"' + ",".join(items) + '"', allow_blank=True)
    dv.error = "เลือกจากรายการเท่านั้น"; dv.errorTitle = "ค่าไม่ถูกต้อง"
    ws.add_data_validation(dv); dv.add(rng)

def dv_ref(ws, rng, ref):
    dv = DataValidation(type="list", formula1=ref, allow_blank=True)
    ws.add_data_validation(dv); dv.add(rng)

STATUSES = ["1 ลีดใหม่", "2 ติดต่อแล้ว", "3 รอรูป/เอกสาร", "4 ส่งเต็นท์แล้ว", "5 เสนอราคาแล้ว",
            "6 นัดตรวจรถ", "7 รอโอน", "8 ปิดดีล", "9 ไม่ขาย", "10 ไม่ผ่านการตรวจ"]
CHANNELS = ["ฟอร์มเว็บ", "LINE ทักเอง", "Google Ads", "Facebook/IG", "TikTok", "Marketplace ทักไป",
            "แนะนำจากพาร์ทเนอร์", "ลูกค้าแนะนำ", "คนรู้จัก", "อื่นๆ"]
FINANCE = ["ปลอดภาระ", "ติดไฟแนนซ์"]
YESNO = ["ใช่", "ไม่ใช่"]
LOSS = ["ราคาไม่พอใจ", "ขายเอง/ที่อื่น", "ติดต่อไม่ได้", "เอกสารมีปัญหา", "รถมีปัญหา", "เปลี่ยนใจ", "อื่นๆ"]

# ---------------- 0. คู่มือ ----------------
ws = wb.active; ws.title = "คู่มือ"
ws.sheet_view.showGridLines = False
ws.column_dimensions["A"].width = 3; ws.column_dimensions["B"].width = 110
lines = [
    ("รถไว RodWai — CRM ลีดและเครื่องคิดกำไร", title),
    ("วิธีใช้ (อัปโหลดไฟล์นี้ขึ้น Google Drive แล้วเปิดด้วย Google Sheets เพื่อใช้ร่วมกับทีมเซลส์ได้)", bold),
    ("", base),
    ("ชีต \"ลีด\" — บันทึกรถทุกคันที่เข้ามา 1 แถว = 1 คัน ใส่รหัสลีดเรียงกัน เช่น RW-0001", base),
    ("   • ช่องสีขาวกรอกเอง / ช่องสีเทาคำนวณอัตโนมัติ ห้ามพิมพ์ทับ", base),
    ("   • อัปเดต \"สถานะ\" ทุกครั้งที่ลีดขยับ สถานะ 8 = ปิดดีล, 9/10 = ไม่สำเร็จ (ใส่เหตุผลด้วย)", base),
    ("   • \"นาทีที่ตอบครั้งแรก\" คือหัวใจของแบรนด์รถไว — ตั้งเป้าให้ต่ำที่สุดและเท่ากันทุกลีด", base),
    ("ชีต \"ราคาเสนอ\" — ทุกราคาที่เต็นท์เสนอ 1 แถว = 1 ข้อเสนอ ใส่รหัสลีดให้ตรงกับชีตลีด", base),
    ("   • ชีตลีดจะนับจำนวนเต็นท์ที่เสนอ และดึงราคาสูงสุดให้อัตโนมัติ", base),
    ("ชีต \"เต็นท์\" — รายชื่อเต็นท์พาร์ทเนอร์ ค่าบริการต่อคัน และสถิติการเสนอ/ชนะ", base),
    ("ชีต \"เซลส์\" — รายชื่อผู้ช่วยขาย ค่าคอม และผลงาน (คำนวณจากชีตลีด)", base),
    ("ชีต \"คำนวณกำไรต่อคัน\" — ใส่ตัวเลขจริง (ตัวเลขสีน้ำเงิน) เพื่อดูว่าแต่ละคันกำไรเท่าไร และต้องขายกี่คันถึงคุ้มทุน", base),
    ("ชีต \"แดชบอร์ด\" — สรุปภาพรวมอัตโนมัติ ไม่ต้องกรอก", base),
    ("", base),
    ("กฎทอง", bold),
    ("   1. ห้ามส่งชื่อ/เบอร์ผู้ขายให้เต็นท์ก่อนผู้ขายเลือกข้อเสนอ", base),
    ("   2. เงินค่ารถ เต็นท์โอนให้ผู้ขายโดยตรงเท่านั้น", base),
    ("   3. ข้อมูลในไฟล์นี้เป็นข้อมูลส่วนบุคคล (PDPA) — แชร์เฉพาะทีมงาน ตั้งสิทธิ์ Google Sheets เป็น \"จำกัด\"", base),
    ("", base),
    ("ตัวเลขตั้งต้นในชีตคำนวณเป็นตัวอย่างสมมติ ให้เปลี่ยนเป็นตัวเลขจริงของคุณ", Font(name=F, italic=True, color="5B6474")),
]
for i, (t, f) in enumerate(lines, 1):
    c = ws.cell(row=i, column=2, value=t); c.font = f; c.alignment = Alignment(wrap_text=True, vertical="top")

# ---------------- 1. ลีด ----------------
L = wb.create_sheet("ลีด")
lead_cols = [
    ("รหัสลีด", 11, ""), ("วันที่เข้า", 12, ""), ("เวลาเข้า", 9, ""), ("ช่องทาง", 16, ""),
    ("ชื่อลูกค้า", 16, ""), ("เบอร์โทร", 13, ""), ("ชื่อ LINE", 14, ""),
    ("ยี่ห้อ", 12, ""), ("รุ่น", 14, ""), ("ปี (ค.ศ.)", 9, ""), ("เลขไมล์", 11, ""),
    ("ไฟแนนซ์", 12, ""), ("ยอดปิดไฟแนนซ์", 14, ""), ("เขต", 13, ""), ("ราคาที่ลูกค้าหวัง", 14, ""),
    ("ผู้ช่วยขาย", 13, ""), ("สถานะ", 17, ""), ("นาทีที่ตอบครั้งแรก", 11, ""),
    ("ตรวจเล่ม+บัตรแล้ว", 11, ""), ("รูปครบ 10 มุม", 10, ""),
    ("จำนวนเต็นท์ที่เสนอ", 11, "calc"), ("ราคาเสนอสูงสุด", 14, "calc"),
    ("เต็นท์ที่ชนะ", 15, ""), ("ราคาขายจริง", 14, ""), ("ค่าบริการที่เก็บ", 13, ""),
    ("เก็บค่าบริการแล้ว", 11, ""), ("วันที่โอน", 12, ""), ("วันจากลีดถึงโอน", 10, "calc"),
    ("เหตุผลที่ไม่สำเร็จ", 15, ""), ("ขอรีวิวแล้ว", 9, ""), ("หมายเหตุ", 28, ""),
]
header(L, lead_cols)
col = {name: get_column_letter(i) for i, (name, _, _) in enumerate(lead_cols, 1)}
for r in range(2, N + 2):
    L[f"{col['จำนวนเต็นท์ที่เสนอ']}{r}"] = f'=IF($A{r}="","",COUNTIF(\'ราคาเสนอ\'!$A:$A,$A{r}))'
    L[f"{col['ราคาเสนอสูงสุด']}{r}"] = f'=IF(OR($A{r}="",{col["จำนวนเต็นท์ที่เสนอ"]}{r}=0),"",_xlfn.MAXIFS(\'ราคาเสนอ\'!$C:$C,\'ราคาเสนอ\'!$A:$A,$A{r}))'
    L[f"{col['วันจากลีดถึงโอน']}{r}"] = f'=IF(OR($B{r}="",{col["วันที่โอน"]}{r}=""),"",{col["วันที่โอน"]}{r}-$B{r})'
    for name, _, kind in lead_cols:
        c = L[f"{col[name]}{r}"]; c.font = base; c.border = box
        if kind == "calc": c.fill = calc_fill
    for k in ("วันที่เข้า", "วันที่โอน"): L[f"{col[k]}{r}"].number_format = "dd/mm/yyyy"
    L[f"{col['เวลาเข้า']}{r}"].number_format = "hh:mm"
    for k in ("ยอดปิดไฟแนนซ์", "ราคาที่ลูกค้าหวัง", "ราคาเสนอสูงสุด", "ราคาขายจริง", "ค่าบริการที่เก็บ", "เลขไมล์"):
        L[f"{col[k]}{r}"].number_format = "#,##0"
rng = lambda k: f"{col[k]}2:{col[k]}{N+1}"
dv_list(L, rng("ช่องทาง"), CHANNELS)
dv_list(L, rng("ไฟแนนซ์"), FINANCE)
dv_list(L, rng("สถานะ"), STATUSES)
for k in ("ตรวจเล่ม+บัตรแล้ว", "รูปครบ 10 มุม", "เก็บค่าบริการแล้ว", "ขอรีวิวแล้ว"): dv_list(L, rng(k), YESNO)
dv_list(L, rng("เหตุผลที่ไม่สำเร็จ"), LOSS)
dv_ref(L, rng("ผู้ช่วยขาย"), "='เซลส์'!$A$2:$A$30")
dv_ref(L, rng("เต็นท์ที่ชนะ"), "='เต็นท์'!$A$2:$A$200")
# highlight: slow first response, closed deals
L.conditional_formatting.add(rng("นาทีที่ตอบครั้งแรก"), CellIsRule(operator="greaterThan", formula=["15"], fill=PatternFill("solid", fgColor="FFE1E1")))
L.conditional_formatting.add(f"A2:{col['หมายเหตุ']}{N+1}", FormulaRule(formula=[f'LEFT(${col["สถานะ"]}2,1)="8"'], fill=PatternFill("solid", fgColor="E3F8EA")))
L.conditional_formatting.add(f"A2:{col['หมายเหตุ']}{N+1}", FormulaRule(formula=[f'OR(LEFT(${col["สถานะ"]}2,1)="9",LEFT(${col["สถานะ"]}2,2)="10")'], font=Font(color="9AA6BA")))
L.auto_filter.ref = f"A1:{col['หมายเหตุ']}{N+1}"

# ---------------- 2. ราคาเสนอ ----------------
B = wb.create_sheet("ราคาเสนอ")
bid_cols = [("รหัสลีด", 12, ""), ("เต็นท์", 18, ""), ("ราคาเสนอ (บาท)", 15, ""), ("วันที่เสนอ", 12, ""),
            ("เงื่อนไข / หมายเหตุ", 34, ""), ("รถ (ดึงอัตโนมัติ)", 26, "calc")]
header(B, bid_cols)
for r in range(2, N * 3 + 2):
    B[f"F{r}"] = f'=IF($A{r}="","",IFERROR(INDEX(\'ลีด\'!$H:$H,MATCH($A{r},\'ลีด\'!$A:$A,0))&" "&INDEX(\'ลีด\'!$I:$I,MATCH($A{r},\'ลีด\'!$A:$A,0))&" "&INDEX(\'ลีด\'!$J:$J,MATCH($A{r},\'ลีด\'!$A:$A,0)),"ไม่พบรหัสลีด"))'
    B[f"C{r}"].number_format = "#,##0"; B[f"D{r}"].number_format = "dd/mm/yyyy"
    for cc in "ABCDEF":
        B[f"{cc}{r}"].font = base; B[f"{cc}{r}"].border = box
    B[f"F{r}"].fill = calc_fill
dv_ref(B, f"B2:B{N*3+1}", "='เต็นท์'!$A$2:$A$200")
B.auto_filter.ref = f"A1:F{N*3+1}"

# ---------------- 3. เต็นท์ ----------------
D = wb.create_sheet("เต็นท์")
d_cols = [("ชื่อเต็นท์", 20, ""), ("ผู้ติดต่อ", 15, ""), ("เบอร์โทร", 13, ""), ("LINE", 14, ""),
          ("ที่ตั้ง (เขต/จังหวัด)", 16, ""), ("ประเภทรถที่รับ", 22, ""), ("ยี่ห้อที่เน้น", 18, ""),
          ("ค่าบริการต่อคัน (บาท)", 13, ""), ("เซ็นข้อตกลงแล้ว", 11, ""), ("วันที่เริ่ม", 12, ""),
          ("ครั้งที่เสนอราคา", 11, "calc"), ("ครั้งที่ชนะ", 10, "calc"), ("อัตราชนะ", 9, "calc"),
          ("ค่าบริการที่ค้างจ่าย", 13, "calc"), ("หมายเหตุ", 26, "")]
header(D, d_cols)
for r in range(2, 202):
    D[f"K{r}"] = f'=IF($A{r}="","",COUNTIF(\'ราคาเสนอ\'!$B:$B,$A{r}))'
    D[f"L{r}"] = f'=IF($A{r}="","",COUNTIF(\'ลีด\'!${col["เต็นท์ที่ชนะ"]}:${col["เต็นท์ที่ชนะ"]},$A{r}))'
    D[f"M{r}"] = f'=IF(OR($A{r}="",K{r}=0),"",L{r}/K{r})'
    D[f"N{r}"] = (f'=IF($A{r}="","",SUMIFS(\'ลีด\'!${col["ค่าบริการที่เก็บ"]}:${col["ค่าบริการที่เก็บ"]},'
                  f'\'ลีด\'!${col["เต็นท์ที่ชนะ"]}:${col["เต็นท์ที่ชนะ"]},$A{r},'
                  f'\'ลีด\'!${col["เก็บค่าบริการแล้ว"]}:${col["เก็บค่าบริการแล้ว"]},"ไม่ใช่"))')
    D[f"H{r}"].number_format = "#,##0"; D[f"N{r}"].number_format = "#,##0"; D[f"M{r}"].number_format = "0%"
    D[f"J{r}"].number_format = "dd/mm/yyyy"
    for i in range(1, 16):
        c = D.cell(row=r, column=i); c.font = base; c.border = box
        if d_cols[i-1][2] == "calc": c.fill = calc_fill
dv_list(D, "I2:I201", YESNO)

# ---------------- 4. เซลส์ ----------------
S = wb.create_sheet("เซลส์")
s_cols = [("ชื่อผู้ช่วยขาย", 18, ""), ("เบอร์โทร", 13, ""), ("ฐานเงินเดือน/เดือน", 14, ""),
          ("ค่าคอมต่อคัน", 12, ""), ("โบนัสต่อรีวิว 5 ดาว", 12, ""), ("จำนวนรีวิว 5 ดาว", 11, ""),
          ("ลีดที่ดูแล", 10, "calc"), ("ปิดดีล", 9, "calc"), ("อัตราปิด", 9, "calc"),
          ("นาทีตอบเฉลี่ย", 10, "calc"), ("ค่าคอมรวม", 12, "calc"), ("รายได้รวม (เดือนนี้โดยประมาณ)", 15, "calc")]
header(S, s_cols)
st = col["สถานะ"]; sa = col["ผู้ช่วยขาย"]; rt = col["นาทีที่ตอบครั้งแรก"]
for r in range(2, 32):
    S[f"G{r}"] = f'=IF($A{r}="","",COUNTIF(\'ลีด\'!${sa}:${sa},$A{r}))'
    S[f"H{r}"] = f'=IF($A{r}="","",COUNTIFS(\'ลีด\'!${sa}:${sa},$A{r},\'ลีด\'!${st}:${st},"8 ปิดดีล"))'
    S[f"I{r}"] = f'=IF(OR($A{r}="",G{r}=0),"",H{r}/G{r})'
    S[f"J{r}"] = f'=IF($A{r}="","",IFERROR(AVERAGEIFS(\'ลีด\'!${rt}:${rt},\'ลีด\'!${sa}:${sa},$A{r}),""))'
    S[f"K{r}"] = f'=IF($A{r}="","",H{r}*D{r}+F{r}*E{r})'
    S[f"L{r}"] = f'=IF($A{r}="","",C{r}+K{r})'
    for k in "CDEKL": S[f"{k}{r}"].number_format = "#,##0"
    S[f"I{r}"].number_format = "0%"; S[f"J{r}"].number_format = "0"
    for i in range(1, 13):
        c = S.cell(row=r, column=i); c.font = base; c.border = box
        if s_cols[i-1][2] == "calc": c.fill = calc_fill
        elif i in (3, 4, 5, 6): c.font = input_font
S["A33"] = "หมายเหตุ: ค่าคอมรวมนับจากดีลทั้งหมดในไฟล์ ถ้าจะคิดรายเดือนให้แยกไฟล์/ชีตต่อเดือน หรือกรองตามวันที่โอน"; S["A33"].font = Font(name=F, italic=True, color="5B6474")

# ---------------- 5. คำนวณกำไรต่อคัน ----------------
U = wb.create_sheet("คำนวณกำไรต่อคัน")
U.sheet_view.showGridLines = False
U.column_dimensions["A"].width = 46; U.column_dimensions["B"].width = 16; U.column_dimensions["C"].width = 52
U["A1"] = "เครื่องคิดกำไรต่อคัน — รถไว"; U["A1"].font = title
U["A2"] = "ตัวเลขสีน้ำเงิน = ใส่เอง (ตอนนี้เป็นตัวเลขสมมติ) / ตัวเลขสีดำบนพื้นเทา = คำนวณอัตโนมัติ"; U["A2"].font = Font(name=F, italic=True, color="5B6474")
rows = [
    ("ข้อมูลรายได้", None, None, "sec"),
    ("ค่าบริการที่เก็บจากเต็นท์ต่อคัน (บาท)", 5000, "ตกลงกับเต็นท์ เช่น เหมาจ่ายต่อคัน", "in"),
    ("ต้นทุนผันแปรต่อคัน", None, None, "sec"),
    ("ค่าคอมผู้ช่วยขายต่อคัน (บาท)", 1500, "จ่ายเฉพาะคันที่ปิดได้", "in"),
    ("ค่าเดินทาง/ค่าใช้จ่ายหน้างานต่อคัน (บาท)", 500, "ไปตรวจรถ + วันโอน", "in"),
    ("ค่าโฆษณาต่อ 1 ลีด (บาท)", 150, "ดูจาก Google Ads / FB Ads", "in"),
    ("อัตราปิดดีล (ลีด → ขายได้)", 0.10, "เช่น 10 ลีดปิดได้ 1 คัน = 10%", "inpct"),
    ("สัดส่วนดีลที่มาจากพาร์ทเนอร์แนะนำ", 0.20, "เซลส์โชว์รูม/อู่/ตัวแทนประกัน", "inpct"),
    ("ค่าแนะนำพาร์ทเนอร์ต่อคัน (บาท)", 1000, "จ่ายเฉพาะดีลที่พาร์ทเนอร์แนะนำ", "in"),
    ("ค่าใช้จ่ายคงที่ต่อเดือน", None, None, "sec"),
    ("ฐานเงินเดือนผู้ช่วยขายรวม (บาท/เดือน)", 0, "ช่วงแรกคุณทำเองใส่ 0 ได้", "in"),
    ("สำนักงานบัญชี (บาท/เดือน)", 0, "ถ้ายังไม่ได้จ้างใส่ 0", "in"),
    ("เครื่องมือ/อื่นๆ (LINE OA, เว็บ, โทรศัพท์) (บาท/เดือน)", 1000, "", "in"),
    ("เป้าหมายจำนวนคันต่อเดือน", 10, "", "in"),
    ("ผลลัพธ์ต่อคัน", None, None, "sec"),
    ("ค่าโฆษณาต่อ 1 คันที่ปิดได้", "=IFERROR(B8/B9,0)", "ค่าโฆษณาต่อลีด ÷ อัตราปิด", "calc"),
    ("ค่าแนะนำพาร์ทเนอร์เฉลี่ยต่อคัน", "=B10*B11", "", "calc"),
    ("ต้นทุนผันแปรรวมต่อคัน", "=B6+B7+B18+B19", "", "calc"),
    ("กำไรขั้นต้นต่อคัน", "=B4-B20", "ถ้าติดลบ = ยิ่งขายยิ่งขาดทุน", "calcbig"),
    ("ผลลัพธ์ต่อเดือน", None, None, "sec"),
    ("รายได้ต่อเดือน", "=B4*B16", "", "calc"),
    ("ต้นทุนคงที่ต่อเดือน", "=B13+B14+B15", "", "calc"),
    ("กำไรสุทธิต่อเดือน (ก่อนภาษี)", "=B21*B16-B24", "", "calcbig"),
    ("จำนวนลีดที่ต้องการต่อเดือน", "=IFERROR(B16/B9,0)", "เพื่อให้ได้ตามเป้าคัน", "calc"),
    ("งบโฆษณาที่ต้องใช้ต่อเดือน", "=B26*B8", "", "calc"),
    ("จุดคุ้มทุน (คันต่อเดือน)", '=IF(B21<=0,"ไม่คุ้มทุน — ปรับราคา/ต้นทุน",ROUNDUP(B24/B21,0))', "ขายต่ำกว่านี้ = ขาดทุน", "calcbig"),
]
r0 = 3
for i, (label, val, note, kind) in enumerate(rows):
    r = r0 + i
    a = U.cell(row=r, column=1, value=label); b = U.cell(row=r, column=2, value=val); c = U.cell(row=r, column=3, value=note)
    a.font = base; c.font = Font(name=F, color="5B6474", size=10)
    if kind == "sec":
        a.font = Font(name=F, bold=True, color="FFFFFF"); 
        for cc in (a, b, c): cc.fill = PatternFill("solid", fgColor=NAVY)
        continue
    b.border = box; a.border = box
    if kind in ("in", "inpct"):
        b.font = input_font; b.fill = PatternFill("solid", fgColor="FFFFFF")
        b.number_format = "0%" if kind == "inpct" else "#,##0"
    else:
        b.fill = calc_fill; b.number_format = "#,##0"
        b.font = Font(name=F, bold=(kind == "calcbig"), size=13 if kind == "calcbig" else 11)
        if kind == "calcbig": a.font = bold
# sanity: ensure row refs match labels
assert U["A4"].value.startswith("ค่าบริการ") and U["A6"].value.startswith("ค่าคอม") and U["A9"].value.startswith("อัตราปิด")
assert U["A16"].value.startswith("เป้าหมาย") and U["A21"].value.startswith("กำไรขั้นต้น") and U["A24"].value.startswith("ต้นทุนคงที่")
assert U["A26"].value.startswith("จำนวนลีด")
U.conditional_formatting.add("B21", CellIsRule(operator="lessThan", formula=["0"], font=Font(color="D32F2F", bold=True)))
U.conditional_formatting.add("B25", CellIsRule(operator="lessThan", formula=["0"], font=Font(color="D32F2F", bold=True)))

# Scenario table: fee per car x close rate -> profit per car
sr = r0 + len(rows) + 2
U.cell(row=sr, column=1, value="ตารางจำลอง: กำไรต่อคัน ตาม \"ค่าบริการต่อคัน\" (แถว) × \"อัตราปิดดีล\" (คอลัมน์)").font = bold
rates = [0.05, 0.08, 0.10, 0.15, 0.20]
fees = [2000, 3000, 4000, 5000, 7000, 10000]
U.cell(row=sr+1, column=1, value="ค่าบริการต่อคัน ↓ / อัตราปิด →").font = bold
for j, rt_ in enumerate(rates):
    c = U.cell(row=sr+1, column=2+j, value=rt_); c.number_format = "0%"; c.font = input_font; c.border = box
for i, fee in enumerate(fees):
    rr = sr + 2 + i
    a = U.cell(row=rr, column=1, value=fee); a.number_format = "#,##0"; a.font = input_font; a.border = box
    for j in range(len(rates)):
        cl = get_column_letter(2 + j)
        f = f"=$A{rr}-($B$6+$B$7+$B$8/{cl}${sr+1}+$B$10*$B$11)"
        c = U.cell(row=rr, column=2+j, value=f); c.number_format = "#,##0"; c.border = box; c.fill = calc_fill; c.font = base
for j in range(len(rates)):
    U.column_dimensions[get_column_letter(2+j)].width = 16
end = f"B{sr+2}:{get_column_letter(1+len(rates))}{sr+1+len(fees)}"
U.conditional_formatting.add(end, CellIsRule(operator="lessThan", formula=["0"], fill=PatternFill("solid", fgColor="FFE1E1")))
U.conditional_formatting.add(end, CellIsRule(operator="greaterThanOrEqual", formula=["0"], fill=PatternFill("solid", fgColor="E3F8EA")))

# ---------------- 6. แดชบอร์ด ----------------
K = wb.create_sheet("แดชบอร์ด", 1)
K.sheet_view.showGridLines = False
K.column_dimensions["A"].width = 34; K.column_dimensions["B"].width = 16; K.column_dimensions["C"].width = 4
K.column_dimensions["D"].width = 24; K.column_dimensions["E"].width = 12; K.column_dimensions["F"].width = 12
K["A1"] = "แดชบอร์ดรถไว (อัปเดตอัตโนมัติจากชีตลีด)"; K["A1"].font = title
LS = "'ลีด'!"
A = f"{LS}$A$2:$A${N+1}"
ST = f"{LS}${st}$2:${st}${N+1}"
kp = [
    ("ลีดทั้งหมด", f'=COUNTA({A})', "#,##0"),
    ("ลีดเดือนนี้", f'=COUNTIFS({LS}$B$2:$B${N+1},">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1),{LS}$B$2:$B${N+1},"<"&EDATE(DATE(YEAR(TODAY()),MONTH(TODAY()),1),1))', "#,##0"),
    ("ปิดดีลทั้งหมด", f'=COUNTIF({ST},"8 ปิดดีล")', "#,##0"),
    ("อัตราปิดดีล", f'=IFERROR(B5/B3,0)', "0%"),
    ("ลีดที่กำลังดำเนินการ (สถานะ 1–7)", f'=COUNTA({A})-B5-COUNTIF({ST},"9 ไม่ขาย")-COUNTIF({ST},"10 ไม่ผ่านการตรวจ")', "#,##0"),
    ("ค่าบริการรวม (ดีลที่ปิด)", f'=SUMIFS({LS}${col["ค่าบริการที่เก็บ"]}$2:${col["ค่าบริการที่เก็บ"]}${N+1},{ST},"8 ปิดดีล")', "#,##0"),
    ("ค่าบริการค้างเก็บ", f'=SUMIFS({LS}${col["ค่าบริการที่เก็บ"]}$2:${col["ค่าบริการที่เก็บ"]}${N+1},{LS}${col["เก็บค่าบริการแล้ว"]}$2:${col["เก็บค่าบริการแล้ว"]}${N+1},"ไม่ใช่")', "#,##0"),
    ("นาทีตอบครั้งแรกเฉลี่ย", f'=IFERROR(AVERAGE({LS}${rt}$2:${rt}${N+1}),"-")', "0"),
    ("จำนวนเต็นท์ที่เสนอต่อคัน (เฉลี่ย)", f'=IFERROR(AVERAGEIF({LS}${col["จำนวนเต็นท์ที่เสนอ"]}$2:${col["จำนวนเต็นท์ที่เสนอ"]}${N+1},">0"),"-")', "0.0"),
    ("วันจากลีดถึงโอน (เฉลี่ย)", f'=IFERROR(AVERAGE({LS}${col["วันจากลีดถึงโอน"]}$2:${col["วันจากลีดถึงโอน"]}${N+1}),"-")', "0.0"),
]
for i, (lab, f, fmt) in enumerate(kp):
    r = 3 + i
    a = K.cell(row=r, column=1, value=lab); b = K.cell(row=r, column=2, value=f)
    a.font = base; a.border = box; b.border = box; b.fill = calc_fill; b.number_format = fmt
    b.font = Font(name=F, bold=True, size=13, color=BLUE)
assert K["A5"].value == "ปิดดีลทั้งหมด" and K["A3"].value == "ลีดทั้งหมด"
# pipeline by status
K["D2"] = "จำนวนลีดตามสถานะ"; K["D2"].font = bold
for i, s_ in enumerate(STATUSES):
    r = 3 + i
    K.cell(row=r, column=4, value=s_).font = base
    c = K.cell(row=r, column=5, value=f'=COUNTIF({ST},D{r})'); c.fill = calc_fill; c.font = bold
    for cc in (4, 5): K.cell(row=r, column=cc).border = box
# by channel
cr = 3 + len(STATUSES) + 2
K.cell(row=cr, column=4, value="ช่องทาง").font = bold
K.cell(row=cr, column=5, value="ลีด").font = bold
K.cell(row=cr, column=6, value="ปิดดีล").font = bold
CH = f"{LS}${col['ช่องทาง']}$2:${col['ช่องทาง']}${N+1}"
for i, ch in enumerate(CHANNELS):
    r = cr + 1 + i
    K.cell(row=r, column=4, value=ch).font = base
    c1 = K.cell(row=r, column=5, value=f'=COUNTIF({CH},D{r})')
    c2 = K.cell(row=r, column=6, value=f'=COUNTIFS({CH},D{r},{ST},"8 ปิดดีล")')
    for c in (c1, c2): c.fill = calc_fill; c.font = bold
    for cc in (4, 5, 6): K.cell(row=r, column=cc).border = box
K["A15"] = "เคล็ดลับ: ดูว่าช่องทางไหน \"ปิดดีล\" ได้มากที่สุด แล้วเพิ่มงบ/เวลาให้ช่องทางนั้น"; K["A15"].font = Font(name=F, italic=True, color="5B6474")

for w in wb.worksheets:
    w.sheet_properties.tabColor = {"คู่มือ": "9AA6BA", "แดชบอร์ด": ORANGE, "ลีด": BLUE, "ราคาเสนอ": BLUE,
                                    "เต็นท์": NAVY, "เซลส์": NAVY, "คำนวณกำไรต่อคัน": "06C755"}[w.title]
wb.active = 1
wb.save(OUT)
print("saved", OUT)
