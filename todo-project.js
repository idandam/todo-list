import CompareBehavior from "./compare-behavior.js";
import * as compareBehaviors from "./compare-behaviors.js"

export default class TodoProject {
    #name;
    #todos;
    #compareBehavior;

    constructor(name) {
        this.#name = name;
        this.#todos = [];
        // The default compare behavior between two todos is this project is by priority (from highest to lowest).
        this.#compareBehavior = new compareBehaviors.CompareByPriority();

    }

    add(todo) {
        // Find todo's appropriate position in this project
        let todoPosition = this.#searchTodoPosition(todo);
        // Add the todo in his appropriate position in this project
        this.#todos.splice(todoPosition, 0, todo);
        // todo is now contained in this project
        todo.containingProject = this;

        return todoPosition;

    }

    remove(id) {
        let position = this.#getIndexOfTodo(id);
        if (position > -1) {
            // Return the removed todo.
            return { todo: this.#todos.splice(position, 1)[0], position };
        }
    }

    sort(sortName) {
        // TODO replace true with this.#compareBehavior.name !== sortName
        if (true) {
            // Get the appropriate compare behavior with respect to the given sortName.
            let compareBehaviorStr = `CompareBy${sortName}`;
            // If there exists such compare behavior 
            if (compareBehaviors[compareBehaviorStr]) {
                // Set this project compare behavior dynamically to the new compare behavior.
                this.#compareBehavior = new compareBehaviors[compareBehaviorStr]();
                // Sort this project's todos according to the new compare behavior.
                this.#todos.sort(this.#compareBehavior.compare.bind(this.#compareBehavior));
                // Indicate that the project was sorted 
                return true;

            }
        }


    }


    getTodoById(id) {
        return this.#todos.find(todo => todo.id == id);

    }

    #getIndexOfTodo(id) {
        let i = this.#todos.findIndex(todo => todo.id == id);
        if (i > -1) {
            return i;
        }
    }

    toString() {
        return this.#name;
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