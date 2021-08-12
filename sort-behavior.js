export default class SortBehavior {

    #name

    constructor(name){
        this.#name = name;
    }
    sort(todo1, todo2){throw new Error("Abstract Method");}

    get name() {
        return this.#name;
    }
    set name(other) {
        this.#name = other;
    }
}