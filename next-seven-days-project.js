import RangedTodoProject from "./ranged-todo-project.js";
import dateManager from "./date-manager.js";

/**
 * A project that contains todos with a date from the next seven days.
 */
export default class NextSevenDaysProject extends RangedTodoProject {

    constructor() {
        // Tomorrow.
        let from = dateManager.getFutureDate({ years: 0, months: 0, days: 1 });
        // Eight days from today.
        let to = dateManager.getFutureDate({ years: 0, months: 0, days: 8 });
        super("Next 7 days", from, to );

    }
}