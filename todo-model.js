import AbstractTodoModel from './abstract-todo-model.js';
import pubsub from './pubsub.js';
import TodoProject from './todo-project.js';
import { TOPICS } from './utils.js';
import TodayProject from "./today-project.js"
import NextSevenDaysProject from "./next-seven-days-project.js"


export default class TodoModel extends AbstractTodoModel {
    #projects;
    #currProject;
    static #specialProjects = { inbox: 0, today: 1, nextSevenDays: 2 };

    constructor() {
        super();
        this.#projects = [];
        this.#defineProjectsProperties();
        this.#currProject = this.#projects[0];

    }

    init() {
        //  
    }

    addProject(projectName) {
        // if we don't have a project with that name then add the project  
        if (!this.getProjectByName(projectName)) {
            let project = new TodoProject(projectName)
            this.#projects.push(project);
            this.publish(TOPICS.projectAdded, { project });
        }
        // announce that we didn't add the project since a project with this name already exists
        else {
            this.publish(TOPICS.projectAdded, { errorMessage: `A project with the name ${projectName} is already exists` });
        }

    }

    removeProject(projectName) {
        // TODO - what if the removed project is the current project
        let i = TodoModel.#specialProjects.nextSevenDays + 1;
        while (i < this.#projects.length && this.#projects[i].name !== projectName) {
            i++;
        }

        if (i < this.#projects.length) {
            let [removedProject] = this.#projects.splice(i, 1);
            let isCurrentProject = removedProject === this.#currProject;
            this.publish(TOPICS.projectRemoved, { index: i, isCurrentProject, projectName });
        }

    }

    sortProject(sortName) {

        if (this.#currProject.sort(sortName)) {
            this.publish(TOPICS.projectSorted, { sortName, currProject: this.#currProject });
        }
    }

    addTodo(todo, project = this.#currProject) {
        project.add(todo);
        this.#updateSpecialProjects("add", todo.dueDate, todo);
        this.publish(TOPICS.todoAdded, { todo });

    }

    removeTodo(id) {
        let todo = this.#currProject.remove(id)
        if (todo) {
            this.#updateSpecialProjects("remove", todo.dueDate, id);
            this.publish(TOPICS.todoRemoved, { id });
            return todo;
        }

    }


    checkTodo(id) {
        let todo = this.#currProject.getTodoById(id);
        if (todo) {
            todo.isChecked = !todo.isChecked;
            // TODO handle change in today or sevedays project. publich there a special topic for this
            this.publish(TOPICS.todoChecked, { todo })
        }
    }

    // TODO 
    updateTodo(id, properties) {
        if (properties) {
            for (let prop in properties) {
                todo[prop] = properties[prop];
            }
            (TOPICS.todoUpdated, { todo, properties });
        }
    }

    changeCurrentProject(projectName) {
        let project = this.getProjectByName(projectName);
        if (project) {
            this.#currProject = project;
            this.publish(TOPICS.currentProjectChanged, { projectName });
        }
    }

    get currentProject() {
        return this.#currProject;
    }

    set currentProject(projectName) {
        let project = this.getProjectByName(projectName);
        if (project) {
            this.#currProject = project;
            this.publish(TOPICS.currentProjectChanged, { currentProject: this.#currProject });
        }
    }

    get projects() {
        return this.#projects;
    }

    getCheckedTodos() {
        return this.#currProject.todos.filter(todo => todo.isChecked);
    }

    publish(topic, data) {
        // delegate to the PubSub instance
        pubsub.publish(topic, data);

    }


    getProjectByName(projectName) {
        return this.#projects.filter(project => project.name === projectName)[0];
    }
    /**
     * Define the first three properties. Make them non-configurable.
     */
    #defineProjectsProperties() {
        Object.defineProperties(this.#projects, {
            0: {
                value: new TodoProject("Inbox"),
                writable: true,
                configurable: false,
                enumerable: true
            },
            1: {
                value: new TodayProject(),
                writable: true,
                configurable: false,
                enumerable: true
            },
            2: {
                value: new NextSevenDaysProject(),
                writable: true,
                configurable: false,
                enumerable: true
            },
        });

    }
    #updateSpecialProjects(op, dueDate, todoData) {
        if (this.#projects[TodoModel.#specialProjects.today].dateRange.includes(dueDate)) {
            this.#projects[TodoModel.#specialProjects.today][op](todoData);
        }
        else if (this.#projects[TodoModel.#specialProjects.nextSevenDays].dateRange.includes(dueDate)) {
            this.#projects[TodoModel.#specialProjects.nextSevenDays][op](todoData);
        }
    }

}