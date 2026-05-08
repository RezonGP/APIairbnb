-- CreateTable
CREATE TABLE `nguoi_dung` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `birthday` VARCHAR(191) NULL,
    `gender` BOOLEAN NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'USER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `nguoi_dung_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vi_tri` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenViTri` VARCHAR(191) NOT NULL,
    `tinhThanh` VARCHAR(191) NOT NULL,
    `quocGia` VARCHAR(191) NOT NULL,
    `hinhAnh` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `phong` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenPhong` VARCHAR(191) NOT NULL,
    `khach` INTEGER NOT NULL,
    `phongNgu` INTEGER NOT NULL,
    `giuong` INTEGER NOT NULL,
    `phongTam` INTEGER NOT NULL,
    `moTa` TEXT NOT NULL,
    `giaTien` INTEGER NOT NULL,
    `mayGiat` BOOLEAN NOT NULL DEFAULT false,
    `banLa` BOOLEAN NOT NULL DEFAULT false,
    `tivi` BOOLEAN NOT NULL DEFAULT false,
    `dieuHoa` BOOLEAN NOT NULL DEFAULT false,
    `wifi` BOOLEAN NOT NULL DEFAULT false,
    `bep` BOOLEAN NOT NULL DEFAULT false,
    `doXe` BOOLEAN NOT NULL DEFAULT false,
    `hoBoi` BOOLEAN NOT NULL DEFAULT false,
    `banUi` BOOLEAN NOT NULL DEFAULT false,
    `maViTri` INTEGER NOT NULL,
    `hinhAnh` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `phong_maViTri_idx`(`maViTri`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dat_phong` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `maPhong` INTEGER NOT NULL,
    `ngayDen` DATETIME(3) NOT NULL,
    `ngayDi` DATETIME(3) NOT NULL,
    `soLuongKhach` INTEGER NOT NULL,
    `maNguoiDung` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `dat_phong_maPhong_idx`(`maPhong`),
    INDEX `dat_phong_maNguoiDung_idx`(`maNguoiDung`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `binh_luan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `maPhong` INTEGER NOT NULL,
    `maNguoiBinhLuan` INTEGER NOT NULL,
    `ngayBinhLuan` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `noiDung` TEXT NOT NULL,
    `saoBinhLuan` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `binh_luan_maPhong_idx`(`maPhong`),
    INDEX `binh_luan_maNguoiBinhLuan_idx`(`maNguoiBinhLuan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `phong` ADD CONSTRAINT `phong_maViTri_fkey` FOREIGN KEY (`maViTri`) REFERENCES `vi_tri`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dat_phong` ADD CONSTRAINT `dat_phong_maPhong_fkey` FOREIGN KEY (`maPhong`) REFERENCES `phong`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dat_phong` ADD CONSTRAINT `dat_phong_maNguoiDung_fkey` FOREIGN KEY (`maNguoiDung`) REFERENCES `nguoi_dung`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `binh_luan` ADD CONSTRAINT `binh_luan_maPhong_fkey` FOREIGN KEY (`maPhong`) REFERENCES `phong`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `binh_luan` ADD CONSTRAINT `binh_luan_maNguoiBinhLuan_fkey` FOREIGN KEY (`maNguoiBinhLuan`) REFERENCES `nguoi_dung`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
