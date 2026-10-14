import type { Project } from "@/types/content";

// 實際專案：台灣房價分析。內容整理自作者的專案說明（房價心得.pdf）與線上網站；
// 截圖為網站深色模式的實際畫面（2026-10-15 擷取）。
// 待補：開發者姓名、Claude Code 在各開發階段的協助方式（developmentStages[].claudeAssist）。
const base = "/projects/project-02";
const shot = (file: string, alt: string) =>
  ({ type: "image", src: `${base}/${file}.jpg`, alt, width: 1600, height: 1000, position: "top" }) as const;

export const project02: Project = {
  id: "project-02",
  slug: "taiwan-housing",
  number: 2,

  title: "台灣房價分析",
  subtitle: "Taiwan Housing Analytics",

  category: "資料分析 · 估價模型",
  categoryEn: "Housing Analytics",

  developer: "成員 B",
  developerId: "member-b",

  summary: "用內政部實價登錄 314 萬筆原始交易建立每坪估價模型，並把模型有多準、哪裡不準、為什麼不準一起量出來放上網站。",
  motivation:
    "房價資訊常只給一個平均數或一個估價數字，卻沒有說明它有多可靠。這個專案想把資料處理、估價方法與驗證結果攤開，讓每一個數字都能被檢查。",
  audience: "想了解各地行情、評估購屋負擔，或想知道估價數字從何而來的一般購屋者與研究者。",
  problem:
    "實價登錄地址格式不統一、最新一季資料尚未登錄完整，而同條件的房子成交價本來就會散開——只給一個點估計很容易被誤用。",
  description:
    "網站共 13 節，分成四組：市場行情（總覽、趨勢、行政區地圖、價格分佈）、估價與因素（影響因素、估價模型）、三個試算工具（房貸、買房 vs 租房、預算能買哪一區、租金投報率），以及兩個分析題目（房價 × 少子化、政策時間軸）。最後一節「數字怎麼來的」列出資料來源、每一層校正與全部驗證結果。整個網站是單一 HTML 檔，不需要後端，部署在 Cloudflare Workers。",

  thumbnail: `${base}/map.jpg`,
  heroImage: `${base}/home.jpg`,
  mediaPosition: "top",

  accentColor: "#E879D0",
  accentColorSecondary: "#FFB86B",

  technologies: ["Python", "pandas", "numpy", "Hedonic 迴歸", "LightGBM", "SVG", "Playwright", "Cloudflare Workers"],
  techStack: [
    { group: "語言", groupEn: "Languages", items: ["Python", "HTML / JavaScript"] },
    { group: "資料處理", groupEn: "Data", items: ["pandas", "numpy"] },
    { group: "統計與模型", groupEn: "Modeling", items: ["Hedonic 迴歸（雙向固定效果）", "收縮估計", "區間校準（calibration curve、PIT）", "LightGBM（對照組）"] },
    { group: "前端", groupEn: "Frontend", items: ["無框架單檔 HTML", "手寫 SVG 圖表"] },
    { group: "測試與部署", groupEn: "Testing & Deploy", items: ["Playwright 自動化與反向測試", "Cloudflare Workers"] },
  ],
  architecture: {
    summary:
      "資料先在本機以 Python 清理、建模與驗證，結果輸出成網站內嵌的資料；網站本身是單一 HTML 檔，所有圖表在瀏覽器以 SVG 繪製，不需要後端或任何 API。",
    layers: [
      {
        name: "資料層",
        description: "內政部實價登錄（買賣、租賃、預售屋），併入戶政人口與戶數、央行與稅制政策事件、官方房價指數。",
        items: ["地址整理成可比對的路街", "暫定季標示"],
      },
      {
        name: "模型層",
        description: "Hedonic 迴歸估計每坪單價，再以行政區殘差與逐層校正算出價格區間。",
        items: ["路街 × 季雙向固定效果", "區間逐層校正"],
      },
      {
        name: "驗證層",
        description: "在模型沒看過的季別上驗證區間命中率，並做滾動原點回測與 LightGBM 對照。",
        items: ["樣本外驗證", "滾動回測"],
      },
      {
        name: "網站層",
        description: "單檔 HTML、手寫 SVG 圖表，處理行動版橫向捲動與無障礙替代文字。",
        items: ["13 節內容", "Cloudflare Workers"],
      },
    ],
  },

  features: [
    {
      id: "market",
      title: "市場行情：先看量，再看價",
      titleEn: "Market Overview & Trends",
      description:
        "全國每一季的成交量與每坪單價，以及各縣市的位置；趨勢頁把縣市與行政區的單價指數化後疊在一起，可以任選幾個比較十年走勢。",
      highlights: ["成交量與單價", "縣市／行政區比較"],
      media: shot("trend", "房價趨勢頁：多個縣市的每坪單價十年走勢疊圖"),
    },
    {
      id: "map",
      title: "行政區地圖",
      titleEn: "District Map",
      description:
        "用自己處理過的村里界做分級著色，底圖是 OpenStreetMap 的台灣全島檔；成交太少的區域直接留灰，不做推估。",
      highlights: ["分級著色", "樣本不足不推估"],
      media: shot("map", "行政區地圖：全台各縣市每坪中位數分級著色與排行表"),
    },
    {
      id: "factors",
      title: "拆開房價影響因素",
      titleEn: "Price Factors",
      description:
        "同一條街、同一季、其他條件都一樣時，只差一個條件，每坪單價會差幾 %——分別看屋齡、坪數、樓層、有無車位，以及 5 種建物型態。",
      highlights: ["控制其他條件", "5 種建物型態"],
      media: shot("factors", "房價影響因素：各條件對每坪單價影響的長條圖"),
    },
    {
      id: "valuation",
      title: "給區間的估價模型",
      titleEn: "Interval Valuation",
      description:
        "輸入縣市、行政區、路街、坪數、屋齡、樓層與建物型態，網站回一個價格區間而不是一個點，並標明這個區間的信心等級與實測命中率。",
      highlights: ["價格區間", "信心等級", "實測命中率"],
      media: shot("valuation", "每坪估價模型：輸入物件條件後得到價格區間"),
    },
    {
      id: "tools",
      title: "購屋試算工具",
      titleEn: "Affordability Tools",
      description:
        "房貸試算月付金額與利率敏感度；買房與租房比較長期總成本；「我的預算能買哪一區」由預算反查可負擔的行政區；租金投報率比較各地差異。",
      highlights: ["房貸試算", "買房 vs 租房", "預算反查"],
      media: shot("afford", "我的預算能買哪一區：輸入收入與自備款，反查可負擔的行政區"),
    },
  ],

  developmentStages: [
    {
      key: "idea",
      label: "IDEA",
      title: "不只給一個數字",
      description: "目標是建立每坪估價模型，並把模型有多準、哪裡不準、為什麼不準一起量出來，放在同一個網站上。",
    },
    {
      key: "prototype",
      label: "PROTOTYPE",
      title: "整理實價登錄資料",
      description:
        "最花時間的不是統計，而是資料本身：地址欄位格式不統一，必須先整理成可以互相比對的路街，才能當成固定效果使用。",
    },
    {
      key: "build",
      label: "BUILD",
      title: "估價模型與區間",
      description:
        "以 log(每坪單價) 為被解釋變數的 hedonic 迴歸，用「路街 × 季」雙向固定效果吸收位置與時間；再依行政區殘差逐層校正出價格區間。",
    },
    {
      key: "debug",
      label: "DEBUG",
      title: "驗證與回測",
      description:
        "在模型沒看過的季別上驗證區間命中率，做 8 個時點的滾動原點回測，並和 LightGBM 對照隨機切分與時間切分的差別。",
    },
    {
      key: "final",
      label: "FINAL PRODUCT",
      title: "單檔網站上線",
      description: "13 節內容整合成單一 HTML 檔，處理行動版與無障礙替代文字，部署在 Cloudflare Workers；資料每季更新並重跑驗證。",
    },
  ],

  challenges: [
    {
      title: "地址格式不統一",
      problem: "實價登錄的地址有巷弄、有段號，也有直接寫「見其他登記事項」，無法直接比對。",
      approach: "先把地址整理成可互相比對的路街，最後保留成交筆數在 40 筆以上的 9,087 條路街作為固定效果。",
      lesson: "資料清理的品質決定了模型能做到多細。",
    },
    {
      title: "最新一季資料不完整",
      problem: "登錄有時間落差，2026Q2 目前只進來約 23% 的量。",
      approach: "回頭比對過去 16 季的經驗，估出暫定季的偏誤中位數約 1.14%；網站標示為暫定值，模型也不拿它當基準季。",
      lesson: "不完整的資料要標示清楚，而不是當成完整資料使用。",
    },
    {
      title: "誤差有一個下限",
      problem: "把條件完全鎖死，剩下的價格離散仍佔整體殘差的 41%，來自實價登錄沒有的欄位，例如裝潢、座向、鄰損與議價空間。",
      approach: "不硬壓誤差，而是輸出經過校準的區間，並在網站上說明這個限制。",
      lesson: "這是估價參考，不是鑑價，不能直接當成交易依據。",
    },
    {
      title: "更準的模型不一定更適合",
      problem: "LightGBM 在隨機切分下明顯較準，但改成時間切分後差距縮小，模型檔也比整個網站大 14 倍。",
      approach: "保留 hedonic 迴歸作為主模型：可以解釋、能給出區間，也放得進單檔網站。",
      lesson: "驗證方式要貼近實際使用情境——預測的是未來的季別。",
    },
  ],

  results: [
    { label: "原始交易資料", value: "314 萬筆", description: "內政部實價登錄，涵蓋 2016Q1–2026Q2，全台 22 縣市、314 個行政區。" },
    { label: "模型解釋力", value: "R² 0.817", description: "Hedonic 迴歸共 9,474 個係數，殘差標準差 0.2541（約 ±29%）。" },
    { label: "80% 區間命中率", value: "79.1%", description: "在模型沒看過的 2026Q1（23,487 筆）驗證；95% 區間實測命中 91.8%。" },
    { label: "點估計誤差中位數", value: "12.7%", description: "優於直接查行政區中位數的 23.3%；網站整體是一個 4,638 KB 的 HTML 檔。" },
  ],

  gallery: [
    shot("overview", "市場總覽：全國每坪中位數、成交量與年增率"),
    shot("spread", "價格分佈：同一行政區內的價格帶"),
    shot("birth", "房價 × 少子化：人口與戶數變化和房價的比較"),
    shot("policy", "政策與事件時間軸：23 項政策標在價量圖上"),
    shot("mortgage", "房貸試算：月付金額與負擔率"),
    shot("method", "數字怎麼來的：資料來源與驗證結果"),
  ],

  links: {
    demo: "https://taiwan-housing.llnick91326.workers.dev/",
  },

  isPlaceholder: false,
};
