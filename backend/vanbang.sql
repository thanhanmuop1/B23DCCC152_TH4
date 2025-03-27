-- 1. Bảng SoVanBang (Sổ văn bằng)
CREATE TABLE SoVanBang (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nam INT NOT NULL,
    ngay_tao DATE NOT NULL,
    mo_ta VARCHAR(255)
);

-- 2. Bảng QuyetDinhTotNghiep (Quyết định tốt nghiệp)
CREATE TABLE QuyetDinhTotNghiep (
    id INT PRIMARY KEY AUTO_INCREMENT,
    so_quyet_dinh VARCHAR(50) NOT NULL,
    ngay_ban_hanh DATE NOT NULL,
    trich_yeu VARCHAR(255),
    so_van_bang_id INT NOT NULL,
    CONSTRAINT fk_quyetdinh_sovanbang FOREIGN KEY (so_van_bang_id)
        REFERENCES SoVanBang(id)
);

-- 3. Bảng CauHinhTruongThongTin (Cấu hình trường thông tin)
CREATE TABLE CauHinhTruongThongTin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ten_truong VARCHAR(100) NOT NULL,
    kieu_du_lieu ENUM('String', 'Number', 'Date') NOT NULL
);

-- 4. Bảng ThongTinVanBang (Thông tin văn bằng)
CREATE TABLE ThongTinVanBang (
    id INT PRIMARY KEY AUTO_INCREMENT,
    so_vao_so INT NOT NULL, -- Số thứ tự trong sổ, tự tăng theo sổ văn bằng
    so_hieu_van_bang VARCHAR(50) NOT NULL,
    ma_sinh_vien VARCHAR(50) NOT NULL,
    ho_ten VARCHAR(100) NOT NULL,
    ngay_sinh DATE NOT NULL,
    quyet_dinh_id INT NOT NULL,
    CONSTRAINT fk_vanbang_quyetdinh FOREIGN KEY (quyet_dinh_id)
        REFERENCES QuyetDinhTotNghiep(id)
);

-- 5. Bảng GiaTriTruongThongTin (Giá trị trường thông tin của văn bằng)
CREATE TABLE GiaTriTruongThongTin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    van_bang_id INT NOT NULL,
    truong_thong_tin_id INT NOT NULL,
    gia_tri VARCHAR(255), -- Lưu giá trị dạng chuỗi (có thể convert sau nếu cần)
    CONSTRAINT fk_giatrutruong_vanbang FOREIGN KEY (van_bang_id)
        REFERENCES ThongTinVanBang(id),
    CONSTRAINT fk_giatrutruong_cauhinh FOREIGN KEY (truong_thong_tin_id)
        REFERENCES CauHinhTruongThongTin(id)
);

-- 6. Bảng LuotTraCuu (Lượt tra cứu)
CREATE TABLE LuotTraCuu (
    id INT PRIMARY KEY AUTO_INCREMENT,
    van_bang_id INT NOT NULL,
    thoi_gian_tra_cuu DATETIME NOT NULL,
    CONSTRAINT fk_luottracuu_vanbang FOREIGN KEY (van_bang_id)
        REFERENCES ThongTinVanBang(id)
);
