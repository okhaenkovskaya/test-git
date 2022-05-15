import { swiperArrows } from "../helpers";

/**
 * Shopify Product Recommendations
 */
class ProductRecommendations extends HTMLElement {
  constructor() {
    super();

    const handleIntersection = (entries, observer) => {
      if (!entries[0].isIntersecting) return;
      observer.unobserve(this);

      fetch(this.dataset.url)
        .then((response) => response.text())
        .then((text) => {
          const html = document.createElement("div");
          html.innerHTML = text;
          const recommendations = html.querySelector("product-recommendations");
          if (recommendations && recommendations.innerHTML.trim().length) {
            this.innerHTML = recommendations.innerHTML;

            if (typeof Swiper !== "undefined") {
              const swiperElement = document.querySelector(
                ".products-recommendations-swiper"
              );
              if (swiperElement) {
                const limitPerView = swiperElement.getAttribute(
                  "data-limit_per_view"
                );
                const limitPerViewMobile = swiperElement.getAttribute(
                  "data-limit_per_view_mobile"
                );
                new Swiper(".products-recommendations-swiper", {
                  slidesPerView: limitPerViewMobile ? limitPerViewMobile : 2,
                  spaceBetween: 0,
                  loop: false,
                  allowTouchMove: true,
                  mousewheel: {
                    invert: false,
                    forceToAxis: true,
                  },
                  navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                  },
                  shortSwipes: false,
                  cssMode: true,
                  breakpoints: {
                    768: {
                      slidesPerView: limitPerViewMobile
                        ? limitPerViewMobile
                        : 2,
                    },
                    990: {
                      cssMode: false,
                      allowTouchMove: true,
                      slidesPerView: limitPerView ? limitPerView : 2,
                    },
                  },
                  on: {
                    init: function () {
                      swiperArrows(this, limitPerViewMobile, limitPerView);
                    },
                    resize: function () {
                      swiperArrows(this, limitPerViewMobile, limitPerView);
                    },
                  },
                });
              }
            }
          }
        })
        .catch((e) => {
          console.error(e);
        });
    };

    new IntersectionObserver(handleIntersection.bind(this), {
      rootMargin: "0px 0px 200px 0px",
    }).observe(this);
  }
}

customElements.define("product-recommendations", ProductRecommendations);
