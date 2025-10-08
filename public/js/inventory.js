//public/js/inventory.js//
'use strict';

// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {

  // Grab the classification select element
  const classificationList = document.querySelector("#classificationList");

  if (!classificationList) {
    console.warn("No classification select element found on this page.");
    return; // Stop if the select list isn't on this page
  }

  // Listen for changes in the select list
  classificationList.addEventListener("change", async function () {
    const classification_id = classificationList.value;
    console.log(`classification_id is: ${classification_id}`);

    if (!classification_id) {
      // Clear table if no classification selected
      const inventoryDisplay = document.getElementById("inventoryDisplay");
      if (inventoryDisplay) inventoryDisplay.innerHTML = "";
      return;
    }

    const classIdURL = `/inv/getInventory/${classification_id}`;

    try {
      const response = await fetch(classIdURL);
      if (!response.ok) throw new Error("Network response was not OK");

      const data = await response.json();
      console.log(data);

      buildInventoryList(data);

    } catch (error) {
      console.error('There was a problem fetching inventory data:', error);
    }
  });

});

// Build inventory items into HTML table components and inject into DOM
function buildInventoryList(data) {
  const inventoryDisplay = document.getElementById("inventoryDisplay");
  if (!inventoryDisplay) return;

  let dataTable = '<thead>';
  dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>';
  dataTable += '</thead>';

  dataTable += '<tbody>';
  data.forEach(element => {
    console.log(element.inv_id + ", " + element.inv_model);
    dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`;
    dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`;
    dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`;
  });
  dataTable += '</tbody>';

  inventoryDisplay.innerHTML = dataTable;
}


module.exports = { buildClassificationList };