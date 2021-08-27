import AbstractTodoModel from './abstract-todo-model.js';
import pubsub from './pubsub.js';
import TodoProject from './todo-project.js';
import { TOPICS } from './utils.js';
import TodayProject from "./today-project.js"
import NextSevenDaysProject from "./next-seven-days-project.js"
import Todo from './todo.js';


export default class TodoModel extends AbstractTodoModel {
    #projects;
    #currentProject;
    static #specialProjects = { inbox: 0, today: 1, nextSevenDays: 2 };

    constructor() {
        super();
        this.#projects = [];
        this.#defineProjectsProperties();
        this.#currentProject = this.#projects[1];

    }

    init() {
        //  
    }

    addProject(projectName) {
        // if we don't have a project with that name then add the project  
        if (!this.getProjectByName(projectName)) {
            let project = new TodoProject(projectName)
            this.#projects.push(project);
            this.publish(TOPICS.projectAdded, project);
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
            let isCurrentProject = removedProject === this.#currentProject;
            this.publish(TOPICS.projectRemoved, { index: i, isCurrentProject, projectName });
        }

    }

    sortProject(sortName) {

        if (this.#currentProject.sort(sortName)) {
            this.publish(TOPICS.projectSorted, { sortName, currProject: this.#currentProject });
        }
    }

    addTodo(todo, project = this.#currentProject) {
        let position = project.add(todo);
        this.#updateSpecialProjects("add", todo.dueDate, todo);
        this.publish(TOPICS.todoAdded, { todo, position });

    }

    removeTodo(id) {
        // data is of the form { todo, position }
        let data = this.#currentProject.remove(id)
        if (data) {
            this.#updateSpecialProjects("remove", data.todo.dueDate, id);
            this.publish(TOPICS.todoRemoved, data.position);
            return data;
        }

    }


    checkTodo(id) {
        let todo = this.#currentProject.getTodoById(id);
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
            this.#currentProject = project;
            this.publish(TOPICS.currentProjectChanged, this.#currentProject);
        }
    }

    isTodayCurrentProject() {
        return this.#currentProject === this.#projects[1];
    }

    get currentProject() {
        return this.#currentProject;
    }

    set currentProject(projectName) {
        let project = this.getProjectByName(projectName);
        if (project) {
            this.#currentProject = project;
            this.publish(TOPICS.currentProjectChanged, { currentProject: this.#currentProject });
        }
    }

    get projects() {
        return this.#projects;
    }

    getCheckedTodos() {
        return this.#currentProject.todos.filter(todo => todo.isChecked);
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
    /**
     * @param {String} op an operation in {"add", "remove"}
     */
    #updateSpecialProjects(op, dueDate, todoData) {
        if (dueDate instanceof Date) {
            if (this.#projects[TodoModel.#specialProjects.today].dateRange.includes(dueDate)) {
                this.#projects[TodoModel.#specialProjects.today][op](todoData);
            }
            else if (this.#projects[TodoModel.#specialProjects.nextSevenDays].dateRange.includes(dueDate)) {
                this.#projects[TodoModel.#specialProjects.nextSevenDays][op](todoData);
            }
        }
    }

    getDefaultPriority() {
        return Todo.defaultPriority;
    }

}