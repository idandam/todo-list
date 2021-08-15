import TodoProject from "./todo-project.js";
import dateManager from "./todo-date-manager.js";

export default class TodayProject extends TodoProject {

    constructor() {
        super("Today");
        
    }
    /**
     * @override
     * 
     * @param {Todo} todo 
     */
    add(todo) {
        todo.dueDate = this.#todayDay;
        super.add(todo);
    }
    clear() {
        this.#todos = [];
    }
    
}