import SortBehavior from "./sort-behavior.js"

class SortByPriority extends SortBehavior {


    constructor() {
        super("Priority");
    }

    sort(todo1, todo2){
        return todo2- todo1;
    }
    /*
    TODO - implement
    sort(todo1, todo2) {
        return (todo1.priority === todo2.priority ? todo1.dueDate - dodo2.dueDate : todo2.priority - todo1.priority)
    }
    */
}

class SortByDate extends SortBehavior {

    constructor() {
        super("Date");

    }
    
    sort(todo1, todo2) {
        //TODO - implement
        return todo1 - todo2;
    }

}
export { SortByDate, SortByPriority };