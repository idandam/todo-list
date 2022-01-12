import RangedTodoProject from "./ranged-todo-project.js";
import dateManager from "./date-manager.js";

/**
 * A project that contains todos with today's date.
 */
export default class TodayProject extends RangedTodoProject {
  constructor() {
    // Today's date
    let from = dateManager.getTodayDate(),
      to = from;
    super("Today", from, to);
  }
}
