-- 1. Bảng SoVanBang (Sổ văn bằng)
CREATE TABLE SoVanBang (
    id INT AUTO_INCREMENT PRIMARY KEY,       -- Khóa chính
    nam INT NOT NULL UNIQUE,                 -- Năm (duy nhất)
    so_hien_tai INT DEFAULT 1                -- Số vào sổ hiện tại (reset mỗi năm)
);

-- 2. Bảng QuyetDinhTotNghiep (Quyết định tốt nghiệp)
CREATE TABLE QuyetDinhTotNghiep (
    id INT AUTO_INCREMENT PRIMARY KEY,               -- Khóa chính
    so_quyet_dinh VARCHAR(50) UNIQUE NOT NULL,      -- Số quyết định (duy nhất)
    ngay_ban_hanh DATE NOT NULL,                    -- Ngày ban hành
    trich_yeu TEXT,                                 -- Trích yếu nội dung
    so_van_bang_id INT NOT NULL,                    -- Thuộc sổ văn bằng nào
    FOREIGN KEY (so_van_bang_id) REFERENCES SoVanBang(id)
);


-- 3. Bảng CauHinhTruongThongTin (Cấu hình trường thông tin)
CREATE TABLE TruongThongTin (
    id INT AUTO_INCREMENT PRIMARY KEY,                   -- Khóa chính
    ten_truong VARCHAR(100) UNIQUE NOT NULL,            -- Tên trường (duy nhất)
    kieu_du_lieu ENUM('String', 'Number', 'Date') NOT NULL -- Kiểu dữ liệu
);


-- 4. Bảng ThongTinVanBang (Thông tin văn bằng)
CREATE TABLE VanBang (
    id INT AUTO_INCREMENT PRIMARY KEY,                  -- Khóa chính
    so_vao_so INT NOT NULL,                             -- Số vào sổ (tự động tăng)
    so_hieu_van_bang VARCHAR(50) UNIQUE NOT NULL,       -- Số hiệu văn bằng (duy nhất)
    ma_sinh_vien VARCHAR(20) NOT NULL,                  -- Mã sinh viên
    ho_ten VARCHAR(100) NOT NULL,                       -- Họ tên
    ngay_sinh DATE NOT NULL,                            -- Ngày sinh
    quyet_dinh_id INT NOT NULL,                         -- Quyết định tốt nghiệp
    so_van_bang_id INT NOT NULL,                        -- Thuộc sổ văn bằng
    UNIQUE(so_van_bang_id, so_vao_so),                  -- Đảm bảo số vào sổ duy nhất trong năm
    FOREIGN KEY (quyet_dinh_id) REFERENCES QuyetDinhTotNghiep(id),
    FOREIGN KEY (so_van_bang_id) REFERENCES SoVanBang(id)
);


-- 5. Bảng GiaTriTruongThongTin (Giá trị trường thông tin của văn bằng)
CREATE TABLE GiaTriTruongThongTin (
    id INT AUTO_INCREMENT PRIMARY KEY,                  -- Khóa chính
    van_bang_id INT NOT NULL,                           -- Thuộc văn bằng nào
    truong_thong_tin_id INT NOT NULL,                   -- Thuộc trường thông tin nào
    gia_tri TEXT,                                       -- Giá trị của trường
    UNIQUE(van_bang_id, truong_thong_tin_id),           -- Đảm bảo mỗi văn bằng chỉ có 1 giá trị cho mỗi trường
    FOREIGN KEY (van_bang_id) REFERENCES VanBang(id),
    FOREIGN KEY (truong_thong_tin_id) REFERENCES TruongThongTin(id)
);


-- 6. Bảng LuotTraCuu (Lượt tra cứu)
CREATE TABLE LuotTraCuu (
    id INT AUTO_INCREMENT PRIMARY KEY,                  -- Khóa chính
    van_bang_id INT NOT NULL,                           -- Văn bằng được tra cứu
    quyet_dinh_id INT NOT NULL,                         -- Quyết định liên quan
    thoi_gian TIMESTAMP DEFAULT CURRENT_TIMESTAMP,      -- Thời gian tra cứu
    FOREIGN KEY (van_bang_id) REFERENCES VanBang(id),
    FOREIGN KEY (quyet_dinh_id) REFERENCES QuyetDinhTotNghiep(id)
);

DELIMITER $$

CREATE TRIGGER trg_tang_so_vao_so
BEFORE INSERT ON VanBang
FOR EACH ROW
BEGIN
    DECLARE so_vao_so_moi INT;
    DECLARE so_van_bang_id INT;
    
    -- Lấy năm hiện tại
    SET @nam_hien_tai = YEAR(CURDATE());

    -- Kiểm tra sổ văn bằng của năm hiện tại
    SELECT id, so_hien_tai INTO so_van_bang_id, so_vao_so_moi
    FROM SoVanBang
    WHERE nam = @nam_hien_tai
    LIMIT 1;

    -- Nếu không tìm thấy sổ, tạo mới
    IF so_van_bang_id IS NULL THEN
        INSERT INTO SoVanBang (nam, so_hien_tai) VALUES (@nam_hien_tai, 1);
        SET so_vao_so_moi = 1;
        SET so_van_bang_id = LAST_INSERT_ID();
    ELSE
        -- Cập nhật số vào sổ
        UPDATE SoVanBang SET so_hien_tai = so_hien_tai + 1 WHERE id = so_van_bang_id;
        SET so_vao_so_moi = so_vao_so_moi + 1;
    END IF;

    -- Gán giá trị cho bản ghi mới
    SET NEW.so_vao_so = so_vao_so_moi;
    SET NEW.so_van_bang_id = so_van_bang_id;

END $$

DELIMITER ;

