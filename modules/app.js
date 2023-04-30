import dayjs from "dayjs";

export const AppData = (function () {
  let isLoading = true;
  let temperatureType = "celsius";
  let _locationData = null;
  let _currentData = null;

  const toggleTemperatureType = () => {
    temperatureType = temperatureType === "celsius" ? "farenheit" : "celsius";
  };

  const setAppData = (fetchJson) => {
    _locationData = new LocationData(fetchJson.location);
    _currentData = new CurrentWeatherData(fetchJson.current);
  };

  const getLocationData = () => {
    return _locationData;
  };

  const getCurrentWeatherData = () => {
    return _currentData;
  };

  return {
    isLoading,
    temperatureType,
    toggleTemperatureType,
    setAppData,
    getLocationData,
    getCurrentWeatherData,
  };
})();

class LocationData {
  constructor(locationFetchData) {
    this.name = locationFetchData.name;
    this.region = locationFetchData.region;
    this.country = locationFetchData.country;
    this.localTime = dayjs.unix(locationFetchData.localtime_epoch);
  }

  getCurrentDate() {
    return this.localTime.format("DD/MM/YYYY");
  }
}

class CurrentWeatherData {
  constructor(currentFetchData) {
    this._temperature = new Temperature(
      currentFetchData.temp_c,
      currentFetchData.temp_f
    );

    this._feelsLike = new Temperature(
      currentFetchData.feelslike_c,
      currentFetchData.feelslike_f
    );
    this.condition = {
      text: currentFetchData.condition.text,
      icon: currentFetchData.condition.icon,
      code: currentFetchData.condition.code,
    };
    this.windData = {
      speed_mph: currentFetchData.wind_mph,
      speed_kph: currentFetchData.wind_kph,
      degree: currentFetchData.wind_degree,
      direction: currentFetchData.wind_dir,
    };
    this.humidity = currentFetchData.humidity;
    this.precipitation = currentFetchData.precip_mm;
  }

  get temperature() {
    return this._temperature[AppData.temperatureType];
  }

  get feelsLike() {
    return this._feelsLike[AppData.temperatureType];
  }
}

class Temperature {
  constructor(c, f) {
    this.celsius = c + "ºC";
    this.farenheit = f + "ºF";
  }
}
