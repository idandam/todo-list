/**
 * Represents a compare behavior for comparing two elements  
 */
export default class CompareBehavior {
    // String name that represents the compare behavior
    #name

    constructor(name){
        this.#name = name;
    }
    /**
     * 
     * @param {Object} element1
     * @param {Object} element2 
     * @returns (In the context of a sorted data structure)
     *  A value smaller than 0 if element1's position should be before element2.
        Else returns a value greater than 0 if element1's position should be after element2.
        Else returns 0 if the position of the two elements with respect to each other doesn't matter. 
     */
    compare(element1, element2){throw new Error("Abstract Method");}

    get name() {
        return this.#name;
    }
    set name(other) {
        this.#name = other;
    }
}