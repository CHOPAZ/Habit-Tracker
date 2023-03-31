'use strict';

let habbits = []; // Состояние приложения

const HEBBIT_KEY = 'HEBBIT_KEY';

/* Объект с полученными элементами */

const page = {
  menu: document.querySelector('.menu__list') /* блок левого меню */,
  header: {
    h1: document.querySelector('h1'),
    progressPrecent: document.querySelector('.progres__precent'),
    progressCoverBar: document.querySelector('.progress__cover-bar'),
  },
};
console.log(page.header.h1);

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

/* Рендер шапки */

function rerenderHead(activeHabbit) {
  if (!activeHabbit) {
    return;
  }
  /* рендер заголовка */
  page.header.h1.innerText = activeHabbit.name;

  /* рендер прогресса */
  const progress =
    activeHabbit.days.length / activeHabbit.target > 1
      ? 100
      : (activeHabbit.days.length / activeHabbit.target) * 100;
  page.header.progressPrecent.innerHTML = progress.toFixed(0) + '%'
  page.header.progressCoverBar.setAttribute('style', `width: ${progress}%`)
}

/* Рендер всей страницы - приходит id */
function rerender(activeHabbitId) {
  const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
  rerenderMenu(activeHabbit);
  rerenderHead(activeHabbit);
}

/* Инициализация приложения IIFE */
(() => {
  loadData();
  rerender(habbits[0].id); // начальньый активный habbit
})();
