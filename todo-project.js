export default class TodoProject {
    #name;
    #todos;
    #sortName;

    static #sortByDateName = 'date';;
    static #sortByPriorityName = 'priority';

    static #sortByPriority(t1, t2) {
        return t1.getPriority() - t2.getPriority();
    }
    static #sortByDate(t1, t2) {
        // TODO
    }

    static #sortMethods = new Map([[TodoProject.#sortByDateName, TodoProject.#sortByDate],
    [TodoProject.#sortByPriorityName, TodoProject.#sortByPriority]]);


    constructor(name) {
        this.#name = name;
        this.#todos = [];
        this.#sortName = TodoProject.#sortByDateName;

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
        if (this.#sortName !== sortName && TodoProject.#sortMethods.has(sortName)) {
            this.#todos.sort(TodoProject.#sortMethods.get(sortName));
            this.#sortName = sortName;
            return true;
        }


    }
    // this will replace the sorting method if name already exists
    addSortMethod(name, f) {
        TodoProject.#sortMethods.set(name, f);
    }

    removeSortMethod(sortName) {
        if (sortName !== TodoProject.#sortByDateName && sortName !== TodoProject.#sortByPriorityName) {
            TodoProject.#sortMethods.delete(sortName);
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

    get sortName() {
        return this.#sortName;
    }

    get todos() {
        return this.#todos;
    }

}