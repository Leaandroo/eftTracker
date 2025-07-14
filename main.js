const addItemForm = document.getElementById("addItemForm");
const itemsList = document.getElementById("itemList");

let hideoutItems = [];
const hideoutModules = [
  "Air Filtering Unit",
  "Bitcoin Farm",
  "Booze Generator",
  "Cultist Circle",
  "Generator",
  "Gear Rack",
  "Gym",
  "Hall of Fame",
  "Heating",
  "Illumination",
  "Intelligence Center",
  "Lavatory",
  "Library",
  "Medstation",
  "Nutrition Unit",
  "Rest Space",
  "Scav Case",
  "Security",
  "Shooting Range",
  "Solar Power",
  "Stash",
  "Vents",
  "Water Collector",
  "Weapon Rack",
  "Workbench",
  "Mission",
];

function saveItem() {
  try {
    localStorage.setItem("hideoutItems", JSON.stringify(hideoutItems)); //Añadimos el item al localStorage
  } catch (e) {
    console.error("No funciona crack :(", e);
  }
}

function loadItem() {
  try {
    const data = localStorage.getItem("hideoutItems"); //Obtenemos el item del localStorage
    if (data) {
      hideoutItems = JSON.parse(data);
    }
  } catch (e) {
    console.error("Error al cargar los datos: ", e);
    hideoutItems = [];
  }
}

function renderItems(vacio) {
  //Renderizamos el item en la lista
  vacio ? true : (itemsList.innerHTML = "");

  hideoutItems.forEach((item, index) => {
    const progress = item.required > 0 ? (item.current / item.required) * 100 : 0; //Calculo el progreso de obtencion del item
    const progressColorClass = progress === 100 ? "completed" : "notCompleted"; //Pongo la barra de progreso en verde si esta completa

    const itemElement = document.createElement("div");
    itemElement.className = "item-card";
    itemElement.innerHTML = `
        <div>
            <h3 class="card-name">${item.name}</h3>
            <p class="card-need">Necesitas: <span>${item.required}</span></p>
            <p class="card-need">Tienes: <span>${item.current}</span></p>
            <p class="card-need">Modulo: <span>${item.moduleItem}</span></p>
        </div>
        <div class="progress-section">
            <div class="progress-text">${Math.round(progress)}%</div>
            <div class="progress-bar">
                    <div class="progress-fill ${progressColorClass}" style="width: ${progress}%;"></div>
            </div>
        </div>
        <div class="card-buttons">
            <button onclick="lowerQuantity(${index}, -1)" class="btn btn-minus"> - 1 </button>
            <button onclick="addQuantity(${index}, 1)" class="btn btn-plus"> + 1 </button>
            <button onclick="deleteItem(${index})" class="btn btn-delete"> Eliminar</button>
        </div>`;
    itemsList.appendChild(itemElement);
  });
}

//Funcion para añadir item a la lista
function addItem(name, needed, quantity, moduleHideout) {
  name = name.at(0).toUpperCase() + name.slice(1);
  moduleHideout = hideoutModules.at(moduleHideout - 1);

  const existingItem = hideoutItems.find((item) => item.name.toLowerCase() === name.toLowerCase());
  const sameModule = hideoutModules.find((item) => item == moduleHideout);

  if (existingItem) {
    if (sameModule) {
      hideoutItems.push({
        name: name,
        required: needed,
        current: quantity,
        moduleItem: moduleHideout,
      });
    } else {
      existingItem.required += needed;
    }

    saveItem();
    renderItems();
  } else {
    hideoutItems.push({
      name: name,
      required: needed,
      current: quantity,
      moduleItem: moduleHideout,
    });
    saveItem();
    renderItems();
  }
  return true;
}

function deleteItem(index) {
  //Elimina el item mediante el index recibido
  if (index >= 0 && index < hideoutItems.length) {
    hideoutItems.splice(index, 1);
    saveItem();
    renderItems();
  }
}

function addQuantity(index) {
  const itemName = hideoutItems.at(index).name;

  if (index >= 0 && index < hideoutItems.length) {
    hideoutItems.forEach((item) => {
      if (item.name == itemName) {
        if (item.current < item.required) {
          const newCurrent = item.current + 1;
          item.current = Math.max(0, newCurrent);
          saveItem();
          renderItems();
        }
      }
    });
  }
}

function lowerQuantity(index) {
  if (index >= 0 && index < hideoutItems.length) {
    const item = hideoutItems[index];
    const newCurrent = item.current - 1;
    item.current = Math.max(0, newCurrent);
    saveItem();
    renderItems();
  }
}

addItemForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const itemNameInput = document.getElementById("itemNameText"); //raw input from HTML
  const itemsQuantity = document.getElementById("itemHideoutText"); //raw input from HTML
  const itemsNeeded = document.getElementById("itemNeededText"); //raw input from HTML
  const itemsModule = document.getElementById("selectorModule");

  const itemName = itemNameInput.value.trim(); //Converted date for actual values
  const itemQuantity = parseInt(itemsQuantity.value, 10); //Converted date for actual values
  const itemNeeded = parseInt(itemsNeeded.value, 10); //Converted date for actual values
  const itemModule = parseInt(itemsModule.value, 10); //Convert module selection to an int

  if (itemName && !isNaN(itemQuantity) && !isNaN(itemNeeded) && itemQuantity >= 0 && itemNeeded > 0 && itemModule >= 0 && itemModule <= 25) {
    if (addItem(itemName, itemNeeded, itemQuantity, itemModule)) {
      itemNameInput.value = ""; //Limpia el input del formulario
      itemsQuantity.value = ""; //Limpia el input del formulario
      itemsNeeded.value = ""; //Limpia el input del formulario
      itemsModule.value = "0"; //Limpio el Selector del modulo
    }
  } else {
    console.log("Agrega bien el item pajero");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  loadItem();
  let vacio = hideoutItems.length == 0 ? true : false;
  renderItems(vacio);
});
