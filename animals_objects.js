// "use strict";

window.addEventListener("DOMContentLoaded", start);

const Animal = {
  name: "-default name-",
  description: "-no description-",
  type: "-unknown",
  age: 0,
};

const allAnimals = [];
// let filterBy = "all"; //global variable
const settings = {
  filter: "all",
  sortBy: "name",
  sortDir: "asc",
};

function start() {
  console.log("ready");
  registerButtons();
  loadJSON();
}
//add eventListeners n buttons here**************************************************************************************************************//
function registerButtons() {
  const buttons = document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));
  console.log(buttons); // Check if it selects the correct elements
  //sorting
  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));
}

//filtering*******************************************************************************************************************//

function selectFilter(event) {
  settings.filter = event.target.dataset.filter;
  console.log(`User selected: ${settings.filter}`);

  buildList(); //  This will apply the filter and rebuild the list
}
function filterList(filteredList) {
  if (settings.filter === "cat") {
    filteredList = allAnimals.filter(isCat);
  } else if (settings.filter === "dog") {
    filteredList = allAnimals.filter(isDog);
  } else {
    filteredList = allAnimals; // Show all animals if no filter
  }

  return filteredList;
}

function isCat(animal) {
  return animal.type.toLowerCase() === "cat"; // Ensure case-insensitive match
}

function isDog(animal) {
  return animal.type.toLowerCase() === "dog";
}
//sorting starts here******************************************************************************************************///////////////////

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

function sortList(sortedList) {
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }
  sortedList = sortedList.sort(sortByProperty);

  // we use the above sortby parameter as a function
  function sortByProperty(animalA, animalB) {
    if (animalA[settings.sortBy] < animalB[settings.sortBy]) {
      return 1 * direction;
    } else {
      return -1 * direction; // const sortedList = sortedList.sort(sortByName);
    }
  }

  return sortedList;
}

function buildList() {
  //
  const currentList = filterList(allAnimals);
  // let sortedList = allAnimals; abhi kia
  const sortedList = sortList(currentList);
  displayList(sortedList);
}
//selectsort function
function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;
  //toggle the direction
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }

  console.log(`user selected ${sortBy}-${sortDir}`);
  setSort(sortBy, sortDir);
}

function loadJSON() {
  fetch("animals.json")
    .then((response) => response.json())
    .then((jsonData) => {
      prepareObjects(jsonData);
    });
}

function prepareObjects(jsonData) {
  jsonData.forEach((jsonObject) => {
    const animal = Object.create(Animal);
    const fullname = jsonObject.fullname;

    const firstSpace = fullname.indexOf(" ");
    const secondSpace = fullname.indexOf(" ", firstSpace + 1);
    const lastSpace = fullname.lastIndexOf(" ");

    animal.name = fullname.substring(0, firstSpace);
    animal.desc = fullname.substring(secondSpace + 1, lastSpace);
    animal.type = fullname.substring(lastSpace + 1).toLowerCase(); // Normalize type case
    animal.age = jsonObject.age;

    allAnimals.push(animal);
  });

  displayList(allAnimals); // Pass full list initially
}

function displayList(animals) {
  const tableBody = document.querySelector("#list tbody");
  tableBody.innerHTML = ""; // Clear the list before appending

  animals.forEach(displayAnimal); // Use the passed-in list, not allAnimals
}

function displayAnimal(animal) {
  const clone = document.querySelector("template#animal").content.cloneNode(true);

  clone.querySelector("[data-field=name]").textContent = animal.name;
  clone.querySelector("[data-field=desc]").textContent = animal.desc;
  clone.querySelector("[data-field=type]").textContent = animal.type;
  clone.querySelector("[data-field=age]").textContent = animal.age;

  document.querySelector("#list tbody").appendChild(clone);
}
