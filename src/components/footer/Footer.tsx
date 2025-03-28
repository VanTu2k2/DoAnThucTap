// import { SpaOutlined } from "@mui/icons-material";


// const Footer:React.FC = () => {
//     return (
//         <div className="flex flex-col justify-center  bg-white dark:bg-gray-800  text-gray-900 dark:text-white items-center p-1">
//             <p style={{
                
//                 fontSize: "12px",
//                 fontWeight: "bold",
//                 textAlign: "center",
//                 lineHeight: "16px",
//                 letterSpacing: "0.4px",
//                 opacity: "0.5" 
//             }}>Copyright © 2025 CRM Massage. All rights reserved.</p>
//             <SpaOutlined style={{
                
//                 fontSize: "24px",
//                 fontWeight: "bold",
//                 lineHeight: "16px",
//                 letterSpacing: "0.4px",
//                 opacity: "0.5"}}/>
//         </div>
//     );
// }

// export default Footer;

const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-gray-800 text-white mt-auto">
            {/* Nội dung Footer */}
            <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
                
                {/* Cột 1: Giới thiệu */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Về chúng tôi</h3>
                    <p className="text-gray-400 text-sm">
                        Chúng tôi chuyên cung cấp các dịch vụ massage trị liệu chất lượng cao, giúp khách hàng thư giãn và phục hồi năng lượng. 
                        Sáng suốt lựa chọn nơi thẩm mỹ an toàn, uy tín nhất, nghĩa là bạn đang tôn trọng chính bạn.
                    </p>
                </div>
                
                {/* Cột 2: Giờ làm việc */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Giờ làm việc</h3>
                    <p className="text-gray-400 text-sm">🕒 Thứ 2 - Chủ Nhật: 08:00 - 22:00</p>
                    <p className="text-gray-400 text-sm">🌟 Phục vụ cả ngày lễ</p>
                    <p className="text-gray-400 text-sm">🔒 Chính sách bảo mật</p>
                </div>

                {/* Cột 3: Dịch vụ */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Dịch vụ</h3>
                    <ul className="text-gray-400 text-sm space-y-2">
                        <li><a href="#" className="hover:text-white transition duration-200">Massage Thư Giãn</a></li>
                        <li><a href="#" className="hover:text-white transition duration-200">Massage Trị Liệu</a></li>
                        <li><a href="#" className="hover:text-white transition duration-200">Chăm Sóc Da</a></li>
                        <li><a href="#" className="hover:text-white transition duration-200">Gói Dịch Vụ Đặc Biệt</a></li>
                    </ul>
                </div>

                {/* Cột 4: Liên hệ */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Liên hệ</h3>
                    <p className="text-gray-400 text-sm">📍 123 Đường ABC, TP.HCM</p>
                    <p className="text-gray-400 text-sm">📞 0909 123 456</p>
                    <p className="text-gray-400 text-sm">✉ contact@crmmassage.com</p>
                </div>
            </div>

            {/* Đường kẻ ngăn cách */}
            <div className="border-t border-gray-700 my-4"></div>
            
            {/* Phần Copyright */}
            <div className="text-center py-4 text-gray-400 text-sm">
                <p>Copyright © 2025 CRM Massage. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;

