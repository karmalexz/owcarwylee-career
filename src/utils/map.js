import { loadScript } from "./utils";

let autocompleteService, placeService;
const GOOGLE_API_SERVICE = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBal4PU2T0poc6U14VZ7B6R9TvNpLd0eY4&libraries=places"

export const getMapServices = async () => {
  if (!autocompleteService) {
    return new Promise((resolve) => {
      loadScript(GOOGLE_API_SERVICE, () => {
        autocompleteService = new window.google.maps.places.AutocompleteService();
        placeService = new window.google.maps.places.PlacesService(document.createElement("div"));
        resolve({ autocompleteService, placeService });
      });
    })
  }
  return Promise.resolve({ autocompleteService, placeService });
}

