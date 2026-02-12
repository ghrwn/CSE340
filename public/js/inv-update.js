"use strict"

const form = document.querySelector("#updateForm")
const updateBtn = document.querySelector("#updateBtn")

if (form && updateBtn) {
  // guarantee it starts disabled on page load
  updateBtn.setAttribute("disabled", "disabled")

  // enable only after user changes something
  form.addEventListener("change", function () {
    updateBtn.removeAttribute("disabled")
  })
}