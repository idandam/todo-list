import RangedTodoProject from "./ranged-todo-project.js";
import dateManager from "./date-manager.js";


export default class TodayProject extends RangedTodoProject {

    constructor() {
        // Today's date
        let from = dateManager.getTodayDate(), to = from;
        super("Today", from, to );

    }
}