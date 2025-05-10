import { useEffect, useState } from "react";
import { getAllOrders } from "../../service/apiOrder";
import { OrderResponse } from "../../interface/Order_interface";
import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";
import { Pagination } from "@mui/material";
import PaymentOrderModal from "../Payment/PaymentOrderModal";
import dayjs from "dayjs";
import "dayjs/locale/vi"; // Đảm bảo dùng tiếng Việt
dayjs.locale("vi");
// import { Search } from "lucide-react";

const pageSize = 8;

interface OrderListProps {
    filterByStatus?: string[]; // prop mới
}

const OrderList = ({ filterByStatus = [] }: OrderListProps) => {
    const [orders, setOrders] = useState<OrderResponse[]>([]); // Danh sách đơn hàng
    const [currentPage, setCurrentPage] = useState(1);
    // const [searchTerm, setSearchTerm] = useState("");
    // const [statusFilter, setStatusFilter] = useState(""); // Trạng thái lọc
    const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null); // Đơn hàng được chọn
    const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái mở modal
    
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await getAllOrders();
            const userData = localStorage.getItem("user");
            if (!userData) return;

            const currentUser = JSON.parse(userData);
            const userId = currentUser?.id;
            const now = new Date();

            const userOrders = response.filter(
                (order: OrderResponse) => order.user?.id === userId
            );

            const sortedOrders = userOrders.sort((a: OrderResponse, b: OrderResponse) =>
                new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
            );

            const markedOrders = sortedOrders.map((order: OrderResponse) => ({
                ...order,
                isNew: (now.getTime() - new Date(order.orderDate).getTime()) / 1000 < 60,
            }));

            setOrders(markedOrders);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách đơn hàng:", error);
        }
    };

    // Chuyển đổi hiển thị tên trang thái
    const translateOrderStatus = (status: string): string => {
        switch (status) {
            case "PENDING":
                return "Mới đặt";
            case "PROCESSING":
                return "Đang xử lý";
            case "SHIPPED":
                return "Đang vận chuyển";
            case "DELIVERED":
                return "Thành công";
            case "CANCELLED":
                return "Đã hủy";
            case "PAID":
                return "Đã thanh toán";
            case "REFUND":
                return "Đã hoàn tiền";
            default:
                return status;
        }
    };    

    // Áp dụng lọc theo search + trạng thái đơn (statusFilter dropdown) + filterByStatus prop
    // const filteredOrders = orders.filter((order) => {
    //     const search = searchTerm.trim().toLowerCase();

    //     const matchSearch =
    //         order.guestName?.toLowerCase().includes(search) ||
    //         order.user?.name.toLowerCase().includes(search) ||
    //         order.id.toString().includes(search);

    //     const matchStatusFilter = !statusFilter || order.status === statusFilter;

    //     const matchFilterByStatus =
    //         filterByStatus.length === 0 || filterByStatus.includes(order.status);

    //     return matchSearch && matchStatusFilter && matchFilterByStatus;
    // });

    const filteredOrders = orders.filter((order) => {
        return filterByStatus.length === 0 || filterByStatus.includes(order.status);
    });

    // Phân trang
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentOrders = filteredOrders.slice(startIndex, endIndex);

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    const handleOpenModal = (order: OrderResponse) => {
        setSelectedOrder(order); // Lưu thông tin đơn hàng được chọn
        setIsModalOpen(true); // Mở modal
    };

    const handleCloseModal = () => {
        setSelectedOrder(null); // Xóa thông tin đơn hàng được chọn
        setIsModalOpen(false); // Đóng modal
    };
    
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 bg-white rounded-lg shadow-md"
        >
            {/* <h2 className="text-2xl font-semibold">Danh sách đơn hàng</h2> */}
            {/* <div className="flex justify-between mb-4">
                <div className="relative flex items-center w-full md:justify-center">
                    <input
                        type="text"
                        className="md:w-[50%] w-full p-4 pr-12 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="Tìm kiếm theo tên, id đơn hàng"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute right-[calc(25%+1rem)] md:right-[calc(25%+1rem)] top-1/2 transform -translate-y-1/2 text-gray-500">
                        <Search className="w-5 h-5" />
                    </div>
                </div>
                <select
                    className="border p-2 rounded-lg ml-2 shadow-lg"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="PENDING">Mới đặt</option>
                    <option value="PROCESSING">Đang xử lý</option>
                    <option value="SHIPPED">Đang vận chuyển</option>
                    <option value="DELIVERED">Thành công</option>
                    <option value="CANCELLED">Đã hủy</option>
                    <option value="PAID">Đã thanh toán</option>
                    <option value="REFUND">Đã hoàn tiền</option>
                </select>
            </div> */}

            {filteredOrders.length > 0 ? (
                <div className="grid gap-6">
                    {currentOrders.map((order) => (                      
                        <div key={order.id} className="relative bg-[#fafafa] border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-300">
                            {order.isNew && (
                                <span className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full bg-green-500 text-white">
                                Mới ✨
                                </span>
                            )}
                            <div className="flex flex-col md:flex-row md:justify-between gap-4">
                                {/* Thông tin đơn hàng */}
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800 mb-2">
                                        Thông tin khách hàng
                                    </p>
                                    <div className="text-sm text-gray-600 space-y-2">
                                        <p>
                                            Họ tên:{" "}
                                            <span className="font-medium text-gray-700">
                                                {order.user ? order.user.name : order.guestName || "Ẩn danh"}
                                            </span>
                                        </p>
                                        <p>
                                            SĐT:{" "}
                                            <span className="text-gray-700">
                                                {order.user?.phone || order.shippingPhone || "Không có số điện thoại"}
                                            </span>
                                        </p>
                                        <p>
                                            Địa chỉ:{" "}
                                            <span className="text-gray-700">
                                                {order.user?.address || order.shippingAddress || "Không có địa chỉ"}
                                            </span>
                                        </p>
                                        <p>
                                            Ngày đặt: {dayjs(order.orderDate).format("dddd, DD/MM/YYYY [lúc] HH:mm").replace(/^\w/, c => c.toUpperCase())}
                                        </p>
                                        <p>
                                            Ghi chú: {order.notes || "Không có ghi chú"}
                                        </p>
                                        <p>
                                            Trạng thái:{" "}
                                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                                                {translateOrderStatus(order.status)}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {/* Sản phẩm */}
                                <div className="flex-[1.2] bg-white rounded-xl p-4 border border-gray-100 max-h-[220px] overflow-auto">
                                    <p className="font-semibold text-gray-800 mb-1">
                                        Thông tin sản phẩm
                                    </p>
                                    <ul className="space-y-4">
                                        {order.orderItems.slice(0, 2).map((item) => (
                                        <li key={item.id} className="flex gap-4 items-center">
                                            <img
                                                src={item.product.imageUrl}
                                                alt={item.product.nameProduct}
                                                className="w-20 h-20 object-cover rounded-md border"
                                            />
                                            <div className="text-sm flex-1">
                                                <p className="font-bold text-gray-800">{item.product.nameProduct}</p>
                                                <p className="text-gray-500">Đơn giá: {item.price.toLocaleString()} VND</p>
                                                <p className="text-gray-500">Số lượng: {item.quantity}</p>
                                                <p className="text-orange-500">Thành tiền: {item.subTotal.toLocaleString()} VND</p>
                                            </div>
                                        </li>
                                      
                                        ))}
                                    </ul>
                                    {order.orderItems.length > 2 && (
                                        <p className="text-xs text-gray-400 mt-2">
                                            Và {order.orderItems.length - 2} sản phẩm khác...
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between items-center mt-6">
                                <p className="text-lg font-semibold text-green-600">
                                    Tổng: {order.totalAmount.toLocaleString()} VNĐ
                                </p>

                                {(order.status === "PENDING" || order.status === "PROCESSING") ? (
                                    <button
                                        className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition"
                                        onClick={() => handleOpenModal(order)}
                                    >
                                        <CreditCard className="w-4 h-4" />
                                        Thanh toán
                                    </button>
                                ) : (
                                    <span className={`text-sm italic font-medium ${
                                        order.status === "PAID"
                                            ? "text-green-600"
                                            : order.status === "CANCELLED"
                                            ? "text-red-500"
                                            : order.status === "DELIVERED"
                                            ? "text-blue-500"
                                            : order.status === "REFUND"
                                            ? "text-orange-500"
                                            : order.status === "SHIPPED"
                                            ? "text-purple-500"
                                            : "text-gray-500"
                                    }`}>
                                        {
                                            order.status === "PAID" ? "Đã thanh toán"
                                            : order.status === "CANCELLED" ? "Đã hủy đơn hàng"
                                            : order.status === "DELIVERED" ? "Đã giao thành công"
                                            : order.status === "REFUND" ? "Đã hoàn tiền"
                                            : order.status === "SHIPPED" ? "Đang vận chuyển"
                                            : "Trạng thái: " + order.status
                                        }
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center mt-8 py-28 text-gray-500 text-lg">
                    Bạn chưa có đơn hàng nào.
                </div>
            )}

            {/* Phân trang */}
            <div className="flex justify-center mt-6">
                <Pagination
                    count={Math.ceil(filteredOrders.length / pageSize)}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                />
            </div>

            {/* Modal Thanh Toán */}
            {isModalOpen && selectedOrder && (
                <PaymentOrderModal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    order={selectedOrder}
                />
            )}
        </motion.div>
    );
};

export default OrderList;
