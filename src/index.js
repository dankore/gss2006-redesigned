//START: Get data from JSON file and render to browse
// Get data from JSON file stored in github.com
const request = new XMLHttpRequest();

request.open("GET", "https://dankore.github.io/gss-2006-json/2006.json");

const storeDataInArray = [];

request.onload = () => {
  const data = JSON.parse(request.responseText);

  // sort by name
  data.set.sort(function(a, b) {
    var nameA = a.name.toUpperCase(); // ignore upper and lowercase
    var nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names must be equal
    return 0;
  });
  storeDataInArray.push(...data.set);
  render(data);
  //START(search): Get data from JSON file for search
};
request.send();

//CONTINUE(search): Create the search method
function findMatches(word, storeDataInArray) {
  storeDataInArray.filter(item => {
    const regex = new RegExp(word, "gi");
    return item.name.match(regex) || item.state.match(regex);
  });
}
//CONTINUE(search): Display matches
const displayContainer = document.querySelector("#search-display");

function displayMatches() {
  if (input.value === "") {
    displayContainer.innerHTML = ``;
  } else {
    const html = findMatches(this.value, storeDataInArray)
      .map(item => {
        const regex = new RegExp(this.value, "gi");

        const name = item.name.replace(
          regex,
          `<span class="hl">${this.value}</span>`
        );
        const classOf = item.class.replace(
          regex,
          `<span class="hl">${this.value}</span>`
        );

        return `
      <ul>
        <li>
          <p class="returnedSearch"> ${name}, ${classOf} </p>
        </li>
      </ul>
      `;
      })
      .join("");
    displayContainer.innerHTML = html;
  }
}
const input = document.querySelector("#search");
input.addEventListener("input", displayMatches);

//Render JSON data to browser
const render = myData => {
  const handleBarTemplate = document.querySelector("#template").innerHTML;

  const compiled = Handlebars.compile(handleBarTemplate);
  const generatedHtml = compiled(myData);
  const jsonContainerinHtml = document.querySelector(".json-container");

  jsonContainerinHtml.innerHTML = generatedHtml;
};
//END: Get data from JSON file and render to browser

//START: Calculate days till birthday
// Calculate number of days
Handlebars.registerHelper("calculateUntillBirthDay", dob => {
  const daysIntoYear = date => {
    return (
      (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
        Date.UTC(date.getFullYear(), 0, 0)) /
      24 /
      60 /
      60 /
      1000
    );
  };
  //Get input
  const arr = dob.split(" ");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const arr1 = arr[0];
  const arr2 = parseInt(arr[1], 10);

  const monthStr = months.indexOf(arr1);

  const currentDate = new Date();
  const futureDate = new Date(0, monthStr, arr2);
  const futureDays = daysIntoYear(futureDate);
  const numberOfDaysToDate = daysIntoYear(currentDate);

  const daysRemaining = futureDays - numberOfDaysToDate;

  if (daysRemaining < 0) {
    return daysRemaining + 365 + " days to birthday";
  } else if (daysRemaining === 0) {
    return "Today is birthday 🎂";
  } else {
    return daysRemaining + " days to birthday";
  }
});
//ENDS: Calculate days till birthday
