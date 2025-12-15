const body = document.querySelector('body'),
      sidebar = body.querySelector('nav'),
      toggle = body.querySelector(".toggle"),
      searchBtn = body.querySelector(".search-box"),
      modeSwitch = body.querySelector(".toggle-switch"),
      modeText = body.querySelector(".mode-text");

// 點擊箭頭按鈕 -> 切換側邊欄開關
toggle.addEventListener("click", () =>{
    sidebar.classList.toggle("close");
});

// 點擊搜尋框 -> 展開側邊欄 (因為收合時無法輸入)
searchBtn.addEventListener("click", () =>{
    sidebar.classList.remove("close");
});