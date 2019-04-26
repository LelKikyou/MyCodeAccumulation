"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  render: function render(h) {
    return h("div", {
      on: {
        "click": "a"
      }
    }, [h("p", ["123456"]), h("input", {
      on: {
        "change": "xx"
      },
      attrs: {
        type: "text"
      }
    })]);
  },
  method: {
    a: function a() {
      console.log(12121);
    },
    xx: function xx() {
      console.log(11212165 + "qqqq");
    }
  }
};