export class InfoPerHourController {
  static async expandHourInfoRow(rowClicked) {
    // Closes expanded hour info row if it's already open
    if (rowClicked.nextSibling.classList.contains("expand")) {
      collapseAllHourInfoRows();
      return;
    }

    collapseAllHourInfoRows();
    rowClicked.classList.add("selected");

    const rowHourInfo = rowClicked.nextSibling;
    rowHourInfo.classList.add("expand");
  }
}

function collapseAllHourInfoRows() {
  const allRows = document.querySelectorAll(".week-forecast-table tbody tr");
  allRows.forEach((row) => {
    row.classList.remove("expand");
    row.classList.remove("selected");
  });
}
