import dayjs from "dayjs";

export const AppData = (function () {
  let _temperatureType = "celsius";
  let _locationData = null;
  let _currentData = null;

  const toggleTemperatureType = () => {
    _temperatureType = _temperatureType === "celsius" ? "farenheit" : "celsius";
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
    this.temperature = new Temperature(
      currentFetchData.temp_c,
      currentFetchData.temp_f
    );
    this.feelsLike = new Temperature(
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
  }
}

class Temperature {
  constructor(c, f) {
    this.celsius = c + "ºC";
    this.farenheit = f + "ºF";
  }
}
