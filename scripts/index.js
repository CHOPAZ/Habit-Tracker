'use strict';

let habbits = []; // Состояние приложения

const HEBBIT_KEY = 'HEBBIT_KEY';

/* Объект с полученными элементами */

const page = {
  menu: document.querySelector('.menu__list'),
};

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

/* Рендер левого меню - приходит целый объект привычки */
function rerenderMenu(activeHabbit) {
  /* Проверка на активное меню */
  if (!activeHabbit) {
    return;
  }

  for (const habbit of habbits) {
    const existed = document.querySelector(`[menu-button-id="${habbit.id}"]`);

    /* Если элемент не найден */
    if (!existed) {
      const btn = document.createElement('button');
      btn.setAttribute('menu-button-id', habbit.id);
      btn.classList.add('menu__item');
      btn.innerHTML = `<img src="./images/${habbit.icon}.svg" alt="${habbit.name}" />`;
      btn.addEventListener('click', () => rerender(habbit.id));

      if (activeHabbit.id === habbit.id) {
        btn.classList.add('menu__item_active');
      }

      page.menu.appendChild(btn);
      continue;
    }
    /* Если элемент найден */
    if (activeHabbit.id === habbit.id) {
      existed.classList.add('menu__item_active');
    } else {
      existed.classList.remove('menu__item_active');
    }
  }
}

/* Рендер всей страницы - приходит id */
function rerender(activeHabbitId) {
  const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
  rerenderMenu(activeHabbit);
}

/* Инициализация приложения IIFE */
(() => {
  loadData();
  rerender(habbits[0].id); // начальньый активный habbit
})();
