# Storeify Sidebar Demo（新手友善版）

這是一個「左側可展開/收合的 Dashboard Sidebar」小型 Demo。你可以把它當作後台系統常見的側邊導覽列雛形：支援收合、Tooltip 提示、右側內容區自動讓位，並帶有深色主題與滑順動畫。

---

## 你會看到什麼功能？

### 1) 展開 / 收合 Sidebar（核心）
- 點右上角的箭頭按鈕（Toggle）切換狀態：
  - 展開寬度：`250px`
  - 收合寬度：`88px`
- 右側內容區（`.home`）會跟著 Sidebar 自動改 `left/width`，避免重疊。

### 2) 收合時只留 Icon，並顯示 Tooltip
- 收合後，側邊欄文字（`.text`）與區塊標題（`.section-title`）會隱藏，只留下 icon。
- 滑鼠移到 icon 上會出現 Tooltip（只有在收合狀態才會出現）。

### 3) 點 Search 會強制展開（方便輸入）
- 收合狀態下點搜尋區塊（Search box）會自動展開 Sidebar。
- 注意：目前「搜尋功能」本身尚未實作，只有 UI 與展開互動。

### 4) Used Capacity 卡片（收合時隱藏）
- 展開時底部會看到容量卡片（目前固定 60%）。
- 收合時會完全隱藏，讓窄欄更乾淨。

---

## 專案檔案結構（重點看這三個）

- `index.html`：頁面結構（Sidebar 的 DOM、Menu 項目、Tooltip 文案等）
- `style.css`：視覺樣式（深色主題、寬度切換、文字隱藏、Tooltip、動畫）
- `index.js`：互動行為（切換 `.close`、點 Search 強制展開）
- `spec.md`：功能需求規格書（狀態、驗收標準、已知限制）

---

## 怎麼使用（最簡單）
1. 直接用瀏覽器打開 `index.html`
2. 點右上角箭頭測試收合/展開
3. 收合後 hover 任一 icon 看 Tooltip
4. 收合後點 Search 區塊，Sidebar 會展開

---

## 互動邏輯（用一句話理解）
Sidebar 的狀態只靠一個 class 控制：`nav.sidebar` 有沒有 `.close`

- 點 Toggle：`sidebar.classList.toggle("close")`
- 點 Search box：`sidebar.classList.remove("close")`

---

## CSS 在做什麼？（新手必看）

### 1) 寬度切換（Sidebar / Home 同步）
- Sidebar：
  - `.sidebar { width: 250px; }`
  - `.sidebar.close { width: 88px; }`
- 內容區 `.home`：
  - 展開：`left: 250px; width: calc(100% - 250px);`
  - 收合：`left: 88px; width: calc(100% - 88px);`

### 2) 收合時隱藏文字與標題
- `.sidebar.close .text { opacity: 0; }`
- `.sidebar.close .section-title { opacity: 0; height: 0; margin: 0; }`

### 3) Tooltip 只在收合時出現
- Tooltip 預設透明（`opacity: 0`）
- 只有 `.sidebar.close` 且 hover 時才顯示（`opacity: 1`）

---

## 新手常改的地方（客製化指南）

### 1) 改主題色/背景色
到 `style.css` 的 `:root` 調整：
- `--primary-color`：紫色強調色（按鈕/Logo）
- `--sidebar-color`：Sidebar 深色背景
- `--body-color`：右側內容區背景

### 2) 改選單項目/Tooltip 文字
到 `index.html` 找到對應的 `<li class="nav-link">`：
- icon：`<i class='bx ... icon'></i>`（使用 Boxicons class）
- 文字：`<span class="text nav-text">...</span>`
- Tooltip：`<span class="tooltip">...</span>`

### 3) 改容量百分比（目前是固定值）
目前 `60%` 是寫死在 HTML/CSS（圓環 offset 也是固定）。
若未來要用 JS 動態更新，可依 `spec.md` 的擴充性需求延伸。

---

## 已知限制（目前刻意沒做）
這些在 `spec.md` 也有列出，README 先讓你有心理預期：

- 所有連結目前都是 `href="#"`（正式版應改真實路由或避免跳回頂部）
- Search 沒有真正搜尋，只是點擊展開 UI
- 深色/淺色切換未實作（JS 內有遺留變數，但 HTML 沒有對應 DOM）
- Log out icon 只有 UI，未接登出流程

---

## 驗收快速清單（你可以自己對照）
- Toggle 點一次收合、再點一次展開
- 收合時 Sidebar 寬度是 88px、內容區會讓位
- 收合時 `.text` 與 `.section-title` 不可見
- Tooltip 只在收合時 hover 才會出現
- 收合時點 Search box 會展開 Sidebar
- 收合時容量卡片不出現（display none）
