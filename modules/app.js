import dayjs from "dayjs";

export const AppData = (function () {
  let isLoading = true;
  let temperatureType = "celsius";
  let _locationData = null;
  let _currentData = null;
  let _forecastWeek = [];

  const toggleTemperatureType = () => {
    temperatureType = temperatureType === "celsius" ? "farenheit" : "celsius";
  };

  const setAppData = (fetchJson) => {
    _locationData = new LocationData(fetchJson.location);
    _currentData = new CurrentWeatherData(fetchJson.current);

    _forecastWeek.length = 0;
    for (const dayData of fetchJson.forecast.forecastday) {
      _forecastWeek.push(new ForecastDay(dayData));
    }
  };

  const getLocationData = () => {
    return _locationData;
  };

  const getCurrentWeatherData = () => {
    return _currentData;
  };

  const getForecastWeekArr = () => {
    return _forecastWeek;
  };

  return {
    isLoading,
    temperatureType,
    toggleTemperatureType,
    setAppData,
    getLocationData,
    getCurrentWeatherData,
    getForecastWeekArr,
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
    return this.localTime.format("DD MMMM, dddd");
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
      speed_kph: currentFetchData.wind_kph,
      degree: currentFetchData.wind_degree,
      direction: currentFetchData.wind_dir,
    };
    this.humidity = currentFetchData.humidity;
    this.precipitation = currentFetchData.precip_mm;
    this.cloud = currentFetchData.cloud;
    this.pressure = currentFetchData.pressure_mb;
  }

  get temperature() {
    return this._temperature[AppData.temperatureType];
  }

  get feelsLike() {
    return this._feelsLike[AppData.temperatureType];
  }
}

class ForecastDay {
  constructor(forecastDayFetchData) {
    this._day = dayjs(forecastDayFetchData.date, "YYYY-MM-DD");
    this._maxTemp = new Temperature(
      forecastDayFetchData.day.maxtemp_c,
      forecastDayFetchData.day.maxtemp_f
    );
    this._minTemp = new Temperature(
      forecastDayFetchData.day.mintemp_c,
      forecastDayFetchData.day.mintemp_f
    );
    this._avgTemp = new Temperature(
      forecastDayFetchData.day.avgtemp_c,
      forecastDayFetchData.day.avgtemp_f
    );

    this.avgHumidity = forecastDayFetchData.day.avghumidity;
    this.rainChance = forecastDayFetchData.day.daily_chance_of_rain;
    this.snowChance = forecastDayFetchData.day.daily_chance_of_snow;

    this.condition = {
      text: forecastDayFetchData.day.condition.text,
      icon: forecastDayFetchData.day.condition.icon,
      code: forecastDayFetchData.day.condition.code,
    };

    this.hourlyData = {
      tempArr: forecastDayFetchData.hour.map(
        (obj) => new Temperature(obj.temp_c, obj.temp_f)
      ),
      feelsLikeArr: forecastDayFetchData.hour.map(
        (obj) => new Temperature(obj.feelslike_c, obj.feelslike_f)
      ),
      rainChance: forecastDayFetchData.hour.map((obj) => obj.chance_of_rain),
      snowChance: forecastDayFetchData.hour.map((obj) => obj.chance_of_snow),
    };
  }

  get day() {
    return this._day.format("DD MMMM, dddd");
  }

  get maxTemp() {
    return this._maxTemp[AppData.temperatureType];
  }

  get minTemp() {
    return this._minTemp[AppData.temperatureType];
  }

  get avgTemp() {
    return this._avgTemp[AppData.temperatureType];
  }
}

class Temperature {
  constructor(c, f) {
    this.celsius = c;
    this.farenheit = f;
  }
}
