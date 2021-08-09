const apiUrl = "https://livejs-api.hexschool.io";
const apiPath = "yangalice212";
let productListData;
let cartListData;
let cartId = [];
const productList = document.querySelector(".productList");
const cartList = document.querySelector(".cartList");
const filter = document.querySelector(".product select");
const customerForm = document.querySelector(".customerForm");
const customerFormBtn = document.querySelector(".customerFormBtn");
const customerFormInput = document.querySelectorAll(
  "input[type=text],input[type=tel],input[type=email],.form-group select"
);
const loader = document.querySelector(".loader");
const constraints = {
  nameInput: {
    presence: {
      allowEmpty: false,
      message: "必填",
    },
  },
  phoneInput: {
    presence: {
      allowEmpty: false,
      message: "必填",
    },
    numericality: {
      message: "請輸入數字格式",
    },
    length: {
      minimum: 8,
      message: "不可少於 8 碼",
    },
  },
  emailInput: {
    presence: {
      allowEmpty: false,
      message: "必填",
    },
    email: {
      message: "請輸入 Email 格式",
    },
  },
  addressInput: {
    presence: {
      allowEmpty: false,
      message: "必填",
    },
  },
  payInput: {
    presence: {
      allowEmpty: false,
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
    .get(`${apiUrl}/api/livejs/v1/customer/${apiPath}/products`)
    .then((res) => {
      productListData = res.data.products;
      showProdcutList();
      //篩選
      filter.addEventListener("change", productFilter);
    })
    .catch((err) => {
      console.log(err);
    });
}
function showProdcutList() {
  let str = "";
  let productId = [];
  productListData.forEach(function (item) {
    str += showProductListItem(item);
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
function showProductListItem(item) {
  let str = `
    <li class="fs-1" data-id="${item.id}">
      <h5>新品</h5>
      <img src="${item.images}" alt="">
      <a href="#" class="addCartBtn text-center btn-purple">加入購物車</a>
      <h4>${item.title}</h4>
      <del>NT$${toThousands(item.origin_price)}</del>
      <p class="fs-3">NT$${toThousands(item.price)}</p>
    </li>
  `;
  return str;
}
//篩選
function productFilter() {
  let str = "";
  productListData.forEach(function (item) {
    if (item.category === filter.value) {
      str += showProductListItem(item);
    } else if (filter.value === "全部") {
      str += showProductListItem(item);
    }
  });
  productList.innerHTML = str;
}
//購物車列表
function cartListInit() {
  axios
    .get(`${apiUrl}/api/livejs/v1/customer/${apiPath}/carts`)
    .then((res) => {
      cartListData = res.data.carts;
      showCartList();
    })
    .catch((err) => {
      console.log(err);
    });
}
function showCartList() {
  let totalPrice = 0;
  let str = "";
  if (cartListData.length === 0) {
    str = `<h3 class="fs-4 text-center">快把購物車填滿～～</h3>`;
    cartList.innerHTML = str;
  } else {
    str = `
      <thead>
        <th width="50%">品項</th>
        <th width="20%">單價</th>
        <th width="20%">數量</th>
        <th width="10%">金額</th>
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
          <td>NT$${toThousands(item.product.price)}</td>
          <td>
            <div class="cartNum">
              <button class="minusBtn">-</button>
              <input type="text" value="${
                item.quantity
              }" class="cartProductNum">
              <button class="plusBtn">+</button>
            </div>
          </td>
          <td class="text-right">NT$${toThousands(
            item.product.price * item.quantity
          )}</td>
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
            <a href="#" class="cartDelAll text-center btn-black">刪除所有品項</a>
          </td>
          <td>
            總金額
          </td>
          <td class="fs-3">NT$${toThousands(totalPrice)}</td>
        </tr>
      </tfoot>
    `;
    cartList.innerHTML = str;
    //修改購物車數量
    const cartNum = document.querySelectorAll(".cartNum");
    cartEditItem(cartNum);

    //刪除單筆購物車
    const cartDelItemBtn = document.querySelectorAll(".delCartItem");
    cartDelItem(cartDelItemBtn);
    //刪除全部購物車
    const cartDelAllBtn = document.querySelector(".cartDelAll");
    cartDelAllItem(cartDelAllBtn);
  }
}
//新增項目至購物車
function cartAddItemInit(id) {
  axios
    .post(`${apiUrl}/api/livejs/v1/customer/${apiPath}/carts`, {
      data: {
        productId: id,
        quantity: 1,
      },
    })
    .then(() => {
      swal("已成功加入購物車", "", "success");
      cartListInit();
    })
    .catch((err) => {
      console.log(err);
    });
}
//修改購物車數量
function cartEditItemInit(id, num) {
  axios
    .patch(`${apiUrl}/api/livejs/v1/customer/${apiPath}/carts`, {
      data: {
        id: id,
        quantity: num,
      },
    })
    .then((res) => {
      if (res.data.status) {
        swal("已成功修改產品數量", "", "success");
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
function cartEditItem(arr) {
  const minusBtn = document.querySelectorAll(".minusBtn");
  const plusBtn = document.querySelectorAll(".plusBtn");
  const cartProductNum = document.querySelectorAll(".cartProductNum");
  arr.forEach(function (item, index) {
    let num = 0;
    minusBtn[index].addEventListener("click", function (e) {
      num = Number(cartProductNum[index].value);
      num -= 1;
      cartProductNum[index].value = num;
      if (num <= 0) {
        swal("購物車數量不可小於1", "", "error");
        num = 1;
        cartProductNum[index].value = num;
        return;
      }
      cartEditItemInit(cartId[index], num);
    });
    plusBtn[index].addEventListener("click", function (e) {
      num = Number(cartProductNum[index].value);
      num += 1;
      cartProductNum[index].value = num;
      cartEditItemInit(cartId[index], num);
    });
    item.addEventListener("change", function (e) {
      e.preventDefault();
      cartProductNum.forEach(function (key, index) {
        let num = Number(key.value);
        if (num <= 0) {
          swal("購物車數量不可小於1", "", "error");
          num = 1;
          cartProductNum[index].value = num;
          return;
        }
        cartEditItemInit(cartId[index], num);
      });
    });
  });
}
//刪除單筆購物車
function cartDelItemInit(cart_id) {
  axios
    .delete(`${apiUrl}/api/livejs/v1/customer/${apiPath}/carts/${cart_id}`)
    .then(() => {
      cartListInit();
    })
    .catch((err) => {
      console.log(err);
    });
}
function cartDelItem(arr) {
  arr.forEach(function (item, index) {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      swal({
        title: "確定要刪除嗎?",
        icon: "warning",
        buttons: {
          cancel: {
            text: "Cancel",
            visible: true,
          },
          danger: {
            text: "OK",
            visible: true,
            value: "delete",
          },
        },
        dangerMode: true,
      }).then((value) => {
        if (value === "delete") {
          cartDelItemInit(cartId[index]);
        }
      });
    });
  });
}
//刪除所有購物車
function cartDelAllItemInit() {
  axios
    .delete(`${apiUrl}/api/livejs/v1/customer/${apiPath}/carts`)
    .then(() => {
      cartListInit();
    })
    .catch((err) => {
      console.log(err);
    });
}
function cartDelAllItem(arr) {
  arr.addEventListener("click", function (e) {
    e.preventDefault();
    swal({
      title: "確定要刪除嗎?",
      icon: "warning",
      buttons: {
        cancel: {
          text: "Cancel",
          visible: true,
        },
        danger: {
          text: "OK",
          visible: true,
          value: "delete",
        },
      },
      dangerMode: true,
    }).then((value) => {
      if (value === "delete") {
        cartDelAllItemInit();
      }
    });
  });
}
//送出預定資料
function sendCustomerFormInit(info) {
  axios
    .post(`${apiUrl}/api/livejs/v1/customer/${apiPath}/orders`, {
      data: {
        user: {
          name: info[0],
          tel: info[1],
          email: info[2],
          address: info[3],
          payment: info[4],
        },
      },
    })
    .then((res) => {
      if (res.data.status) {
        customerFormInput.forEach((i) => {
          i.value = "";
        });
        swal("已成功送出訂單", "", "success");
        cartListInit();
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
//驗證顧客表單資訊 - input change 就觸發
function changeCustomerFormCheck() {
  customerFormInput.forEach((item) => {
    item.addEventListener("change", function () {
      item.nextElementSibling.textContent = "";
      formCheck();
    });
  });
}
//驗證顧客表單資訊 - 按下送出按鈕觸發
let check = false;
function sendCustomerFormCheck() {
  if (cartListData.length === 0) {
    swal("購物車裡沒東西哦", "", "warning");
    return;
  }
  customerFormInput.forEach(() => {
    formCheck();
    changeCustomerFormCheck();
  });
  if (check) {
    let info = [
      document.querySelector(".nameInput").value,
      document.querySelector(".phoneInput").value,
      document.querySelector(".emailInput").value,
      document.querySelector(".addressInput").value,
      document.querySelector(".payInput").value,
    ];
    sendCustomerFormInit(info);
  }
}

function formCheck() {
  let errors = validate(customerForm, constraints);
  if (errors) {
    let arr = Object.keys(errors);
    let item = "";
    arr.forEach((key) => {
      item = document.querySelector(`p.${key}`);
      if (item.className === "nameInput") {
        item.textContent = "姓名為必填";
      } else if (item.className === "phoneInput") {
        item.textContent = "電話為必填";
      } else if (item.className === "emailInput") {
        item.textContent = "Email 為必填";
      } else if (item.className === "addressInput") {
        item.textContent = "地址為必填";
      } else if (item.className === "payInput") {
        item.textContent = "交易方式為必填";
      }
    });
    check = false;
  } else {
    check = true;
  }
}

customerFormBtn.addEventListener("click", sendCustomerFormCheck);
init();
