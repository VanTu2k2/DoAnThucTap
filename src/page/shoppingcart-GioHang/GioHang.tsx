// import { useEffect, useState } from "react";
// import { getOrderUser, getProducts } from "../../service/apiProduct";
// import { Order, OrderItems, ProductResponse } from "../../interface/Product_interface";
// import { useNavigate } from "react-router-dom";

// const OrderCartView = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [, setProducts] = useState<ProductResponse[]>([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([]);
//   const [totalSelectedAmount, setTotalSelectedAmount] = useState(0);

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

//   const handleToggleSelectOrder = (orderId: number, totalAmount: number) => {
//     if (selectedOrderIds.includes(orderId)) {
//       // Bỏ chọn
//       setSelectedOrderIds(selectedOrderIds.filter(id => id !== orderId));
//       setTotalSelectedAmount(prev => prev - totalAmount);
//     } else {
//       // Chọn
//       setSelectedOrderIds([...selectedOrderIds, orderId]);
//       setTotalSelectedAmount(prev => prev + totalAmount);
//     }
//   };

//   const handlePaymentAll = () => {
//     // Tùy ý xử lý: điều hướng hoặc gửi danh sách đơn cần thanh toán
//     navigate("/payment"); // hoặc handle logic API thanh toán
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
//                   <input
//                     type="checkbox"
//                     checked={selectedOrderIds.includes(order.id)}
//                     onChange={() => handleToggleSelectOrder(order.id, order.totalAmount)}
//                     className="w-5 h-5 mr-2 rounded-full border border-gray-300 text-white bg-white checked:bg-red-200 checked:border-red-400 checked:text-white focus:ring-0
//                             appearance-none relative
//                             checked:after:content-['✓'] checked:after:text-[12px] checked:after:text-white
//                             checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center"
//                   />
//                     <h3 className="text-lg font-semibold text-gray-800">Mã đơn hàng: #{order.id}</h3>
//                   </div>

//                   {/* <h3 className="text-lg font-semibold text-gray-800">Mã đơn hàng: #{order.id}</h3> */}

//                   <p className="text-sm text-gray-600">Ngày đặt: {new Date(order.orderDate).toLocaleString()}</p>
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
//                   {/* <p><span className="font-medium">Email:</span> {order.user?.email}</p> */}
//                   <p><span className="font-medium">SĐT:</span> {order.user?.phone}</p>
//                   {/* <p><span className="font-medium">Địa chỉ:</span> {order.user?.address}</p> */}
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
//                           <p>Số lượng: {item.quantity}</p>
//                           <p className="font-semibold text-orange-600">
//                             Thành tiền: {item.subTotal.toLocaleString("vi-VN")} VND
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               <div className="flex items-center mt-3">
//                   <button
//                       className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-xl"
//                   >-</button>

//                   {/* <span className="mx-4 text-lg">{quantityToAdd}</span> */}

//                   <button
//                       className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-xl"
//                   >+</button>
//               </div>

//               {/* Tổng đơn */}
//               <div className="mt-6">
//                 <div className="bg-gray-50 rounded-lg p-4 text-right border">
//                   <p className="text-lg font-bold text-gray-800">
//                     Tổng đơn:{" "}
//                     <span className="text-orange-600">
//                       {order.totalAmount.toLocaleString("vi-VN")} VND
//                     </span>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))
//       )}

//       {/* Nút thanh toán tổng */}
//       {orders.length > 0 && (
//         <div className="flex justify-between items-center gap-4 mt-6 flex-wrap">
          
//           {/* ✅ Radio chọn tất cả nằm bên trái */}
//           <div className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={selectedOrderIds.length === orders.length}
//               onChange={() => {
//                 if (selectedOrderIds.length === orders.length) {
//                   setSelectedOrderIds([]);
//                   setTotalSelectedAmount(0);
//                 } else {
//                   const allIds = orders.map((order) => order.id);
//                   const allTotal = orders.reduce((sum, order) => sum + order.totalAmount, 0);
//                   setSelectedOrderIds(allIds);
//                   setTotalSelectedAmount(allTotal);
//                 }
//               }}
//               className="w-5 h-5 rounded-full border border-gray-300 bg-white checked:bg-red-200 checked:border-red-400 appearance-none relative 
//                         checked:after:content-['✓'] checked:after:text-[12px] checked:after:text-white 
//                         checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center"
//             />
//             <span className="text-gray-700 text-sm">Chọn tất cả</span>
//           </div>

//           {/* ✅ Nhóm tổng tiền + nút thanh toán bên phải */}
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
import { getOrderUser, getProducts } from "../../service/apiProduct";
import { Order, OrderItems, ProductResponse } from "../../interface/Product_interface";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/vi"; // Đảm bảo dùng tiếng Việt
dayjs.locale("vi");

const OrderCartView = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  // const [, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductResponse[]>([]);

  const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([]);
  // const [totalSelectedAmount, setTotalSelectedAmount] = useState(0);

  const totalSelectedAmount = orders
    .filter(order => selectedOrderIds.includes(order.id))
    .reduce((sumOrder, order) => {
      const orderTotal = order.orderItems.reduce((sumItem, item) => sumItem + item.subTotal, 0);
      return sumOrder + orderTotal;
  }, 0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user?.id;
        if (!userId) return;

        const [ordersData, productsData] = await Promise.all([
          getOrderUser(userId),
          getProducts(),
        ]);
        setOrders(ordersData);
        setProducts(productsData);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Đang tải đơn hàng...</p>;

  // const handleToggleSelectOrder = (orderId: number, totalAmount: number) => {
  //   if (selectedOrderIds.includes(orderId)) {
  //     setSelectedOrderIds(selectedOrderIds.filter(id => id !== orderId));
  //     setTotalSelectedAmount(prev => prev - totalAmount);
  //   } else {
  //     setSelectedOrderIds([...selectedOrderIds, orderId]);
  //     setTotalSelectedAmount(prev => prev + totalAmount);
  //   }
  // };

  const handleToggleSelectOrder = (orderId: number) => {
    if (selectedOrderIds.includes(orderId)) {
      setSelectedOrderIds(selectedOrderIds.filter(id => id !== orderId));
    } else {
      setSelectedOrderIds([...selectedOrderIds, orderId]);
    }
  };

  const handleChangeQuantity = (orderId: number, productId: number, newQuantity: number) => {
    setOrders(prevOrders => {
      const updatedOrders = prevOrders.map(order => {
        if (order.id === orderId) {
          const updatedItems = order.orderItems.map(item => {
            if (item.product.id === productId) {
              const updatedItem = { ...item, quantity: newQuantity };
              updatedItem.subTotal = updatedItem.price * updatedItem.quantity; // Tính lại thành tiền
              return updatedItem;
            }
            return item;
          });
          return { ...order, orderItems: updatedItems };
        }
        return order;
      });
      return updatedOrders;
    });
  };  

  const handlePaymentAll = () => {
    navigate("/payment"); // hoặc xử lý logic thanh toán
  };

  return (
    <div className="max-w-5xl mx-auto">
      {orders.length === 0 ? (
        <p className="text-gray-500 text-center">Bạn chưa có đơn hàng nào.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 mb-4 border border-gray-200"
          >
            <div className="p-6 border-b bg-gray-50 rounded-t-2xl">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <div className="flex items-center mb-2">
                    {/* <input
                      type="checkbox"
                      checked={selectedOrderIds.includes(order.id)}
                      onChange={() => handleToggleSelectOrder(order.id, order.totalAmount)}
                      className="w-5 h-5 mr-2 rounded-full border border-gray-300 text-white bg-white checked:bg-red-200 checked:border-red-400 checked:text-white focus:ring-0 appearance-none relative checked:after:content-['✓'] checked:after:text-[12px] checked:after:text-white checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center"
                    /> */}
                    <input
                      type="checkbox"
                      checked={selectedOrderIds.includes(order.id)}
                      onChange={() => handleToggleSelectOrder(order.id)}
                      className="w-5 h-5 mr-2 rounded-full border border-gray-300 text-white bg-white checked:bg-red-200 checked:border-red-400 checked:text-white focus:ring-0 appearance-none relative checked:after:content-['✓'] checked:after:text-[12px] checked:after:text-white checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center"
                    />
                    <h3 className="text-lg font-semibold text-gray-800">Mã đơn hàng: #{order.id}</h3>
                  </div>

                  {/* <p className="text-sm text-gray-600">Ngày đặt: {new Date(order.orderDate).toLocaleString()}</p> */}
                  <p className="text-sm text-gray-600">
                    Ngày thêm vào giỏ hàng: {dayjs(order.orderDate).format("dddd, DD/MM/YYYY [lúc] HH:mm").replace(/^\w/, c => c.toUpperCase())}
                  </p>

                  <p className="text-sm text-gray-600">
                    Trạng thái:{" "}
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        order.status === "Đã giao"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Đang xử lý"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </p>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-medium">Tên khách hàng:</span> {order.user?.name}</p>
                  <p><span className="font-medium">SĐT:</span> {order.user?.phone}</p>
                </div>
              </div>
              {order.notes && (
                <p className="text-sm text-gray-600 mt-2 italic">📝 Ghi chú: {order.notes}</p>
              )}
            </div>

            {/* Danh sách sản phẩm */}
            <div className="p-6">
              <h4 className="text-md font-semibold text-gray-700 mb-4">🧴 Sản phẩm trong đơn hàng</h4>
              <div className="space-y-6">
                {order.orderItems.map((item: OrderItems) => {
                  const product = item.product;
                  const fullProduct = products.find(p => p.id === product.id); // ✅ tìm sản phẩm từ danh sách đầy đủ

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col items-center md:flex-row md:items-start gap-4 border-b pb-5"
                    >
                      <img
                        src={Array.isArray(product.imageUrl) ? product.imageUrl[0] : product.imageUrl}
                        alt={product.nameProduct}
                        className="w-32 h-32 rounded-xl border object-cover"
                      />
                      <div className="flex-1 text-center md:text-left">
                        <p className="font-semibold text-gray-800 text-base">{product.nameProduct}</p>
                        <p className="text-sm text-gray-500 italic">{product.description}</p>
                        <div className="text-sm text-gray-600 mt-2 space-y-1">
                          <p>Đơn giá: {item.price.toLocaleString("vi-VN")} VND</p>

                          {/* Thay đổi số lượng */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                handleChangeQuantity(order.id, item.product.id, item.quantity - 1);
                                // Tự động tích chọn đơn hàng sau khi thay đổi số lượng
                                if (!selectedOrderIds.includes(order.id)) {
                                  setSelectedOrderIds([...selectedOrderIds, order.id]);
                                }
                              }}
                              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-xl"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="text-lg">{item.quantity}</span>
                            <button
                              onClick={() => {
                                handleChangeQuantity(order.id, item.product.id, item.quantity + 1);
                                // Tự động tích chọn đơn hàng sau khi thay đổi số lượng
                                if (!selectedOrderIds.includes(order.id)) {
                                  setSelectedOrderIds([...selectedOrderIds, order.id]);
                                }
                              }}
                              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-xl"
                              disabled={item.quantity >= item.product.quantity}
                            >
                              +
                            </button>
                          </div>

                          {/* Cập nhật hiển thị số lượng tồn kho từ API */}
                          <p className="text-gray-600">Còn: {fullProduct?.quantity ?? "?"}</p>

                          <p className="font-semibold text-orange-600">
                            Thành tiền: {item.subTotal.toLocaleString("vi-VN")} VND
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}

              </div>

              {/* Tổng đơn */}
              {/* <div className="mt-6">
                <div className="bg-gray-50 rounded-lg p-4 text-right border">
                  <p className="text-lg font-bold text-gray-800">
                    Tổng đơn:{" "}
                    <span className="text-orange-600">
                      {order.totalAmount.toLocaleString("vi-VN")} VND
                    </span>
                  </p>
                </div>
              </div> */}
            </div>
          </div>
        ))
      )}

      {/* Nút thanh toán tổng */}
      {orders.length > 0 && (
        <div className="flex justify-between items-center gap-4 mt-6 flex-wrap">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedOrderIds.length === orders.length}
              // onChange={() => {
              //   if (selectedOrderIds.length === orders.length) {
              //     setSelectedOrderIds([]);
              //     setTotalSelectedAmount(0);
              //   } else {
              //     const allIds = orders.map((order) => order.id);
              //     const allTotal = orders.reduce((sum, order) => sum + order.totalAmount, 0);
              //     setSelectedOrderIds(allIds);
              //     setTotalSelectedAmount(allTotal);
              //   }
              // }}

              onChange={() => {
                if (selectedOrderIds.length === orders.length) {
                  setSelectedOrderIds([]);
                } else {
                  const allIds = orders.map(order => order.id);
                  setSelectedOrderIds(allIds);
                }
              }}              
              className="w-5 h-5 rounded-full border border-gray-300 bg-white checked:bg-red-200 checked:border-red-400 appearance-none relative checked:after:content-['✓'] checked:after:text-[12px] checked:after:text-white checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center"
            />
            <span className="text-gray-700 text-sm">Chọn tất cả</span>
          </div>

          {/* Nhóm tổng tiền + nút thanh toán bên phải */}
          <div className="flex items-center gap-4 ml-auto">
            <div className="text-lg font-semibold text-gray-700">
              Tổng tiền:{" "}
              <span className="text-orange-600">
                {totalSelectedAmount.toLocaleString("vi-VN")} VND
              </span>
            </div>

            <button
              onClick={handlePaymentAll}
              disabled={selectedOrderIds.length === 0}
              className={`flex items-center gap-2 font-bold py-3 px-6 rounded-2xl shadow-lg transition duration-300 ${
                selectedOrderIds.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
            >
              Thanh toán
              {selectedOrderIds.length > 0 && (
                <span className="bg-white text-orange-600 font-bold rounded-full px-2 py-0.5 text-sm">
                  {selectedOrderIds.length}
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCartView;
