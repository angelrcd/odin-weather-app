const suggestionDatalist = document.querySelector("datalist");
export default async function getSuggestions(value) {
  try {
    const fetchOptions = {
      mode: "cors",
    };
    const response = await fetch(
      "https://api.weatherapi.com/v1/search.json?key=21be9b60ca504f4396b165818232904&q=" +
        value
    );
    const data = await response.json();
    const suggestions = data.map((obj) => obj.name + ", " + obj.country);
    console.log(suggestions);
    insertSuggestionsInList(suggestions);
  } catch {
    return;
  }
}

function insertSuggestionsInList(suggestionsArr) {
  suggestionDatalist.innerHTML = "";
  for (const suggestion of suggestionsArr) {
    const option = document.createElement("option");
    option.value = suggestion;
    suggestionDatalist.appendChild(option);
  }
}
