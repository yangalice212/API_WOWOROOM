const api_path = "yangalice212";
const token = "";
let productListData;
let cartListData;
const productList = document.querySelector(".productList");
const cartList = document.querySelector(".cartList");
const sendCustomerFormBtn = document.querySelector(".sendCustomerFormBtn");
const customerFormInput = document.querySelectorAll(
  "input[type=text],input[type=tel],input[type=email],.form-group select"
);
const constraints = {
  nameInput: {
    presence: {
      message: "必填",
    },
  },
  phoneInput: {
    presence: {
      message: "必填",
    },
    numericality: {
      message: "請輸入數字格式",
    },
  },
  emailInput: {
    presence: {
      message: "必填",
    },
  },
  ticketPrice: {
    presence: {
      message: "必填",
    },
    numericality: {
      greaterThan: 0,
      message: "必須大於 0",
    },
  },
  ticketNum: {
    presence: {
      message: "必填",
    },
    numericality: {
      greaterThan: 0,
      message: "必須大於 0",
    },
  },
  ticketRate: {
    presence: {
      message: "必填",
    },
    numericality: {
      greaterThanOrEqualTo: 1,
      lessThanOrEqualTo: 10,
      message: "必須在 1-10 的區間",
    },
  },
  ticketDescrip: {
    presence: {
      message: "必填",
    },
  },
};
function init() {
  productListInit();
  cartListInit();
}
//產品列表
function productListInit() {
  axios
    .get(
      `https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/products`
    )
    .then(function (response) {
      productListData = response.data.products;
      showProdcutList();
    });
}
function showProdcutList() {
  let str = "";
  let productId = [];
  productListData.forEach(function (item) {
    str += `
        <li class="fs-1" data-id="${item.id}">
          <h5>新品</h5>
          <img src="${item.images}" alt="">
          <a href="#" class="addCartBtn text-center">加入購物車</a>
          <h4>${item.title}</h4>
          <del>NT$${item.origin_price}</del>
          <p class="fs-3">NT$${item.price}</p>
        </li>
  `;
    productId.push(item.id);
  });
  productList.innerHTML = str;
  //加入購物車
  const addCartBtn = document.querySelectorAll(".addCartBtn");
  addCartBtn.forEach(function (item, index) {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      cartAddItemInit(productId[index]);
    });
  });
}
//購物車列表
function cartListInit() {
  axios
    .get(
      `https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts`
    )
    .then(function (response) {
      cartListData = response.data.carts;
      showCartList();
    });
}
function showCartList() {
  let totalPrice = 0;
  let cartId = [];
  let str = `
        <thead>
          <th width="50%">品項</th>
          <th width="22%">單價</th>
          <th width="22%">數量</th>
          <th width="22%">金額</th>
          <th></th>
        </thead>
        <tbody>
  `;
  cartListData.forEach(function (item) {
    str += `
        <tr>
          <td class="d-flex ai-center">
            <img src="${item.product.images}" alt="">
            <h4>${item.product.title}</h4>
          </td>
          <td>NT$${item.product.price}</td>
          <td>${item.quantity}</td>
          <td>NT$${item.product.price * item.quantity}</td>
          <td class="text-right"><a href="#" class="delCartItem"><i class="fas fa-times fa-2x"></i></a></td>
        </tr>
  `;
    cartId.push(item.id);
    totalPrice += item.product.price * item.quantity;
  });
  str += `
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3">
              <a href="#" class="cartDelAll text-center">刪除所有品項</a>
            </td>
            <td>
              總金額
            </td>
            <td class="fs-3">NT$${totalPrice}</td>
          </tr>
        </tfoot>
  `;
  cartList.innerHTML = str;
  //刪除單筆購物車
  const cartDellItemBtn = document.querySelectorAll(".delCartItem");
  cartDellItemBtn.forEach(function (item, index) {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      cartDelItemInit(cartId[index]);
    });
  });
  //刪除全部購物車
  const cartDelAllBtn = document.querySelector(".cartDelAll");
  cartDelAllBtn.addEventListener("click", function (e) {
    e.preventDefault();
    cartDelAllItemInit();
  });
}
function cartAddItemInit(id) {
  axios
    .post(
      `https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts`,
      {
        data: {
          productId: id,
          quantity: 1,
        },
      }
    )
    .then(function () {
      cartListInit();
    });
}
//修改購物車數量
function cartEditItemInit(id, num) {
  axios
    .patch(
      `https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts`,
      {
        data: {
          id: id,
          quantity: num,
        },
      }
    )
    .then(function (res) {
      console.log(res);
    });
}
function cartDelItemInit(cart_id) {
  axios
    .delete(
      `https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts/${cart_id}`
    )
    .then(function () {
      cartListInit();
    });
}
function cartDelAllItemInit() {
  axios
    .delete(
      `https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts`
    )
    .then(function () {
      cartListInit();
    });
}
function sendCustomerFormInit() {
  axios
    .post(
      `https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/orders`,
      {
        data: {
          user: {
            name: "六角學院",
            tel: "07-5313506",
            email: "hexschool@hexschool.com",
            address: "高雄市六角學院路",
            payment: "Apple Pay",
          },
        },
      }
    )
    .then(function (res) {
      console.log(res);
    });
}
sendCustomerFormBtn.addEventListener("click", sendCustomerFormInit);
init();
