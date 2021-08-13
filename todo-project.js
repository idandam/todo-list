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
        let todoPosition = this.#searchTodoPosition(todo);
        this.#todos.splice(todoPosition, 0, todo);

    }

    remove(id) {
        let prevLength = this.#todos.length;
        this.#todos = this.#todos.filter(todo => id !== todo.id);
        return prevLength !== this.#todos.length;
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

    printTodosByDate() {
        let str = "";
        for (let todo of this.#todos) {
            str += ", " + todo.toDateString();
        }
        return str;
    }

    /**
     * search the position of todo in the sorted todos array according to how this project compares his todos.
     * Using binary search.
     * We are using here the compare behavior of this project since this project's todos are sorted according 
     * to the same compare behavior, so the binary search will return the correct position of todo.
     * @param {Todo} todo 
     * @returns the position of todo in the sorted array if 
     */
    
    #searchTodoPosition(todo) {
        let left = 0, finishedAt = 0, right = this.#todos.length - 1;
        let mid, compareResult;

        while (left <= right) {
            mid = Math.trunc((left + right) / 2);
            compareResult = this.#compareBehavior.compare(todo, this.#todos[mid]);
        
            if (compareResult > 0) {
                finishedAt = left = mid + 1;
            }
            else if (compareResult < 0) {
                finishedAt = right = mid - 1;
            }
            else {
                finishedAt = mid;
                break;
            }
        }
        if (finishedAt === right){
            return finishedAt + 1;
        }

        return finishedAt;

    }
    

}