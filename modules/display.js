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
      <h3>${locationData.name}</h3>
      <div class="current-temp-container">
        <p>
          <span class="numeric-data">${currentData.temperature}</span>
          <span class="unit">${tempUnit}</span>
        </p>
        <img src="${currentData.condition.icon}" alt=${
    currentData.condition.text
  }>
      </div>
      <p class="current-condition-text">${currentData.condition.text}</p>
      <p>${locationData.getCurrentDate()}</p>
      <p>${locationData.getCurrentHour()}</p>
    </div>
  `;
  currentRow.appendChild(getCurrentRowSecondaryContent());
  fragment.appendChild(currentRow);
  appBody.appendChild(fragment);
}

function getCurrentRowSecondaryContent() {
  const currentData = AppData.getCurrentWeatherData();
  const tempUnit = AppData.temperatureType === "celsius" ? "ºC" : "ºF";
  const secondaryContent = [
    {
      icon: "feelsLike.svg",
      name: "Feels like",
      data: currentData.feelsLike,
      unit: tempUnit,
    },
    {
      icon: "humidity.svg",
      name: "Humidity",
      data: currentData.humidity,
      unit: "%",
    },
    {
      icon: "cloud.svg",
      name: "Cloud",
      data: currentData.cloud,
      unit: "%",
    },
    {
      icon: "rain.svg",
      name: "Rain",
      data: currentData.precipitation,
      unit: "mm",
    },
    {
      icon: "wind.svg",
      name: `Wind (${currentData.windData.degree}º)`,
      data: currentData.windData.speed_kph,
      unit: "KpH",
    },
  ];

  const secondaryContainer = document.createElement("div");
  secondaryContainer.classList.add("current-secondary");
  for (const content of secondaryContent) {
    const cell = getSecondaryContentCell(
      content.icon,
      content.name,
      content.data,
      content.unit
    );
    secondaryContainer.appendChild(cell);
  }

  return secondaryContainer;
}

function getSecondaryContentCell(iconSrc, name, data, units) {
  const cell = document.createElement("div");
  cell.classList.add("current-secondary-cell");
  const icon = new Image();
  icon.src = iconSrc;
  icon.alt = name + " icon";
  cell.appendChild(icon);

  const info = document.createElement("div");
  info.innerHTML = `
    <p>${name}</p>
    <p>
      <span class="numeric-data">${data}</span>
      <span class="unit">${units}</span>
    </p>
  `;
  cell.appendChild(info);
  return cell;
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

  const rowTitle = document.createElement("h2");
  rowTitle.innerText = "Week forecast";

  appBody.appendChild(rowTitle);
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
  tRow.insertCell().innerText = Number(dataDay.minTemp).toFixed(1);
  tRow.insertCell().innerText = Number(dataDay.avgTemp).toFixed(1);
  tRow.insertCell().innerText = Number(dataDay.maxTemp).toFixed(1);

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
