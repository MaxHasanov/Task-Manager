"use strict";

let taskName = document.querySelector(".nameTask");
let taskDesc = document.querySelector(".descTask");
let allTask = document.querySelector(".addTask");
const button = document.querySelector(".btnAdd");
const btnComplete = document.querySelector(".сompleteTaskBtn");
const completedItems = document.querySelector(".completedItems");
const projectsAll = document.querySelector(".projectsAll");
const select = document.querySelector(".fullNameSelect");
const btnAddTaskPorject = document.querySelector(".btnAddTaskPorject");
let tasksLocal = [];

// Добавляем список сотрудников для возможности выбора кто будет ответсвенным за задачу;
let api = `user_db.json`;
fetch(api)
  .then((response) => response.json())
  .then((data) => {
    data.forEach((item) => {
      const option = document.createElement("option");
      option.text = item.fullName;
      option.value = item.fullName;
      select.add(option);
    });
  })
  .catch(function (error) {
    console.log("error", error);
  });

// Класс "Сотрудник"
class User {
  constructor(fullName, DateOfBirth, phoneNumber) {
    this.fullName = fullName;
    this.DateOfBirth = DateOfBirth;
    this.phoneNumber = phoneNumber;
  }
}

// Класс "Сотрудники"
class UserList {
  constructor() {
    this.users = [];
  }

  getUser() {
    return this.users;
  }

  addEmployeeTask(employee) {
    this.users.push(employee);
  }
}

let user = new User();
let userList = new UserList();

// Класс "Задача"
class Task {
  constructor(title, descrip, date) {
    this.title = title;
    this.desc = descrip;
    this.completed = false;
    this.date = date;
    this.employee = new UserList();
  }

  addEmployeeTask(employee) {
    this.employee.addEmployeeTask(employee);
  }

  getUser() {
    return this.employee.getUser();
  }

  complet() {
    this.completed = true;
  }
}

let itemTask = new Task();

// Класс "Список задач"
class TaskList {
  constructor() {
    this.tasks = [];
  }

  createTask(task) {
    this.tasks.push(task);
  }

  removeTask(task) {
    const index = this.tasks.indexOf(task);
    if (index !== -1) {
      this.tasks.splice(index, 1);
    }
  }

  getTasks() {
    return this.tasks;
  }
}

const start = new TaskList();

// Создаём задачу, получаем значения из input и добавляем их в класс Task,
// Из класса TaskList, с помощью метода createTask добавляем задачу в массив объектов.
window.addEventListener("DOMContentLoaded", (event) => {
  if (button) {
    button.addEventListener("click", () => {
      const title = taskName.value;
      const descrip = taskDesc.value;
      const date = new Date();
      let newDate = date.toLocaleString();

      itemTask = new Task(title, descrip, newDate);
      start.createTask(itemTask);
      taskName.value = "";
      taskDesc.value = "";
      renderTasks();
    });
  }
});

// Получение сотрудников из JSON файла (базы данных) и добавление к задачи.
function apiEmployee(element) {
  fetch(api)
    .then((response) => response.json())
    .then((data) => {
      const employeeId = select.value;
      const selectEmployee = data.find((user) => user.fullName === employeeId);
      const user = new User(
        selectEmployee.fullName,
        selectEmployee.DateOfBirth,
        selectEmployee.phoneNumber
      );

      // Добавить созданный класс Сотрудника в Task при создании задачи
      itemTask.addEmployeeTask(user);
      let addUserTask = itemTask.employee.users[0].fullName;
      const employeeItem = document.createElement("li");

      employeeItem.innerHTML = addUserTask;
      element.insertBefore(employeeItem, element.children[2]);
    });
}

// Отрисовка задачи и добавление в HTML
function renderTasks() {
  let render;
  const element = document.createElement("div");
  element.classList.add("card");
  element.classList.add("card2");
  // Возвращаем массив объектов (задач) и проходимся по нему с помощью метода forEach.
  const tasks = start.getTasks();
  tasks.forEach((task) => {
    render = `
        <h3 class="name item-txt">${task.title}</h3>
        <p class="desc item-txt">${task.desc}</p>
        <p class="date item-txt">${task.date}</p>
        <button data-title="${task.title}" class="сompleteTaskBtn item-txt">Выполнить задачу</button>
        <span data-delete="${task.title}" class="deleteBtn del item-txt"></span>
    `;
    element.setAttribute("data-task", task.title);
    element.innerHTML = render;
    allTask.appendChild(element);
  });
  apiEmployee(element);
}

allTask.addEventListener("click", (event) => {
  let target = event.target;
  let arrTasks = start.getTasks();

  // Выполнение задачи, меняем значение this.completed = true;
  if (target.classList.contains("сompleteTaskBtn")) {
    let completedItem = target.dataset.title;
    let indexTask = arrTasks.find((task) => task.title === completedItem);
    target.disabled = true;
    indexTask.complet();

    actionLocalStorage(indexTask);
    renderLocalItems();

    // Удаление задачи из массива, а так же из DOM дерева
  } else if (target.classList.contains("deleteBtn")) {
    let dataTask = target.dataset.delete;
    let indexTask = arrTasks.find((task) => task.title === dataTask);
    console.log(indexTask);
    let blockDeleteTask = document.querySelector(`[data-task="${dataTask}"]`);

    start.removeTask(indexTask);
    blockDeleteTask.remove();
  }
});

// Функциия для локальной отправки и получения данных;
function actionLocalStorage(task) {
  localStorage.setItem(task.title, JSON.stringify(task));
  let getLocalTask = JSON.parse(localStorage.getItem(task.title, task));
  tasksLocal.push(getLocalTask);
}

// Отрисовка выполненных задач;
function renderLocalItems() {
  const renderBlock = document.createElement("div");
  renderBlock.classList.add("completedItem");
  let test;
  for (let el of tasksLocal) {
    test = `
        <h3 class="item-txt">Название: ${el.title}</h3>
        <h4 class="item-txt">Описание: ${el.desc}</h4>
        <p class="item-txt">Дата создания: ${el.date}</p>
        <p class="item-txt">Ответственный: ${el.employee.users[0].fullName}
        <p class="item-txt">Задача выполнена!</p>
        `;
  }
  renderBlock.innerHTML = test;
  completedItems.appendChild(renderBlock);
}

// При загрузке страницы, ранее выполненные задачи рендерятся на странице;
document.addEventListener("DOMContentLoaded", () => {
  let getItemsLocal;
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    getItemsLocal = JSON.parse(localStorage.getItem(key));
    tasksLocal.push(getItemsLocal);
    renderLocalItems();
  }
});

// New Class Project, ProjectList

const projectsBlock = document.querySelector(".projects");
const displayProjects = document.querySelector(".displayProjects");
const nameProject = document.querySelector(".nameProject");
const descProject = document.querySelector(".descProject");
const btnaAdProject = document.querySelector(".btnaAdProject");
const allProjects = document.querySelector(".allProjects");
const displayAllTasks = document.querySelector(".display");
const btnAddTask = document.querySelector(".btnAddTask");

class Project {
  constructor(title, description, startDate) {
    this.title = title;
    this.desc = description;
    this.startDate = startDate;
    this.endDate = "Дата окончания: 4 мая 2023 года ";
    this.isCompleted = false;
    this.taskList = new TaskList();
  }

  addTask(task) {
    this.taskList.createTask(task);
  }

  getTasks() {
    return this.taskList.getTasks();
  }

  removeTask(task) {
    this.taskList.removeTask(task);
  }
}

class ProjectsList extends Project {
  constructor() {
    super();
    this.projects = [];
  }

  getProjects() {
    return this.projects;
  }

  addProject(project) {
    this.projects.push(project);
  }
}

// Получаем input.value  и создаём новый project, после происходит render;
window.addEventListener("DOMContentLoaded", (event) => {
  if (btnaAdProject) {
    btnaAdProject.addEventListener("click", () => {
      const titleProject = nameProject.value;
      const description = descProject.value;
      const dateProject = new Date();
      let newDate = dateProject.toLocaleString();

      project = new Project(titleProject, description, newDate);

      projectList.addProject(project);

      nameProject.value = "";
      descProject.value = "";

      renderProject(project);
    });
  }
});

let arrTasks = [];
// Рендер созданного проекта в DOM;
// А так же добавление задачи в массив проекта;
function renderProject(proj) {
  let itemsProject = projectList.getProjects();
  let blockProject = document.createElement("div");
  blockProject.classList.add("card");
  let render;

  itemsProject.forEach((item) => {
    render = `
        <h3 class="item-txt">${item.title}</h3>
        <p class="item-txt">${item.desc}</p>
        <div class="projectBlock" data-project="${item.title}"
        </div>
        `;
  });
  blockProject.innerHTML = render;
  allProjects.appendChild(blockProject);

  let option = document.createElement("option");

  // Добавляем созданные проекты в select, option;
  itemsProject.forEach((el) => {
    option.value = el.title;
    option.textContent = el.title;
  });
  projectsAll.appendChild(option);
}

// По клику добавляем задачу в выбранный проект из option;
btnAddTaskPorject.addEventListener("click", (event) => {
  event.preventDefault();
  let arrProjectList = projectList.getProjects();

  const projectId = projectsAll.value;
  const employeeId = select.value;

  const proj = arrProjectList.find((project) => project.title === projectId);
  const projectBlock = document.querySelector(`[data-project="${projectId}"]`);

  let valueTaskName = taskName.value;
  let valueTaskDesc = taskDesc.value;
  let dateTask = new Date();
  let newDate = dateTask.toLocaleString();

  let createTaskProject;

  // Подумать как добавлять к задачам - сотрудников, в качестве значений объекта
  fetch(api)
    .then((response) => response.json())
    .then((data) => {
      const selectEmployee = data.find((user) => user.fullName === employeeId);
      const user = new User(
        selectEmployee.fullName,
        selectEmployee.DateOfBirth,
        selectEmployee.phoneNumber
      );

      // Добавить созданный класс Сотрудника в Task при создании задачи
      createTaskProject.addEmployeeTask(user);
      const employeeItem = document.createElement("li");

      let addUserTask = createTaskProject.employee.users[0].fullName;
      employeeItem.innerHTML = addUserTask;
      taskItem.insertBefore(employeeItem, taskItem.children[2]);
    });

  createTaskProject = new Task(valueTaskName, valueTaskDesc, newDate);

  arrTasks.push(createTaskProject);
  proj.addTask(createTaskProject);

  let arrTask = proj.getTasks();

  // Отрисовка в DOM добавленной задачи в нужный проект.
  const taskItem = document.createElement("div");
  taskItem.classList.add("taskBlock");

  let renderTaskHtml = "";
  arrTask.forEach((item) => {
    renderTaskHtml = `
    <p class="taskTitle item_txt">${item.title}</p>
    <p class="item_txt">${item.desc}</p>
    <p class="item_txt">${item.date}</p>
    <button data-title="${item.title}" class="сompleteTaskBtn item_txt">Выполнить задачу</button>
    <span data-delete="${item.title}" class="deleteBtn del item_txt"></span>
    `;
    taskItem.setAttribute("data-task", item.title);
    taskItem.innerHTML = renderTaskHtml;
    projectBlock.append(taskItem);
  });
});

// Выполнение задачи из проекта
allProjects.addEventListener("click", (event) => {
  let target = event.target;
  let getTask = project.getTasks();

  if (target.classList.contains("сompleteTaskBtn")) {
    target.disabled = true;
    let test = target.dataset.title;
    let indexTask = arrTasks.find((task) => task.title === test);
    indexTask.complet();

    actionLocalStorage(indexTask);
    renderLocalItems();
  }

  // // Удаление задачи из массива, а так же из DOM дерева
  if (target.classList.contains("deleteBtn")) {
    let getDataProject = target.dataset.delete;
    let deletedItemBlock = document.querySelector(
      `[data-task="${getDataProject}"]`
    );
    let indexBlockItem = getTask.find(
      (indexEl) => indexEl.title === getDataProject
    );
    console.log(indexBlockItem);
    project.removeTask(indexBlockItem);
    deletedItemBlock.remove();
  }
});

let project = new Project();

const projectList = new ProjectsList();

function openMenu(x) {
  x.classList.toggle("change");
}

document.querySelector(".menu").addEventListener("click", () => {
  let itemsCompletedBlock = document.querySelector(".completedItems");
  itemsCompletedBlock.classList.toggle("displayCompletedTasks");
});
