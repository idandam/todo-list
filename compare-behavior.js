export default class CompareBehavior {

    #name

    constructor(name){
        this.#name = name;
    }
    /**
     * 
     * @param {Todo} todo1 
     * @param {Todo} todo2 
     */
    compare(todo1, todo2){throw new Error("Abstract Method");}

    get name() {
        return this.#name;
    }
    set name(other) {
        this.#name = other;
    }
}