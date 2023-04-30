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
}

function renderLoad() {
  appBody.textContent = "Loading...";
}

function renderCurrentInfoRow() {
  const locationData = AppData.getLocationData();
  const currentData = AppData.getCurrentWeatherData();

  const fragment = document.createDocumentFragment();
  const currentRow = document.createElement("div");
  currentRow.classList.add("main-row");
  currentRow.innerHTML = `
    <div class="current-main">
      <p>${locationData.getCurrentDate()}</p>
      <h2>${locationData.name}</h2>
      <img src="${currentData.condition.icon}" alt="">
      <p>${currentData.temperature}</p>
      <p>feels like: ${currentData.feelsLike}</p>
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
