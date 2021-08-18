import DateRange from "./date-range.js";
import TodoProject from "./todo-project.js";
import pubsub from './pubsub.js';
import { TOPICS } from "./utils.js";

export default class RangedTodoProject extends TodoProject{

    #dateRange

    constructor(name, from, to){
        super(name);
        this.#dateRange = new DateRange(from, to);
        pubsub.subscribe(TOPICS.projectAdded, onTodoAdded.bind(this));
        
    }

    fillTodos(projects){
        for (let project of projects){
            for (let todo of project.todos){
                if (this.#dateRange.includes(todo.dueDate)){
                    this.add(todo);
                }
            }
        }
    }

    onTodoAdded(data){
        if (this.#dateRange.includes(data.todo.dueDate)){
            this.add(data.todo);
        }  
    }

}