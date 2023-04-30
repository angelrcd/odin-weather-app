export class InfoPerHourController {
  static insertRow(rowClicked) {
    deleteAllHourInfoRows();

    rowClicked.classList.add("selected");
    const rowHourInfo = document.createElement("tr");

    const headerCell = document.createElement("th");
    rowHourInfo.appendChild(headerCell);
    const bodyCell = document.createElement("td");
    bodyCell.colSpan = 7;
    rowHourInfo.appendChild(bodyCell);

    rowHourInfo.classList.add("info-by-hour");
    rowClicked.insertAdjacentElement("afterend", rowHourInfo);
  }
}

function deleteAllHourInfoRows() {
  const allRows = document.querySelectorAll(".week-forecast-table tbody tr");
  allRows.forEach((row) => {
    row.classList.remove("selected");
    if (row.classList.contains("info-by-hour")) {
      row.remove();
    }
  });
}
