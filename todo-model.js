import AbstractTodoModel from './abstract-todo-model.js';
import pubsub from './pubsub.js';
import TodoProject from './todo-project.js';
import { TOPICS } from './utils.js';


export default class TodoModel extends AbstractTodoModel {
    #projects;
    #currProject;

    constructor() {
        super();
        this.#currProject = new TodoProject("Default");
        this.#projects = [this.#currProject];

    }

    init() {
        //  
    }

    addProject(projectName) {
        // if we don't have a project with that name then add the project  
        if (!this.#getProjectByName(projectName)) {
            this.#projects.push(new TodoProject(projectName));
            this.publish(TOPICS.projectAdded, { projectName });
        }
        // announce that we didn't add the project since 
        else {
            this.publish(TOPICS.projectAdded, { isAdded: false, why: `A project with the name ${projectName} is already exists` });
        }

    }

    removeProject(projectName) {
        // TODO - what if the removed project is the current project
        let i = 0;
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
        if (this.#currProject.remove(id)) {
            this.publish(TOPICS.todoRemoved, { id });
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
        return this.#projects;
    }

    #getProjectByName(projectName) {
        return this.#projects.filter(project => project.name === projectName)[0];
    }

}