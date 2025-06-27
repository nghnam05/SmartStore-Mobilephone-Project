(function ($) {
  "use strict";

  var spinner = function () {
    setTimeout(function () {
      if ($("#spinner").length > 0) {
        $("#spinner").removeClass("show");
      }
    }, 1);
  };
  spinner(0);


  $(window).scroll(function () {
    if ($(window).width() < 992) {
      if ($(this).scrollTop() > 55) {
        $(".fixed-top").addClass("shadow");
      } else {
        $(".fixed-top").removeClass("shadow");
      }
    } else {
      if ($(this).scrollTop() > 55) {
        $(".fixed-top").addClass("shadow").css("top", -55);
      } else {
        $(".fixed-top").removeClass("shadow").css("top", 0);
      }
    }
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1100, "easeInOutExpo");
    return false;
  });

  $(".testimonial-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 2000,
    center: false,
    dots: true,
    loop: true,
    margin: 25,
    nav: true,
    navText: [
      '<i class="bi bi-arrow-left"></i>',
      '<i class="bi bi-arrow-right"></i>',
    ],
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 1,
      },
      768: {
        items: 1,
      },
      992: {
        items: 2,
      },
      1200: {
        items: 2,
      },
    },
  });

  // vegetable carousel
  $(".vegetable-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1500,
    center: false,
    dots: true,
    loop: true,
    margin: 25,
    nav: true,
    navText: [
      '<i class="bi bi-arrow-left"></i>',
      '<i class="bi bi-arrow-right"></i>',
    ],
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 1,
      },
      768: {
        items: 2,
      },
      992: {
        items: 3,
      },
      1200: {
        items: 4,
      },
    },
  });

  // Modal Video
  $(document).ready(function () {
    var $videoSrc;
    $(".btn-play").click(function () {
      $videoSrc = $(this).data("src");
    });
    console.log($videoSrc);

    $("#videoModal").on("shown.bs.modal", function (e) {
      $("#video").attr(
        "src",
        $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0"
      );
    });

    $("#videoModal").on("hide.bs.modal", function (e) {
      $("#video").attr("src", $videoSrc);
    });
  });

  // Product Quantity
  $(".quantity button").on("click", function () {
    var button = $(this);
    var oldValue = button.parent().parent().find("input").val();
    if (button.hasClass("btn-plus")) {
      var newVal = parseFloat(oldValue) + 1;
    } else {
      if (oldValue > 0) {
        var newVal = parseFloat(oldValue) - 1;
      } else {
        newVal = 0;
      }
    }
    button.parent().parent().find("input").val(newVal);
  });
})(jQuery);
const storageButtons = document.querySelectorAll(".storage-option");

storageButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    storageButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

const links = document.querySelectorAll(".nav-link");
links.forEach((link) => {
  link.addEventListener("click", (e) => {
    links.forEach((item) => {
      item.classList.remove("active");
    });
    link.classList.add("active");
  });
});

const input = document.getElementById("search-input");
const suggestions = document.getElementById("suggestions");
let timeout;

input.addEventListener("input", () => {
  const keyword = input.value.trim();
  clearTimeout(timeout);

  if (!keyword) {
    suggestions.innerHTML = "";
    return;
  }

  timeout = setTimeout(() => {
    fetch(`/search/suggest?q=${encodeURIComponent(keyword)}`)
      .then((res) => res.json())
      .then((data) => {
        suggestions.innerHTML = "";

        if (data.length === 0) {
          suggestions.innerHTML =
            '<div class="list-group-item">No products found</div>';
          return;
        }

        data.forEach((item) => {
          const el = document.createElement("a");
          el.href = `/product/${item.id}`;
          el.className =
            "list-group-item list-group-item-action d-flex align-items-center gap-3 py-2";

          el.innerHTML = `
            <i class="bi bi-phone"></i>
            <span class="fw-semibold text-dark">${item.name}</span>
          `;
          suggestions.appendChild(el);
        });
      })
      .catch((err) => {
        console.error("Lỗi fetch:", err);
      });
  }, 300);
});
