
import DatLichHen from "../../page/appointment-LichHen/DatLichhen";
import PageDetail from "../../page/auth/PageDetails";
import DanhSachKH from "../../page/customer-KhachHang/Danh_sach_KH";
import DichVuTK from "../../page/dashboard-ThongKe/Dich_Vu_TK";
import HieuSuatNV from "../../page/dashboard-ThongKe/Hieu_suat_NV";
import ThongKeTC from "../../page/dashboard-ThongKe/Thong_Ke_TC";
import LichSuDichVu from "../../page/history/LS_Dichvu";
import LichSuKhachHang from "../../page/history/LS_Khachhang";
import DanhSachNV from "../../page/staff-Nhanvien/Danh_sach_NV";
import LoginForm from "../../page/auth/LoginForm";
import NoiDung from "../menu/NoiDung";
interface DetailsProps {
    currentPage: string;
}

const Details: React.FC<DetailsProps> = ({ currentPage }) => {


    return (
        <div className="overflow-y-auto p-4  bg-white dark:bg-gray-800  text-gray-900 dark:text-white" style={{ height: 'calc(100vh - 64px)' }}>
            
            {/* Render chi tiết trang tùy thuộc vào currentPage */}
            
            {currentPage === 'home' && <PageDetail />}
            {currentPage === 'hsnv' && <HieuSuatNV />}
            {currentPage === 'tktc' && <ThongKeTC />}
            {currentPage === 'dichvutk' && <DichVuTK />}

            {/* Nhan vien */}
            {currentPage === 'danhsachNV' && <DanhSachNV/>}

            {/* Khach hang */}
            {currentPage === "danhsachKH" && <DanhSachKH/>}

            {/* Lịch hẹn */}
            

            {/* Lịch sử */}
            {currentPage === 'lsdv' && <LichSuDichVu />}
            {currentPage === "lskh" && <LichSuKhachHang/>}

            {/* Login */}
            {currentPage === 'logintk' && <LoginForm />}
            
            {/* Nội dung */}
            {currentPage === 'noidunghome' && <NoiDung />}
        </div>
    );
}

export default Details;

