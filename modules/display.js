import { AppData } from "./app";

const appBody = document.querySelector("#app");

export default function renderDisplay() {
  // Empty past render
  appBody.innerHTML = "";

  if (AppData.isLoading) {
    renderLoad();
    return;
  }

  renderCurrentInfoRow();
  renderForecastWeekTable();
}

function renderLoad() {
  appBody.textContent = "Loading...";
}

function renderCurrentInfoRow() {
  const tempUnit = AppData.temperatureType === "celsius" ? "ºC" : "ºF";
  const locationData = AppData.getLocationData();
  const currentData = AppData.getCurrentWeatherData();

  const fragment = document.createDocumentFragment();
  const currentRow = document.createElement("section");
  currentRow.classList.add("main-row");
  currentRow.innerHTML = `
    <div class="current-main">
      <p>${locationData.getCurrentDate()}</p>
      <h2>${locationData.name}</h2>
      <img src="${currentData.condition.icon}" alt="">
      <p>${currentData.temperature}${tempUnit}</p>
      <p>feels like: ${currentData.feelsLike}${tempUnit}</p>
      <p>${currentData.condition.text}</p>
    </div>
    <div class="current-secondary">
      <div>
        <p>Humidity (%)</p>
        <p>${currentData.humidity}</p>
      </div>
      <div>
        <p>Precipitation (mm)</p>
        <p>${currentData.precipitation}</p>
      </div>
      <div>
        <p>Wind (KpH)</p>
        <p>${currentData.windData.speed_kph}</p>
      </div>
      <div>
        <p>Cloud Cover (%)</p>
        <p>${currentData.cloud}</p>
      </div>
      <div>
        <p>Pressure (mb)</p>
        <p>${currentData.pressure}</p>
      </div>
    </div>
  `;
  fragment.appendChild(currentRow);
  appBody.appendChild(fragment);
}

function renderForecastWeekTable() {
  const tempUnit = AppData.temperatureType === "celsius" ? "ºC" : "ºF";
  const forecastWeekArr = AppData.getForecastWeekArr();
  const table = document.createElement("table");
  table.classList.add("week-forecast-table");
  const tHeadRow = table.createTHead();
  tHeadRow.innerHTML = `
  <tr>
    <th rowspan="2" class="empty-cell"></th>
    <th rowspan="2""></th>
    <th rowspan="2">Rain (%)</th>
    <th rowspan="2">Snow (%)</th>
    <th rowspan="2">Humidity (%)</th>
    <th colspan="3" scope="colgroup">Temperature (${tempUnit})</th>
  </tr>
  <tr>
    <th scope="col">Min</th>
    <th scope="col">Avg<br></th>
    <th scope="col">Max</th>
  </tr>
  `;

  const tBody = table.createTBody();

  let index = 0;
  for (const dataDay of forecastWeekArr) {
    const dayDataRow = getDataDayTableRow(dataDay);
    dayDataRow.setAttribute("data-index", index);
    tBody.appendChild(dayDataRow);
    index++;
  }

  const weekForecastSection = document.createElement("section");
  weekForecastSection.classList.add("week-info-row");
  weekForecastSection.appendChild(table);
  appBody.appendChild(weekForecastSection);
}

function getDataDayTableRow(dataDay) {
  const tRow = document.createElement("tr");
  const thDay = document.createElement("th");
  thDay.innerText = dataDay.day;
  tRow.appendChild(thDay);

  const iconCell = tRow.insertCell();
  iconCell.classList.add("icon-cell");
  const img = new Image();
  img.src = dataDay.condition.icon;
  img.alt = dataDay.condition.text;
  iconCell.appendChild(img);

  tRow.insertCell().innerText = dataDay.rainChance;
  tRow.insertCell().innerText = dataDay.snowChance;
  tRow.insertCell().innerText = dataDay.avgHumidity;
  tRow.insertCell().innerText = dataDay.minTemp;
  tRow.insertCell().innerText = dataDay.avgTemp;
  tRow.insertCell().innerText = dataDay.maxTemp;

  return tRow;
}
