import { AppData } from "./app";

const appBody = document.querySelector("#app");

export default function renderDisplay() {
  // Empty past render
  appBody.innerHTML = "";

  if (AppData.isLoading) {
    renderLoad();
    return;
  }

  const locationData = AppData.getLocationData();
  const currentData = AppData.getCurrentWeatherData();

  appBody.textContent =
    locationData.name +
    ", " +
    locationData.country +
    " " +
    currentData.temperature;
}

function renderLoad() {
  appBody.textContent = "Loading...";
}
