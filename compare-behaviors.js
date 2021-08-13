import CompareBehavior from "./compare-behavior.js"

class CompareByPriority extends CompareBehavior {


    constructor() {
        super("Priority");
    }

    /**
     * 
     * @param {Todo} todo1 
     * @param {Todo} todo2 
     * @returns The todo's dates difference if theirs priorities are the same,   
     *          Else returns the todo's priorities difference in revered order.
     */
    compare(todo1, todo2) {
        return (todo1.priority === todo2.priority ? todo1.dueDate - todo2.dueDate : todo2 - todo1)
    }
    
}

class CompareByDate extends CompareBehavior {

    constructor() {
        super("Date");

    }
    
    /**
     * 
     * @param {Todo} todo1 
     * @param {Todo} todo2 
     * @returns The todo's dates difference
     */
    compare(todo1, todo2) {
        return todo1.dueDate - todo2.dueDate;
    }

}
export { CompareByDate, CompareByPriority };