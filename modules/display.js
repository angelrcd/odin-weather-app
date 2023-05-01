import { AppData } from "./app";
import Chart from "chart.js/auto";

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
    tBody.appendChild(dayDataRow);

    // Inserts hidden hour info row
    const hourInfoRow = tBody.insertRow();
    hourInfoRow.classList.add("info-by-hour");
    const th = document.createElement("th");
    hourInfoRow.appendChild(th);
    const cell = hourInfoRow.insertCell();
    cell.colSpan = 7;
    const div = document.createElement("div");
    div.classList.add("info-by-hour");
    insertHourInfoChart(div, index);
    cell.appendChild(div);
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

function insertHourInfoChart(container, dayIndex) {
  const labels = [
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ];

  const canvasTemps = document.createElement("canvas");
  const dataTemps = {
    labels: labels,
    datasets: [
      {
        label: "Temperature",
        data: AppData.getForecastWeekArr()[dayIndex].hourlyData.tempArr.map(
          (temp) => temp[AppData.temperatureType]
        ),
        fill: false,
        borderColor: "#dc2626",
        tension: 0,
      },
      {
        label: "Feels like",
        data: AppData.getForecastWeekArr()[
          dayIndex
        ].hourlyData.feelsLikeArr.map((temp) => temp[AppData.temperatureType]),
        fill: false,
        borderColor: "#0284c7",
        tension: 0,
      },
    ],
  };
  new Chart(canvasTemps, {
    type: "line",
    data: dataTemps,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });

  const canvasChances = document.createElement("canvas");
  const dataChances = {
    labels: labels,
    datasets: [
      {
        label: "Chance of rain",
        data: AppData.getForecastWeekArr()[dayIndex].hourlyData.rainChance,
        borderColor: "#1e40af",
        backgroundColor: "#1e40af80",
      },
      {
        label: "Chance of snow",
        data: AppData.getForecastWeekArr()[dayIndex].hourlyData.snowChance,
        borderColor: "#5f9fbe",
        backgroundColor: "#5f9fbe80",
      },
    ],
  };
  new Chart(canvasChances, {
    type: "bar",
    data: dataChances,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
    },
  });

  container.appendChild(canvasTemps);
  container.appendChild(canvasChances);
}
