import SortBehavior from "./sort-behavior.js";
import * as sortBehaviors from "./sort-behaviors.js"

export default class TodoProject {
    #name;
    #todos;
    #sortBehavior;
    /*
    static #sortByDateName = 'date';;
    static #sortByPriorityName = 'priority';

    static #sortByPriority(todo1, todo2) {
        return todo2 - todo1;
    }
    static #sortByDate(todo1, todo2) {
        // TODO
    }

    static #sortMethods = new Map([[TodoProject.#sortByDateName, TodoProject.#sortByDate],
    [TodoProject.#sortByPriorityName, TodoProject.#sortByPriority]]);

    */
    constructor(name) {
        this.#name = name;
        this.#todos = [];
        this.#sortBehavior = new sortBehaviors.SortByPriority();

    }

    add(todo) {
        this.#todos.push(todo);
    }

    remove(id) {
        let length = this.#todos.length;
        this.#todos = this.#todos.filter(todo => id !== todo.id);
        return length !== this.#todos.length;
    }

    sort(sortName) {
        // TODO replace true with this.#sortBehavior.name !== sortName
        if (true) {
            let sn = `SortBy${sortName}`;
            if (sortBehaviors[sn]) {
                this.#sortBehavior = new sortBehaviors[sn]();
                this.#todos.sort(this.#sortBehavior.sort);
                return sortName;
            }
        }


    }

    toString() {
        return this.#name;
    }

    getTodoById(id) {
        return this.#todos.filter(todo => todo.id === id)[0];

    }

    get name() {
        return this.#name;
    }
    set name(projectName) {
        this.#name = projectName;
    }

    get todos() {
        return this.#todos;
    }

}