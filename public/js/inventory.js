"use strict"

// Get a list of items in inventory based on the classification_id
let classificationList = document.querySelector("#classificationList")

if (classificationList) {
  classificationList.addEventListener("change", async function () {
    let classification_id = classificationList.value
    console.log(`classification_id is: ${classification_id}`)

    // IMPORTANT: your app uses /inventory, not /inv
    let classIdURL = "/inventory/getInventory/" + classification_id

    try {
      const response = await fetch(classIdURL)
      if (!response.ok) throw new Error("Network response was not OK")

      const data = await response.json()
      console.log(data)
      buildInventoryList(data)
    } catch (error) {
      console.log("There was a problem: ", error.message)
    }
  })
}

// Build inventory items into HTML table components and inject into DOM
function buildInventoryList(data) {
  let inventoryDisplay = document.getElementById("inventoryDisplay")

  // Set up the table labels
  let dataTable = "<thead>"
  dataTable += "<tr><th>Vehicle Name</th><th>Modify</th><th>Delete</th></tr>"
  dataTable += "</thead>"

  // Set up the table body
  dataTable += "<tbody>"

  // If empty list
  if (!data || data.length === 0) {
    dataTable +=
      "<tr><td colspan='3'>No inventory found for this classification.</td></tr>"
  } else {
    // Iterate over all vehicles in the array and put each in a row
    data.forEach(function (element) {
      console.log(element.inv_id + ", " + element.inv_model)
      dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`
      dataTable += `<td><a href="/inventory/edit/${element.inv_id}" title="Click to update">Modify</a></td>`
      dataTable += `<td><a href="/inventory/delete/${element.inv_id}" title="Click to delete">Delete</a></td></tr>`
    })
  }

  dataTable += "</tbody>"

  // Display the contents in the Inventory Management view
  inventoryDisplay.innerHTML = dataTable
}