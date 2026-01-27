import React, { useState, useEffect } from "react";

/**
 * AddressSelector - Component chọn địa chỉ Việt Nam chuyên nghiệp
 * CHỈ HỖ TRỢ: Hà Nội, HCM, Đà Nẵng, Cần Thơ
 * 
 * Props:
 * - onAddressChange(fullAddress, addressParts, isSupported) - Callback khi địa chỉ thay đổi
 * - onSupportStatusChange(isSupported) - Callback khi trạng thái hỗ trợ thay đổi
 */

// =====================================================
// DỮ LIỆU ĐỊA CHỈ TĨNH - CHỈ 4 THÀNH PHỐ LỚN
// =====================================================
const SUPPORTED_CITIES = {
    hanoi: {
        code: "hanoi",
        name: "Hà Nội",
        districts: [
            {
                code: "ba-dinh",
                name: "Quận Ba Đình",
                wards: [
                    { code: "phuc-xa", name: "Phường Phúc Xá" },
                    { code: "truc-bach", name: "Phường Trúc Bạch" },
                    { code: "vinh-phuc", name: "Phường Vĩnh Phúc" },
                    { code: "cong-vi", name: "Phường Cống Vị" },
                    { code: "lieu-giai", name: "Phường Liễu Giai" },
                    { code: "nguyen-trung-truc", name: "Phường Nguyễn Trung Trực" },
                    { code: "quan-thanh", name: "Phường Quán Thánh" },
                    { code: "ngoc-ha", name: "Phường Ngọc Hà" },
                    { code: "dien-bien", name: "Phường Điện Biên" },
                    { code: "doi-can", name: "Phường Đội Cấn" },
                ],
            },
            {
                code: "hoan-kiem",
                name: "Quận Hoàn Kiếm",
                wards: [
                    { code: "phan-chu-trinh", name: "Phường Phan Chu Trinh" },
                    { code: "hang-bai", name: "Phường Hàng Bài" },
                    { code: "hang-bong", name: "Phường Hàng Bông" },
                    { code: "hang-dao", name: "Phường Hàng Đào" },
                    { code: "hang-gai", name: "Phường Hàng Gai" },
                    { code: "cua-dong", name: "Phường Cửa Đông" },
                    { code: "ly-thai-to", name: "Phường Lý Thái Tổ" },
                    { code: "trang-tien", name: "Phường Tràng Tiền" },
                    { code: "hang-trong", name: "Phường Hàng Trống" },
                    { code: "cua-nam", name: "Phường Cửa Nam" },
                ],
            },
            {
                code: "dong-da",
                name: "Quận Đống Đa",
                wards: [
                    { code: "cat-linh", name: "Phường Cát Linh" },
                    { code: "van-mieu", name: "Phường Văn Miếu" },
                    { code: "quoc-tu-giam", name: "Phường Quốc Tử Giám" },
                    { code: "hang-bot", name: "Phường Hàng Bột" },
                    { code: "lang-thuong", name: "Phường Láng Thượng" },
                    { code: "lang-ha", name: "Phường Láng Hạ" },
                    { code: "o-cho-dua", name: "Phường Ô Chợ Dừa" },
                    { code: "kham-thien", name: "Phường Khâm Thiên" },
                    { code: "tho-quan", name: "Phường Thổ Quan" },
                    { code: "kim-lien", name: "Phường Kim Liên" },
                ],
            },
            {
                code: "cau-giay",
                name: "Quận Cầu Giấy",
                wards: [
                    { code: "nghia-do", name: "Phường Nghĩa Đô" },
                    { code: "nghia-tan", name: "Phường Nghĩa Tân" },
                    { code: "mai-dich", name: "Phường Mai Dịch" },
                    { code: "dich-vong", name: "Phường Dịch Vọng" },
                    { code: "dich-vong-hau", name: "Phường Dịch Vọng Hậu" },
                    { code: "quan-hoa", name: "Phường Quan Hoa" },
                    { code: "yen-hoa", name: "Phường Yên Hoà" },
                    { code: "trung-hoa", name: "Phường Trung Hoà" },
                ],
            },
            {
                code: "thanh-xuan",
                name: "Quận Thanh Xuân",
                wards: [
                    { code: "nhan-chinh", name: "Phường Nhân Chính" },
                    { code: "thanh-xuan-trung", name: "Phường Thanh Xuân Trung" },
                    { code: "thanh-xuan-nam", name: "Phường Thanh Xuân Nam" },
                    { code: "thanh-xuan-bac", name: "Phường Thanh Xuân Bắc" },
                    { code: "khuong-trung", name: "Phường Khương Trung" },
                    { code: "khuong-mai", name: "Phường Khương Mai" },
                    { code: "khuong-dinh", name: "Phường Khương Đình" },
                    { code: "ha-dinh", name: "Phường Hạ Đình" },
                ],
            },
            {
                code: "hai-ba-trung",
                name: "Quận Hai Bà Trưng",
                wards: [
                    { code: "nguyen-du", name: "Phường Nguyễn Du" },
                    { code: "le-dai-hanh", name: "Phường Lê Đại Hành" },
                    { code: "dong-nhan", name: "Phường Đồng Nhân" },
                    { code: "pho-hue", name: "Phường Phố Huế" },
                    { code: "bach-khoa", name: "Phường Bách Khoa" },
                    { code: "bach-mai", name: "Phường Bạch Mai" },
                    { code: "truong-dinh", name: "Phường Trương Định" },
                    { code: "minh-khai", name: "Phường Minh Khai" },
                ],
            },
        ],
    },
    hcm: {
        code: "hcm",
        name: "TP. Hồ Chí Minh",
        districts: [
            {
                code: "quan-1",
                name: "Quận 1",
                wards: [
                    { code: "ben-nghe", name: "Phường Bến Nghé" },
                    { code: "ben-thanh", name: "Phường Bến Thành" },
                    { code: "co-giang", name: "Phường Cô Giang" },
                    { code: "cau-kho", name: "Phường Cầu Kho" },
                    { code: "cau-ong-lanh", name: "Phường Cầu Ông Lãnh" },
                    { code: "da-kao", name: "Phường Đa Kao" },
                    { code: "nguyen-cu-trinh", name: "Phường Nguyễn Cư Trinh" },
                    { code: "nguyen-thai-binh", name: "Phường Nguyễn Thái Bình" },
                    { code: "pham-ngu-lao", name: "Phường Phạm Ngũ Lão" },
                    { code: "tan-dinh", name: "Phường Tân Định" },
                ],
            },
            {
                code: "quan-3",
                name: "Quận 3",
                wards: [
                    { code: "phuong-1", name: "Phường 1" },
                    { code: "phuong-2", name: "Phường 2" },
                    { code: "phuong-3", name: "Phường 3" },
                    { code: "phuong-4", name: "Phường 4" },
                    { code: "phuong-5", name: "Phường 5" },
                    { code: "phuong-9", name: "Phường 9" },
                    { code: "phuong-10", name: "Phường 10" },
                    { code: "phuong-11", name: "Phường 11" },
                    { code: "phuong-12", name: "Phường 12" },
                    { code: "phuong-13", name: "Phường 13" },
                    { code: "vo-thi-sau", name: "Phường Võ Thị Sáu" },
                ],
            },
            {
                code: "quan-7",
                name: "Quận 7",
                wards: [
                    { code: "tan-hung", name: "Phường Tân Hưng" },
                    { code: "tan-kieng", name: "Phường Tân Kiểng" },
                    { code: "tan-phong", name: "Phường Tân Phong" },
                    { code: "tan-phu", name: "Phường Tân Phú" },
                    { code: "tan-quy", name: "Phường Tân Quy" },
                    { code: "tan-thuan-dong", name: "Phường Tân Thuận Đông" },
                    { code: "tan-thuan-tay", name: "Phường Tân Thuận Tây" },
                    { code: "binh-thuan", name: "Phường Bình Thuận" },
                    { code: "phu-my", name: "Phường Phú Mỹ" },
                    { code: "phu-thuan", name: "Phường Phú Thuận" },
                ],
            },
            {
                code: "quan-10",
                name: "Quận 10",
                wards: [
                    { code: "phuong-1", name: "Phường 1" },
                    { code: "phuong-2", name: "Phường 2" },
                    { code: "phuong-4", name: "Phường 4" },
                    { code: "phuong-5", name: "Phường 5" },
                    { code: "phuong-6", name: "Phường 6" },
                    { code: "phuong-7", name: "Phường 7" },
                    { code: "phuong-8", name: "Phường 8" },
                    { code: "phuong-9", name: "Phường 9" },
                    { code: "phuong-10", name: "Phường 10" },
                    { code: "phuong-11", name: "Phường 11" },
                    { code: "phuong-12", name: "Phường 12" },
                    { code: "phuong-13", name: "Phường 13" },
                    { code: "phuong-14", name: "Phường 14" },
                    { code: "phuong-15", name: "Phường 15" },
                ],
            },
            {
                code: "binh-thanh",
                name: "Quận Bình Thạnh",
                wards: [
                    { code: "phuong-1", name: "Phường 1" },
                    { code: "phuong-2", name: "Phường 2" },
                    { code: "phuong-3", name: "Phường 3" },
                    { code: "phuong-5", name: "Phường 5" },
                    { code: "phuong-6", name: "Phường 6" },
                    { code: "phuong-7", name: "Phường 7" },
                    { code: "phuong-11", name: "Phường 11" },
                    { code: "phuong-12", name: "Phường 12" },
                    { code: "phuong-13", name: "Phường 13" },
                    { code: "phuong-14", name: "Phường 14" },
                    { code: "phuong-15", name: "Phường 15" },
                    { code: "phuong-17", name: "Phường 17" },
                    { code: "phuong-19", name: "Phường 19" },
                    { code: "phuong-21", name: "Phường 21" },
                    { code: "phuong-22", name: "Phường 22" },
                    { code: "phuong-24", name: "Phường 24" },
                    { code: "phuong-25", name: "Phường 25" },
                    { code: "phuong-26", name: "Phường 26" },
                    { code: "phuong-27", name: "Phường 27" },
                    { code: "phuong-28", name: "Phường 28" },
                ],
            },
            {
                code: "phu-nhuan",
                name: "Quận Phú Nhuận",
                wards: [
                    { code: "phuong-1", name: "Phường 1" },
                    { code: "phuong-2", name: "Phường 2" },
                    { code: "phuong-3", name: "Phường 3" },
                    { code: "phuong-4", name: "Phường 4" },
                    { code: "phuong-5", name: "Phường 5" },
                    { code: "phuong-7", name: "Phường 7" },
                    { code: "phuong-8", name: "Phường 8" },
                    { code: "phuong-9", name: "Phường 9" },
                    { code: "phuong-10", name: "Phường 10" },
                    { code: "phuong-11", name: "Phường 11" },
                    { code: "phuong-12", name: "Phường 12" },
                    { code: "phuong-13", name: "Phường 13" },
                    { code: "phuong-14", name: "Phường 14" },
                    { code: "phuong-15", name: "Phường 15" },
                    { code: "phuong-17", name: "Phường 17" },
                ],
            },
            {
                code: "go-vap",
                name: "Quận Gò Vấp",
                wards: [
                    { code: "phuong-1", name: "Phường 1" },
                    { code: "phuong-3", name: "Phường 3" },
                    { code: "phuong-4", name: "Phường 4" },
                    { code: "phuong-5", name: "Phường 5" },
                    { code: "phuong-6", name: "Phường 6" },
                    { code: "phuong-7", name: "Phường 7" },
                    { code: "phuong-8", name: "Phường 8" },
                    { code: "phuong-9", name: "Phường 9" },
                    { code: "phuong-10", name: "Phường 10" },
                    { code: "phuong-11", name: "Phường 11" },
                    { code: "phuong-12", name: "Phường 12" },
                    { code: "phuong-13", name: "Phường 13" },
                    { code: "phuong-14", name: "Phường 14" },
                    { code: "phuong-15", name: "Phường 15" },
                    { code: "phuong-16", name: "Phường 16" },
                    { code: "phuong-17", name: "Phường 17" },
                ],
            },
            {
                code: "thu-duc",
                name: "TP. Thủ Đức",
                wards: [
                    { code: "linh-dong", name: "Phường Linh Đông" },
                    { code: "linh-tay", name: "Phường Linh Tây" },
                    { code: "linh-chieu", name: "Phường Linh Chiểu" },
                    { code: "linh-trung", name: "Phường Linh Trung" },
                    { code: "linh-xuan", name: "Phường Linh Xuân" },
                    { code: "binh-chieu", name: "Phường Bình Chiểu" },
                    { code: "binh-tho", name: "Phường Bình Thọ" },
                    { code: "hiep-binh-chanh", name: "Phường Hiệp Bình Chánh" },
                    { code: "hiep-binh-phuoc", name: "Phường Hiệp Bình Phước" },
                    { code: "tam-binh", name: "Phường Tam Bình" },
                    { code: "tam-phu", name: "Phường Tam Phú" },
                    { code: "truong-tho", name: "Phường Trường Thọ" },
                ],
            },
        ],
    },
    danang: {
        code: "danang",
        name: "Đà Nẵng",
        districts: [
            {
                code: "hai-chau",
                name: "Quận Hải Châu",
                wards: [
                    { code: "thanh-binh", name: "Phường Thanh Bình" },
                    { code: "thuan-phuoc", name: "Phường Thuận Phước" },
                    { code: "thach-thang", name: "Phường Thạch Thang" },
                    { code: "hai-chau-1", name: "Phường Hải Châu 1" },
                    { code: "hai-chau-2", name: "Phường Hải Châu 2" },
                    { code: "phuoc-ninh", name: "Phường Phước Ninh" },
                    { code: "hoa-thuan-tay", name: "Phường Hoà Thuận Tây" },
                    { code: "hoa-thuan-dong", name: "Phường Hoà Thuận Đông" },
                    { code: "nam-duong", name: "Phường Nam Dương" },
                    { code: "binh-hien", name: "Phường Bình Hiên" },
                    { code: "binh-thuan", name: "Phường Bình Thuận" },
                    { code: "hoa-cuong-bac", name: "Phường Hoà Cường Bắc" },
                    { code: "hoa-cuong-nam", name: "Phường Hoà Cường Nam" },
                ],
            },
            {
                code: "thanh-khe",
                name: "Quận Thanh Khê",
                wards: [
                    { code: "tam-thuan", name: "Phường Tam Thuận" },
                    { code: "thanh-khe-tay", name: "Phường Thanh Khê Tây" },
                    { code: "thanh-khe-dong", name: "Phường Thanh Khê Đông" },
                    { code: "xuan-ha", name: "Phường Xuân Hà" },
                    { code: "tan-chinh", name: "Phường Tân Chính" },
                    { code: "chinh-gian", name: "Phường Chính Gián" },
                    { code: "vinh-trung", name: "Phường Vĩnh Trung" },
                    { code: "thac-gian", name: "Phường Thạc Gián" },
                    { code: "an-khe", name: "Phường An Khê" },
                    { code: "hoa-khe", name: "Phường Hoà Khê" },
                ],
            },
            {
                code: "son-tra",
                name: "Quận Sơn Trà",
                wards: [
                    { code: "tho-quang", name: "Phường Thọ Quang" },
                    { code: "nai-hien-dong", name: "Phường Nại Hiên Đông" },
                    { code: "man-thai", name: "Phường Mân Thái" },
                    { code: "an-hai-bac", name: "Phường An Hải Bắc" },
                    { code: "an-hai-tay", name: "Phường An Hải Tây" },
                    { code: "an-hai-dong", name: "Phường An Hải Đông" },
                    { code: "phuoc-my", name: "Phường Phước Mỹ" },
                ],
            },
            {
                code: "ngu-hanh-son",
                name: "Quận Ngũ Hành Sơn",
                wards: [
                    { code: "my-an", name: "Phường Mỹ An" },
                    { code: "khue-my", name: "Phường Khuê Mỹ" },
                    { code: "hoa-quy", name: "Phường Hoà Quý" },
                    { code: "hoa-hai", name: "Phường Hoà Hải" },
                ],
            },
            {
                code: "lien-chieu",
                name: "Quận Liên Chiểu",
                wards: [
                    { code: "hoa-hiep-bac", name: "Phường Hoà Hiệp Bắc" },
                    { code: "hoa-hiep-nam", name: "Phường Hoà Hiệp Nam" },
                    { code: "hoa-khanh-bac", name: "Phường Hoà Khánh Bắc" },
                    { code: "hoa-khanh-nam", name: "Phường Hoà Khánh Nam" },
                    { code: "hoa-minh", name: "Phường Hoà Minh" },
                ],
            },
            {
                code: "cam-le",
                name: "Quận Cẩm Lệ",
                wards: [
                    { code: "khue-trung", name: "Phường Khuê Trung" },
                    { code: "hoa-phat", name: "Phường Hoà Phát" },
                    { code: "hoa-an", name: "Phường Hoà An" },
                    { code: "hoa-tho-dong", name: "Phường Hoà Thọ Đông" },
                    { code: "hoa-tho-tay", name: "Phường Hoà Thọ Tây" },
                    { code: "hoa-xuan", name: "Phường Hoà Xuân" },
                ],
            },
        ],
    },
    cantho: {
        code: "cantho",
        name: "Cần Thơ",
        districts: [
            {
                code: "ninh-kieu",
                name: "Quận Ninh Kiều",
                wards: [
                    { code: "cai-khe", name: "Phường Cái Khế" },
                    { code: "an-hoa", name: "Phường An Hoà" },
                    { code: "thoi-binh", name: "Phường Thới Bình" },
                    { code: "an-nghiep", name: "Phường An Nghiệp" },
                    { code: "an-cu", name: "Phường An Cư" },
                    { code: "an-hoi", name: "Phường An Hội" },
                    { code: "tan-an", name: "Phường Tân An" },
                    { code: "an-lac", name: "Phường An Lạc" },
                    { code: "an-phu", name: "Phường An Phú" },
                    { code: "xuan-khanh", name: "Phường Xuân Khánh" },
                    { code: "hung-loi", name: "Phường Hưng Lợi" },
                    { code: "an-khanh", name: "Phường An Khánh" },
                    { code: "an-binh", name: "Phường An Bình" },
                ],
            },
            {
                code: "binh-thuy",
                name: "Quận Bình Thủy",
                wards: [
                    { code: "binh-thuy", name: "Phường Bình Thủy" },
                    { code: "tra-an", name: "Phường Trà An" },
                    { code: "tra-noc", name: "Phường Trà Nóc" },
                    { code: "thoi-an-dong", name: "Phường Thới An Đông" },
                    { code: "an-thoi", name: "Phường An Thới" },
                    { code: "bui-huu-nghia", name: "Phường Bùi Hữu Nghĩa" },
                    { code: "long-hoa", name: "Phường Long Hoà" },
                    { code: "long-tuyen", name: "Phường Long Tuyền" },
                ],
            },
            {
                code: "cai-rang",
                name: "Quận Cái Răng",
                wards: [
                    { code: "le-binh", name: "Phường Lê Bình" },
                    { code: "hung-phu", name: "Phường Hưng Phú" },
                    { code: "hung-thanh", name: "Phường Hưng Thạnh" },
                    { code: "ba-lang", name: "Phường Ba Láng" },
                    { code: "thuong-thanh", name: "Phường Thường Thạnh" },
                    { code: "phu-thu", name: "Phường Phú Thứ" },
                    { code: "tan-phu", name: "Phường Tân Phú" },
                ],
            },
            {
                code: "o-mon",
                name: "Quận Ô Môn",
                wards: [
                    { code: "chau-van-liem", name: "Phường Châu Văn Liêm" },
                    { code: "thoi-hoa", name: "Phường Thới Hoà" },
                    { code: "thoi-long", name: "Phường Thới Long" },
                    { code: "long-hung", name: "Phường Long Hưng" },
                    { code: "thoi-an", name: "Phường Thới An" },
                    { code: "phuoc-thoi", name: "Phường Phước Thới" },
                    { code: "truong-lac", name: "Phường Trường Lạc" },
                ],
            },
            {
                code: "thot-not",
                name: "Quận Thốt Nốt",
                wards: [
                    { code: "thot-not", name: "Phường Thốt Nốt" },
                    { code: "thoi-thuan", name: "Phường Thới Thuận" },
                    { code: "thuan-an", name: "Phường Thuận An" },
                    { code: "tan-loc", name: "Phường Tân Lộc" },
                    { code: "trung-nhut", name: "Phường Trung Nhứt" },
                    { code: "thang-loi", name: "Phường Thắng Lợi" },
                    { code: "tan-hung", name: "Phường Tân Hưng" },
                    { code: "thuan-hung", name: "Phường Thuận Hưng" },
                    { code: "my-thuan", name: "Phường Mỹ Thuận" },
                ],
            },
        ],
    },
};

// Danh sách các tỉnh KHÔNG HỖ TRỢ (chỉ để hiển thị)
const UNSUPPORTED_PROVINCES = [
    "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu",
    "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước",
    "Bình Thuận", "Cà Mau", "Cao Bằng", "Đắk Lắk", "Đắk Nông",
    "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang",
    "Hà Nam", "Hà Tĩnh", "Hải Dương", "Hải Phòng", "Hậu Giang",
    "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum",
    "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An",
    "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ",
    "Phú Yên", "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh",
    "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình",
    "Thái Nguyên", "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "Trà Vinh",
    "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
];

// CSS Styles
const addressStyles = `
  .address-selector {
    background: #fff;
    border-radius: 12px;
    margin-bottom: 20px;
  }

  .address-row {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
  }

  .address-field {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .address-field.full-width {
    flex: 1 1 100%;
  }

  .address-label {
    font-size: 13px;
    font-weight: 500;
    color: #666;
  }

  .address-label .required {
    color: #d32f2f;
  }

  .address-select,
  .address-input {
    width: 100%;
    padding: 12px 14px;
    border: 1.5px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    color: #333;
    background: #fff;
    transition: all 0.25s ease;
    outline: none;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 36px;
  }

  .address-input {
    background-image: none;
    padding-right: 14px;
    cursor: text;
  }

  .address-select:hover,
  .address-input:hover {
    border-color: #bbb;
  }

  .address-select:focus,
  .address-input:focus {
    border-color: #d32f2f;
    box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.1);
  }

  .address-select:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
    opacity: 0.7;
  }

  .address-input::placeholder {
    color: #aaa;
  }

  /* UNSUPPORTED WARNING */
  .shipping-warning {
    background: linear-gradient(135deg, #fff5f5 0%, #ffebee 100%);
    border: 1px solid #ffcdd2;
    border-radius: 10px;
    padding: 16px 20px;
    margin-top: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .shipping-warning-icon {
    font-size: 28px;
    flex-shrink: 0;
  }

  .shipping-warning-text {
    flex: 1;
  }

  .shipping-warning-title {
    font-size: 15px;
    font-weight: 700;
    color: #c62828;
    margin-bottom: 4px;
  }

  .shipping-warning-desc {
    font-size: 13px;
    color: #666;
    line-height: 1.4;
  }

  /* SUPPORTED SUCCESS */
  .shipping-success {
    background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
    border: 1px solid #a5d6a7;
    border-radius: 10px;
    padding: 16px 20px;
    margin-top: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .shipping-success-icon {
    font-size: 28px;
    flex-shrink: 0;
  }

  .shipping-success-text {
    flex: 1;
  }

  .shipping-success-title {
    font-size: 15px;
    font-weight: 700;
    color: #2e7d32;
    margin-bottom: 4px;
  }

  .shipping-success-desc {
    font-size: 13px;
    color: #555;
    line-height: 1.4;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .address-row {
      flex-direction: column;
      gap: 12px;
    }
  }
`;

const AddressSelector = ({ onAddressChange, onSupportStatusChange }) => {
    // States
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);
    const [streetAddress, setStreetAddress] = useState("");
    const [isUnsupported, setIsUnsupported] = useState(false);

    // Get data
    const cities = Object.values(SUPPORTED_CITIES);
    const districts = selectedCity ? selectedCity.districts : [];
    const wards = selectedDistrict ? selectedDistrict.wards : [];

    // =====================
    // HANDLERS
    // =====================
    const handleCityChange = (e) => {
        const code = e.target.value;

        // Check if unsupported province selected OR any city other than HCM
        // User Requirement: "Hiện tại shop chỉ giao hàng trong khu vực TP. Hồ Chí Minh"
        if (code === "unsupported" || (code && code !== "hcm")) {
            setIsUnsupported(true);

            // Allow selecting the city object internally if it exists (e.g. Hanoi) so the label shows up,
            // but mark it as unsupported effectively blocking checkout.
            if (code !== "unsupported" && SUPPORTED_CITIES[code]) {
                setSelectedCity(SUPPORTED_CITIES[code]);
            } else {
                setSelectedCity(null);
            }

            setSelectedDistrict(null);
            setSelectedWard(null);
            if (onSupportStatusChange) onSupportStatusChange(false);
            if (onAddressChange) onAddressChange("", {}, false);
            return;
        }

        setIsUnsupported(false);

        if (!code) {
            setSelectedCity(null);
            setSelectedDistrict(null);
            setSelectedWard(null);
            return;
        }

        const city = SUPPORTED_CITIES[code];
        setSelectedCity(city || null);
        setSelectedDistrict(null);
        setSelectedWard(null);

        if (onSupportStatusChange) onSupportStatusChange(true);
    };

    const handleDistrictChange = (e) => {
        const code = e.target.value;
        if (!code) {
            setSelectedDistrict(null);
            setSelectedWard(null);
            return;
        }
        const district = districts.find((d) => d.code === code);
        setSelectedDistrict(district || null);
        setSelectedWard(null);
    };

    const handleWardChange = (e) => {
        const code = e.target.value;
        if (!code) {
            setSelectedWard(null);
            return;
        }
        const ward = wards.find((w) => w.code === code);
        setSelectedWard(ward || null);
    };

    // =====================
    // UPDATE ADDRESS
    // =====================
    useEffect(() => {
        if (isUnsupported) return;

        const parts = [];
        if (streetAddress.trim()) parts.push(streetAddress.trim());
        if (selectedWard) parts.push(selectedWard.name);
        if (selectedDistrict) parts.push(selectedDistrict.name);
        if (selectedCity) parts.push(selectedCity.name);

        const fullAddress = parts.join(", ");
        const isComplete = selectedCity && selectedDistrict && selectedWard && streetAddress.trim();

        if (onAddressChange) {
            onAddressChange(fullAddress, {
                city: selectedCity,
                district: selectedDistrict,
                ward: selectedWard,
                street: streetAddress.trim(),
            }, !isUnsupported && isComplete);
        }
    }, [selectedCity, selectedDistrict, selectedWard, streetAddress, isUnsupported]);

    return (
        <div className="address-selector">
            <style>{addressStyles}</style>

            {/* ROW 1: Tỉnh/Thành phố */}
            <div className="address-row">
                <div className="address-field">
                    <label className="address-label">
                        Tỉnh thành <span className="required">*</span>
                    </label>
                    <select
                        className="address-select"
                        value={isUnsupported && !selectedCity ? "unsupported" : (selectedCity?.code || "")}
                        onChange={handleCityChange}
                    >
                        <option value="">-- Chọn Tỉnh/Thành phố --</option>

                        {/* SUPPORTED CITIES */}
                        <optgroup label="🚚 Khu vực hỗ trợ giao hàng">
                            {cities.map((city) => (
                                <option key={city.code} value={city.code}>
                                    {city.name}
                                </option>
                            ))}
                        </optgroup>

                        {/* UNSUPPORTED PROVINCES */}
                        <optgroup label="⚠️ Khu vực chưa hỗ trợ">
                            <option value="unsupported" style={{ color: '#999' }}>
                                Tỉnh/Thành phố khác...
                            </option>
                        </optgroup>
                    </select>
                </div>
            </div>

            {/* UNSUPPORTED WARNING */}
            {isUnsupported && (
                <div className="shipping-warning">
                    <span className="shipping-warning-icon">🚫</span>
                    <div className="shipping-warning-text">
                        <div className="shipping-warning-title">Khu vực không hỗ trợ vận chuyển</div>
                        <div className="shipping-warning-desc">
                            Hiện tại shop chỉ giao hàng trong khu vực TP. Hồ Chí Minh <br />
                            Rất mong được phục vụ bạn trong thời gian sớm nhất 💛
                        </div>
                    </div>
                </div>
            )}

            {/* SUPPORTED - SHOW FULL FORM */}
            {selectedCity && !isUnsupported && (
                <>
                    {/* ROW 2: Quận/Huyện */}
                    <div className="address-row">
                        <div className="address-field">
                            <label className="address-label">
                                Quận huyện <span className="required">*</span>
                            </label>
                            <select
                                className="address-select"
                                value={selectedDistrict?.code || ""}
                                onChange={handleDistrictChange}
                            >
                                <option value="">-- Chọn Quận/Huyện --</option>
                                {districts.map((d) => (
                                    <option key={d.code} value={d.code}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* ROW 3: Xã/Phường */}
                    {selectedDistrict && (
                        <div className="address-row">
                            <div className="address-field">
                                <label className="address-label">
                                    Phường xã <span className="required">*</span>
                                </label>
                                <select
                                    className="address-select"
                                    value={selectedWard?.code || ""}
                                    onChange={handleWardChange}
                                >
                                    <option value="">-- Chọn Phường/Xã --</option>
                                    {wards.map((w) => (
                                        <option key={w.code} value={w.code}>
                                            {w.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* ROW 4: Địa chỉ chi tiết */}
                    {selectedWard && (
                        <div className="address-row">
                            <div className="address-field full-width">
                                <label className="address-label">
                                    Địa chỉ <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="address-input"
                                    placeholder="Số nhà, tên đường (VD: 123 Nguyễn Văn Linh)"
                                    value={streetAddress}
                                    onChange={(e) => setStreetAddress(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* SUCCESS MESSAGE */}
                    {selectedCity && selectedDistrict && selectedWard && streetAddress.trim() && (
                        <div className="shipping-success">
                            <span className="shipping-success-icon">✅</span>
                            <div className="shipping-success-text">
                                <div className="shipping-success-title">Địa chỉ hợp lệ - Hỗ trợ giao hàng</div>
                                <div className="shipping-success-desc">
                                    📍 {streetAddress}, {selectedWard.name}, {selectedDistrict.name}, {selectedCity.name}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AddressSelector;
