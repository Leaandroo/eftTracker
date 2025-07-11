const addItemForm = document.getElementById("addItem");
const itemsList = document.getElementById("item-List");

let hideoutItems = [];

function saveItem() {
  try {
    localStorage.setItem("tarkovItem", JSON.stringify(hideoutItems)); //Añadimos el item al localStorage
  } catch (e) {
    console.error("No funciona crack :(", e);
  }
}

function loadItem() {
  try {
    const data = localStorage.getItem("tarkovItem"); //Obtenemos el item del localStorage
    if (data) {
      hideoutItems = JSON.parse(data);
    }
  } catch (e) {
    console.error("Error al cargar los datos: ", e);
    hideoutItems = [];
  }
}

function renderItems() {
  //Renderizamos el item en la lista
  itemsList.innerHTML = "";

  hideoutItems.forEach((item, index) => {
    const progress =
      item.required > 0 ? (item.current / item.required) * 100 : 0; //Calculo el progreso de obtencion del item
    const progressColorClass = progress === 100 ? "green" : "blue"; //Pongo la barra de progreso en verde si esta completa

    const itemElement = document.createElement("div");
    itemElement.className = "item-card";
    itemElement.innerHTML = `
        <div>
            <h3 class="card-name">${item.name}</h3>
            <p class="card-need">Necesitas: <span>${item.required}</span></p>
            <p class="card-need">Tienes: <span>${item.current}</span></p>
        </div>
        <div class="progress-section">
            <div class="progress-text">${Math.round(progress)}%</div>
            <div class="progress-bar">
                    <div class="progress-fill ${progressColorClass}" style="width: ${progress}%;"></div>
            </div>
        </div>
        <div class="card-buttons">
            <button onclick="updateQuantity(${index}, -1)" class="btn btn-yellow"> -1 </button>
            <button onclick="updateQuantity(${index}, 1)" class="btn btn-blue"> +1 </button>
            <button onclick="deleteItem(${index})" class="btn btn-red"> Eliminar</button>
        </div>`;
    itemsList.appendChild(itemElement);
  });
}

//Funcion para añadir item a la lista
function addItem(name, needed, quantity) {
  name = name.at(0).toUpperCase() + name.slice(1);
  const existingItem = hideoutItems.find(
    (item) => item.name.toLowerCase() === name.toLowerCase()
  );
  if (existingItem) {
    console.log("Este item ya existe: ", existingItem);
    return false;
  } else {
    hideoutItems.push({
      name: name,
      required: needed,
      current: quantity,
    });
    saveItem();
    renderItems();
    return true;
  }
}

function deleteItem(index) {
  //Elimina el item mediante el index recibido
  if (index >= 0 && index < hideoutItems.length) {
    hideoutItems.splice(index, 1);
    saveItem();
    renderItems();
  }
}

function updateQuantity(index, changeIndex) {
  if (index >= 0 && index < hideoutItems.length) {
    const item = hideoutItems[index];
    const newCurrent = item.current + changeIndex;

    item.current = Math.max(0, Math.min(newCurrent, item.required));
    saveItem();
    renderItems();
  }
}

addItemForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const itemNameInput = document.getElementById("itemName"); //raw input from HTML
  //console.log(`valor del input name = ${itemNameInput}`);
  const itemsQuantity = document.getElementById("itemsQuantity"); //raw input from HTML
  //console.log(`valor del input cantidad = ${itemsQuantity}`);
  const itemsNeeded = document.getElementById("itemsNeeded"); //raw input from HTML
  //console.log(`valor del input needed = ${itemsNeeded}`);

  const itemName = itemNameInput.value.trim(); //Converted date for actual values
  //console.log(`valor del input name limpio = ${itemNameInput}`);
  const itemQuantity = parseInt(itemsQuantity.value, 10); //Converted date for actual values
  //console.log(`valor del input cantidad parseado = ${itemsQuantity}`);
  const itemNeeded = parseInt(itemsNeeded.value, 10); //Converted date for actual values
  //console.log(`valor del input needed parsead = ${itemsNeeded}`);

  if (
    itemName &&
    !isNaN(itemQuantity) &&
    !isNaN(itemNeeded) &&
    itemQuantity >= 0 &&
    itemNeeded > 0
  ) {
    if (addItem(itemName, itemNeeded, itemQuantity)) {
      itemNameInput.value = ""; //Limpia el input del formulario
      itemsQuantity.value = ""; //Limpia el input del formulario
      itemsNeeded.value = ""; //Limpia el input del formulario
    }
  } else {
    console.log("Agrega bien el item pajero");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  loadItem();
  renderItems();
});
