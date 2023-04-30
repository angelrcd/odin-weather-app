import { AppData } from "./modules/app";
import renderDisplay from "./modules/display";
import LocalStorageController from "./modules/localStorageController";

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
  } catch (error) {
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

searchButton.addEventListener("click", () => {
  const searchValue = searchInput.value;
  getWeatherForecast(searchValue);
});

changeTempBtn.addEventListener("change", () => {
  const temp = changeTempBtn.checked ? "farenheit" : "celsius";
  AppData.temperatureType = temp;
  renderDisplay();
  LocalStorageController.setTemperatureType(temp);
});
