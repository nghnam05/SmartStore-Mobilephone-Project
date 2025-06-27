document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".btn-minus, .btn-plus").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault(); 

      const isPlus = this.classList.contains("btn-plus");
      const quantityWrapper = this.closest(".quantity");
      const input = quantityWrapper.querySelector("input");
      let quantity = parseInt(input.value);
      const price = parseFloat(input.dataset.price);
      const id = input.dataset.id;

      if (isPlus) {
        quantity++;
      } else {
        if (quantity > 1) {
          quantity--;
        } else {
          quantity = 1;
        }
      }

      input.value = quantity;

      // Cập nhật thành tiền cho dòng đó
      const row = this.closest("tr");
      const totalCell = row.querySelector(".item-total-price");
      const newTotal = price * quantity;
      totalCell.textContent = newTotal.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });

      // Cập nhật tổng giỏ hàng
      updateCartTotal();
    });
  });
});

function updateCartTotal() {
  let total = 0;
  document.querySelectorAll(".quantity input").forEach((input) => {
    const quantity = parseInt(input.value);
    const price = parseFloat(input.dataset.price);
    total += quantity * price;
  });

  document.querySelectorAll(".text-total").forEach((el) => {
    el.textContent = total.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  });
}
