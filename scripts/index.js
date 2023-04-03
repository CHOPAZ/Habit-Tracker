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
  popup: {
    id: document.getElementById('hebbit-popup'),
    iconField: document.querySelector('.popup__form input[name="icon"]'),
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

/* Валидация и возврат данных
  fields - список полей (name, comment)
*/
function validateAndGetFormData(form, fields) {
  const formData = new FormData(form);
  const res = {};
  for (const field of fields) {
    const fieldValue = formData.get(field);
    /* Если форма пустая или не пустая */
    form[field].classList.remove('error');
    if (!fieldValue) {
      form[field].classList.add('error');
    }
    res[field] = fieldValue;
  }

  /* Проверка на валидность формы */
  let isValid = true;
  for (const field of fields) {
    if (!res[field]) {
      isValid = false;
    }
  }
  if (!isValid) {
    return;
  }
  return res;
}

/* Сброс формы */
function resetForm(form, fields) {
  for (const field of fields) {
    form[field].value = '';
  }
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
  const data = validateAndGetFormData(event.target, ['comment']);
  if (!data) {
    return;
  }
  habbits = habbits.map((habbit) => {
    if (habbit.id == globalActiveHabbitId) {
      return {
        ...habbit,
        days: habbit.days.concat([{ comment: data.comment }]),
      };
    }
    return habbit;
  });

  /* Очистка формы */
  resetForm(event.target, ['comment']);
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

/* Появленеи popup */
function togglePopup() {
  if (page.popup.id.classList.contains('cover_hidden')) {
    page.popup.id.classList.remove('cover_hidden');
  } else {
    page.popup.id.classList.add('cover_hidden');
  }
}

/* Установка новой активной иконки в инпут (в popup) */
function selectionIcon(icon, context) {
  page.popup.iconField.value = icon;
  const activeIcon = document.querySelector(
    '.popup__icon-btn.popup__icon-btn_active'
  );
  activeIcon.classList.remove('popup__icon-btn_active');
  context.classList.add('popup__icon-btn_active');
}

/* Добавление новой привычки в popup */
function addHabbit(event) {
  event.preventDefault();
  const data = validateAndGetFormData(event.target, ['name', 'icon', 'target']);
  if (!data) {
    return;
  }
  const maxId = habbits.reduce(
    (acc, habbit) => (acc > habbit.id ? acc : habbit.id),
    0
  );
  habbits.push({
    id: maxId + 1,
    name: data.name,
    icon: data.icon,
    target: data.target,
    days: [],
  });
  resetForm(event.target, ['name', 'icon', 'target']);
  togglePopup();
  saveData();
  rerender(maxId + 1)
}

/* Рендер всей страницы - приходит id */
function rerender(activeHabbitId) {
  globalActiveHabbitId = activeHabbitId;
  const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
  if (!activeHabbit) {
    return;
  }
  document.location.replace(document.location.pathname + '#' + activeHabbitId);
  rerenderMenu(activeHabbit);
  rerenderHead(activeHabbit);
  rerenderDays(activeHabbit);
}

/* Инициализация приложения IIFE */
(() => {
  loadData();
  const hashId = Number(document.location.hash.replace('#', ''));
  const urlHabbit = habbits.find(habbit => habbit.id === hashId);
  console.log(urlHabbit);
  if (urlHabbit) {
    rerender(urlHabbit.id)
  } else {
    rerender(habbits[0].id)
  }

})();
