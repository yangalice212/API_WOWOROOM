function toThousands(num) {
  num = num.toString();
  let pattern = /(-?\d+)(\d{3})/;

  while (pattern.test(num)) {
    num = num.replace(pattern, "$1,$2");
  }
  return num;
}

$(document).ready(function () {
  $(".navbarToggle").click(function () {
    $(".navbarMenu").toggleClass("active");
  });

  $(window).scroll(function () {
    if ($(this).scrollTop() > 60) {
      $(".gotop").fadeIn();
    } else {
      $(".gotop").fadeOut();
    }
  });
  $(".gotop").click(function () {
    $("html ,body").animate(
      {
        scrollTop: 0,
      },
      800
    );
  });
});