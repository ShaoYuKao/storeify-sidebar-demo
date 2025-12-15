# Storeify Sidebar Demo — 功能需求規格書（FRS）

## 1. 文件目的
定義「Storeify Sidebar Demo」之側邊欄（Sidebar）元件與其周邊版面（Home content）在目前前端實作（`index.html` / `style.css` / `index.js`）基礎上的**功能需求、互動行為、狀態切換、視覺規則、限制與驗收標準**，以利後續擴充為可導覽的 Dashboard 應用。

---

## 2. 範圍（Scope）
### 2.1 In Scope
- 固定於左側的 Sidebar 版面，支援展開/收合狀態。
- Sidebar 內：
  - Header：Logo 與 Toggle 按鈕。
  - Search Box：點擊可強制展開 Sidebar。
  - Menu 區：分區標題（Main / Communication）與多個 nav-link。
  - Bottom 區：Capacity card、Settings、Help、Profile 與 Log out icon。
  - 收合狀態下顯示 Tooltip（hover 顯示）。
- 右側內容區（`.home`）依 Sidebar 狀態自動位移與寬度調整。
- CSS Transition 動畫（以 CSS 變數 `--tran-03/04/05` 為準）。

### 2.2 Out of Scope（目前不做，但需保留擴充點）
- 真正的路由導覽（目前 `href="#"`）。
- 搜尋功能（目前僅 UI/互動：點擊展開）。
- 容量百分比動態更新（目前固定 60%）。
- 深色/淺色模式切換（JS 內的 `modeSwitch/modeText` 目前未實作對應 DOM）。
- 登出流程（`#log_out` 僅 UI）。

---

## 3. 目標使用者與使用情境
### 3.1 角色（Actors）
- 一般使用者（Dashboard 操作者）

### 3.2 使用情境（Use Cases）
1. 使用者點擊 Toggle 收合 Sidebar 以取得更大內容區顯示空間。
2. 使用者在 Sidebar 收合時，滑鼠移到圖示上以查看 Tooltip 瞭解該功能。
3. 使用者點擊 Search Box 以展開 Sidebar，準備輸入搜尋（即使搜尋尚未實作）。

---

## 4. 資訊架構與 UI 組成
### 4.1 DOM 主要區塊
- `nav.sidebar`：側邊欄容器
  - `header`
    - `.image-text`（Logo icon + Brand name）
    - `.toggle`（Chevron icon，點擊切換狀態）
  - `.menu-bar`
    - `.menu`
      - `li.search-box`（Search）
      - `.section-title`（Main）
      - `ul.menu-links`（Main links）
      - `.section-title`（Communication）
      - `ul.menu-links`（Communication links）
    - `.bottom-content`
      - `.capacity-card`
      - `li`（Settings）
      - `li`（Help）
      - `li.mode.profile`（Profile + log out）
- `section.home`：右側內容區

### 4.2 導覽項目（目前）
- Main：Home / Orders / Documentation / Map Overview / Statistics
- Communication：Communication / Couriers
- Bottom：Settings / Help / Profile（含 Log out）

> 註：所有連結目前為 `href="#"`，規格要求保留可替換為真實 URL/路由的能力（見 §9 擴充性）。

---

## 5. 功能需求（Functional Requirements）
### FR-01 Sidebar 展開/收合
**描述**：使用者可透過 Header 的 Toggle 按鈕切換 Sidebar 展開或收合。  
**觸發**：點擊 `.toggle`  
**狀態表示**：以 `nav.sidebar` 是否包含 class `close` 決定收合狀態。
- 展開：`nav.sidebar` **不含** `.close`
- 收合：`nav.sidebar` **包含** `.close`

**結果**：
- Sidebar 寬度切換（見 §6.1）。
- `.home` 內容區同步位移/寬度調整（見 §6.2）。
- Tooltip 行為依狀態切換（見 FR-03）。
- Capacity card 在收合時隱藏（見 FR-04）。
- Sidebar 內文字在收合時隱藏（見 FR-02）。

---

### FR-02 收合時隱藏文字與分區標題
**描述**：Sidebar 收合時，僅保留 icon，隱藏 `.text` 與 `.section-title` 以節省空間。  
**規則**（以現行 CSS 實作為準）：
- `.sidebar.close .text`：opacity = 0（不可見）
- `.sidebar.close .section-title`：opacity = 0 且 height=0 且 margin=0（不占空間）

---

### FR-03 Tooltip（僅收合時生效）
**描述**：Sidebar 收合時，滑鼠 hover 在各 `li` 上顯示 Tooltip，提示該項目名稱。  
**適用範圍**：
- `.sidebar.close .nav-link:hover .tooltip`
- `.sidebar.close .bottom-content li:hover .tooltip`

**互動規則**：
- Tooltip 預設不可見（opacity 0, pointer-events none）。
- Hover 時顯示（opacity 1）。
- Tooltip 位置：顯示於 Sidebar 右側 `left: calc(100% + 15px)`，垂直置中 `top: 50%`。

**限制**：
- Tooltip 僅為提示，不影響點擊導覽行為。
- 需避免被容器裁切：`.menu-bar` 必須允許 tooltip 溢出（目前為 `overflow: visible`）。

---

### FR-04 Capacity card 收合時隱藏
**描述**：Sidebar 收合時不顯示容量卡片，以避免擁擠。  
**規則**：`.sidebar.close .capacity-card { display: none; opacity: 0; }`

---

### FR-05 Search Box 點擊強制展開 Sidebar
**描述**：使用者點擊 Search Box 時，若 Sidebar 處於收合狀態，系統應自動展開 Sidebar，方便後續輸入。  
**觸發**：點擊 `li.search-box`（目前以 `addEventListener("click")` 綁定容器）  
**結果**：移除 `nav.sidebar` 的 `.close` class（若不存在則無副作用）。

**備註**：目前不包含「實際搜尋」功能；輸入框僅提供 UI 呈現。

---

### FR-06 Home 內容區與 Sidebar 同步版面
**描述**：右側內容區需隨 Sidebar 展開/收合自動調整 left 與 width，保持不重疊。  
**狀態對應**：
- 展開：`.home { left: 250px; width: calc(100% - 250px); }`
- 收合：`.sidebar.close ~ .home { left: 88px; width: calc(100% - 88px); }`

---

### FR-07 Profile 與 Log out icon 呈現
**描述**：
- 展開狀態：Profile 區顯示頭像、姓名、Email（job），並顯示 log out icon。
- 收合狀態：
  - `.name` 與 `.job` 不顯示（`display: none`）
  - Profile 背景變為 none（以符合窄欄外觀）
  - `#log_out` 背景變為 none

**限制**：Log out icon 點擊行為目前未定義；需保留掛載事件的空間（見 §9）。

---

## 6. 視覺與版面需求（UI/UX Requirements）
### 6.1 Sidebar 尺寸
- 展開寬度：250px
- 收合寬度：88px
- Sidebar 固定定位：`position: fixed; top:0; left:0; height:100%; z-index:100`

### 6.2 動畫與轉場
- Sidebar、Home、文字透明度等使用 CSS 變數轉場：
  - `--tran-03: all 0.3s ease;`
  - `--tran-04: all 0.4s ease;`
  - `--tran-05: all 0.5s ease;`
- Toggle icon 旋轉：
  - 展開預設：rotate(180deg)（箭頭向左）
  - 收合：rotate(0deg)（箭頭向右）

### 6.3 Hover 視覺
- `li a:hover` 背景變為 `#1d1b31`
- hover 時 icon/text 顏色變 `--toggle-color`（白）

---

## 7. 互動規格（Event & State）
### 7.1 事件清單
| 事件 | Selector | 行為 | 影響狀態 |
|---|---|---|---|
| Click Toggle | `.toggle` | `sidebar.classList.toggle("close")` | 展開/收合切換 |
| Click Search Box | `.search-box` | `sidebar.classList.remove("close")` | 強制展開 |

### 7.2 狀態定義
- S1：Sidebar 展開（預設）
- S2：Sidebar 收合（`nav.sidebar.close`）

### 7.3 狀態轉移
- S1 --(click toggle)--> S2
- S2 --(click toggle)--> S1
- S2 --(click search-box)--> S1
- S1 --(click search-box)--> S1（無副作用）

---

## 8. 可用性與可及性（Accessibility）需求
> 目前程式碼未實作，但規格要求後續補齊時不得破壞既有 UI。

### A11Y-01 鍵盤操作
- Toggle 必須可被鍵盤聚焦並可用 Enter/Space 觸發。
- Nav links 必須可 Tab 導覽。
- 收合狀態下 Tooltip 不應阻礙鍵盤導覽（tooltip pointer-events 需保持不攔截）。

### A11Y-02 ARIA 與語意
- `nav.sidebar` 應具備適當標籤（例如 `aria-label="Sidebar"`）。
- Toggle 應提供 `aria-expanded` 對應展開/收合狀態（true/false）。
- Tooltip 若要可及性一致性，應能以 `aria-label` 或 `title` 提供等價資訊（擇一策略）。

---

## 9. 擴充性需求（Extensibility）
- 所有 `a href="#"` 應可替換為真實路由或 URL，不改動 CSS/JS 架構。
- `#log_out` 需保留可掛載 click handler 的穩定 selector。
- Capacity card 的百分比（目前 60%）未來應能由 JS/後端資料驅動更新（包含文字與圓環 stroke-dashoffset）。

---

## 10. 相容性與非功能需求（NFR）
### NFR-01 瀏覽器支援
- 需支援現代 Chromium / Firefox / Safari 的最新兩個主要版本。
- CSS `calc()`、flex、transition 必須正常。

### NFR-02 效能
- Toggle/展開收合操作應在 60fps 目標下順暢（主要依賴 CSS transition）。
- 不得在 toggle 事件中做高成本 DOM 重排；目前僅切換 class 符合。

### NFR-03 安全與隱私
- Demo 目前載入外部資源（Boxicons、Google Fonts、頭像 URL）。若用於正式環境，需評估 CSP/外部依賴與隱私政策。

---

## 11. 驗收標準（Acceptance Criteria）
### AC-01 Toggle 行為
- 當點擊 `.toggle` 一次：
  - `nav.sidebar` 的 class 清單中 `close` 需被加入（若原本沒有）。
- 再點擊一次：
  - `close` 需被移除。

### AC-02 收合尺寸與內容區
- Sidebar 收合時：
  - Sidebar 視覺寬度為 88px。
  - `.home` 的 left 為 88px，width 為 `calc(100% - 88px)`。
- Sidebar 展開時：
  - Sidebar 視覺寬度為 250px。
  - `.home` 的 left 為 250px，width 為 `calc(100% - 250px)`。

### AC-03 收合時文字/標題隱藏
- Sidebar 收合時：
  - 任一 `.text` 不應可見（opacity=0）。
  - `.section-title` 不應占據可見高度（height=0 且 margin=0）。

### AC-04 Tooltip 僅收合時顯示
- 展開狀態 hover 任一 nav 項目：Tooltip 不應顯示（opacity 仍為 0）。
- 收合狀態 hover 任一 nav 項目：Tooltip 應顯示（opacity 變為 1）。

### AC-05 Search 點擊強制展開
- 先將 Sidebar 收合，再點擊 `.search-box`：
  - `nav.sidebar` 不應包含 `close`。

### AC-06 Capacity card 隱藏規則
- 收合狀態下 `.capacity-card` 不應出現在版面中（display: none）。
- 展開狀態下 `.capacity-card` 應可見。

---

## 12. 已知限制與待辦（Known Gaps）
- `index.js` 中的 `modeSwitch`、`modeText` 目前在 DOM 不存在，屬未完成或遺留欄位；後續若導入主題切換需補齊對應 HTML/CSS。
- `href="#"` 會在點擊時影響頁面捲動（回到頂部）的可能性；正式版應改用真實路由或 preventDefault 策略。
- Search input 未綁定輸入事件；目前僅作為「展開觸發器」。

---
