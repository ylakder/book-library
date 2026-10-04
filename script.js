const weekDays = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];
const yearMonths = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];
const dateDiv = document.querySelector("header .date");
const inProgressBookElement = document.querySelector(
  ".reading .book-container",
);
const nextUpBookElement = document.querySelector(".next-up .book-container");
const libraryView = document.querySelector(".library-view");
const searchView = document.querySelector(".search-view");
const searchInput = document.querySelector(".search input");
const cancelSearchBtn = document.querySelector(".search .cancel-icon");
let isFirstTime = true;
let isSearchOpen = false;
let data = [];

function updateDate() {
  let now = new Date();
  dateDiv.textContent = `${weekDays[now.getDay()]} ${now.getDate()} ${yearMonths[now.getMonth()]}`;
}
updateDate();
setInterval(() => {
  updateDate();
}, 60000);

async function fetchFromSource(url, limit) {
  const response = await (await fetch(url)).json();
  return response.docs.slice(0, limit);
}

async function getData() {
  data.push(
    ...(await fetchFromSource(
      "https://openlibrary.org/search.json?q=programming",
      4,
    )),
  );
  data.push(
    ...(await fetchFromSource(
      "https://openlibrary.org/search.json?q=coding",
      4,
    )),
  );
  data.push(
    ...(await fetchFromSource(
      "https://openlibrary.org/search.json?q=science",
      4,
    )),
  );

  data.forEach((book) => {
    if (book.cover_i) {
      let coverURL = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
      inProgressBookElement.innerHTML += `
      <div class="image" data-id="${book.key}">
        <img src="${coverURL}" alt="${book.title}">
      </div>
      `;
    } else {
      return;
    }
  });
}
getData();

function showResults(books) {
  searchView.innerHTML = "";
  books.forEach((book) => {
    if (book.cover_i) {
      let coverURL = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
      searchView.innerHTML += `
      <div class="image" data-id="${book.key}">
        <img src="${coverURL}" alt="${book.title}">
      </div>
      <div class="details">
        <span class="book-title">${book.title}</span>
        <span class="book-author">By: ${book.author_name}</span>
      </div>
      `;
    } else {
      return;
    }
  });
}
function handleSearch() {
  let query = searchInput.value.trim();
  if (query === "") {
    searchView.innerHTML = "";
    return;
  }
  fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`)
    .then((response) => response.json())
    .then((data) => showResults(data.docs));
}

searchInput.addEventListener("focus", () => {
  if (isSearchOpen) {
    return;
  }
  isSearchOpen = true;
  libraryView.classList.add("fade-out");
  document.querySelector("footer").classList.add("fade-out");
  document.querySelector("header").classList.add("fade-out");
  document.querySelector(".title").classList.add("fade-out");
  isFirstTime
    ? document.querySelector(".search").classList.add("fade-out")
    : "";
  libraryView.addEventListener(
    "transitionend",
    () => {
      libraryView.classList.add("hidden");
      document.querySelector("footer").classList.add("hidden");
      document.querySelector("header").classList.add("hidden");
      document.querySelector(".title").classList.add("hidden");
      document.querySelector(".search").classList.remove("fade-out");
    },
    { once: true },
  );

  searchView.classList.remove("hidden");
  searchView.classList.add("fade-out");
  requestAnimationFrame(() => {
    searchView.classList.remove("hidden");
    searchView.classList.remove("fade-out");
  });

  cancelSearchBtn.textContent = "✕";
  cancelSearchBtn.style.cursor = "pointer";
  isFirstTime = false;
});

cancelSearchBtn.addEventListener(
  "click",
  () => {
    isSearchOpen = false;
    libraryView.classList.add("fade-out");
    document.querySelector(".search").classList.add("hidden");
    document.querySelector("footer").classList.add("fade-out");
    document.querySelector("header").classList.add("fade-out");
    document.querySelector(".title").classList.add("fade-out");
    libraryView.addEventListener(
      "transitionend",
      () => {
        searchView.innerHTML = "";
        searchView.classList.remove("hidden");
      },
      { once: true },
    );

    libraryView.classList.remove("hidden");
    document.querySelector("header").classList.remove("hidden");
    document.querySelector(".title").classList.remove("hidden");
    document.querySelector("footer").classList.remove("hidden");
    document.querySelector(".search").classList.remove("hidden");

    libraryView.classList.add("fade-out");
    requestAnimationFrame(() => {
      libraryView.classList.remove("fade-out");
      document.querySelector("footer").classList.remove("fade-out");
      document.querySelector("header").classList.remove("fade-out");
      document.querySelector(".title").classList.remove("fade-out");
      document.querySelector(".search").classList.remove("fade-out");
    });

    searchInput.value = "";
    cancelSearchBtn.textContent = "";
    isFirstTime = true;
  },
  { once: false },
);
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSearch();
    cancelSearchBtn.textContent = "";
    cancelSearchBtn.style.cursor = "none";
  }
});
//`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
//"https://openlibrary.org/search.json?q=javascript"
