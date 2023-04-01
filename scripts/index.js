'use strict';

let habbits = []; // Состояние приложения
let globalActiveHabbitId; // id текущей привычки

const HEBBIT_KEY = 'HEBBIT_KEY';

/* Объект с полученными элементами */

const page = {
  menu: document.querySelector('.menu__list') /* блок левого меню */,
  header: {
    h1: document.querySelector('h1'),
    progressPrecent: document.querySelector('.progres__precent'),
    progressCoverBar: document.querySelector('.progress__cover-bar'),
  },
  content: {
    daysContainer: document.getElementById('days'),
    nextDay: document.querySelector('.habbit__day'),
  },
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
  /* рендер заголовка */
  page.header.h1.innerText = activeHabbit.name;
  /* рендер прогресса */
  const progress =
    activeHabbit.days.length / activeHabbit.target > 1
      ? 100
      : (activeHabbit.days.length / activeHabbit.target) * 100;
  page.header.progressPrecent.innerHTML = progress.toFixed(0) + '%';
  page.header.progressCoverBar.setAttribute('style', `width: ${progress}%`);
}

/* Рендер дней с комментарием */
function rerenderDays(activeHabbit) {
  /* очишение дней при рендере */
  page.content.daysContainer.innerHTML = '';
  for (const idxDay in activeHabbit.days) {
    const day = document.createElement('div');
    day.classList.add('habbit');
    day.innerHTML = `
    <div class="habbit__day">День ${Number(idxDay) + 1}</div>
    <div class="habbit__comment">${activeHabbit.days[idxDay].comment}</div>
    <button class="habbit__delete-btn" onclick="removeDay(${idxDay})">
    <img src="./images/delete.svg" alt="delete">
    </button>
    `;
    page.content.daysContainer.appendChild(day);
  }
  /* Новый день */
  page.content.nextDay.innerText = `День ${activeHabbit.days.length + 1}`;
}

/* Добавление нового дня  */
function addDay(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(event.target);
  const comment = data.get('comment');
  /* Если форма пустая или не пустая */
  form['comment'].classList.remove('habbit__input_error');
  if (!comment) {
    form['comment'].classList.add('habbit__input_error');
    return;
  }

  habbits = habbits.map((habbit) => {
    if (habbit.id == globalActiveHabbitId) {
      return {
        ...habbit,
        days: habbit.days.concat([{ comment }]),
      };
    }
    return habbit;
  });

  /* Очистка формы */
  form['comment'].value = '';
  rerender(globalActiveHabbitId);
  saveData();
}

/* Удаление дней */
function removeDay(id) {
  habbits = habbits.map((habbit) => {
    if (habbit.id === globalActiveHabbitId) {
      habbit.days.splice(id, 1);
      return {
        ...habbit,
        day: habbit.days,
      };
    }
    return habbit;
  });
  rerender(globalActiveHabbitId);
  saveData();
}

/* Рендер всей страницы - приходит id */
function rerender(activeHabbitId) {
  globalActiveHabbitId = activeHabbitId;
  const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
  if (!activeHabbit) {
    return;
  }
  rerenderMenu(activeHabbit);
  rerenderHead(activeHabbit);
  rerenderDays(activeHabbit);
}

/* Инициализация приложения IIFE */
(() => {
  loadData();
  rerender(habbits[0].id); // начальньый активный habbit
})();
