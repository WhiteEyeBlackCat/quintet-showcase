import type { ProgramInfo } from "@/types/content";

export const program: ProgramInfo = {
  name: "QUINTET",
  title: ["QUINTET", "PROJECT EXHIBITION"],
  tagline: "FIVE MINDS. FIVE BUILDS. ONE AI-POWERED JOURNEY.",
  description: [
    "五重奏——五位成員，五個獨立創意專案。",
    "透過 Claude Code 與 AI 輔助開發，將創意構想轉化為實際作品，探索人工智慧與軟體開發的更多可能。",
  ],
  // 只列出已確認的事實，不放入未經驗證的數據。
  stats: [
    { value: "05", label: "參與成員", labelEn: "Participants" },
    { value: "05", label: "完成專案", labelEn: "Projects" },
    { value: "Claude Code", label: "主要開發工具", labelEn: "Primary Tool" },
  ],
  mission: {
    eyebrow: "OUR MISSION",
    heading: "用 AI 擴展創意的邊界",
    paragraphs: [
      "這是一場以 AI 輔助開發為核心的實作計畫。五位成員從各自的興趣與專業出發，各自提出一個想解決的問題。",
      "在開發過程中，Claude Code 是每個人的協作夥伴——協助拆解需求、產生程式碼、除錯與撰寫文件，讓構想能更快地成為可運作的作品。",
    ],
    chapters: [
      { label: "BACKGROUND", title: "計畫背景", description: "探索 AI 輔助開發在實際專案中的應用方式。" },
      { label: "METHOD", title: "開發方式", description: "每位成員獨立開發，以 Claude Code 作為主要開發工具。" },
      { label: "WORKS", title: "五大作品", description: "涵蓋 AI 應用、影像生成、資料分析、桌面應用與模型研究。" },
      { label: "HIGHLIGHTS", title: "成果亮點", description: "從構想到完成作品，完整記錄每一步的開發歷程。" },
      { label: "FUTURE", title: "未來展望", description: "將這次的經驗延伸至更多領域與更大的專案。" },
    ],
  },
  journey: [
    {
      number: "01",
      label: "IDEA",
      title: "構想",
      description: "從日常觀察與個人興趣出發，定義想解決的問題與作品的核心價值。",
    },
    {
      number: "02",
      label: "PLANNING",
      title: "規劃",
      description: "與 Claude Code 討論可行性，拆解功能範圍、選擇技術並安排開發步驟。",
    },
    {
      number: "03",
      label: "AI-ASSISTED BUILD",
      title: "AI 協作開發",
      description: "以自然語言描述需求，由 Claude Code 協助產生程式碼，再由成員審閱、調整與整合。",
    },
    {
      number: "04",
      label: "TESTING & DEBUGGING",
      title: "測試與除錯",
      description: "實際執行與測試作品，將錯誤訊息與觀察回饋給 AI，一起找出原因並修正。",
    },
    {
      number: "05",
      label: "FINAL PRODUCT",
      title: "完成作品",
      description: "整理介面細節、撰寫說明文件，完成可以展示與分享的最終版本。",
    },
  ],
  facts: [
    { value: "05", label: "位參與成員", labelEn: "Participants" },
    { value: "05", label: "件完成作品", labelEn: "Completed Projects" },
    { value: "05", label: "種專案類型", labelEn: "Project Categories" },
    { value: "Claude Code", label: "AI 輔助開發工具", labelEn: "AI-assisted Development" },
  ],
  pillars: [
    {
      title: "AI 輔助開發的實際應用",
      titleEn: "Applied AI Development",
      description: "將 AI 協作融入真實的開發流程，而非僅停留在概念展示。",
    },
    {
      title: "獨立完成專案",
      titleEn: "Independent Builds",
      description: "每位成員從構想、實作到完成，獨立負責一個完整作品。",
    },
    {
      title: "創意實驗",
      titleEn: "Creative Experimentation",
      description: "勇於嘗試不熟悉的技術與領域，以快速迭代驗證想法。",
    },
    {
      title: "問題解決能力",
      titleEn: "Problem Solving",
      description: "在開發中面對實際問題，學習拆解、除錯與尋找替代方案。",
    },
    {
      title: "軟體工程經驗",
      titleEn: "Engineering Practice",
      description: "累積版本控制、模組化設計與文件撰寫等實務經驗。",
    },
    {
      title: "技術探索",
      titleEn: "Technical Exploration",
      description: "涵蓋語言模型、影像生成、資料分析與桌面應用等不同技術領域。",
    },
  ],
  closing: {
    heading: ["THE END OF THE EXHIBITION.", "THE BEGINNING OF WHAT'S NEXT."],
    paragraphs: [
      "五個作品，五種不同的探索方向。",
      "從最初的構想，到最終完成的作品，這場實作展現了 AI 輔助開發所帶來的創造可能。",
    ],
  },
};
