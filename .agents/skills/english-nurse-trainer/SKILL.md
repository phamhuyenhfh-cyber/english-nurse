---
name: english-nurse-trainer
description: Kích hoạt khi người dùng (đặc biệt là điều dưỡng dụng cụ / CSSD) yêu cầu xây dựng lộ trình học tiếng Anh chuyên ngành điều dưỡng 90 ngày, tạo ứng dụng web Flashcards & Bài tập điền từ, ghi âm luyện phát âm, hoặc hỗ trợ đồng bộ và phát hành web lên GitHub Pages / Netlify.
---

# 🩺 Skill: English Nurse 90-Day Learning & Web Portal Assistant

Skill này hướng dẫn Agent cách lập kế hoạch, phát triển trang web tự học tiếng Anh chuyên ngành Điều dưỡng / CSSD (Central Sterile Supply Department) 90 ngày, tích hợp game Flashcard, bài tập điền từ tự nhớ 100%, chấm điểm phát âm qua Micro, và tự động phát hành web 24/7 lên GitHub Pages / Netlify Cloud.

---

## 🎯 ĐỐI TƯỢNG VÀ BỐI CẢNH ỨNG DỤNG

- **Học viên**: Điều dưỡng dụng cụ phòng mổ (Scrub Nurse) hoặc Điều dưỡng Khoa Tiệt trùng Trung tâm (CSSD).
- **Đặc điểm bối cảnh**: Môi trường làm việc ít giao tiếp tiếng Anh trực tiếp, phát âm ban đầu còn yếu, hay có tâm lý nản lòng/bỏ cuộc nếu bài học quá dài.
- **Giải pháp học tập**:
  1. **Micro-learning (15-20 phút/ngày)**: Chia nhỏ kiến thức từ giáo trình chuẩn *Oxford English for Careers - Nursing 1*.
  2. **Kỹ thuật CSSD Self-Talk**: Vừa làm việc tiệt trùng/đóng gói dụng cụ vừa tự nhẩm tiếng Anh thành tiếng.
  3. **Ứng dụng Web Tự Học SPA**: Đầy đủ Flashcards 3D, Bài tập điền từ tự nhớ (không gợi ý), Phòng ghi âm micro so sánh giọng đọc bản xứ.
  4. **Triển khai Cloud 24/7**: Phát hành lên GitHub Pages hoặc Netlify để mở trên điện thoại và máy tính cơ quan mà không bị đứt kết nối (tránh lỗi Bad Gateway khi tắt máy nhà).

---

## 📋 QUY TRÌNH THỰC HIỆN KHI ĐÓNG GÓI BÀI HỌC VÀ LẬP WEB

### 1. Thiết kế Lộ trình 90 Ngày & Bộ Dữ Liệu (`data.js`)
- **Tỷ lệ 1-1 chính xác**: Mỗi ngày học 5 từ vựng mới ➔ Phải có đúng 5 câu bài tập điền từ tương ứng (không được thiếu câu nào).
- **Không gợi ý ký tự đầu**: Ẩn hoàn toàn chữ cái đầu tiên trong bài tập điền từ để học viên chủ động tự nhớ từ vựng.
- **Nội dung bổ sung mỗi bài**:
  * Từ vựng + Phiên âm chuẩn IPA + Nghĩa Tiếng Việt + Ví dụ thực tế.
  * Đoạn thoại Shadowing (nhại lại).
  * Kỹ thuật tự nói chuyện CSSD Self-Talk.
  * Câu lệnh mẫu Luyện phản xạ Đóng vai AI (Roleplay Prompt).

### 2. Cấu trúc Giao diện Web (SPA HTML/CSS/JS)
- **Thiết kế Responsive & Chuẩn Y Tế**: Tông màu Teal (`#0d9488`) tươi sáng, sạch sẽ, chuẩn giao diện y tế hiện đại.
- **Tính năng bắt buộc trong Web**:
  * **Bộ Chọn Giọng Đọc Bản Xứ (Voice Studio)**: Cho phép quét và ép chọn giọng phát âm bản xứ (`en-US`, `en-GB`, `en-AU`) tránh bị ngọng tiếng Việt trên trình duyệt di động.
  * **Trò chơi Flashcard 3D**: Lật thẻ học từ chia theo từng Ngày học.
  * **Bài tập Điền từ Kiểm tra trí nhớ**: Gõ đáp án và chấm điểm ngay.
  * **Phòng Ghi Âm Studio**: Thu âm micro (`MediaRecorder`), nghe lại và phân tích % chính xác từng từ (tô màu xanh cho từ phát âm đúng, gạch đỏ cho từ đọc sai).
  * **Đồng bộ Tiến độ (Sync Code)**: Nút `📋 Copy Tiến Độ` và `📥 Dán Tiến Độ` giúp chuyển kết quả học giữa máy nhà, máy cơ quan và điện thoại.

### 3. Quy trình Đóng gói & Phát hành Cloud 24/7 vĩnh viễn
1. **Tạo tệp nén Zip phẳng (Flat ZIP)**:
   - Nén trực tiếp các tệp `index.html`, `styles.css`, `data.js`, `app.js` vào file zip sao cho `index.html` nằm ngay tại thư mục gốc của file ZIP.
2. **Triển khai lên GitHub Pages (Tự động vĩnh viễn)**:
   ```bash
   git init
   git branch -M main
   gh repo create <username>/<repo-name> --public --source=. --push
   gh api repos/<username>/<repo-name>/pages -X POST -F "source[branch]=main" -F "source[path]=/"
   ```
3. **Địa chỉ URL 24/7**: `https://<username>.github.io/<repo-name>/` (Chạy 24/24h vĩnh viễn ngay cả khi tắt máy tính cá nhân).

---

## ⚠️ QUY TẮC AN TOÀN VÀ LƯU VẾT HỆ THỐNG (MANDATORY LOGGING)

Mọi thao tác tạo mới hoặc chỉnh sửa tệp tin trong workspace bắt buộc phải ghi lịch sử hành động vào tệp `CHANGES.log` tại thư mục gốc dự án theo định dạng:
`[Thời gian ISO/Hệ thống] <Tên file>: <Mô tả ngắn gọn thay đổi>`
