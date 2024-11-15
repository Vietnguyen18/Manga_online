from pdf2image import convert_from_path
from PIL import Image
import os


def remove_white_background(image):
    # Chuyển ảnh sang chế độ RGBA (để thêm kênh alpha)
    image = image.convert("RGBA")
    datas = image.getdata()

    # Loại bỏ màu trắng và thay bằng nền trong suốt
    new_data = []
    for item in datas:
        # Kiểm tra nếu pixel là màu trắng (R=255, G=255, B=255)
        if item[:3] == (255, 255, 255):
            new_data.append((255, 255, 255, 0))  # Đặt độ trong suốt (alpha = 0)
        else:
            new_data.append(item)  # Giữ nguyên các pixel khác

    image.putdata(new_data)
    return image


def pdf_to_png_high_quality(pdf_path, output_folder, dpi=600):
    # Đảm bảo thư mục đầu ra tồn tại
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Chuyển đổi PDF sang các trang ảnh với DPI cao
    pages = convert_from_path(pdf_path, dpi=dpi)

    # Xử lý từng trang và lưu dưới dạng PNG
    for i, page in enumerate(pages):
        # Xóa nền trắng
        page_with_transparency = remove_white_background(page)

        # Đường dẫn file xuất ra
        output_path = os.path.join(output_folder, f"page_{i+1}.png")
        page_with_transparency.save(output_path, "PNG")
        print(f"Lưu thành công: {output_path}")


# Sử dụng hàm
pdf_path = "/home/ducviet/Pictures/Manga.pdf"  # Đường dẫn đến tệp PDF của bạn
output_folder = "/home/ducviet/Pictures/"  # Thư mục lưu các hình ảnh xuất ra
pdf_to_png_high_quality(
    pdf_path, output_folder, dpi=1200
)  # Sử dụng DPI 1200 cho ảnh nét nhất
