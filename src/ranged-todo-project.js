import DateRange from "./date-range.js";
import TodoProject from "./todo-project.js";

/**
 * A todo project with todos that belong to a specific range of dates.
 */
export default class RangedTodoProject extends TodoProject {
  #dateRange;

  constructor(name, from, to) {
    super(name);
    this.#dateRange = new DateRange(from, to);
  }
  /**
   * Add to this project todos that belong to the range of dates that is represeted by dateRange
   * @param {Array} projects
   */
  fillTodos(projects) {
    for (let project of projects) {
      for (let todo of project.todos) {
        if (this.#dateRange.includes(todo.dueDate)) {
          this.add(todo);
        }
      }
    }
  }

  get dateRange() {
    return this.#dateRange;
  }
}
