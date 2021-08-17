export default class Todo {
    #id
    #title;
    #description;
    #dueDate;
    #priority
    #isChecked;
    #containingProject;

    static #priorities = { Low: 1, Medium: 2, High: 3 };

    static #runNum = 0;
    static #fetchUniqueId() {
        return Todo.#runNum++;
    }

    constructor(title, priority = "LOW", dueDate = "No Date") {
        this.#id = Todo.#fetchUniqueId();
        this.#title = title;
        this.#dueDate = dueDate;
        this.#priority = priority;
        this.#isChecked = false;
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

        dueDate.setHours(0,0,0,0);
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
}