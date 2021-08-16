export default class Range {

    #from
    #to

    constructor(from, to) {
        this.#validateRange(from, to);
        this.#from = from;
        this.#to = to;
    }

    includes(x) {
        return this.#from <= x && x <= this.#to;
    }
    toString() {
        return `(${this.#from},...,${this.#to})`;
    }
    get from() {
        return this.#from;
    }
    set from(from) {
        this.#validateRange(from, this.#to);
        this.#from = from;
    }
    get to() {
        return this.#to;
    }
    set to(to) {
        this.#validateRange(this.#from, to);
        this.#to = to;
    }
    #validateRange(from, to){
        if(from > to){
            throw new Error(`The start of the range can't be greater then the end: from=${from}, to=${to}`);
        }
        
    }
}