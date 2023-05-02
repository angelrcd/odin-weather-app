import { AppData } from "./modules/app";
import renderDisplay from "./modules/display";
import LocalStorageController from "./modules/localStorageController";
import { InfoPerHourController } from "./modules/displayInfoPerHour";
import getSuggestions from "./modules/fetchLocationSuggestions";

const searchInput = document.querySelector(".search-bar-container input");
const searchButton = document.querySelector(".search-bar-container button");
const changeTempBtn = document.querySelector("input[type='checkbox']");

async function getWeatherForecast(location) {
  AppData.isLoading = true;
  const fetchOptions = {
    mode: "cors",
  };
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=21be9b60ca504f4396b165818232904&q=${location}&days=7&aqi=no&alerts=no`,
      fetchOptions
    );
    const data = await response.json();
    AppData.setAppData(data);
    AppData.isLoading = false;
    LocalStorageController.setLastCity(location);
    renderDisplay();
    setTableRowEventsListeners();
  } catch (error) {
    AppData.isLoading = false;
    console.error(error);
  }
}

setInitialTempType();
renderDisplay();
getWeatherForecast(LocalStorageController.getLastCity());

function setInitialTempType() {
  const temp = LocalStorageController.getTemperatureType();
  AppData.temperatureType = temp;
  changeTempBtn.checked = temp === "farenheit";
}

function setTableRowEventsListeners() {
  const weekInfoTableRows = document.querySelectorAll(
    ".week-forecast-table tbody tr"
  );
  weekInfoTableRows.forEach((row) => {
    row.addEventListener("click", (e) => {
      const rowClicked = e.target.closest("tr");
      InfoPerHourController.expandHourInfoRow(rowClicked);
    });
  });
}

searchButton.addEventListener("click", () => {
  const searchValue = searchInput.value;
  getWeatherForecast(searchValue);
});

searchInput.addEventListener("input", (e) => {
  getSuggestions(e.target.value);
});

changeTempBtn.addEventListener("change", () => {
  const temp = changeTempBtn.checked ? "farenheit" : "celsius";
  AppData.temperatureType = temp;
  renderDisplay();
  setTableRowEventsListeners();
  LocalStorageController.setTemperatureType(temp);
});
