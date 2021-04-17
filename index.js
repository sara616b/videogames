"use strict";
import { headers } from "./settings.js";
window.addEventListener("DOMContentLoaded", start);
const form = document.querySelector("form");

function start() {
  updateList();
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    preparePost();
    clearForm();
  });
}

function updateList() {
  document.querySelector("main").textContent = "";
  get();
}
function clearForm() {
  form.elements.multiplayer.value = "";
  form.elements.title.value = "";
  form.elements.genre.value = "";
  form.elements.age_limit.value = "";
  form.elements.release_date.value = "";
  form.elements.developer.value = "";
  form.elements.price.value = "";
  form.elements.description.value = "";
  form.elements.metascore.value = "";
  form.elements.platforms = "[]";
}

function get() {
  fetch("https://frontenddatabases-cb0a.restdb.io/rest/videogames", {
    method: "get",
    headers: headers,
  })
    .then((e) => e.json())
    .then((e) => e.forEach(showGame));
}

function showGame(game) {
  const template = document.querySelector("template").content;
  const copy = template.cloneNode(true);

  copy.querySelector(".delete").addEventListener("click", () => {
    let gameId = game._id;
    deleteGame(gameId);
  });
  copy.querySelector("h2").textContent = game.title;

  if (game.developer === undefined) {
    copy.querySelector(".developer").classList.add("hidden");
  } else {
    copy.querySelector(".developer").textContent = game.developer;
  }
  if (game.description === undefined) {
    copy.querySelector(".description").classList.add("hidden");
  } else {
    copy.querySelector(".description").textContent = game.description;
  }
  if (game.age_limit === undefined) {
    copy.querySelector(".age_limit").classList.add("hidden");
    console.log(copy.querySelector(".age_limit"));
  } else {
    copy.querySelector(".age_limit").textContent = game.age_limit;
  }

  document.querySelector("main").appendChild(copy);
}
function preparePost() {
  let multiplayer = true;
  if (form.elements.multiplayer.value === "singleplayer") {
    multiplayer = false;
  }
  const platforms = [];
  const platformEls = document.querySelectorAll("[name=platforms]:checked");
  platformEls.forEach((el) => platforms.push(el.value));
  post({
    title: form.elements.title.value,
    genre: form.elements.genre.value,
    age_limit: form.elements.age_limit.value,
    release_date: form.elements.release_date.value,
    developer: form.elements.developer.value,
    price: form.elements.price.value,
    description: form.elements.description.value,
    platforms: platforms,
    multiplayer: multiplayer,
    metascore: form.elements.metascore.value,
  });
}
function post(data) {
  const postData = JSON.stringify(data);
  fetch("https://frontenddatabases-cb0a.restdb.io/rest/videogames", {
    method: "post",
    headers: headers,
    body: postData,
  })
    .then((res) => res.json())
    .then((data) => showGame(data));
}
function deleteGame(id) {
  console.log("deleting game");
  fetch("https://frontenddatabases-cb0a.restdb.io/rest/videogames/" + id, {
    method: "delete",
    headers: headers,
  })
    .then((res) => res.json())
    .then((data) => updateList());
}
