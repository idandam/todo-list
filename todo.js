import dateManager from "./date-manager.js"

export default class Todo {
    #id
    #title;
    #description;
    #dueDate;
    #priority
    #isChecked;
    #containingProject;

    static #priorities = { Low: 1, Medium: 2, High: 3 };
    static #defaultPriority = "Low";
    // TODO - encapsulate this
    static #runNum = 0;
    static #fetchUniqueId() {
        return Todo.#runNum++;
    }

    constructor(title, description, priority = Todo.#defaultPriority, dueDate) {
        this.#id = Todo.#fetchUniqueId();
        this.#title = title;
        this.#description = description;
        this.#dueDate = dateManager.getProperTodoDate(dueDate);
        this.#priority = priority;
        this.#isChecked = false;
    }

    assign(obj) {
        this.#id = parsed.id;
        this.#title = parsed.title;
        this.#description = obj.description;
        this.#dueDate = dateManager.getProperTodoDate(obj.dueDate);
        this.#priority = obj.priority;
        this.#isChecked = obj.isChecked;
    }

    toJSON() {
        return {
            id: this.#id,
            title: this.#title,
            description :this.#description,
            dueDate: this.#dueDate,
            priority: this.#priority,
            isChecked: this.#isChecked,

        }
    }

    get title() {
        return this.#title;
    }
    set title(title) {
        this.#title = title;
    }

    get description() {
        return this.#description;
    }
    set description(description) {
        this.#description = description;
    }
    get dueDate() {
        return this.#dueDate;
    }
    set dueDate(dueDate) {
        if (!dueDate instanceof Date || dueDate !== "No Date")
            throw new Error("dueDate must be a Date object or equals to the string 'No Date'.");

        dueDate.setHours(0, 0, 0, 0);
        this.#dueDate = dueDate;
    }

    get priority() {
        return this.#priority;
    }
    set priority(priority) {
        if (priority in Object.keys(Todo.#priorities)) {
            this.#priority = priority;
        }
    }

    get isChecked() {
        return this.#isChecked;
    }
    set isChecked(isChecked) {
        this.#isChecked = isChecked;
    }

    get containingProject() {
        return this.#containingProject;
    }
    set containingProject(containingProject) {
        this.#containingProject = containingProject;
    }

    get id() {
        return this.#id;
    }

    static get priorities() {
        return this.#priorities;
    }

    valueOf() {
        return Todo.#priorities[this.#priority];
    }

    toString() {
        return this.#priority;
    }
    toDateString() {
        if (this.#dueDate instanceof Date) {
            return this.#dueDate.toLocaleDateString();
        }

        return this.#dueDate;
    }
    static get defaultPriority() {
        return Todo.#defaultPriority;
    }
}