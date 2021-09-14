import CompareBehavior from "./compare-behavior.js"


class CompareByDate extends CompareBehavior {

    constructor() {
        super("Date");

    }

    /**
     * 
     * @param {*} todo1 
     * @param {*} todo2 
     * @returns (In the context of a sorted data structure)
     *  A value smaller than 0 if todo1's position should be before todo2.
        Else returns a value greater than 0 if todo1's position should be after todo2.
        Else returns 0 if the position of the two todos with respect to each other doesn't matter. 
     */
    compare(todo1, todo2) {
        /* If an argument is not an instance of Date then he should come after the other argument
           in a sorted data structure */
        if (!(todo1.dueDate instanceof Date)) {
            return 1;
        }
        if (!(todo2.dueDate instanceof Date)) {
            return -1;
        }
        // Natural date order
        return todo1.dueDate - todo2.dueDate;
    }

}

class CompareByPriority extends CompareBehavior {

    #compareByDate

    constructor() {
        super("Priority");
        this.#compareByDate = new CompareByDate();
    }

    compare(todo1, todo2) {
       // If the priorities are identical then compare based on the Date value of the two todos. 
        if (todo1.priority === todo2.priority) {
            return this.#compareByDate.compare(todo1, todo2)
        }
        // Higher priorities todos should come first 
        return todo2 - todo1;
    }

}

export { CompareByDate, CompareByPriority };