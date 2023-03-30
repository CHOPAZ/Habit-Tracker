'use strict';

let habbits = []; // Состояние приложения

const HEBBIT_KEY = 'HEBBIT_KEY';

/* Загрузка данных */
function loadData() {
  const habbitsString = localStorage.getItem(HEBBIT_KEY);
  const habbitArray = JSON.parse(habbitsString);

  /* Проверка на массив */
  if (Array.isArray(habbitArray)) {
    habbits = habbitArray;
  }
}

/* Сохранение данных */
function saveData() {
  localStorage.setItem(HEBBIT_KEY, JSON.stringify(habbits));
}

/* Инициализация приложения IIFE */
(() => {
  loadData();
})();
