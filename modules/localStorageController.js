export default class LocalStorageController {
  static getLastCity() {
    return localStorage.getItem("lastCity") || "Madrid";
  }

  static setLastCity(city) {
    localStorage.setItem("lastCity", city);
  }

  static getTemperatureType() {
    return localStorage.getItem("temperatureType") || "celsius";
  }

  static setTemperatureType(type) {
    localStorage.setItem("temperatureType", type);
  }
}
