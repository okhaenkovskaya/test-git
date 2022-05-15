import { findAncestor, swiperArrows } from "./helpers";
import Swiper, { Navigation, Pagination, Thumbs } from "swiper";
import { configureCart } from "liquid-ajax-cart";
console.log('Hello')
/**
 * Configure Liquid Ajax Cart
 */
configureCart("addToCartCssClass", "js-ajax-cart-opened");

/**
 * Configure Swiper Modules
 */
Swiper.use([Navigation, Pagination, Thumbs]);
window.Swiper = Swiper;

/**
 * Event Listeners
 */
document.addEventListener(
  "click",
  (event) => {
    if (event) {
      sampleMethod(event);
    }
  },
  false
);

window.addEventListener("resize", () => {});

document.addEventListener("DOMContentLoaded", () => {
  productsCarousel();
});

/**
 * Header menu
 */
const menuItemsWithSub = document.querySelectorAll("[data-mainmenu-hassub]");

menuItemsWithSub.forEach((item) => {
  item.addEventListener("mouseenter", function () {
    this.querySelector("[data-mega-menu]")?.classList.add("mega-menu--active");
  });
  // Navigation menu mouse leave delay
  item.addEventListener("mouseleave", function () {
    setTimeout(() => {
      const elem = this.querySelector("[data-mega-menu]");
      if (elem?.classList) {
        elem.classList.remove("mega-menu--active");
      }
    }, 300);
  });
});

/**
 * Mobile menu
 */
const mobileMenuItems = document.querySelectorAll("[data-drawer-itemtoggle]");

mobileMenuItems.forEach((item) => {
  const parentItem = findAncestor(item, ".hasSub");

  item.addEventListener("click", function () {
    parentItem.querySelector("[data-drawer-child]").classList.toggle("open");
  });
});

const drawer = document.querySelector("[data-drawer]");
const openDrawer = document.querySelectorAll("[data-open-drawer]");
const closeDrawer = document.querySelectorAll("[data-close-drawer]");

openDrawer.forEach((item) => {
  item.addEventListener("click", function () {
    drawer.classList.add("open");
    document.body.classList.add("disable-body");
  });
});

closeDrawer.forEach((item) => {
  item.addEventListener("click", function () {
    drawer.classList.remove("open");
    document.body.classList.remove("disable-body");
  });
});

/**
 * Quantity Selector component
 */
class QuantityInput extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector("input");
    this.changeEvent = new Event("change", { bubbles: true });

    this.querySelectorAll("button").forEach((button) =>
      button.addEventListener("click", this.onButtonClick.bind(this))
    );
  }

  onButtonClick(event) {
    event.preventDefault();
    const previousValue = this.input.value;

    event.target.name === "plus" ? this.input.stepUp() : this.input.stepDown();
    if (previousValue !== this.input.value)
      this.input.dispatchEvent(this.changeEvent);
  }
}
customElements.define("quantity-input", QuantityInput);

/**
 * Accordion component
 */
class Accordion extends HTMLElement {
  constructor() {
    super();
    this.canMultipleOpen = this.hasAttribute("data-allow-multiple-open");
    if (this.hasAttribute("data-first-open")) {
      const contentHeight = this.querySelectorAll(
        "[data-accordion='content']"
      )[0].offsetHeight;
      const firstButton = this.querySelectorAll(
        "[data-accordion='trigger']"
      )[0];
      if (!firstButton) return;
      this.openBody(firstButton, firstButton.nextElementSibling, contentHeight);
    }

    this.querySelectorAll("[data-accordion='trigger']").forEach((button) =>
      button.addEventListener("click", this.toggleBody.bind(this, button))
    );
  }

  openBody(trigger, el, heightLimit) {
    el.style.height = heightLimit + "px";
    trigger.classList.add("is-collapsed");
  }

  closeBody(trigger, el) {
    el.style.height = "0";
    trigger.classList.remove("is-collapsed");
  }

  toggleBody(elem) {
    if (elem.classList.contains("is-collapsed")) {
      this.closeBody(elem, elem.nextElementSibling);
    } else {
      const contentHeight = elem.nextElementSibling.querySelectorAll(
        '[data-accordion="content"]'
      )[0].offsetHeight;
      if (!this.canMultipleOpen) {
        for (const e of document.querySelectorAll(
          '[data-accordion="trigger"]'
        )) {
          this.closeBody(elem, e.nextElementSibling);
          e.classList.remove("is-collapsed");
        }
      }

      this.openBody(elem, elem.nextElementSibling, contentHeight);
    }
  }
}
customElements.define("accordion-block", Accordion);

/**
 * Swiper products carousel component
 */
function productsCarousel() {
  const carouselElements = document.querySelectorAll(
    ".products-carousel-swiper"
  );
  if (carouselElements.length) {
    carouselElements.forEach((carousel) => {
      const limitPerView = carousel.getAttribute("data-limit_per_view");
      const limitPerViewMobile = carousel.getAttribute(
        "data-limit_per_view_mobile"
      );
      new Swiper(carousel, {
        spaceBetween: 0,
        slidesPerView: limitPerViewMobile ? limitPerViewMobile : 2,
        allowTouchMove: true,
        autoHeight: true,
        watchOverflow: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        pagination: {
          el: ".swiper-pagination",
          type: "bullets",
          clickable: true,
        },
        cssMode: false,
        breakpoints: {
          768: {
            slidesPerView: limitPerViewMobile ? limitPerViewMobile : 2,
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
    });
  }
}

/***
 * Modal popup
 */
class ModalDialog extends HTMLElement {
  constructor() {
    super();
    this.querySelector('[id^="ModalClose-"]').addEventListener(
      "click",
      this.hide.bind(this)
    );
    this.addEventListener("keyup", (event) => {
      if (event.code.toUpperCase() === "ESCAPE") this.hide();
    });
    this.addEventListener("click", (event) => {
      if (event.target.nodeName === "MODAL-DIALOG") this.hide();
    });
  }

  show(opener) {
    this.openedBy = opener;
    document.body.classList.add("overflow-hidden");
    this.setAttribute("open", "");
  }

  hide() {
    document.body.classList.remove("overflow-hidden");
    this.removeAttribute("open");
  }
}
customElements.define("modal-dialog", ModalDialog);

/***
 * Modal button(opener)
 */
class ModalOpener extends HTMLElement {
  constructor() {
    super();

    const button = this.querySelector("button");

    if (!button) return;
    button.addEventListener("click", () => {
      const modal = document.querySelector(this.getAttribute("data-modal"));
      if (modal) modal.show(button);
    });
  }
}
customElements.define("modal-opener", ModalOpener);

function sampleMethod(event) {
  const element = event.target.closest("[data-some-attr]"); // add your element class/id/data-attr.
  if (element) {
    event.preventDefault();
    //.... your logic here
  }
}
