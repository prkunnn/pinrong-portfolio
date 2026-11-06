# 陳品蓉的個人網站｜可以自己更新照片的版本

這一包包含：九段成長故事、四個角色插圖、原始照片、可編輯 JSON 內容，以及 Pages CMS 後台設定。

## 一、費用
- GitHub Pages：GitHub Free 的**公開**儲存庫可免費使用。
- Pages CMS（https://app.pagescms.org/）：官方提供免費雲端版本。
- 不必購買網域；免費網址格式通常是 https://你的GitHub帳號.github.io/儲存庫名稱/ 。

## 二、第一次啟用（只需設定一次）
1. 登入 https://github.com/ ，按右上角 `+` > New repository。
2. 取名 `pinrong-portfolio`（名稱可以自行改）。要用 GitHub Free 的 Pages，選 Public。**注意：公開前請確認活動照片與學生肖像可以使用。**
3. 建好 repo 後，需要把本 ZIP **解壓縮後的完整資料夾結構** 放進儲存庫（不是只上傳 ZIP 檔）。**比較穩定的方式**是用免費 GitHub Desktop：`File > Add Local Repository` 選解壓後資料夾；若提示尚非 Git repo，選 `Create a Repository Here`，再按 `Publish Repository`（公開網站需設 Public）。若使用 GitHub 網頁上傳，請逐一確認 `assets/`、`content/`、`admin/` 和隱藏的 `.pages.yml` 都有上傳；Mac Finder 可按 `Command + Shift + .` 顯示隱藏檔。
4. 在 GitHub repo 的 `Settings` > `Pages`，Source 選 `Deploy from a branch`，Branch 選 `main`、資料夾選 `/(root)`，按 Save。
5. 等 GitHub 完成首次部署後，會在 Pages 設定頁看到網站公開網址。
6. 前往 https://app.pagescms.org/ ，點 `Sign in with GitHub`，授權該網站所需的 GitHub App，選擇剛剛的 repository。
7. 後台會依 `.pages.yml` 出現「九段成長故事・照片」、「四個角色・插圖」、「首頁・結語」。

## 三、之後換照片（不用再改 HTML）
1. 登入 https://app.pagescms.org/ ，選自己的儲存庫。
2. 點「九段成長故事・照片」→ 找到你要編輯的那一段，例如第 1 段販售浪漫。
3. 在「照片」欄位上傳新圖片，必要時可一次放多張；第一張是主圖，其餘會出現在縮圖列。
4. 可以改標題、內文、摘要、外部網址，並修改「顯示順序」來調整排列。
5. 按 Save / 儲存。Pages CMS 會將內容寫入 GitHub，網站部署完成後會讀取最新資料。
6. 依 GitHub Pages 公告，部署可能需要數分鐘，不一定是立即更新。

## 四、注意事項
- `index.html` 內有離線備份內容。直接雙擊它仍可看到原網站，但 GitHub CMS 的新內容在公開網址（HTTP/HTTPS）上才會從 `content/*.json` 讀取。
- 舊的 `陳品蓉_九段成長歷程_個人網站.html` 是一個獨立 HTML，不是這次自動更新版；**以新壓縮包中的整個資料夾上線**。
- `admin/` 是操作入口說明頁，真正的管理介面在 Pages CMS，登入時會跳轉至該官方服務。
- 不要把 GitHub 密碼、Token、身分證、私人電話等敏感資料寫進公開儲存庫。
- 如果上傳照片遇到檔案過大問題，先將照片壓到 1–2 MB 以下（JPG/WebP）。
- 本次未代表你建立 GitHub repository、授權登入或公開網站；這些都需要由帳號擁有者操作。

## 五、資料檔用途
- `content/stories.json`: 九段歷程的文字、照片、標籤與順序。
- `content/roles.json`: 四個角色的文字與插圖。
- `content/site.json`: 首頁和結語文字。
- `.pages.yml`: 告訴 Pages CMS 哪些欄位可以編輯。
- `assets/`: 圖片；`assets/content-loader.js`: 在公開網站讀取最新版資料。
