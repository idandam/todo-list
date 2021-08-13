import CompareBehavior from "./compare-behavior.js";
import * as compareBehaviors from "./compare-behaviors.js"

export default class TodoProject {
    #name;
    #todos;
    #compareBehavior;

    constructor(name) {
        this.#name = name;
        this.#todos = [];
        this.#compareBehavior = new compareBehaviors.CompareByPriority();

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
        // TODO replace true with this.#compareBehavior.name !== sortName
        if (true) {
            let compareBehaviorStr = `CompareBy${sortName}`;
            if (compareBehaviors[compareBehaviorStr]) {
                let compareBevahior = new compareBehaviors[compareBehaviorStr]();
                if (compareBevahior instanceof CompareBehavior) {
                    this.#compareBehavior = compareBevahior;
                    this.#todos.sort(this.#compareBehavior.compare.bind(this.#compareBehavior));
                    return sortName;
                }
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

    printTodosByDate(){
        let str = "";
        for (let todo of this.#todos){
            str += ", " + todo.toDateString();
        }
        return str;
    }

}