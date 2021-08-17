import DateRange from "./date-range.js";
import TodoProject from "./todo-project.js";

export default class RangedTodoProject extends TodoProject{

    #dateRange

    constructor(name, from, to){
        super(name);
        this.#dateRange = new DateRange(from, to);
        
    }

    fillTodos(projects){
        for (let project of projects){
            for (let todo of project.todos){
                if (this.#dateRange.includes(todo.dueDate)){
                    super.add(todo);
                }
            }
        }
    }

}