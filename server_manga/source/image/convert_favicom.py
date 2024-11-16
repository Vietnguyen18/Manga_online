from PIL import Image


def convert_to_favicon_high_quality(input_image_path, output_icon_path):
    # Mở ảnh gốc
    img = Image.open(input_image_path)

    # Kiểm tra kích thước ảnh
    if img.size[0] < 256 or img.size[1] < 256:
        print(
            "Ảnh gốc có độ phân giải thấp hơn 256x256. Hãy sử dụng ảnh có độ phân giải cao hơn."
        )
        return

    # Tạo favicon chỉ với kích thước lớn nhất (256x256)
    img.save(output_icon_path, format="ICO", sizes=[(256, 256)])
    print(f"Favicon chất lượng cao đã được lưu tại: {output_icon_path}")


# Đường dẫn ảnh gốc và favicon đầu ra
input_image = "/home/ducviet/Pictures/logo.png"  # Đường dẫn ảnh gốc 4K
output_icon = "/home/ducviet/Pictures/favicon.ico"  # Đường dẫn lưu favicon

# Chuyển đổi
convert_to_favicon_high_quality(input_image, output_icon)
