// import { useEffect, useState } from "react";
// import { getOrderUser, getProducts } from "../../service/apiProduct";
// import { Order, OrderItems, ProductResponse } from "../../interface/Product_interface";
// import { useNavigate } from "react-router-dom";
// import dayjs from "dayjs";
// import "dayjs/locale/vi"; // Đảm bảo dùng tiếng Việt
// dayjs.locale("vi");

// const OrderCartView = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const [products, setProducts] = useState<ProductResponse[]>([]);

//   const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([]);

//   const totalSelectedAmount = orders
//     .filter(order => selectedOrderIds.includes(order.id))
//     .reduce((sumOrder, order) => {
//       const orderTotal = order.orderItems.reduce((sumItem, item) => sumItem + item.subTotal, 0);
//       return sumOrder + orderTotal;
//   }, 0);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const user = JSON.parse(localStorage.getItem("user") || "{}");
//         const userId = user?.id;
//         if (!userId) return;

//         const [ordersData, productsData] = await Promise.all([
//           getOrderUser(userId),
//           getProducts(),
//         ]);
//         setOrders(ordersData);
//         setProducts(productsData);
//         setLoading(false);
//       } catch (err) {
//         console.error("Lỗi khi lấy dữ liệu:", err);
//       }
//     };

//     fetchOrders();
//   }, []);

//   if (loading) return <p className="text-center text-gray-500">Đang tải đơn hàng...</p>;

//   const handleToggleSelectOrder = (orderId: number) => {
//     if (selectedOrderIds.includes(orderId)) {
//       setSelectedOrderIds(selectedOrderIds.filter(id => id !== orderId));
//     } else {
//       setSelectedOrderIds([...selectedOrderIds, orderId]);
//     }
//   };

//   const handleChangeQuantity = (orderId: number, productId: number, newQuantity: number) => {
//     setOrders(prevOrders => {
//       const updatedOrders = prevOrders.map(order => {
//         if (order.id === orderId) {
//           const updatedItems = order.orderItems.map(item => {
//             if (item.product.id === productId) {
//               const updatedItem = { ...item, quantity: newQuantity };
//               updatedItem.subTotal = updatedItem.price * updatedItem.quantity; // Tính lại thành tiền
//               return updatedItem;
//             }
//             return item;
//           });
//           return { ...order, orderItems: updatedItems };
//         }
//         return order;
//       });
//       return updatedOrders;
//     });
//   };  

//   // const handlePaymentAll = () => {
//   //   navigate("/payment"); // hoặc xử lý logic thanh toán
//   // };

//   const handlePaymentAll = () => {
//     const selectedOrders = orders.filter(order => selectedOrderIds.includes(order.id));
//     navigate("/confirm-payment", { state: { orders: selectedOrders } });
//   };  

//   return (
//     <div className="max-w-5xl mx-auto">
//       {orders.length === 0 ? (
//         <p className="text-gray-500 text-center">Bạn chưa có đơn hàng nào.</p>
//       ) : (
//         orders.map((order) => (
//           <div
//             key={order.id}
//             className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 mb-4 border border-gray-200"
//           >
//             <div className="p-6 border-b bg-gray-50 rounded-t-2xl">
//               <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
//                 <div>
//                   <div className="flex items-center mb-2">
//                     <input
//                       type="checkbox"
//                       checked={selectedOrderIds.includes(order.id)}
//                       onChange={() => handleToggleSelectOrder(order.id)}
//                       className="w-5 h-5 mr-2 rounded-full border border-gray-300 text-white bg-white checked:bg-red-200 checked:border-red-400 checked:text-white focus:ring-0 appearance-none relative checked:after:content-['✓'] checked:after:text-[12px] checked:after:text-white checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center"
//                     />
//                     <h3 className="text-lg font-semibold text-gray-800">Mã đơn hàng: #{order.id}</h3>
//                   </div>

//                   <p className="text-sm text-gray-600">
//                     Ngày thêm vào giỏ hàng: {dayjs(order.orderDate).format("dddd, DD/MM/YYYY [lúc] HH:mm").replace(/^\w/, c => c.toUpperCase())}
//                   </p>

//                   <p className="text-sm text-gray-600">
//                     Trạng thái:{" "}
//                     <span
//                       className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
//                         order.status === "Đã giao"
//                           ? "bg-green-100 text-green-700"
//                           : order.status === "Đang xử lý"
//                           ? "bg-yellow-100 text-yellow-700"
//                           : "bg-red-100 text-red-700"
//                       }`}
//                     >
//                       {order.status}
//                     </span>
//                   </p>
//                 </div>
//                 <div className="text-sm text-gray-600 space-y-1">
//                   <p><span className="font-medium">Tên khách hàng:</span> {order.user?.name}</p>
//                   <p><span className="font-medium">SĐT:</span> {order.user?.phone}</p>
//                 </div>
//               </div>
//               {order.notes && (
//                 <p className="text-sm text-gray-600 mt-2 italic">📝 Ghi chú: {order.notes}</p>
//               )}
//             </div>

//             {/* Danh sách sản phẩm */}
//             <div className="p-6">
//               <h4 className="text-md font-semibold text-gray-700 mb-4">🧴 Sản phẩm trong đơn hàng</h4>
//               <div className="space-y-6">
//                 {order.orderItems.map((item: OrderItems) => {
//                   const product = item.product;
//                   const fullProduct = products.find(p => p.id === product.id); // ✅ tìm sản phẩm từ danh sách đầy đủ

//                   return (
//                     <div
//                       key={item.id}
//                       className="flex flex-col items-center md:flex-row md:items-start gap-4 border-b pb-5"
//                     >
//                       <img
//                         src={Array.isArray(product.imageUrl) ? product.imageUrl[0] : product.imageUrl}
//                         alt={product.nameProduct}
//                         className="w-32 h-32 rounded-xl border object-cover"
//                       />
//                       <div className="flex-1 text-center md:text-left">
//                         <p className="font-semibold text-gray-800 text-base">{product.nameProduct}</p>
//                         <p className="text-sm text-gray-500 italic">{product.description}</p>
//                         <div className="text-sm text-gray-600 mt-2 space-y-1">
//                           <p>Đơn giá: {item.price.toLocaleString("vi-VN")} VND</p>

//                           {/* Thay đổi số lượng */}
//                           <div className="flex items-center gap-2">
//                             <button
//                               onClick={() => {
//                                 handleChangeQuantity(order.id, item.product.id, item.quantity - 1);
//                                 // Tự động tích chọn đơn hàng sau khi thay đổi số lượng
//                                 if (!selectedOrderIds.includes(order.id)) {
//                                   setSelectedOrderIds([...selectedOrderIds, order.id]);
//                                 }
//                               }}
//                               className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-xl"
//                               disabled={item.quantity <= 1}
//                             >
//                               -
//                             </button>
//                             <span className="text-lg">{item.quantity}</span>
//                             <button
//                               onClick={() => {
//                                 handleChangeQuantity(order.id, item.product.id, item.quantity + 1);
//                                 // Tự động tích chọn đơn hàng sau khi thay đổi số lượng
//                                 if (!selectedOrderIds.includes(order.id)) {
//                                   setSelectedOrderIds([...selectedOrderIds, order.id]);
//                                 }
//                               }}
//                               className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-xl"
//                               disabled={item.quantity >= item.product.quantity}
//                             >
//                               +
//                             </button>
//                           </div>

//                           {/* Cập nhật hiển thị số lượng tồn kho từ API */}
//                           <p className="text-gray-600">Còn: {fullProduct?.quantity ?? "?"}</p>

//                           <p className="font-semibold text-orange-600">
//                             Thành tiền: {item.subTotal.toLocaleString("vi-VN")} VND
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         ))
//       )}

//       {/* Nút thanh toán tổng */}
//       {orders.length > 0 && (
//         <div className="flex justify-between items-center gap-4 mt-6 flex-wrap">
//           <div className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={selectedOrderIds.length === orders.length}
//               onChange={() => {
//                 if (selectedOrderIds.length === orders.length) {
//                   setSelectedOrderIds([]);
//                 } else {
//                   const allIds = orders.map(order => order.id);
//                   setSelectedOrderIds(allIds);
//                 }
//               }}              
//               className="w-5 h-5 rounded-full border border-gray-300 bg-white checked:bg-red-200 checked:border-red-400 appearance-none relative checked:after:content-['✓'] checked:after:text-[12px] checked:after:text-white checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center"
//             />
//             <span className="text-gray-700 text-sm">Chọn tất cả</span>
//           </div>

//           {/* Nhóm tổng tiền + nút thanh toán bên phải */}
//           <div className="flex items-center gap-4 ml-auto">
//             <div className="text-lg font-semibold text-gray-700">
//               Tổng tiền:{" "}
//               <span className="text-orange-600">
//                 {totalSelectedAmount.toLocaleString("vi-VN")} VND
//               </span>
//             </div>

//             <button
//               onClick={handlePaymentAll}
//               disabled={selectedOrderIds.length === 0}
//               className={`flex items-center gap-2 font-bold py-3 px-6 rounded-2xl shadow-lg transition duration-300 ${
//                 selectedOrderIds.length === 0
//                   ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                   : "bg-orange-500 hover:bg-orange-600 text-white"
//               }`}
//             >
//               Thanh toán
//               {selectedOrderIds.length > 0 && (
//                 <span className="bg-white text-orange-600 font-bold rounded-full px-2 py-0.5 text-sm">
//                   {selectedOrderIds.length}
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderCartView;


import { useEffect, useState } from "react";
import { ShoppingBag, Trash2 } from "lucide-react";
import { CustomerDataFull } from "../../interface/CustomerData_interface";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import { createOrder } from "../../service/apiOrder";
import { Order, OrderItemResponse } from "../../interface/Order_interface";

// Khai báo riêng cho localStorage
interface LocalOrderItem extends OrderItemResponse {
    userId: number;
}

const OrderCartView = () => {
    const [customer, setCustomer] = useState<CustomerDataFull | null>(null);
    const [orderItems, setOrderItems] = useState<OrderItemResponse[]>([]);
    const [address, setAddress] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [notes, setNotes] = useState<string>("");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser) as unknown as CustomerDataFull;
            setCustomer(parsedUser);
    
            const rawOrderItems = localStorage.getItem("orderItems");
            const allOrderItems = JSON.parse(rawOrderItems || "[]") as unknown as LocalOrderItem[];
            const userOrderItems = allOrderItems.filter(item => item.userId === parsedUser.id);
            setOrderItems(userOrderItems);
        }
    }, []);
    
    const handleIncreaseQuantity = (index: number) => {
        const updatedItems = [...orderItems];
        updatedItems[index].quantity += 1;
        setOrderItems(updatedItems);
    
        const raw = localStorage.getItem("orderItems");
        const allOrderItems = JSON.parse(raw || "[]") as unknown as LocalOrderItem[];
        const newAllOrderItems = allOrderItems.map(item => {
            if (item.userId === customer?.id && item.id === updatedItems[index].id) {
                return { ...item, quantity: updatedItems[index].quantity };
            }
            return item;
        });
        localStorage.setItem("orderItems", JSON.stringify(newAllOrderItems));
    };
    
    const handleDecreaseQuantity = (index: number) => {
        const updatedItems = [...orderItems];
        if (updatedItems[index].quantity > 1) {
            updatedItems[index].quantity -= 1;
            setOrderItems(updatedItems);
    
            const raw = localStorage.getItem("orderItems");
            const allOrderItems = JSON.parse(raw || "[]") as unknown as LocalOrderItem[];
            const newAllOrderItems = allOrderItems.map(item => {
                if (item.userId === customer?.id && item.id === updatedItems[index].id) {
                    return { ...item, quantity: updatedItems[index].quantity };
                }
                return item;
            });
            localStorage.setItem("orderItems", JSON.stringify(newAllOrderItems));
        }
    };    
    
    const handleRemoveItem = (index: number, name: string) => {
        if (!window.confirm(`Bạn muốn xóa ${name} không?`)) return;
    
        const removedItemId = orderItems[index].id;
        const updatedItems = orderItems.filter((_, i) => i !== index);
        setOrderItems(updatedItems);
    
        const raw = localStorage.getItem("orderItems");
        const allOrderItems = JSON.parse(raw || "[]") as unknown as LocalOrderItem[];
        const newAllOrderItems = allOrderItems.filter(item =>
            !(item.userId === customer?.id && item.id === removedItemId)
        );
    
        localStorage.setItem("orderItems", JSON.stringify(newAllOrderItems));
        toast.success(`Xóa ${name} thành công.`);
    };
    
    const handleSubmitOrder = async () => {
        const orderData: Order = {
            userId: customer?.id,
            guestName: "",
            shippingAddress: address || "Mua tại cửa hàng",
            shippingPhone: phone || customer?.phone || "0000000000",
            notes: notes || "Không có",
            orderItems: orderItems.map(item => ({
                productId: item.id,
                quantity: item.quantity,
            })),
        };
    
        try {
            await createOrder(orderData);
            toast.success("Đặt hàng thành công.");
            setAddress("");
            setPhone("");
            setNotes("");
            setOrderItems([]);
            localStorage.removeItem("orderItems");
        } catch (error) {
            console.error("Lỗi khi đặt hàng:", error);
            toast.error("Lỗi khi đặt hàng.");
        }
    };
    
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-5xl mx-auto space-y-6"
            >
            <ToastContainer />

            {orderItems.length === 0 ? (
                <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-200 text-center text-gray-500 text-lg font-medium flex items-center justify-center gap-2 min-h-[370px]">
                    🛒 Không có sản phẩm trong giỏ hàng
                </div>
            ) : (
                <>
                {/* Thông tin khách hàng */}
                {/* {customer && (
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                    <div className="flex items-center gap-4">
                        <img
                        src={customer.imageUrl}
                        alt="Avatar"
                        className="h-14 w-14 rounded-full object-cover"
                        />
                        <div>
                        <p className="text-lg font-semibold">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                        </div>
                    </div>
                    </div>
                )} */}

                {/* Sản phẩm trong giỏ */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    🧴 Sản phẩm trong giỏ hàng
                    </h3>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {orderItems.map((item, index) => (
                        <div
                        key={index}
                        className="flex flex-col md:flex-row md:items-start gap-4 border-b pb-4"
                        >
                        <img
                            src={item.imageUrl}
                            alt={item.nameProduct}
                            className="w-24 h-24 object-cover rounded-xl border"
                        />
                        <div className="flex-1">
                            <p className="font-semibold text-gray-800">{item.nameProduct}</p>
                            <div className="text-sm text-gray-600 mt-1">{item.description}</div>

                            <div className="flex items-center gap-2 mt-2">
                            <span>Số lượng:</span>
                            <button
                                onClick={() => handleDecreaseQuantity(index)}
                                className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full"
                                disabled={item.quantity <= 1}
                            >
                                -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                                onClick={() => handleIncreaseQuantity(index)}
                                className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full"
                            >
                                +
                            </button>
                            </div>

                            <p className="mt-2 text-orange-600 font-medium">
                            Thành tiền: {(item.price * item.quantity).toLocaleString()} VNĐ
                            </p>
                        </div>
                        <button
                            onClick={() => handleRemoveItem(index, item.nameProduct)}
                            className="text-red-500 text-sm hover:underline self-start"
                        >
                            <Trash2 size={16} className="inline-block mr-1" /> Xóa
                        </button>
                        </div>
                    ))}
                    </div>
                </div>

                {/* Thông tin giao hàng */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium mb-1">Địa chỉ giao hàng</label>
                        <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full p-3 rounded border focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Nhập địa chỉ..."
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Số điện thoại</label>
                        <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-3 rounded border focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Nhập số điện thoại..."
                        />
                    </div>
                    </div>

                    <div>
                    <label className="block font-medium mb-1">Ghi chú</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="w-full p-3 rounded border focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Ghi chú thêm (nếu có)..."
                    />
                    </div>
                </div>

                {/* Tổng tiền và nút mua */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex justify-between items-center">
                    <span className="text-lg font-semibold">Tổng tiền thanh toán:</span>
                    <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-blue-500">
                        {orderItems
                        .reduce((total, item) => total + item.price * item.quantity, 0)
                        .toLocaleString()}{" "}
                        VNĐ
                    </span>
                    <button
                        onClick={handleSubmitOrder}
                        className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-600 transition"
                    >
                        <ShoppingBag className="inline-block mr-2" /> Mua hàng
                    </button>
                    </div>
                </div>
                </>
            )}
        </motion.div>

    );
};

export default OrderCartView;
