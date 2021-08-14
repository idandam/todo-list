import TodoProject from "./todo-project.js";

export default class TodayProject extends TodoProject {

    #todayDay

    constructor() {
        super("Today");
        this.#todayDay = new Date();
    }
    /**
     * @override
     * 
     * @param {Todo} todo 
     */
    add(todo) {
        todo.dueDate = new Date();
        super.add(todo);
    }
    fillTodayTodos(){
        
    }

}