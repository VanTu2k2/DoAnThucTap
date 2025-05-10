import React, { useState } from 'react';
import { ProductResponse } from '../../interface/Product_interface';

interface CartProductModalProps {
    product: ProductResponse | null;
    onClose: () => void;
}

const CartProductModal: React.FC<CartProductModalProps> = ({ product, onClose }) => {
    const [quantity, setQuantity] = useState(1);

    if (!product) {
        return null;
    }

    type OrderItem = ProductResponse & {
        quantity: number;
        userId: string;
        userName: string;
    };
    
    const handleOrder = () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user?.id;
    
        if (!userId) {
            alert('Vui lòng đăng nhập để thêm vào giỏ hàng!');
            return;
        }
    
        const orderItem: OrderItem = {
            ...product,
            quantity,
            userId: user.id,
            userName: user.name,
        };
    
        const existingOrders: OrderItem[] = JSON.parse(localStorage.getItem('orderItems') || '[]');
    
        const existingIndex = existingOrders.findIndex(
            (item) => item.id === product.id && item.userId === user.id
        );
    
        if (existingIndex !== -1) {
            existingOrders[existingIndex].quantity += quantity;
        } else {
            existingOrders.push(orderItem);
        }
    
        localStorage.setItem('orderItems', JSON.stringify(existingOrders));
        alert('Sản phẩm đã được thêm vào giỏ hàng!');
        onClose();
    };
    
    

    // const handleOrder = () => {
    //     const orderItem = {
    //         ...product, // Lưu toàn bộ thông tin sản phẩm
    //         quantity,   // Thêm số lượng
    //     };
    
    //     // Lấy danh sách orderItems từ localStorage
    //     const existingOrders = JSON.parse(localStorage.getItem('orderItems') || '[]');
    
    //     // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    //     const existingIndex: number = existingOrders.findIndex((item: ProductResponse & { quantity: number }) => item.id === product.id);
    //     if (existingIndex !== -1) {
    //         // Nếu sản phẩm đã tồn tại, cập nhật số lượng
    //         existingOrders[existingIndex].quantity += quantity;
    //     } else {
    //         // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới
    //         existingOrders.push(orderItem);
    //     }
    
    //     // Lưu lại vào localStorage
    //     localStorage.setItem('orderItems', JSON.stringify(existingOrders));
    
    //     alert('Sản phẩm đã được thêm vào giỏ hàng!');
    //     onClose(); // Đóng modal
    // };

    const handleIncrease = () => {
        if (quantity < product.quantity) {
            setQuantity((prev) => prev + 1);
        }
    };
    
    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };    

    const totalPrice = product.price * quantity;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-xl">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Thêm vào giỏ hàng</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-red-500 text-xl transition duration-200"
                    >
                        ✕
                    </button>
                </div>

                {/* Product Display */}
                <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                    <img
                        src={product.imageUrl}
                        alt={product.nameProduct}
                        className="w-40 h-40 object-cover rounded-md shadow-md"
                    />
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-xl font-semibold text-gray-800">{product.nameProduct}</h3>
                        <p className="text-sm text-gray-500 mt-1">Kho còn: <strong>{product.quantity}</strong> sản phẩm</p>
                        <p className="text-blue-500 font-semibold text-base mt-2">
                            Giá: {product.price.toLocaleString()} VNĐ
                        </p>

                        {/* Quantity Selector */}
                        <div className="my-3">
                            <div className="flex justify-center md:justify-start items-center gap-3">
                                <button
                                    type="button"
                                    onClick={handleDecrease}
                                    disabled={quantity <= 1}
                                    className={`w-8 h-8 rounded-full text-sm shadow-md transition duration-200 ${
                                        quantity <= 1
                                            ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                    }`}
                                >
                                    -
                                </button>
                                <span className="text-base font-semibold">{quantity}</span>
                                <button
                                    type="button"
                                    onClick={handleIncrease}
                                    disabled={quantity >= product.quantity}
                                    className={`w-8 h-8 rounded-full text-sm shadow-md transition duration-200 ${
                                        quantity >= product.quantity
                                            ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                    }`}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <p className="text-green-500 font-semibold text-base">
                            Tổng tiền: {totalPrice.toLocaleString()} VNĐ
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-lg shadow-md transition duration-200"
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        onClick={handleOrder}
                        className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow-md transition duration-200"
                    >
                        Thêm vào giỏ hàng
                    </button>
                </div>
            </div>
        </div>

    );
};

export default CartProductModal;