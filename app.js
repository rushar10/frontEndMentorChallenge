const section = document.getElementById("container");
const tagsContainer = document.querySelector(".tags-container");
const tags = document.querySelector(".tag-section");
const clear = document.getElementById("clear");
let filterArray = [];

window.addEventListener("DOMContentLoaded", () => {
  async function anon() {
    addItem(await getJSON());
  }
  anon();
});
const getJSON = async function () {
  const data = await fetch("./data.json");
  const resp = await data.json();

  return resp;
};
clear.addEventListener("click", clearAll);
function addItem(arr) {
  const newArr = arr
    .map((item) => {
      return `
      <div class="item-box ${item.featured && "is-featured"}">
      <div class="inner-container">
        <div class="profile">
          <img src=${item.logo} alt=${item.company + "logo"} />
        </div>
        <div class="job-info">
          <div class="company-info">
            <h4 class="name">${item.company}</h4>
            ${item.new ? '<h4 class="new">New!</h4>' : ""}
            ${item.featured ? '<h4 class="featured">Featured</h4>' : ""}
          </div>
          <strong class="position">${item.position}</strong>
          <div class="details">
            <small class="posted-at">${item.postedAt}</small>
            <small class="contract">${item.contract}</small>
            <small class="location">${item.location}</small>
          </div>
        </div>

        <div class="filters">
          <button class="role">${item.role}</button>
          <button class="level">${item.level}</button>
          ${item.languages.map((lang) => {
            return `<button class="language">${lang}</button>`;
          })}
          ${item.tools.map((tool) => {
            return `<button class="tool">${tool}</button>`;
          })}
        </div>
      </div>
    </div>
    `;
    })
    .join("");
  section.innerHTML = newArr;
  const filterButton = document.querySelectorAll(".filters button");

  filterButton.forEach((button) => {
    button.addEventListener("click", writeToTags);
  });
}

function writeToTags(e) {
  tagsContainer.style.display = "flex";
  if (!filterArray.includes(e.currentTarget.textContent)) {
    filterArray.push(e.currentTarget.textContent);
  }
  tagDis();
  filter();
}

async function clearAll() {
  filterArray = filterArray.filter((item) => item == "");
  tagDis();
  addItem(await getJSON());
}

function tagDis() {
  if (filterArray !== []) {
    const disTag = filterArray
      .map((arr) => {
        return `
      <div class="tag">
        <span>${arr}</span>
        <button class="cross-button"><i class="fas fa-times"></i></button>
    </div>`;
      })
      .join("");
    tags.innerHTML = disTag;
  } else {
    tags.innerHTML = "";
  }
  const crossBtn = document.querySelectorAll(".cross-button");
  crossBtn.forEach((btn) => {
    btn.addEventListener("click", removeItem);
  });
}

function removeItem(e) {
  let item = e.currentTarget.previousElementSibling.textContent;
  filterArray = filterArray.filter((arr) => arr != item);
  tagDis();
  filter();
}

async function filter() {
  const resp = await getJSON();
  const newArr = [];
  resp.forEach((item) => {
    let count = 0;
    filterArray.forEach((arr) => {
      if (
        item.languages.includes(arr) ||
        item.level == arr ||
        item.tools.includes(arr) ||
        (item.role == arr && !newArr.includes(item))
      ) {
        count++;
      }
    });
    if (count == filterArray.length) {
      newArr.push(item);
    }
  });
  addItem(newArr);
}
