### **Phân tích yêu cầu đề bài:**

---

### 1. **Quản lý sổ văn bằng:**

- **Chức năng chính:**

  - Quản lý thông tin sổ văn bằng theo từng năm.
  - Mỗi năm có một sổ văn bằng riêng biệt.
  - **Số vào sổ** tự động tăng dần khi thêm mới văn bằng trong năm đó.
  - Khi mở sổ mới (đầu năm mới), số vào sổ sẽ **reset về 1**.

- **Dữ liệu cần lưu trữ:**
  - Mã sổ văn bằng (ID duy nhất)
  - Năm phát hành sổ (Year)
  - Số vào sổ hiện tại (để tăng tự động)

---

### 2. **Quyết định tốt nghiệp:**

- **Chức năng chính:**
  - Quản lý các quyết định tốt nghiệp (mỗi năm có nhiều quyết định).
  - Mỗi quyết định gắn với một **sổ văn bằng** cụ thể.
- **Thông tin mỗi quyết định bao gồm:**
  - Mã quyết định (ID duy nhất)
  - **Số quyết định** (duy nhất trong năm)
  - **Ngày ban hành**
  - **Trích yếu** (mô tả ngắn gọn nội dung quyết định)
  - **Mã sổ văn bằng** (để liên kết với sổ văn bằng)

---

### 3. **Cấu hình biểu mẫu phụ lục văn bằng:**

- **Chức năng chính:**
  - Cho phép quản trị viên thêm, chỉnh sửa, xóa các **trường thông tin động** trên văn bằng.
  - Các trường này có thể thay đổi theo từng năm hoặc từng quyết định.
- **Thông tin mỗi trường cấu hình:**
  - Tên trường (ví dụ: "Dân tộc", "Điểm trung bình",...)
  - Kiểu dữ liệu: **String**, **Number**, **Date** (có thể mở rộng)
  - Mô tả (optional)

---

### 4. **Thông tin văn bằng:**

- **Chức năng chính:**

  - Quản lý chi tiết từng văn bằng sinh viên, gắn với **quyết định tốt nghiệp** và **sổ văn bằng**.
  - Khi thêm mới văn bằng:
    - **Số vào sổ** tự động tăng (theo sổ văn bằng).
    - Không cho phép chỉnh sửa lại **số vào sổ** sau khi tạo.
  - Các thông tin khác được lấy từ **biểu mẫu cấu hình**.

- **Thông tin mỗi văn bằng bao gồm:**
  - **Số vào sổ** (tự động tăng, không chỉnh sửa)
  - **Số hiệu văn bằng** (mã duy nhất của từng văn bằng)
  - **Mã sinh viên (MSV)**, **Họ tên**, **Ngày sinh** (bắt buộc)
  - Các trường thông tin động (cấu hình từ biểu mẫu: Nơi sinh, Dân tộc, Điểm trung bình, Xếp hạng, Hệ đào tạo,…)
  - **Mã quyết định tốt nghiệp** (để liên kết)

---

### 5. **Tra cứu văn bằng:**

- **Chức năng chính:**

  - Cho phép người dùng tra cứu thông tin văn bằng và quyết định tốt nghiệp.
  - Người dùng phải nhập **ít nhất 2 thông tin** để tìm kiếm.
  - Ghi nhận **số lượt tra cứu** theo từng quyết định.

- **Các tham số tìm kiếm:**

  - Số hiệu văn bằng
  - Số vào sổ
  - Mã sinh viên (MSV)
  - Họ tên
  - Ngày sinh

- **Yêu cầu ghi nhận:**
  - Mỗi lần tìm kiếm thành công, tăng số lượt tra cứu cho **quyết định tốt nghiệp** tương ứng.

---

### 6. **Yêu cầu bổ sung:**

- Quyền hạn:
  - **Quản trị viên**: Quản lý toàn bộ hệ thống (sổ văn bằng, quyết định, biểu mẫu).
  - **Người dùng**: Chỉ có quyền **tra cứu** thông tin văn bằng.
- Kiểm tra dữ liệu:
  - Đảm bảo tính **duy nhất** của các trường quan trọng (Số vào sổ, Số hiệu văn bằng).
  - **Valid** kiểu dữ liệu khi nhập liệu dựa trên cấu hình biểu mẫu.

Bạn có muốn tiếp tục với thiết kế CSDL hoặc xây dựng các API cho từng chức năng không?
