class Range {
    #from
    #to

    constructor(from, to) {
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
    set from(other) {
        if (this.#to <= other) {
            this.#form = other;
        }
    }
    get to(){
        return this.#to;
    }
    set to(other){
        if (other <= this.#from){
            this.#to = other;
        }
    }
}