import AbstractTodoModel from './abstract-todo-model.js';
import pubsub from './pubsub.js';
import TodoProject from './todo-project.js';
import TodayProject from './today-project.js';
import { TOPICS } from './utils.js';
import NextSevenDaysProject from './next-seven-days-project.js';


export default class TodoModel extends AbstractTodoModel {
    #projects
    #currProject;

    constructor() {
        super();
        this.#defineProjectsProperties();
        this.#currProject = this.#projects.inbox;
    }

    init() {
        //  
    }

    addProject(projectName) {
        // if we don't have a project with that name then add the project  
        if (!this.#getProjectByName(projectName)) {
            this.#otherProjects.push(new TodoProject(projectName));
            this.publish(TOPICS.projectAdded, { projectName });
        }
        // announce that we didn't add the project since 
        else {
            this.publish(TOPICS.projectAdded, { isAdded: false, why: `A project with the name ${projectName} is already exists` });
        }

    }
    //TODO - check if need to remove from next seven days or from today
    removeProject(projectName) {
        // TODO - what if the removed project is the current project
        let i = 0;
        while (i < this.#otherProjects.length && this.#otherProjects[i].name !== projectName) {
            i++;
        }

        if (i < this.#otherProjects.length) {
            let [removedProject] = this.#otherProjects.splice(i, 1);
            let isCurrentProject = removedProject === this.#currProject;
            this.publish(TOPICS.projectRemoved, { index: i, isCurrentProject, projectName });
        }

    }

    sortProject(sortName) {
        let updatedSortName = this.#currProject.sort(sortName);
        if (updatedSortName) {
            this.publish(TOPICS.projectSorted, { updatedSortName, currProject: this.#currProject });
        }
    }

    addTodo(todo, project = this.#currProject) {
        project.add(todo);
        this.publish(TOPICS.todoAdded, { todo });

    }

    removeTodo(id) {
        let todo = this.#currProject.remove(id)
        if (todo) {
            this.publish(TOPICS.todoRemoved, { id });
            return todo;
        }

    }


    checkTodo(id) {
        let todo = this.#currProject.getTodoById(id);
        if (todo) {
            todo.isChecked = !todo.isChecked;
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
        let project = this.#getProjectByName(projectName);
        if (project) {
            this.#currProject = project;
            this.publish(TOPICS.currentProjectChanged, { projectName });
        }
    }

    publish(topic, data) {
        // delegate to the PubSub instance
        pubsub.publish(topic, data);

    }

    moveTodoToProject(todo, projectName) {
        let project = this.#getProjectByName(projectName);
        if (project && this.removeTodo(todo.id)) {
            this.addTodo(todo, project);
            // TODO - publish...

        }
    }

    get currentProject() {
        return this.#currProject;
    }

    set currentProject(projectName) {
        let project = this.#getProjectByName(projectName);
        if (project) {
            this.#currProject = project;
            this.publish(TOPICS.currentProjectChanged, { currentProject: this.#currProject });
        }
    }

    get projects() {
        return this.#otherProjects;
    }

    #getProjectByName(projectName) {
        return this.#otherProjects.filter(project => project.name === projectName)[0];
    }
    #defineProjectsProperties() {
        Object.defineProperties(this.#projects, {
            inbox: {
                value: new TodoProject("Inbox"),
                writable: true,
                configurable: false,
                enumerable: true
            },
            today: {
                value: new TodayProject(),
                writable: true,
                configurable: false,
                enumerable: true
            },
            nextSevenDays: {
                value: new NextSevenDaysProject(),
                writable: true,
                configurable: false,
                enumerable: true
            },
            otherProjects: {
                value: [],
                writable: true,
                configurable: true,
                enumerable: true
            },
        });

    }

}