"""Generate the diagram SVGs for project 04 (SurveyVoiceAI) and project 06 (mentor).
Usage (from the repo root): python3 scripts/generate-diagrams.py .
Overwrites public/projects/project-04/*.svg and project-06/*.svg. Every number is copied
from the source projects' records - update it there first. Project 06 diagrams are generic
(no thesis-specific examples)."""
import sys
from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(sys.argv[1])
W, H = 1600, 1000
FONT = "'Noto Sans TC','PingFang TC','Microsoft JhengHei',system-ui,sans-serif"
MONO = "ui-monospace,SFMono-Regular,Menlo,monospace"
INK, SOFT, MUTE = "#eef0ff", "#b7bcdb", "#8a90b4"


def frame(uid, a1, a2, body, label):
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="{escape(label)}">
<title>{escape(label)}</title>
<defs>
<linearGradient id="{uid}bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#070914"/><stop offset="1" stop-color="#0b1026"/></linearGradient>
<radialGradient id="{uid}glow" cx="0.78" cy="0.18" r="0.7"><stop offset="0" stop-color="{a1}" stop-opacity="0.22"/><stop offset="1" stop-color="{a1}" stop-opacity="0"/></radialGradient>
<radialGradient id="{uid}glow2" cx="0.1" cy="0.95" r="0.6"><stop offset="0" stop-color="{a2}" stop-opacity="0.16"/><stop offset="1" stop-color="{a2}" stop-opacity="0"/></radialGradient>
<linearGradient id="{uid}acc" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{a1}"/><stop offset="1" stop-color="{a2}"/></linearGradient>
</defs>
<rect width="{W}" height="{H}" fill="url(#{uid}bg)"/><rect width="{W}" height="{H}" fill="url(#{uid}glow)"/><rect width="{W}" height="{H}" fill="url(#{uid}glow2)"/>
<g font-family="{FONT}">
{body}
</g>
</svg>
"""


def t(x, y, s, size=28, fill=INK, weight=400, anchor="start", mono=False, op=1):
    fam = f' font-family="{MONO}"' if mono else ""
    return f'<text x="{x}" y="{y}" font-size="{size}" fill="{fill}" font-weight="{weight}" text-anchor="{anchor}" fill-opacity="{op}"{fam}>{escape(s)}</text>'


def box(x, y, w, h, stroke, fill_op=0.55, r=18, sw=1.5, dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="#10142b" fill-opacity="{fill_op}" stroke="{stroke}" stroke-opacity="0.75" stroke-width="{sw}"{d}/>'


def arrow(x1, y1, x2, y2, c):
    return (f'<path d="M{x1} {y1} L{x2} {y2}" stroke="{c}" stroke-width="2.5" stroke-opacity="0.8"/>'
            f'<path d="M{x2} {y2} l-12 -7 v14z" fill="{c}" fill-opacity="0.9"/>')


def header(eyebrow, title, a1, sub=None):
    s = t(100, 120, eyebrow, 22, a1, 600, mono=True) + t(100, 182, title, 50, INK, 700)
    if sub:
        s += t(100, 232, sub, 26, SOFT)
    return s


def footer(note):
    return t(100, 950, note, 20, MUTE)


def write(path, svg):
    p = ROOT / path
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(svg, encoding="utf-8")
    print("wrote", p.relative_to(ROOT))


# ───────────────────────── SurveyVoiceAI (project 04) ─────────────────────────
A1, A2 = "#F5C451", "#FF7A59"
B4 = "public/projects/project-04"


def svai_cover():
    b = []
    # waveform
    import math
    pts = []
    for i in range(0, 121):
        x = 120 + i * 6.5
        amp = 150 * abs(math.sin(i * 0.21)) * (0.35 + 0.65 * abs(math.sin(i * 0.047)))
        pts.append((x, amp))
    for x, a in pts:
        b.append(f'<rect x="{x:.1f}" y="{500 - a / 2:.1f}" width="3.4" height="{max(a, 4):.1f}" rx="1.7" fill="url(#cvacc)" fill-opacity="0.85"/>')
    # questionnaire card
    b.append(box(1000, 250, 480, 520, A1))
    b.append(t(1040, 310, "逐題比對", 24, A1, 600, mono=False))
    rows = [("Q12 訪員登錄", "3", "#8a90b4"), ("Q12 錄音判讀", "3", "#7CF0B4"), ("Q13 訪員登錄", "1", "#8a90b4"), ("Q13 錄音判讀", "4", A2)]
    y = 370
    for label, code, c in rows:
        b.append(t(1040, y, label, 26, SOFT))
        b.append(f'<rect x="1360" y="{y - 30}" width="72" height="42" rx="10" fill="{c}" fill-opacity="0.18" stroke="{c}" stroke-opacity="0.8"/>')
        b.append(t(1396, y, code, 26, INK, 700, "middle", mono=True))
        y += 78
    b.append(f'<path d="M1040 {y - 20} H1440" stroke="#fff" stroke-opacity="0.12"/>')
    b.append(f'<rect x="1040" y="{y + 4}" width="400" height="64" rx="14" fill="{A2}" fill-opacity="0.16" stroke="{A2}" stroke-opacity="0.8"/>')
    b.append(t(1240, y + 46, "⚑ Q13 不一致 → 排入複聽", 26, INK, 600, "middle"))
    b.append(arrow(920, 500, 985, 500, A1))
    b.append(t(120, 170, "SURVEYVOICEAI · INTERVIEWER QA", 24, A1, 600, mono=True))
    b.append(t(120, 240, "從錄音裡，找出訪員登錄錯的那一題", 52, INK, 700))
    b.append(t(120, 850, "電訪錄音 → 語音辨識 → 逐題判讀 → 與訪員登錄比對 → 複聽清單", 28, SOFT))
    b.append(footer("全程本機執行 · 受訪者資料不出機器 · 本圖為示意，代碼為虛構"))
    return frame("cv", A1, A2, "\n".join(b), "SurveyVoiceAI 封面：錄音波形與問卷逐題比對示意")


def svai_pipeline():
    b = [header("WORKFLOW · INTERVIEWER QA", "一通錄音怎麼變成一份複聽清單", A1, "實際運作的流程（2026-10）")]
    steps = [
        ("讀取錄音", "NAS 錄音庫", "不存到硬碟"),
        ("語音辨識", "Breeze-ASR-26", "轉成逐字稿"),
        ("切出每一題", "依題目開始時間", "前後各 90 秒"),
        ("判讀答案", "微調後的 Kev-9B", "受訪者選了哪一項"),
        ("比對與排序", "vs 訪員登錄", "產生複聽清單"),
    ]
    x, y, w, h, gap = 100, 330, 248, 250, 32
    for i, (a, b1, c) in enumerate(steps):
        xx = x + i * (w + gap)
        col = A1 if i < 4 else A2
        b.append(box(xx, y, w, h, col))
        b.append(t(xx + 24, y + 48, f"0{i + 1}", 22, col, 600, mono=True))
        b.append(t(xx + 24, y + 104, a, 34, INK, 700))
        b.append(t(xx + 24, y + 160, b1, 24, SOFT))
        b.append(t(xx + 24, y + 200, c, 22, MUTE))
        if i < 4:
            b.append(arrow(xx + w + 4, y + h / 2, xx + w + gap - 4, y + h / 2, A1))
    b.append(box(100, 650, 1400, 190, "#8a90b4", 0.35, dash="8 8"))
    b.append(t(140, 705, "資料邊界", 26, A1, 700))
    lines = [
        "受訪者可以被辨識身分：錄音、逐字稿與模型都只在本機的單張 V100S 上，不送到任何雲端服務。",
        "標註頁與督導看板只在本機開放並需要通行碼；Claude Code 處理受訪者資料時只看結構、不顯示內容。",
        "輸出是排序好的複聽清單，由督導做最終判定。",
    ]
    for i, l in enumerate(lines):
        b.append(t(140, 755 + i * 38, "· " + l, 24, SOFT))
    b.append(footer("來源：SurveyVoiceAI CLAUDE.md〈Current status〉、ticket 13 / 14 / 15 / 16"))
    return frame("pl", A1, A2, "\n".join(b), "SurveyVoiceAI 流程圖：讀取錄音、語音辨識、切出每一題、判讀答案、比對與排序")


def svai_results():
    b = [header("MEASUREMENT · STAGE-1 FINE-TUNE", "一致率提高了，正確率不一定", A1, "單選題；測試集已排除無效通話（STATUS.md 2026-10-14）")]
    # left: agreement bars
    b.append(t(100, 320, "與訪員登錄的一致率（%）", 26, INK, 600))
    data = [("看過的問卷 · n=4,209", 82.3, 88.6), ("沒看過的問卷 · n=4,281", 81.6, 86.9)]
    x0, scale = 100, 7.6  # 70% -> 0
    for i, (lab, zs, ft) in enumerate(data):
        y = 370 + i * 190
        b.append(t(x0, y, lab, 22, SOFT))
        for j, (name, v, c) in enumerate([("未訓練", zs, "#8a90b4"), ("微調後", ft, A1)]):
            yy = y + 22 + j * 64
            wbar = (v - 70) * scale * 2.4
            b.append(f'<rect x="{x0}" y="{yy}" width="{wbar:.0f}" height="44" rx="8" fill="{c}" fill-opacity="{0.35 if j == 0 else 0.85}"/>')
            b.append(t(x0 + 14, yy + 31, name, 20, "#04050b" if j else INK, 600))
            b.append(t(x0 + wbar + 14, yy + 32, f"{v:.1f}", 26, INK, 700, mono=True))
    b.append(t(x0, 790, "橫軸自 70% 起算", 18, MUTE))
    # right: pilot truth accuracy with CI
    rx = 860
    b.append(t(rx, 320, "試點真實正確率（25 通，95% CI）", 26, INK, 600))
    lo, hi = 75, 100
    axw = 400
    px = lambda v: rx + (v - lo) / (hi - lo) * axw
    rows = [("未訓練", 85.9, 80.1, 90.5, "#8a90b4"), ("微調後", 89.6, 83.4, 94.0, A1), ("訪員自己", 92.7, 87.4, 96.6, A2)]
    for i, (name, m, l, h, c) in enumerate(rows):
        y = 420 + i * 110
        b.append(t(rx, y - 30, name, 22, SOFT))
        b.append(f'<path d="M{px(l):.0f} {y} H{px(h):.0f}" stroke="{c}" stroke-width="5" stroke-linecap="round" stroke-opacity="0.8"/>')
        b.append(f'<circle cx="{px(m):.0f}" cy="{y}" r="11" fill="{c}"/>')
        b.append(t(px(h) + 16, y + 9, f"{m}  [{l}, {h}]", 22, INK, 500, mono=True))
    for v in (75, 80, 85, 90, 95, 100):
        b.append(f'<path d="M{px(v):.0f} 730 v10" stroke="{MUTE}"/>')
        b.append(t(px(v), 768, str(v), 18, MUTE, anchor="middle", mono=True))
    b.append(f'<path d="M{rx} 730 H{rx + axw}" stroke="{MUTE}" stroke-opacity="0.6"/>')
    b.append(box(100, 830, 1400, 80, A1, 0.3))
    b.append(t(130, 880, "三條區間全部重疊：25 通分不出高下。一致率的提升約是真實正確率提升的 2 倍以上——一致率高 ≠ 正確率高。", 23, INK))
    b.append(footer("來源：SurveyVoiceAI .scratch/survey-voice-ai/STATUS.md（數字以 ticket 16 為準）"))
    return frame("rs", A1, A2, "\n".join(b), "SurveyVoiceAI 量測結果：一致率與試點真實正確率的信賴區間比較")


def svai_baserate():
    b = [header("DESIGN TARGET · TICKET 13", "警示的價值由基礎率決定", A1, "假設訪員真實錯誤率 2%、偵測靈敏度 90%，每 10,000 題")]
    cols = [("偵測特異度", 160), ("真陽性", 520), ("假陽性", 760), ("警示可信度（PPV）", 1000)]
    for name, x in cols:
        b.append(t(x, 330, name, 24, MUTE, 600))
    rows = [("95%", "180", "490", 26.9), ("99%", "180", "98", 64.7), ("99.9%", "180", "9.8", 94.8)]
    for i, (sp, tp, fp, ppv) in enumerate(rows):
        y = 420 + i * 120
        b.append(f'<path d="M100 {y - 60} H1500" stroke="#fff" stroke-opacity="0.08"/>')
        b.append(t(160, y, sp, 40, INK, 700, mono=True))
        b.append(t(520, y, tp, 36, SOFT, mono=True))
        b.append(t(760, y, fp, 36, A2 if i == 0 else SOFT, 600 if i == 0 else 400, mono=True))
        b.append(f'<rect x="1000" y="{y - 36}" width="{ppv * 4.2:.0f}" height="46" rx="8" fill="{A1}" fill-opacity="{0.35 + ppv / 200:.2f}"/>')
        b.append(t(1000 + ppv * 4.2 + 14, y, f"{ppv}%", 32, INK, 700, mono=True))
    b.append(box(100, 760, 1400, 130, A2, 0.3))
    b.append(t(140, 815, "95% 特異度的偵測器，發出的警示有 73% 是誤報，督導幾週內就不會再看。", 26, INK, 600))
    b.append(t(140, 860, "→ 改做複聽清單：只調整督導本來就在做的抽聽順序，督導的確認與駁回再拿來改進模型。", 24, SOFT))
    b.append(footer("來源：SurveyVoiceAI ticket 13〈Objection 1 — the base rate decides the product〉"))
    return frame("br", A1, A2, "\n".join(b), "SurveyVoiceAI 基礎率試算：特異度與警示可信度的關係")


def svai_silent():
    b = [header("ANOMALY · 141 UNREADABLE CALLS", "逐字稿幾乎是空的，原因不在模型", A1, "第一階段 1,911 通裡，141 通被判為無效通話；先量訊號，再查撥號紀錄")]
    steps = [
        ("ASR 現象", "每分鐘中位數 28 字", "正常通話 162 字"),
        ("量音量", "123 通每一秒都 < −50 dBFS", "正常通話 RMS 中位數 −17.4"),
        ("查撥號紀錄", "123 通案件裡沒有「開始撥號」", "同專案正常通話 168/176 有"),
    ]
    for i, (a, b1, c) in enumerate(steps):
        x = 100 + i * 480
        b.append(box(x, 320, 440, 260, A1 if i < 2 else A2))
        b.append(t(x + 32, 380, f"0{i + 1}  {a}", 30, INK, 700))
        b.append(t(x + 32, 450, b1, 26, A1 if i < 2 else A2, 600))
        b.append(t(x + 32, 500, c, 22, MUTE))
        if i < 2:
            b.append(arrow(x + 444, 450, x + 476, 450, A1))
    b.append(t(100, 680, "結論與產品面", 28, INK, 700))
    lines = [
        "ASR 吐出的字是解碼器對著靜音產生的；這類錄音用訊號就能在 ASR 之前一秒內抓到，不必等 GPU。",
        "主體是面訪／測試資料事後鍵入、錄音機剛好在跑；剩下的個案由開發者決定處理方式。",
        "量測腳本直接以 NAS 串流讀檔、不落地；141 通 201 秒跑完。",
    ]
    for i, l in enumerate(lines):
        b.append(t(100, 735 + i * 44, "· " + l, 23, SOFT))
    b.append(footer("來源：SurveyVoiceAI STATUS.md〈已查明的異常〉；專案名稱與訪員編號不公開"))
    return frame("sl", A1, A2, "\n".join(b), "SurveyVoiceAI 無效通話調查：ASR、音量、撥號紀錄三步驟")



def svai_collab():
    b = [header("HOW IT WAS BUILT · HUMAN × CLAUDE CODE", "人定方向，Claude Code 給證據與執行", A1, "每個重大決策：人提出 → AI 查證並列出選項 → 人拍板 → AI 實作與量測")]
    cols = [
        (100, "開發者", "目標 · 構想 · 決策", A2, [
            "提出目標：每一通錄音都要被稽核",
            "設定門檻：警示要有 70% 可信度",
            "現場觀察：訪員會口頭確認選項",
            "親耳複聽：抓出閩南語被轉成國語",
            "拍板：複聽清單、資料不出本機",
        ]),
        (840, "Claude Code · 資深工程師", "資料證據 · 技術選項 · 執行", A1, [
            "試算：特異度 95% 時只有 26.9% 警示為真",
            "三個選項 × 七個面向的比較表",
            "量測錄音格式、確認題目時間對得上",
            "找出聽不清錄音的指標、統一簡繁字",
            "模型訓練與評估、標註頁與督導看板",
        ]),
    ]
    for x, who, role, c, items in cols:
        b.append(box(x, 300, 660, 520, c))
        b.append(t(x + 40, 365, who, 34, INK, 700))
        b.append(t(x + 40, 410, role, 24, c, 600))
        b.append(f'<path d="M{x + 40} 440 H{x + 620}" stroke="#fff" stroke-opacity="0.1"/>')
        for i, it in enumerate(items):
            y = 495 + i * 66
            b.append(f'<circle cx="{x + 52}" cy="{y - 8}" r="6" fill="{c}"/>')
            b.append(t(x + 74, y, it, 24, SOFT))
    b.append(arrow(770, 520, 830, 520, A1))
    b.append(f'<path d="M830 600 L770 600" stroke="{A2}" stroke-width="2.5" stroke-opacity="0.8"/><path d="M770 600 l12 -7 v14z" fill="{A2}"/>')
    b.append(t(800, 500, "需求", 18, MUTE, anchor="middle"))
    b.append(t(800, 640, "證據", 18, MUTE, anchor="middle"))
    b.append(t(100, 880, "每個決策都寫成紀錄文件；沒有可靠出處的數字標明「缺口」，量測一律附方法與樣本數。", 24, INK))
    b.append(footer("來源：SurveyVoiceAI CLAUDE.md、ticket 13 / 14 / 15、STATUS.md"))
    return frame("cb", A1, A2, "\n".join(b), "人機分工圖：開發者提供目標、構想與決策，Claude Code 提供資料證據、技術選項與執行")


# ───────────────────────── mentor (project 06) ─────────────────────────
# Generic content only: the showcase must not use the author's own thesis as the example.
M1, M2 = "#E9D8A6", "#8B7CFF"
B6 = "public/projects/project-06"
GOOD, BAD = "#7CF0B4", "#FF7A59"


def mentor_cover():
    b = [t(120, 170, "MENTOR · A CLAUDE CODE SKILL", 24, M1, 600, mono=True),
         t(120, 240, "先問後講：讓 AI 當你的論文導師", 52, INK, 700)]
    pillars = [("先問後講", "AI 先請你預測、解釋或比較", "最後才整理重點"),
               ("隔一段時間再考", "沒有提示仍答得出來", "才算真的會"),
               ("每句話都找得到出處", "wiki 每段都標明", "頁碼、圖號或公式編號")]
    for i, (h, l1, l2) in enumerate(pillars):
        y = 320 + i * 170
        b.append(box(120, y, 560, 140, M2, 0.45))
        b.append(t(150, y + 52, f"0{i + 1}", 22, M1, 600, mono=True))
        b.append(t(210, y + 54, h, 32, INK, 700))
        b.append(t(210, y + 98, f"{l1}，{l2}", 22, SOFT))
    import math
    cx, cy = 1140, 560
    nodes = [(cx, cy, "核心論文", "deep", M1, 56),
             (cx - 260, cy - 190, "背景理論", "middle", M2, 50), (cx + 260, cy - 190, "研究方法", "middle", M2, 50),
             (cx - 280, cy + 170, "相關研究", "draft", MUTE, 44), (cx + 280, cy + 170, "相關研究", "draft", MUTE, 44),
             (cx, cy + 290, "下一篇要讀的", "", MUTE, 26)]
    for x, y, _l, _t, c, r in nodes[1:]:
        d = math.hypot(x - cx, y - cy); ux, uy = (x - cx) / d, (y - cy) / d
        dash = ' stroke-dasharray="6 8"' if not _t else ""
        b.append(f'<path d="M{cx + ux * 66:.0f} {cy + uy * 66:.0f} L{x - ux * (r + 10):.0f} {y - uy * (r + 10):.0f}" stroke="{M1}" stroke-opacity="0.45" stroke-width="2"{dash}/>')
    for x, y, lab, tier, c, r in nodes:
        b.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{c}" fill-opacity="0.18" stroke="{c}" stroke-opacity="0.9" stroke-width="2"/>')
        if tier:
            b.append(t(x, y + 7, tier, 19 if r < 56 else 24, INK, 700, "middle", mono=True))
        ly = y - r - 18 if y < cy else y + r + 34
        if (x, y) == (cx, cy):
            ly = y - r - 18
        b.append(t(x, ly, lab, 22, INK if c != MUTE else SOFT, 500, "middle"))
    b.append(footer("圓點＝wiki 頁，依重要程度分成 draft／middle／deep；虛線＝已被引用、還沒寫的頁"))
    return frame("mc", M1, M2, "\n".join(b), "mentor 封面：三個核心做法與個人論文 wiki 的知識網示意")


# Slide palette from ../Thesis/report/wikillm_report.marp.md (slides 4 and 6).
CREAM, CREAM_L, BR_D, BR_M, BR_L, RUST = "#F2ECDF", "#FAF5EB", "#2C1D12", "#6B4C33", "#B89B7A", "#A83A2E"


def cream_frame(body, label):
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="{escape(label)}">
<title>{escape(label)}</title>
<rect width="{W}" height="{H}" fill="{CREAM}"/>
<g font-family="{FONT}">
{body}
</g>
</svg>
"""


def icon(kind, x, y, c=BR_D):
    """24x24-grid line icon scaled 2.4x, centred on (x, y)."""
    paths = {
        "person": '<circle cx="12" cy="7" r="4"/><path d="M4 22v-3a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v3z"/>',
        "dna": '<path d="M7 2c0 6 10 8 10 14s-2 6-2 6M17 2c0 6-10 8-10 14s2 6 2 6"/><path d="M8.5 6h7M9 10h6M9 15h6M8.5 19h7"/>',
        "calc": '<rect x="5" y="2" width="14" height="20" rx="2"/><rect x="8" y="5" width="8" height="4"/><path d="M8.5 13h1M12 13h1M15 13h.5M8.5 17h1M12 17h1M15 17h.5"/>',
        "net": '<circle cx="4" cy="7" r="2"/><circle cx="4" cy="17" r="2"/><circle cx="12" cy="4" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="20" r="2"/><circle cx="20" cy="12" r="2"/><path d="M6 7l4-3M6 7l4 5M6 17l4-5M6 17l4 3M14 4l4 7M14 12h4M14 20l4-7"/>',
        "chat": '<path d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H10l-5 4v-4H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/><path d="M8 10.5h.5M12 10.5h.5M16 10.5h.5" stroke-width="2.4"/>',
        "scatter": '<path d="M3 3v18h18"/><path d="M8 15h.5M11 11h.5M14 13h.5M16 7h.5M19 9h.5M10 17h.5" stroke-width="2.6"/>',
        "bars": '<path d="M5 20v-5M10 20v-8M15 20v-11M20 20v-16" stroke-width="3"/>',
        "target": '<circle cx="11" cy="13" r="9"/><circle cx="11" cy="13" r="5"/><circle cx="11" cy="13" r="1"/><path d="M11 13l9-9M17 4h3v3"/>',
        "search": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h5"/><path d="M14 2l5 5h-5z"/><circle cx="15" cy="15" r="3.5"/><path d="M17.5 17.5L21 21"/>',
        "doc": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8M8 9h3"/>',
        "graph": '<circle cx="12" cy="5" r="2.5"/><circle cx="12" cy="13" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M12 7.5v3M10 15l-3.2 2.4M14 15l3.2 2.4"/>',
        "check": '<circle cx="12" cy="12" r="10"/><path d="M7.5 12.5l3 3 6-6"/>',
        "list": '<path d="M9 6h12M9 12h12M9 18h12"/><path d="M3.5 5l1-1v4M3 11.2a1 1 0 1 1 1.6 1L3 14h2M3 17h2l-1 1.2a1 1 0 1 1-1 1.3"/>',
        "ask": '<path d="M2 3h10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H6l-3 2.5V11H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M12 15c2-1.3 4.5-1.3 5.5 0c1-1.3 3.5-1.3 5.5 0v7c-2-1.3-4.5-1.3-5.5 0c-1-1.3-3.5-1.3-5.5 0z"/><path d="M17.5 15v7"/>',
        "quiz": '<circle cx="12" cy="12" r="10"/><path d="M9.2 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4.5"/><path d="M12 18h.5" stroke-width="2.6"/>',
        "cycle": '<path d="M20 11a8 8 0 0 0-14.5-4.5L3 9"/><path d="M3 4v5h5"/><path d="M4 13a8 8 0 0 0 14.5 4.5L21 15"/><path d="M21 20v-5h-5"/>',
    }
    return (f'<g transform="translate({x - 28.8:.1f} {y - 28.8:.1f}) scale(2.4)" fill="none" stroke="{c}" '
            f'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">{paths[kind]}</g>')


def mentor_arch():
    """Remake of report slide 4: mentor -> domain -> subject. Subjects are generic."""
    cx, cy, rx, ry, r = 760, 528, 400, 262, 92
    b = [t(800, 92, "LLM WIKI 架構", 60, BR_D, 800, "middle"),
         t(800, 136, "LLM WIKI ARCHITECTURE", 20, BR_M, 600, "middle")]
    b.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="none" stroke="{BR_M}" stroke-width="2" stroke-dasharray="8 9" opacity="0.7"/>')
    import math
    domains = [(-90, "dna", "生物資訊", "bioinformatics"), (-30, "calc", "數學方法", "math_methods"),
               (30, "net", "深度學習", "deep_learning"), (90, "chat", "大型語言模型", "llm"),
               (150, "scatter", "機器學習", "machine_learning"), (210, "bars", "統計", "statistics")]
    pos = {}
    for ang, ic, zh, en in domains:
        a = math.radians(ang)
        x, y = cx + rx * math.cos(a), cy + ry * math.sin(a)
        pos[en] = (x, y)
        ux, uy = math.cos(a), math.sin(a)
        b.append(f'<path d="M{cx + 130 * ux:.0f} {cy + 130 * uy:.0f} L{x - (r + 4) * ux:.0f} {y - (r + 4) * uy:.0f}" stroke="{BR_D}" stroke-width="3"/>')
        b.append(f'<circle cx="{x - (r + 4) * ux:.0f}" cy="{y - (r + 4) * uy:.0f}" r="7" fill="{BR_D}"/>')
    for ang, ic, zh, en in domains:
        x, y = pos[en]
        b.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{r}" fill="{CREAM_L}" stroke="{BR_L}" stroke-width="2.5"/>')
        b.append(icon(ic, x, y - 26))
        b.append(t(x, y + 34, zh, 23, BR_D, 700, "middle"))
        b.append(t(x, y + 60, en, 13, BR_M, 600, "middle", mono=True))
    b.append(f'<circle cx="{cx}" cy="{cy}" r="130" fill="{BR_D}"/>')
    b.append(icon("person", cx, cy - 58, CREAM_L))
    b.append(t(cx, cy + 22, "Mentor", 50, CREAM_L, 800, "middle"))
    b.append(t(cx, cy + 62, "導師：引導學習與研究", 21, CREAM, 500, "middle"))
    subjects = [("bioinformatics", "論文主題", 1), ("math_methods", "專題研究", 1), ("deep_learning", "課程筆記", 1)]
    for dom, name, side in subjects:
        x, y = pos[dom]
        bx = x + r + 56
        b.append(f'<path d="M{x + r:.0f} {y:.0f} H{bx:.0f}" stroke="{BR_D}" stroke-width="3"/>')
        b.append(f'<circle cx="{x + r:.0f}" cy="{y:.0f}" r="7" fill="{BR_D}"/><circle cx="{bx:.0f}" cy="{y:.0f}" r="7" fill="{BR_D}"/>')
        b.append(f'<rect x="{bx:.0f}" y="{y - 40:.0f}" width="190" height="76" rx="10" fill="{CREAM_L}" stroke="{BR_L}" stroke-width="2"/>')
        b.append(t(bx + 95, y - 12, "subject", 17, BR_M, 500, "middle"))
        b.append(t(bx + 95, y + 22, name, 25, BR_D, 700, "middle"))
    b.append(t(800, 940, "導師  →  領域 domain  →  主題 subject", 28, BR_D, 700, "middle"))
    return cream_frame("\n".join(b), "LLM Wiki 架構：導師在中心，連到六個領域，每個領域底下再放具體的主題")


def mentor_workflow():
    """Remake of report slide 6: build phase, absorb phase, and the loop between them."""
    b = [t(800, 92, "建立 LLM Wiki 的流程", 58, BR_D, 800, "middle"),
         t(800, 140, "兩個階段，一個循環 · Two phases, one loop", 26, BR_M, 400, "middle")]
    r, y1, y2 = 104, 355, 680
    xs = [230, 530, 830, 1130, 1430]
    row1 = [("target", "設定目標", "Set goal"), ("search", "搜尋與下載", "Search & download"),
            ("doc", "整理成筆記", "Summarize"), ("graph", "整合進 wiki", "Integrate"),
            ("check", "檢查出處", "Lint")]
    row2 = [("list", "安排閱讀順序", "Reading order"), ("ask", "提問並對照原文", "Ask & cross-check PDF"),
            ("quiz", "測驗", "Test (quiz)"), ("cycle", "複習", "Review")]

    def pill(x, y, s):
        return (f'<rect x="{x}" y="{y}" width="300" height="54" rx="6" fill="{BR_D}"/>'
                + t(x + 150, y + 36, s, 24, CREAM_L, 700, "middle"))

    def node(x, y, ic, zh, en):
        return (f'<circle cx="{x}" cy="{y}" r="{r}" fill="{CREAM_L}" stroke="{BR_D}" stroke-width="2.5"/>'
                + icon(ic, x, y - 28) + t(x, y + 30, zh, 21, BR_D, 700, "middle")
                + t(x, y + 55, en, 14, BR_M, 500, "middle"))

    def harrow(x1, x2, y):
        return (f'<path d="M{x1} {y} H{x2 - 4}" stroke="{BR_D}" stroke-width="2.5"/>'
                f'<path d="M{x2} {y} l-14 -7 v14z" fill="{BR_D}"/>')

    b.append(pill(60, 176, "Part 1 · 建立 Build"))
    b.append(pill(60, 508, "Part 2 · 吸收 Absorb"))
    for i, n in enumerate(row1):
        b.append(node(xs[i], y1, *n))
        if i < 4:
            b.append(harrow(xs[i] + r, xs[i + 1] - r, y1))
    for i, n in enumerate(row2):
        b.append(node(xs[i + 1], y2, *n))
        if i < 3:
            b.append(harrow(xs[i + 1] + r, xs[i + 2] - r, y2))
    b.append(f'<path d="M{xs[4]} {y1 + r} V{y2 - r - 4}" stroke="{BR_D}" stroke-width="2.5"/>'
             f'<path d="M{xs[4]} {y2 - r} l-7 -14 h14z" fill="{BR_D}"/>')
    b.append(f'<path d="M{xs[2] + 14} {y2 - r} C{xs[2] + 4} {y2 - 170} {xs[2] - 4} {y1 + 170} {xs[2]} {y1 + r + 14}" stroke="{RUST}" stroke-width="3" fill="none"/>'
             f'<path d="M{xs[2]} {y1 + r} l-8 15 h16z" fill="{RUST}"/>')
    b.append(t(xs[2] + 26, (y1 + y2) / 2 + 8, "發現摘要有誤，回頭修正", 19, RUST, 600))
    b.append(f'<path d="M{xs[4]} {y2 + r} C{xs[4] - 120} {y2 + 190} {xs[1] + 120} {y2 + 190} {xs[1] + 22} {y2 + r + 16}" stroke="{RUST}" stroke-width="3" fill="none"/>'
             f'<path d="M{xs[1] + 14} {y2 + r + 8} l17 2 l-9 13z" fill="{RUST}"/>')
    b.append(t(980, 935, "回到原文重新查證 · re-verify against source", 24, BR_M, 500, "middle"))
    return cream_frame("\n".join(b), "建立 LLM Wiki 的流程：第一階段建立（設定目標、搜尋與下載、整理成 Markdown、整合進 wiki、檢查），第二階段吸收（閱讀順序、提問並對照 PDF、測驗、複習），再回到原文重新查證")




def cream_title(title, sub):
    return (t(800, 92, title, 54, BR_D, 800, "middle")
            + t(800, 140, sub, 24, BR_M, 400, "middle"))


def mentor_ladder():
    b = [cream_title("六階提問：懂到哪裡，問到哪裡", "The Question Ladder · 以論文裡任一個核心概念 X 為例")]
    rungs = [
        ("閉卷寫出定義", "不看資料，寫出 X 的定義"),
        ("用白話解釋", "講給大學生聽：X 為什麼存在？少了它會怎樣？"),
        ("區分相近概念", "X 和最容易混淆的 Y 差在哪裡？"),
        ("情境應用", "遇到一個新情境，該不該用 X？怎麼用？"),
        ("說出何時失效", "在什麼條件下，X 會給出錯誤的結果？"),
        ("寫成論文中的一句話", "用一句經得起口試追問的話，說明 X 對你的研究"),
    ]
    for i, (zh, q) in enumerate(rungs):
        x, y, hi = 100 + i * 36, 196 + i * 106, i >= 4
        b.append(f'<rect x="{x}" y="{y}" width="1220" height="90" rx="10" fill="{CREAM_L}" stroke="{RUST if hi else BR_L}" stroke-width="{3 if hi else 2}"/>')
        b.append(f'<circle cx="{x + 52}" cy="{y + 45}" r="28" fill="{RUST if hi else BR_D}"/>')
        b.append(t(x + 52, y + 56, str(i + 1), 30, CREAM_L, 800, "middle"))
        b.append(t(x + 104, y + 55, zh, 27, BR_D, 700))
        b.append(t(x + 430, y + 54, q, 23, BR_D if hi else BR_M, 600 if hi else 400))
    b.append(t(800, 880, "第 5、6 層最能分辨「看過」和「真的懂」；卡在哪一層，就是下一步要補的地方。", 25, RUST, 700, "middle"))
    return cream_frame("\n".join(b), "六階提問：閉卷寫出定義、用白話解釋、區分相近概念、情境應用、說出何時失效、寫成論文中的一句話")


def mentor_tiers():
    b = [cream_title("每篇論文，依重要程度決定寫多深", "One paper, three depths · middle 包含 draft 的內容，deep 包含 middle 的內容")]
    tiers = [("draft", "doc", "相關研究", ["一句話定位", "摘要", "用途與產出", "核心主張", "與其他研究的差異"]),
             ("middle", "graph", "背景理論與方法", ["+ 方法與公式（附符號表）", "+ 圖表解讀", "+ 限制", "+ 如何驗證"]),
             ("deep", "search", "論文的核心依據", ["+ 每張圖逐格判讀", "+ 完整推導", "+ 寫作筆記", "+ 測驗題", "+ 原文逐字引用"])]
    bottom, w = 800, 420
    for i, (name, ic, use, items) in enumerate(tiers):
        x, top = 110 + i * (w + 50), 420 - i * 90
        dark = i == 2
        fg, sub = (CREAM_L, CREAM) if dark else (BR_D, BR_M)
        b.append(f'<rect x="{x}" y="{top}" width="{w}" height="{bottom - top}" rx="12" fill="{BR_D if dark else CREAM_L}" stroke="{BR_D if dark else BR_L}" stroke-width="2.5"/>')
        b.append(icon(ic, x + 64, top + 62, fg))
        b.append(t(x + 112, top + 62, name, 36, fg, 800, mono=True))
        b.append(t(x + 112, top + 96, f"適合：{use}", 21, sub, 600))
        b.append(f'<path d="M{x + 32} {top + 124} H{x + w - 32}" stroke="{BR_L}" stroke-width="1.5"/>')
        for j, it in enumerate(items):
            b.append(t(x + 40, top + 170 + j * 40, it, 22, fg))
        if i < 2:
            b.append(f'<path d="M{x + w + 8} {top - 20} L{x + w + 42} {top - 60}" stroke="{RUST}" stroke-width="3"/><path d="M{x + w + 46} {top - 66} l-15 5 l9 10z" fill="{RUST}"/>')
    b.append(t(800, 880, "沒打開過的圖不寫，AI 也不能憑記憶補內容：每段文字都要對得到頁碼、圖號或原文引用。", 23, RUST, 700, "middle"))
    return cream_frame("\n".join(b), "wiki 頁的三種深度：draft、middle、deep 各自包含的內容與適用的論文")


def mentor_roadmap():
    b = [cream_title("依研究目標安排學習順序", "/master-mentor plan · 一次只學一個單元，需要時才找論文")]
    r, y = 106, 370
    xs = [230, 530, 830, 1130, 1430]
    steps = [("target", "寫下研究目標", "與「懂了」的標準"), ("list", "挑出下一個單元", "前置知識已具備、最卡住"),
             ("search", "只找需要的論文", "lorevore 整理成 wiki"), ("ask", "先問後講", "預測、解釋、比較"),
             ("quiz", "隔一段時間再考", "不複習、不給提示")]
    for i, (ic, zh, en) in enumerate(steps):
        x = xs[i]
        b.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{CREAM_L}" stroke="{BR_D}" stroke-width="2.5"/>')
        b.append(icon(ic, x, y - 30) + t(x, y + 30, zh, 22, BR_D, 700, "middle") + t(x, y + 56, en, 15, BR_M, 500, "middle"))
        if i < 4:
            b.append(f'<path d="M{x + r} {y} H{xs[i + 1] - r - 4}" stroke="{BR_D}" stroke-width="2.5"/><path d="M{xs[i + 1] - r} {y} l-14 -7 v14z" fill="{BR_D}"/>')
    b.append(f'<path d="M{xs[4] - 40} {y + r - 8} C{xs[4] - 70} {y + 210} {xs[3] + 30} {y + 210} {xs[3]} {y + r + 14}" stroke="{RUST}" stroke-width="3" fill="none"/>'
             f'<path d="M{xs[3]} {y + r} l-8 15 h16z" fill="{RUST}"/>')
    b.append(t((xs[3] + xs[4]) / 2, y + 222, "未過關：排回複習", 22, RUST, 700, "middle"))
    b.append(f'<path d="M{xs[4] + 40} {y + r - 8} C{xs[4] + 60} {y + 420} {xs[1]} {y + 420} {xs[1]} {y + r + 14}" stroke="{BR_D}" stroke-width="3" fill="none"/>'
             f'<path d="M{xs[1]} {y + r} l-8 15 h16z" fill="{BR_D}"/>')
    b.append(t(1000, y + 385, "過關：前進到下一個單元", 22, BR_D, 700, "middle"))
    b.append(t(800, 890, "先學什麼由研究目標決定；份量控制在一次讀得完的範圍，順序依每次再考的結果隨時調整。", 23, BR_M, 500, "middle"))
    return cream_frame("\n".join(b), "學習規劃流程：寫下研究目標、挑出下一個單元、只找需要的論文、先問後講、隔一段時間再考，過關才前進")


write(f"{B4}/cover.svg", svai_cover())
write(f"{B4}/pipeline.svg", svai_pipeline())
write(f"{B4}/results.svg", svai_results())
write(f"{B4}/base-rate.svg", svai_baserate())
write(f"{B4}/silent-calls.svg", svai_silent())
write(f"{B4}/collab.svg", svai_collab())
write(f"{B6}/cover.svg", mentor_cover())
write(f"{B6}/ladder.svg", mentor_ladder())
write(f"{B6}/roadmap.svg", mentor_roadmap())
write(f"{B6}/architecture.svg", mentor_arch())
write(f"{B6}/workflow.svg", mentor_workflow())
write(f"{B6}/tiers.svg", mentor_tiers())
