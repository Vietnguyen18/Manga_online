from pdf2image import convert_from_path
import os

def pdf_to_png(pdf_path, output_folder, dpi=1200):
    """
    Chuyển đổi tệp PDF sang các hình ảnh PNG.
    
    Args:
        pdf_path (str): Đường dẫn đến tệp PDF.
        output_folder (str): Thư mục để lưu các tệp PNG.
        dpi (int): Độ phân giải của ảnh (dots per inch).
    """
    # Đảm bảo thư mục đầu ra tồn tại
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Chuyển đổi PDF sang các trang ảnh
    pages = convert_from_path(pdf_path, dpi=dpi)

    # Lưu từng trang thành ảnh PNG
    for i, page in enumerate(pages):
        output_path = os.path.join(output_folder, f"page_{i + 1}.png")
        page.save(output_path, "PNG")
        print(f"Lưu thành công: {output_path}")

# Sử dụng hàm
pdf_path = "/home/ducviet/Downloads/banner.pdf"  # Đường dẫn file PDF
output_folder = "/home/ducviet/Pictures/"  # Thư mục lưu ảnh
pdf_to_png(pdf_path, output_folder, dpi=1200)  # Chuyển đổi với DPI mặc định là 300
