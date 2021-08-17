import RangedTodoProject from "./ranged-todo-project.js";
import dateManager from "./date-manager.js";

export default class TodayProject extends RangedTodoProject {

    constructor() {
        let today = dateManager.getTodayDate();
        super("Today", today, today);   
    }
    
}