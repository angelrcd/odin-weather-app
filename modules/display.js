import { AppData } from "./app";

const appBody = document.querySelector("#app");

export default function renderDisplay() {
  // Empty past render
  appBody.innerHTML = "";

  if (AppData.isLoading) {
    renderLoad();
    return;
  }

  renderCurrentInfoRow();
  renderForecastWeekTable();
}

function renderLoad() {
  appBody.textContent = "Loading...";
}

function renderCurrentInfoRow() {
  const tempUnit = AppData.temperatureType === "celsius" ? "ºC" : "ºF";
  const locationData = AppData.getLocationData();
  const currentData = AppData.getCurrentWeatherData();

  const fragment = document.createDocumentFragment();
  const currentRow = document.createElement("section");
  currentRow.classList.add("main-row");
  currentRow.innerHTML = `
    <div class="current-main">
      <p>${locationData.getCurrentDate()}</p>
      <h2>${locationData.name}</h2>
      <img src="${currentData.condition.icon}" alt="">
      <p>${currentData.temperature}${tempUnit}</p>
      <p>feels like: ${currentData.feelsLike}${tempUnit}</p>
      <p>${currentData.condition.text}</p>
    </div>
    <div class="current-secondary">
      <div>
        <p>Humidity (%)</p>
        <p>${currentData.humidity}</p>
      </div>
      <div>
        <p>Precipitation (mm)</p>
        <p>${currentData.precipitation}</p>
      </div>
      <div>
        <p>Wind (KpH)</p>
        <p>${currentData.windData.speed_kph}</p>
      </div>
      <div>
        <p>Cloud Cover (%)</p>
        <p>${currentData.cloud}</p>
      </div>
      <div>
        <p>Pressure (mb)</p>
        <p>${currentData.pressure}</p>
      </div>
    </div>
  `;
  fragment.appendChild(currentRow);
  appBody.appendChild(fragment);
}

function renderForecastWeekTable() {
  const tempUnit = AppData.temperatureType === "celsius" ? "ºC" : "ºF";
  const forecastWeekArr = AppData.getForecastWeekArr();
  const table = document.createElement("table");
  table.classList.add("week-forecast-table");
  const tHeadRow = table.createTHead();
  tHeadRow.innerHTML = `
  <tr>
    <th rowspan="2" class="empty-cell"></th>
    <th rowspan="2""></th>
    <th rowspan="2">Rain (%)</th>
    <th rowspan="2">Snow (%)</th>
    <th rowspan="2">Humidity (%)</th>
    <th colspan="3" scope="colgroup">Temperature (${tempUnit})</th>
  </tr>
  <tr>
    <th scope="col">Min</th>
    <th scope="col">Avg<br></th>
    <th scope="col">Max</th>
  </tr>
  `;

  const tBody = table.createTBody();

  for (const dataDay of forecastWeekArr) {
    const dayDataRow = getDataDayTableRow(dataDay);
    tBody.appendChild(dayDataRow);

    // Inserts hidden hour info row
    const hourInfoRow = tBody.insertRow();
    hourInfoRow.classList.add("info-by-hour");
    const th = document.createElement("th");
    hourInfoRow.appendChild(th);
    const cell = hourInfoRow.insertCell();
    cell.colSpan = 7;
    const div = document.createElement("div");
    div.textContent = `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Perferendis, pariatur commodi corrupti cupiditate ducimus vitae odit illo impedit. Earum, tempore dolorem cumque inventore doloribus deleniti laborum dignissimos eius consectetur rerum?
    Nisi laboriosam harum animi nulla alias ea repellat eius, dolor ex eum quaerat, consequuntur minus quisquam nemo perspiciatis voluptates consectetur vitae nam dicta vel quidem ab ipsa dolores quo? Cumque?
    Omnis enim temporibus tempore porro esse doloremque id. Explicabo incidunt tempora unde, sapiente eaque commodi libero similique neque eligendi harum ab praesentium corporis temporibus vitae architecto velit molestias minima repudiandae.
    Maxime, libero vero? Nostrum cumque quibusdam impedit hic maxime commodi doloremque dolor recusandae, dignissimos, velit ullam? Repellendus praesentium aut soluta laborum aliquam fugiat, veritatis eaque nobis possimus impedit totam voluptas!
    Quas quam at iste nesciunt eum ullam quaerat, possimus consectetur deserunt tempora ad nemo dolor quos similique iure hic soluta saepe, temporibus incidunt praesentium minus exercitationem aliquid. Voluptates, harum minima!
    Asperiores adipisci, ab iusto natus dolore at, exercitationem sint officia unde eum nisi repellendus fugiat ipsam vitae ipsum laboriosam deserunt cumque nostrum molestias nobis minima culpa perspiciatis. Dicta, dolor harum!
    Perspiciatis itaque dicta unde eius necessitatibus similique officia autem nesciunt non voluptatibus aliquid at impedit ducimus dolores architecto quis, eaque vero alias optio laborum tempore fugit? Tenetur officia ex optio.
    Voluptatem ratione corporis dolore distinctio, id quasi recusandae? Iure aliquam nostrum et, reprehenderit vero suscipit numquam, deserunt maxime, repellendus cumque placeat. A aliquam vel accusamus mollitia, quo sequi voluptatibus ut!
    Deserunt nisi odit saepe accusantium, corporis cumque sed culpa labore quo quam quasi adipisci vel asperiores beatae debitis nobis distinctio! Necessitatibus quam asperiores qui alias ad? Expedita quo tempora saepe?
    Repudiandae natus incidunt doloribus, porro expedita qui officia facilis impedit voluptas vitae eaque iure quisquam tempore recusandae. Possimus tempora dolorem unde officia aliquam similique quasi, non, at ad cumque illum?
    Ut repellendus minus ipsam nostrum a corrupti, architecto soluta doloremque saepe exercitationem sapiente. Tenetur adipisci reiciendis sunt tempore. Dolor, veritatis quas similique dolorem omnis animi id velit veniam quam minima.
    Aperiam possimus laudantium officia, veritatis eaque minus similique vero eos veniam quisquam maiores tempora amet, quasi exercitationem minima porro id temporibus, iusto sint nemo. Excepturi sunt labore delectus modi facilis.
    Iure mollitia consequatur nostrum sapiente numquam, et ipsa quo sunt quod quibusdam nihil voluptate inventore error. Commodi similique perferendis deleniti nulla incidunt totam, quibusdam, enim ipsa cumque, corporis nisi saepe.
    Sed laborum cupiditate repudiandae at architecto corporis in rerum impedit, ipsam praesentium enim reiciendis! Quis tempore dolorem cum dicta et, blanditiis ipsum esse dolor voluptatem quo quia doloribus accusantium. Atque.
    Dolore, illo tempora! Suscipit nulla, nesciunt corrupti libero laborum repellat reprehenderit illum dicta est ratione itaque! Nisi, cupiditate impedit sapiente, facere sed ea tempore corrupti aliquam laboriosam ipsam doloribus dolore.
    Maiores earum exercitationem consectetur distinctio doloremque, possimus magnam saepe itaque pariatur veniam et placeat beatae hic perferendis neque omnis dolor molestias voluptates alias debitis quod. Velit ad maxime autem ab.
    Molestias doloremque laboriosam architecto maiores est provident nisi iste culpa? Perspiciatis, error quidem dignissimos minus similique nisi nobis aperiam quisquam officia pariatur illo tenetur est, facilis voluptatem corrupti placeat reprehenderit?
    Suscipit earum minus omnis culpa. Eaque iure eos laborum dolor inventore magnam in aspernatur maxime expedita excepturi earum voluptas consectetur voluptatum cum, tempore ea. Laudantium repudiandae maiores esse ab repellendus?
    Quia sit, possimus eaque facere temporibus recusandae ullam nam est quibusdam iste repudiandae at cumque, sequi earum molestias itaque dicta ea mollitia nesciunt excepturi obcaecati nulla cupiditate. Deserunt, omnis necessitatibus.
    Facere perspiciatis quos cupiditate excepturi consequuntur veniam itaque dicta sed saepe voluptate pariatur, nostrum voluptatem! Autem earum ut neque voluptas quo ipsa eius molestias delectus dolorem aut. Illum, non natus?
    Libero sint itaque recusandae illo ratione unde consectetur sequi deserunt aperiam, nam molestiae velit nostrum exercitationem officia atque vel hic tempore fugit sed, assumenda, sunt minima. Dignissimos a voluptatem cumque.
    Explicabo commodi a, delectus fugit numquam, porro labore quia cupiditate officiis provident magnam necessitatibus unde excepturi, placeat expedita iure harum. Voluptatum adipisci delectus et voluptas, facere sequi accusantium cumque eius!
    Quidem, iusto. Dolorum nam perspiciatis, labore provident pariatur id nulla dolorem expedita veniam molestiae non velit reiciendis repellat enim dolor ut at debitis ad quidem accusamus dicta neque in autem?
    Earum atque culpa quod? Illum, consequatur! Neque praesentium ipsam dolor perferendis reprehenderit eos voluptatibus sed nostrum quae deserunt explicabo animi ipsa ratione, facere minima earum maiores! Facilis vero ullam temporibus.
    Ab molestias expedita eum rem assumenda consequatur corrupti quibusdam, sapiente ea, ullam aut dolores corporis praesentium fuga minima hic laboriosam sint eius quae facilis iure, voluptate saepe reprehenderit. Reiciendis, ad?
    Quaerat, in! Dignissimos voluptatem, et voluptatum maiores cupiditate, ab quas dicta ipsum dolores aperiam libero, impedit a consectetur nostrum harum quisquam doloremque sapiente consequuntur pariatur rerum! Voluptatem quos minus esse!
    Porro assumenda dolorem voluptatum, in totam ad amet asperiores culpa quod sint accusamus adipisci voluptas corrupti quaerat ea illo reiciendis sed similique esse quibusdam ducimus. Eum minima sit adipisci voluptas!
    Asperiores soluta expedita impedit ipsa modi labore! Quam iste consectetur delectus quo laboriosam quidem aperiam officia enim placeat eveniet esse, hic nesciunt? Aut, nulla nobis! Eligendi consectetur omnis quidem magnam!
    Ea illo voluptatem error eius labore, ipsum repellat quo odit debitis dolorem rem enim culpa iusto ipsa similique modi nemo, facilis perspiciatis officia suscipit consectetur, nam dolore sit quos? Alias!
    Nihil minus accusamus repellendus. Ducimus consequatur quo blanditiis modi optio tenetur ea quia cumque voluptas reiciendis placeat, nulla vitae animi dolores, saepe, molestiae sint ratione fuga! Sit magnam obcaecati fuga?`;
    div.classList.add("info-by-hour");
    cell.appendChild(div);
  }

  const weekForecastSection = document.createElement("section");
  weekForecastSection.classList.add("week-info-row");
  weekForecastSection.appendChild(table);
  appBody.appendChild(weekForecastSection);
}

function getDataDayTableRow(dataDay) {
  const tRow = document.createElement("tr");
  const thDay = document.createElement("th");
  thDay.innerText = dataDay.day;
  tRow.appendChild(thDay);

  const iconCell = tRow.insertCell();
  iconCell.classList.add("icon-cell");
  const img = new Image();
  img.src = dataDay.condition.icon;
  img.alt = dataDay.condition.text;
  iconCell.appendChild(img);

  tRow.insertCell().innerText = dataDay.rainChance;
  tRow.insertCell().innerText = dataDay.snowChance;
  tRow.insertCell().innerText = dataDay.avgHumidity;
  tRow.insertCell().innerText = dataDay.minTemp;
  tRow.insertCell().innerText = dataDay.avgTemp;
  tRow.insertCell().innerText = dataDay.maxTemp;

  return tRow;
}
