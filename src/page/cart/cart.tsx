import "../../styles/cart.css";

const Cart: React.FC = () => {
  return (
    <div className="contianer-cart">
      <h2>Giỏ hàng</h2>

      {/* Render các sản phẩm trong gio hàng */}

      <table className="table">
        <thead>
          <th>STT</th>
          <th>Sản phẩm</th>
          <th>Hình ảnh</th>
          <th>Loại</th>
          <th>Giá</th>
          <th>Số lượng</th>
          <th>Thành tiền</th>
        </thead>

        <tr>
          <td>1</td>
          <td>Iphone 12 Pro Max</td>
          <td>
            <img
              src="https://example.com/iphone12.jpg"
              alt="iphone12"
              width="100"
            />
          </td>
          <td>iPhone</td>
          <td>299.990.000đ</td>
          <td>
            <input type="number" min="1" value="1" style={{
                width:40
            }}/>
          </td>
          <td>299.990.000đ</td>
        </tr>
        
        <tr>
            <td>2</td>
          <td>Samsung Galaxy S21 Ultra</td>
          <td></td>
        </tr>
      </table>
      <a href="/vnpay-pay">
      <button type="button">VnPay</button>
      </a>

      <a href="/google-pay">
      <button type="button">Google Pay</button>
      </a>
    </div>
  );
};

export default Cart;
