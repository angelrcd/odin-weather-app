import { AppData } from "./modules/app";

async function getWeatherForecast(location) {
  const fetchOptions = {
    mode: "cors",
  };

  const response = await fetch(
    "http://api.weatherapi.com/v1/forecast.json?key=21be9b60ca504f4396b165818232904&q=Madrid&days=7&aqi=no&alerts=no",
    fetchOptions
  );
  const data = await response.json();
  AppData.setAppData(data);
  console.log(AppData.getLocationData());
}

getWeatherForecast("Madrid");
