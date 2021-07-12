const api_url = "https://livejs-api.hexschool.io";
const api_path = "yangalice212";
const token = "PZNUCKUUe5TOVVyLn3fhddf7WX92";
let orderListData;
let orderIdArr = [];
const delAllOrderBtn = document.querySelector(".delAllOrderBtn");
const orderTable = document.querySelector(".order-table-body");
const orderDetailBody = document.querySelector(".orderDetailBody");
function init() {
  orderListInit();
}
//chart.js - 產品類別
function chartCategoryInit() {
  let obj = {};
  orderListData.forEach(function (item) {
    item.products.forEach(function (key) {
      if (obj[key.category] === undefined) {
        obj[key.category] = 1;
      } else {
        obj[key.category] += 1;
      }
    });
  });
  let productNamArr = Object.keys(obj);
  let finalData = [];
  productNamArr.forEach(function (item) {
    let arr = [];
    arr.push(item);
    arr.push(obj[item]);
    finalData.push(arr);
  });
  let chart = c3.generate({
    bindto: ".chartCategory", // HTML 元素綁定
    data: {
      columns: finalData, // 資料存放
      type: "pie", // 圖表種類
      colors: {
        窗簾: "#5434A7",
        床架: "#DACBFF",
        收納: "#9D7FEA",
      },
    },
    size: {
      width: 350,
      height: 350,
    },
  });
}
//chart.js 產品品項
function chartProductInit() {
  let obj = {};
  orderListData.forEach(function (item) {
    item.products.forEach(function (key) {
      if (obj[key.title] === undefined) {
        obj[key.title] = key.quantity;
      } else {
        obj[key.title] += key.quantity;
      }
    });
  });
  let productNamArr = Object.keys(obj);
  let data = [];

  productNamArr.forEach(function (item) {
    let arr = [];
    arr.push(item);
    arr.push(obj[item]);
    data.push(arr);
  });
  data.sort(function (a, b) {
    if (a[1] > b[1]) {
      return -1;
    } else if (a[1] < b[1]) {
      return 1;
    } else {
      return 0;
    }
  });
  let finalData = [];
  let otherNum = 0;
  data.forEach(function (item) {
    otherNum += item[1];
    if (finalData.length < 3) {
      finalData.push(item);
      otherNum -= item[1];
    }
  });
  finalData.push(["其他", otherNum]);
  let chart = c3.generate({
    bindto: ".chartTitle", // HTML 元素綁定
    data: {
      columns: finalData, // 資料存放
      type: "pie", // 圖表種類
      colors: {
        "Louvre 雙人床架／雙人加大": "#9D7FEA",
        "Louvre 單人床架": "#DACBFF",
        "Antony 雙人床架／雙人加大": "#6A33F8",
        "Antony 遮光窗簾": "#301E5F",
        "Charles 系列儲物組合": "#0067CE",
        "Charles 雙人床架": "#4B0091",
        "Jordan 雙人床架／雙人加大": "#5B00AE",
        "Antony 床邊桌": "#CA8EFF",
        其他: "#5434A7",
      },
    },
    size: {
      width: 350,
      height: 350,
    },
  });
}
//渲染訂單
function orderListInit() {
  axios
    .get(
      `${api_url}/api/livejs/v1/admin/${api_path}/orders`,
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then(function (res) {
      orderListData = res.data.orders;
      orderList();
      chartCategoryInit();
      chartProductInit();
    });
}
function orderList() {
  let str = "";
  let isPaid = "";
  let productList = [];
  //渲染訂單
  orderListData.forEach(function (item) {
    if (item.paid === false) {
      isPaid = "未處理";
    } else {
      isPaid = "已處理";
    }
    str += `
      <tr>
        <th>${item.createdAt}</th>
        <td>${item.user.name}<br>${item.user.tel}</td>
        <td>${item.user.address}</td>
        <td>${item.user.email}</td>
        <td><a href="#" class="orderDetail" data-bs-toggle="modal" data-bs-target="#orderDetailModal">訂單詳情</a></td>
        <td>${todayDate()}</td>
        <td><a href="#" class="isPaidBtn">${isPaid}</a></td>
        <td><a href="#" class="delOrderItemBtn">刪除</a></td>
      </tr>
    `;
    orderIdArr.push(item.id);
    productList.push(item.products);
  });
  orderTable.innerHTML = str;
  //訂單產品列表
  const orderDetail = document.querySelectorAll(".orderDetail");
  orderDetail.forEach(function (item, index) {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      orderProdcutList(productList[index]);
    });
  });
  //修改訂單
  const isPaidBtn = document.querySelectorAll(".isPaidBtn");
  editOrderList(isPaidBtn);
  //刪除單筆訂單
  const delOrderItemBtn = document.querySelectorAll(".delOrderItemBtn");
  delOrderItem(delOrderItemBtn);
}
//查看產品列表
function orderProdcutList(arr) {
  let str = "";
  let orderTotalPrice = 0;
  arr.forEach(function (item) {
    str += `
      <tr class="bodyItem">
        <td>${item.title}</td>
        <td>${item.quantity}</td>
        <td class="text-right">NT $${toThousands(item.price)}</td>
      </tr>
  `;
    orderTotalPrice += item.price;
  });
  str += `
    <tr>
      <td></td>
      <td>總金額</td>
      <td class="text-right orderTotalPrice">NT $${toThousands(
        orderTotalPrice
      )}</td>
    </tr>
  `;
  orderDetailBody.innerHTML = str;
}
function todayDate() {
  let td = new Date();
  let year = td.getFullYear();
  let month = td.getMonth() + 1;
  let day = td.getDate();
  return `${year}/${month}/${day}`;
}
//修改訂單API
function editOrderListInit(orderId) {
  axios
    .put(
      `${api_url}/api/livejs/v1/admin/${api_path}/orders`,
      {
        data: {
          id: orderId,
          paid: true,
        },
      },
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then(function (res) {
      orderListInit();
    })
    .catch((err) => {
      console.log(err);
    });
}
function editOrderList(arr) {
  arr.forEach(function (item, index) {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      editOrderListInit(orderIdArr[index]);
    });
  });
}
//刪除全部訂單API
function delAllOrderInit() {
  axios
    .delete(
      `${api_url}/api/livejs/v1/admin/${api_path}/orders`,
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then(function () {
      orderListInit();
      swal("已刪除全部訂單", "", "success");
    })
    .catch((err) => {
      console.log(err);
    });
}
function delAllOrder() {
  if (orderListData.length === 0) {
    swal("無法再刪除啦！", "訂單已經被清空囉", "warning");
  } else {
    swal({
      title: "確定要刪除所有訂單嗎?",
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
        delAllOrderInit();
      }
    });
  }
}
//刪除單筆訂單API
function delOrderItemInit(orderId) {
  axios
    .delete(
      `${api_url}/api/livejs/v1/admin/${api_path}/orders/${orderId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then(function () {
      orderListInit();
      swal("已刪除訂單", "", "success");
    })
    .catch((err) => {
      console.log(err);
    });
}
function delOrderItem(arr) {
  arr.forEach(function (item, index) {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      swal({
        title: "確定要刪除該筆訂單嗎?",
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
          delOrderItemInit(orderIdArr[index]);
        }
      });
    });
  });
}

init();

delAllOrderBtn.addEventListener("click", delAllOrder);
todayDate();
