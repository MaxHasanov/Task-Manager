'use strict'
import { Task, TaskList } from "./main.js";

const projectsBlock = document.querySelector('.projects');
const displayProjects = document.querySelector('.displayProjects');
const nameProject = document.querySelector('.nameProject');
const descProject = document.querySelector('.descProject');
const btnaAdProject = document.querySelector('.btnaAdProject');
const allProjects = document.querySelector('.allProjects');
const displayAllTasks = document.querySelector('.display');
const btnAddTask = document.querySelector('.btnAddTask');

displayProjects.addEventListener('click', () => {
    projectsBlock.classList.toggle('display');
});

class Project {
    constructor(title, description, startDate) {
        this.title = title;
        this.desc = description;
        this.startDate = startDate;
        this.endDate = 'Дата окончания: 4 мая 2023 года ';
        this.isCompleted = false;
        this.taskList = new TaskList();
    }

    addTask(task) {
        this.taskList.createTask(task)
    }

    getTasks() {
        return this.taskList.getTasks();
    }
}

class ProjectsList extends Project {
    constructor() {
        super()
        this.projects = [];
    }

    getProjects() {
        return this.projects;
    }

    addProject(project) {
        this.projects.push(project);
    }
}



window.addEventListener('DOMContentLoaded', (event) => {
    if(btnaAdProject) {
        btnaAdProject.addEventListener('click', () => {
            const titleProject = nameProject.value;
            const description = descProject.value;
            const dateProject = new Date();

            project = new Project(titleProject, description, dateProject);
            projectList.addProject(project);
            nameProject.value = "";
            descProject.value = "";
            renderProject();
        })
    }
})

function renderProject() {
    let itemsProject = projectList.getProjects(); 
    let blockProject = document.createElement('div');
    let render;

    itemsProject.forEach((item) => {
        render = `
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
        <button class="btnAddTask">Добавить задачу в проект</button>
        <div class="display">
        <input class="test" placeholder="Название задачи">
        </div>
        `
    })
    blockProject.innerHTML = render;
    allProjects.appendChild(blockProject);

    blockProject.querySelector('.btnAddTask')
    .addEventListener('click', () => {
        blockProject.querySelector('.display')
        .classList.toggle('displayTask');
    });


    // Нужно передать значения из input для создания задачи в класс Task
    // После добавлять в список проектов и отображать в DOM.
    let testValue = blockProject.querySelector('.test');

}


let project = new Project();

const projectList = new ProjectsList();

// function getArrs() {
//     project.getTasks();
// }

// displayProjects.addEventListener('click', getArrs);

// let taskTest = new Task('Task 1', 'Description of task 1', '27/04/23');
// project.addTask(taskTest);

// projectList.addProject(project);
// console.log(projectList.getProjects());
