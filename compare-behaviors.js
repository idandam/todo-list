import CompareBehavior from "./compare-behavior.js"


class CompareByDate extends CompareBehavior {

    constructor() {
        super("Date");

    }
    
    /**
     * 
     * @param {Todo} todo1 
     * @param {Todo} todo2 
     * @returns //TODO -complete doc
     */
    compare(todo1, todo2) {
        if (!(todo1.dueDate instanceof Date)){
            return 1;
        }
        if (!(todo2.dueDate instanceof Date)){
            return -1;
        }
        return todo1.dueDate- todo2.dueDate;
    }

}

class CompareByPriority extends CompareBehavior {

    #compareByDate

    constructor() {
        super("Priority");
        this.#compareByDate = new CompareByDate();
    }

    /**
     * 
     * @param {Todo} todo1 
     * @param {Todo} todo2 
     * @returns The comapre by date result if the todo's priorities are the same,   
     *          Else returns the todo's priorities difference in reversed order.
     */
    compare(todo1, todo2) {
        if (todo1.priority === todo2.priority){
            return this.#compareByDate.compare(todo1, todo2)
        }

        return todo2 - todo1;
    }
    
}

export { CompareByDate, CompareByPriority };