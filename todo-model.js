import AbstractTodoModel from './abstract-todo-model.js'
import pubsub from './pubsub.js'
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
        this.#projects.push(new TodoProject(projectName));
        this.publish(TOPICS.projectAdded, { projectName });

    }

    removeProject(projectName) {
        // TODO - what if the removed project is the current project
        let i = 0;
        while (i < this.#projects.length && this.#projects[i].name !== projectName){
            i++;
        }

        if (i  < this.#projects.length) {
            let [removedProject] = this.#projects.splice(i, 1);
            let isCurrentProject = removedProject === this.#currProject;
            this.publish(TOPICS.projectRemoved, { index: i, isCurrentProject, projectName });
        }

    }

    sortProject(sortName) {
        if (this.#currProject.sort(sortName)) {
            this.publish(TOPICS.projectSorted, { sortName });
        }
    }

    addTodo(todo, project = this.#currProject) {
        project.add(todo);
        this.publish(TOPICS.todoAdded, { todo });

    }

    removeTodo(id) {
        this.#currProject.remove(id);
        this.publish(TOPICS.todoRemoved, { id });

    }


    checkTodo(todo) {
        todo.isDone = !todo.isDone;
        this.publish(TOPICS.todoChecked, { todo })
    }


    updateTodo(properties, todo) {
        if (properties) {
            for (let prop in properties) {
                todo[prop] = properties[prop];
            }
            (TOPICS.todoUpdated, { todo, properties });
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
        let [project] = this.#projects.filter((project) => project.name === projectName);
        if (project) {
            this.#currProject = project;
            this.publish(TOPICS.currentProjectChanged, { currentProject: this.#currProject });
        }
    }

    get projects() {
        return this.#projects;
    }

}