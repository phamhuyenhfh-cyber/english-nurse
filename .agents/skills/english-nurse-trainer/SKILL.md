---
name: english-nurse-trainer
description: Kích hoạt khi người dùng (đặc biệt là điều dưỡng dụng cụ / CSSD) yêu cầu xây dựng lộ trình học tiếng Anh chuyên ngành điều dưỡng 90 ngày, tạo ứng dụng web Flashcards & Bài tập điền từ, ghi âm luyện phát âm theo từng ngày với sửa lỗi phiên âm IPA, chọn giọng đọc bản xứ, thiết kế giao diện chuẩn Apple Typography & UI/UX Pro Max, tích hợp bài kiểm tra đóng gói tuần, ghi âm đọc lại câu và Trợ lý Gemini AI Voice Chatbot, hoặc hỗ trợ đồng bộ và phát hành web 24/7 vĩnh viễn lên GitHub Pages / Netlify Cloud.
---

# 🩺 Skill: English Nurse 90-Day Learning & Web Portal Assistant

Skill này hướng dẫn chi tiết quy trình xây dựng, phát triển, thiết kế UI/UX và đóng gói trang web tự học Tiếng Anh Chuyên Ngành Điều Dưỡng / CSSD (Central Sterile Supply Department) 90 ngày. Hệ thống tích hợp game Flashcard 3D, Bài tập điền từ & Ghi âm đọc lại câu, Bài kiểm tra đóng gói kiến thức theo tuần (Nối từ, Trắc nghiệm chọn câu đúng), Trợ lý Luyện nói Gemini AI Voice Chatbot nhúng trực tiếp, Bộ chọn giọng đọc bản xứ (Voice Studio), Thanh Bottom Navigation Dock di động, Giao diện chuẩn Apple Typography System & UI/UX Pro Max, Phòng Ghi âm Micro sửa lỗi theo phiên âm IPA, tham chiếu 10 bộ công cụ ngữ âm hàng đầu thế giới (Phonemizer, IPA-Dict, Gruut-IPA, eSpeak-ng), và tự động phát hành Cloud 24/7 vĩnh viễn lên GitHub Pages.

---

## 🎯 1. ĐỐI TƯỢNG VÀ BỐI CẢNH ỨNG DỤNG

- **Học viên**: Điều dưỡng dụng cụ phòng mổ (Scrub Nurse) hoặc Điều dưỡng Khoa Tiệt trùng Trung tâm (CSSD).
- **Đặc điểm bối cảnh**: Môi trường làm việc ít giao tiếp tiếng Anh trực tiếp, phát âm ban đầu còn yếu/dễ ngọng giọng địa phương, dễ bị nản lòng nếu bài học kéo dài quá 30 phút.
- **Giải pháp thiết kế cốt lõi**:
  1. **Micro-learning (15-20 phút/ngày)**: Chia nhỏ 15 Unit từ giáo trình chuẩn *Oxford English for Careers - Nursing 1*.
  2. **Kỹ thuật CSSD Self-Talk**: Vừa đóng gói/hấp tiệt trùng dụng cụ vừa nhẩm hoặc đọc tiếng Anh thành tiếng.
  3. **Ứng dụng Web SPA Apple Typography & UI/UX Pro Max**: Tích hợp đầy đủ Flashcards 3D, Điền từ & Ghi âm đọc lại câu, Bài kiểm tra đóng gói tuần (nối từ, trắc nghiệm), Trợ lý Voice AI Gemini nhúng trực tiếp, Bộ chọn giọng đọc bản xứ, Thanh Bottom Navigation Dock di động và Phòng ghi âm chữa lỗi IPA.
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

## 🚀 4. PHƯƠNG PHÁP ĐÓNG GÓI BÀI HỌC VÀ TRỢ LÝ GEMINI AI

1. **Điền Từ & Ghi Âm Đọc Lại Câu Vừa Điền**:
   - Học sinh tự điền từ tiếng Anh còn thiếu ➔ Bấm 🎙️ Micro thu âm đọc nguyên câu ➔ Máy tự động chấm % IPA và hiển thị Thẻ Chữa Lỗi IPA Màu Vàng cho các từ chưa chuẩn.

2. **Bài Kiểm Tra Đóng Gói Theo Tuần (Weekly Review Test)**:
   - Cuối mỗi tuần học (Ngày 6, 12, 18, 24...), mở tab **`🏆 Kiểm Tra Tuần`** bao gồm:
     * **🧩 Phần 1: Nối Từ Tiếng Anh ➔ Nghĩa Tiếng Việt (Matching Game)**.
     * **🔘 Phần 2: Trắc Nghiệm Chọn Câu Đúng (Multiple Choice A/B/C/D)**.
     * **✏️ Phần 3: Điền Từ & Ghi Âm Đọc Lại Câu**.

3. **Trợ Lý Voice AI Gemini Nhúng Trực Tiếp**:
   - Nhúng trực tiếp khung chat Trợ lý Gemini AI trong tab **`🤖 Luyện Nói Gemini AI`**.
   - Cho phép nói bằng Micro 🎙️ hoặc gõ văn bản ➔ Gemini phản hồi trực tiếp bằng giọng nói bản xứ chuẩn Mỹ/Anh.

---

## 🛠️ 5. QUY TRÌNH PHÁT HÀNH CLOUD 24/7 LÊN GITHUB PAGES

1. Khởi tạo Git Repo & Authenticate qua Token:
   ```bash
   gh auth token
   git push https://<username>:<token>@github.com/<username>/<repo>.git main --force
   ```
2. Trigger GitHub Pages Build API:
   ```bash
   gh api repos/<username>/<repo>/pages/builds -X POST
   ```
3. Cache-busting URL (`index.html` assets `styles.css?v=7.0`, `app.js?v=7.0`).
