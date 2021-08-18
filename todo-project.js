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
        todo.containingProject = this;
        


    }

    remove(id) {
        let indexOfTodo = this.#getIndexOfTodo(id);
        if (indexOfTodo) {
            return this.#todos.splice(indexOfTodo, 1)[0];
        }
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
                    return true;
                }
            }
        }


    }

    toString() {
        return this.#name;
    }

    getTodoById(id) {
        return this.#todos.find(todo => todo.id === id);

    }
    
    #getIndexOfTodo(id){
        let i = this.#todos.indexOf(todo => todo.id === id);
        if (i > -1){
            return i;
        }
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
     * Search the position of todo in the sorted todos array according to how this project compares his todos.
     * Using binary search.
     * Notes:
     * 1. We are using here the compare behavior of this project since this project's todos are sorted according 
     *    the same compare behavior, so the binary search will return the correct position of todo.
     * 2. In the while loop, if left > right and 
     *      we finished at left, then it must be that finishedAt (( == left) == todo's length).
     *      Else if we finished at right then it must be that we previously went left and then right,
     *      so todo's position is between left and right, therefore we need to return finishedAt + 1 ( == right +1).
     *      Else finishedAt = mid and mid can be the a valid position for for todo, in terms of the compare behavior.
     * @param {Todo} todo 
     * @returns The position of todo in the sorted todo's array.
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
        if (finishedAt === right) {
            return finishedAt + 1;
        }

        return finishedAt;

    }


}