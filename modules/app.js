export const AppData = (function () {
  let _location = null;

  const getLocationData = () => {
    return _location;
  };

  const setAppData = (fetchJson) => {
    _location = new LocationData(fetchJson.location);
  };

  return {
    setAppData,
    getLocationData,
  };
})();

class LocationData {
  constructor(locationFetchData) {
    this.name = locationFetchData.name;
    this.region = locationFetchData.region;
    this.country = locationFetchData.country;
    this.localTime = locationFetchData.localtime;
  }
}
