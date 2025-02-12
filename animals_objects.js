// "use strict";

window.addEventListener("DOMContentLoaded", start);

const Animal = {
  name: "-default name-",
  description: "-no description-",
  type: "-unknown",
  age: 0,
};

const allAnimals = [];

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
  const filter = event.target.dataset.filter;
  console.log(`user selected ${filter}`);
  filterList(filter);
}
function filterList(filterBy) {
  let filteredList = allAnimals; // Default to all animals

  if (filterBy === "cat") {
    filteredList = allAnimals.filter(isCat);
  } else if (filterBy === "dog") {
    filteredList = allAnimals.filter(isDog);
  }

  console.log("Filtered List:", filteredList); // Debugging
  displayList(filteredList); // Pass the filtered list
}

function isCat(animal) {
  return animal.type.toLowerCase() === "cat"; // Ensure case-insensitive match
}

function isDog(animal) {
  return animal.type.toLowerCase() === "dog";
}
//sorting starts here******************************************************************************************************///////////////////

function sortList(sortBy, sortDir) {
  // let sortedList = allAnimals.sort(sortByType);
  console.log(`sortBy is ${sortBy}`);
  let sortedList = allAnimals;
  let direction = 1;
  if (sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }
  sortedList = sortedList.sort(sortByProperty);

  // we use the above sortby parameter as a function
  function sortByProperty(animalA, animalB) {
    if (animalA[sortBy] < animalB[sortBy]) {
      return 1 * direction;
    } else {
      return -1 * direction; // const sortedList = sortedList.sort(sortByName);
    }
  }

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
  sortList(sortBy, sortDir);
  // console.log(selectSort);
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

// ✅ Ensure filterList() is called after data is loaded
// setTimeout(() => {
//   filterList("cat"); // Test filtering for cats
// }, 2000);
