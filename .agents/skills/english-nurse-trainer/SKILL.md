---
name: english-nurse-trainer
description: Kích hoạt khi người dùng (đặc biệt là điều dưỡng dụng cụ / CSSD) yêu cầu xây dựng lộ trình học tiếng Anh chuyên ngành điều dưỡng 90 ngày, tạo ứng dụng web Flashcards & Bài tập điền từ, ghi âm luyện phát âm theo từng ngày với sửa lỗi phiên âm IPA, chọn giọng đọc bản xứ, thiết kế giao diện chuẩn Apple Typography & UI/UX Pro Max, hoặc hỗ trợ đồng bộ và phát hành web 24/7 vĩnh viễn lên GitHub Pages / Netlify Cloud.
---

# 🩺 Skill: English Nurse 90-Day Learning & Web Portal Assistant

Skill này hướng dẫn chi tiết quy trình xây dựng, phát triển, thiết kế UI/UX và đóng gói trang web tự học Tiếng Anh Chuyên Ngành Điều Dưỡng / CSSD (Central Sterile Supply Department) 90 ngày. Hệ thống tích hợp game Flashcard 3D, Bài tập điền từ tự nhớ 100%, Bộ chọn giọng đọc bản xứ (Voice Studio), Thanh Bottom Navigation Dock di động, Giao diện chuẩn Apple Typography System & UI/UX Pro Max, Phòng Ghi âm Micro sửa lỗi theo phiên âm IPA, tham chiếu 10 bộ công cụ ngữ âm hàng đầu thế giới (Phonemizer, IPA-Dict, Gruut-IPA, eSpeak-ng), và tự động phát hành Cloud 24/7 vĩnh viễn lên GitHub Pages.

---

## 🎯 1. ĐỐI TƯỢNG VÀ BỐI CẢNH ỨNG DỤNG

- **Học viên**: Điều dưỡng dụng cụ phòng mổ (Scrub Nurse) hoặc Điều dưỡng Khoa Tiệt trùng Trung tâm (CSSD).
- **Đặc điểm bối cảnh**: Môi trường làm việc ít giao tiếp tiếng Anh trực tiếp, phát âm ban đầu còn yếu/dễ ngọng giọng địa phương, dễ bị nản lòng nếu bài học kéo dài quá 30 phút.
- **Giải pháp thiết kế cốt lõi**:
  1. **Micro-learning (15-20 phút/ngày)**: Chia nhỏ 15 Unit từ giáo trình chuẩn *Oxford English for Careers - Nursing 1*.
  2. **Kỹ thuật CSSD Self-Talk**: Vừa đóng gói/hấp tiệt trùng dụng cụ vừa nhẩm hoặc đọc tiếng Anh thành tiếng.
  3. **Ứng dụng Web SPA Apple Typography & UI/UX Pro Max**: Tích hợp đầy đủ Flashcards 3D, Điền từ tự nhớ, Bộ chọn giọng đọc bản xứ, Thanh Bottom Navigation Dock di động và Phòng ghi âm chữa lỗi IPA.
  4. **Phát hành Cloud 24/7 vĩnh viễn**: Triển khai lên GitHub Pages để mở mượt mà trên điện thoại và máy cơ quan ngay cả khi máy tính cá nhân tắt hoàn toàn.

---

## 🎨 2. TIÊU CHUẨN NÂNG CẤP GIAO DIỆN APPLE TYPOGRAPHY & UI/UX PRO MAX

1. **Bộ Phông Chữ Đẳng Cấp Apple.com (Apple Typography System)**:
   - Font Family Stack: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `"SF Pro Display"`, `"SF Pro Text"`, `"Helvetica Neue"`, `sans-serif`.
   - Khử răng cưa chữ Retina: `-webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility;`
   - Tight Headline Tracking (`letter-spacing: -0.025em`) và tỷ lệ dãn dòng `line-height: 1.5` cho cảm giác mượt mắt, không mỏi khi học lâu.

2. **Thiết Kế Ergonomics Di Động (Mobile Bottom Navigation Dock)**:
   - Khi xem trên điện thoại (`max-width: 768px`), tự động chuyển thanh Menu 4 Tab (**Lộ Trình**, **Flashcard**, **Điền Từ**, **Ghi Âm**) xuống **Thanh Điều Hướng Dưới Cùng (Bottom Navigation Dock)** ôm sát viền dưới màn hình.
   - Nút bấm thiết kế chuẩn `48px Touch Target` cho thao tác bằng 1 ngón tay cái cực kỳ dễ dàng.

3. **Kính Mờ Glassmorphism & Hiệu Ứng Nảy Neumorphic**:
   - Header và Banner Hero nạp hiệu ứng kính mờ `backdrop-filter: blur(20px)`.
   - Các thẻ card và nút bấm có phản hồi nảy mượt `transform: translateY(-3px)` kèm bóng đổ nẩy mềm.
   - Hiệu ứng sóng âm đỏ `micPulseWave` khi bấm Micro ghi âm.

---

## 📚 3. KIẾN TRÚC NGỮ ÂM IPA THAM CHUYỂN HÀNG ĐẦU (OPEN-SOURCE REPOS)

Hệ thống tham chiếu và áp dụng nguyên lý từ 10 dự án mã nguồn mở IPA đỉnh cao:

1. **Bộ Chuyển Đổi Text ➔ IPA (G2P Engines)**:
   - `bootphon/phonemizer`: Tiêu chuẩn chuyển đổi văn bản tự do sang ký hiệu IPA.
   - `Kyubyong/g2p`: Tách âm tiết Tiếng Anh & trọng âm theo từ điển CMU.
   - `as-ideas/DeepPhonemizer`: Mô hình Transformer hỗ trợ chuyển đổi từ vựng y tế phức tạp.
   - `dmort27/epitran`: Bộ luật ngữ âm chuyển đổi chính tả sang IPA.

2. **Dữ Liệu Từ Điển IPA Nhúng Siêu Nhẹ (Offline Lookup)**:
   - `open-dict-data/ipa-dict`: Kho dữ liệu IPA dạng JSON/Text nhúng thẳng vào Web SPA (không cần backend).
   - `Alexir/CMUdict`: Từ điển 130.000+ từ Tiếng Anh chuẩn hóa IPA.
   - `AdamSteffanick/ipa-data`: Bảng phân loại đặc tính âm học nguyên âm/phụ âm Unicode IPA.

3. **Động Cơ & Thuật Toán Chấm Điểm Phát Âm (Core Engines)**:
   - `espeak-ng/espeak-ng`: Động cơ TTS & Phonemizer C/C++ nền tảng cho 100+ ngôn ngữ.
   - `rhasspy/gruut-ipa`: Chuẩn hóa, phân tách âm tiết (syllables) và so khớp chuỗi IPA.
   - `lingpy/lingpy`: Thuật toán đo lường khoảng cách tương đồng âm tiết (Phonetic Distance).

---

## 🛠️ 4. QUY TRÌNH PHÁT TRIỂN & CẤU TRÚC WEB SPA

### A. Bộ Dữ Liệu Giáo Trình 90 Ngày (`data.js`)
- **Nguyên tắc Tỷ lệ 1-1**: Mỗi ngày có đúng 5 từ vựng mới ➔ Phải có đúng 5 câu bài tập điền từ kiểm tra trí nhớ tương ứng (không gợi ý ký tự đầu).
- **Cấu trúc bài học mỗi ngày**:
  * Từ vựng + Phiên âm chuẩn IPA + Nghĩa Tiếng Việt + Ví dụ ngữ cảnh y tế.
  * Đoạn thoại Shadowing (nhại lại).
  * Kịch bản CSSD Self-Talk thực tế tại phòng mổ/tiệt trùng.
  * Câu lệnh đóng vai luyện phản xạ nói với AI (Roleplay Prompt).

### B. Bộ Chọn Giọng Đọc Bản Xứ (Voice Studio Engine)
- **Tự động quét danh sách giọng đọc bản xứ (`speechSynthesis.getVoices()`)**:
  * Phân loại sinh động: 🇺🇸 Mỹ (Samantha / David / Google US), 🇬🇧 Anh (Daniel / Victoria), 🇦🇺 Úc (Karen).
  * **Khắc phục lỗi ngọng tiếng Việt trên di động**: Gán ép trực tiếp `utterance.voice = selectedVoice` để trình duyệt iOS Safari & Android Chrome không bị mặc định chọn bộ giọng đọc tiếng Việt của máy.
  * Nút **"🔊 Nghe Thử Giọng"** phát câu chào mẫu và lưu giọng đọc chọn lựa vào `localStorage`.

### C. Phòng Ghi Âm & Chữa Lỗi Phát Âm Theo Phiên Âm IPA
- **Ghi âm di động đa nền tảng (`MediaRecorder`)**:
  * Tự động nhận diện định dạng tương thích (iOS Safari: `audio/mp4` / `audio/aac`; Android Chrome: `audio/webm`).
  * Trích xuất danh sách mẫu câu luyện ghi âm **Theo Từng Ngày (1 - 90)** thông qua bộ lọc `recorderDaySelect`.
- **Thuật toán Chấm điểm & Thẻ Chữa Lỗi IPA (`calculateSentenceSimilarityWithIPA`)**:
  * Đánh giá % chính xác từng từ trong câu.
  * Tô **Màu Xanh** cho từ phát âm đúng, **Màu Đỏ Gạch Ngang** cho từ đọc nhầm/thiếu.
  * Tạo **Thẻ Chữa Lỗi IPA Màu Vàng (`.ipa-fix-card`)**: Hiển thị rõ từ cần sửa, phiên âm IPA chuẩn `/.../` và nút 🔊 nghe lại riêng lẻ từng từ.

### D. Đồng Bộ Tiến Độ (Sync Progress Engine)
- Nút **"📋 Copy Tiến Độ"** và **"📥 Dán Tiến Độ"**: Mã hóa `progressState` và `masteredVocabState` thành chuỗi Base64 giúp chị Huyền chuyển kết quả học giữa máy nhà, máy cơ quan và điện thoại dễ dàng.

---

## 🌐 5. QUY TRÌNH PHÁT HÀNH CLOUD 24/7 VĨNH VIỄN (GITHUB PAGES)

1. **Khởi tạo & Đóng gói Flat ZIP**:
   - Tạo tệp `english-nurse.zip` chứa cấu trúc phẳng (Flat ZIP) có `index.html` nằm tại thư mục gốc.
2. **Khởi tạo Git & Đẩy mã nguồn qua Token**:
   ```bash
   git init
   git branch -M main
   git add .
   git commit -m "Update English Nurse 90-Day Web Portal"
   # Đẩy qua GitHub token
   git push https://<username>:<token>@github.com/<username>/<repo-name>.git main --force
   ```
3. **Kích hoạt GitHub Pages Cloud 24/7**:
   ```bash
   gh api repos/<username>/<repo-name>/pages -X POST -F "source[branch]=main" -F "source[path]=/"
   gh api repos/<username>/<repo-name>/pages/builds -X POST
   ```
4. **Làm tươi bộ nhớ đệm trình duyệt (Cache Busting)**:
   - Thêm tham số `?v=4.0` vào các thẻ nạp `styles.css?v=4.0`, `data.js?v=4.0`, `app.js?v=4.0` trong `index.html`.
5. **URL Truy cập 24/7 vĩnh viễn**: `https://<username>.github.io/<repo-name>/` (Hoạt động 24/24h ngay cả khi máy tính cá nhân tắt hoàn toàn).

---

## ⚠️ 6. QUY TẮC NHẬT KÝ LƯU VẾT HỆ THỐNG (CHANGES.LOG)

Mọi thao tác tạo mới hoặc chỉnh sửa tệp tin trong dự án bắt buộc phải được ghi lại vào tệp `CHANGES.log` tại thư mục gốc dự án:
`[Thời gian ISO/Hệ thống] <Tên file>: <Mô tả ngắn gọn thay đổi>`
