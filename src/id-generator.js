export default class IdGenerator {
    #reusableIds
    static #nextId = "0";

    constructor() {
        this.#reusableIds = [];

    }

    generateId() {
        if (this.#reusableIds.length > 0){
            return this.#reusableIds.pop();
        }
        
        let rval = IdGenerator.#nextId, id = parseInt(IdGenerator.#nextId);
        IdGenerator.#nextId = "" + (++id)  
        
        return rval;
    }

    reuseId(id) {
        if (!this.#reusableIds.includes(id)) {
            this.#reusableIds.push(id);
        }
    }

    assign(obj) {
        if (obj) {
            this.#reusableIds = obj.reusableIds;
            IdGenerator.#nextId = obj.nextId;
        }

        return this;
    }

    toJSON() {
        return {
            reusableIds: this.#reusableIds,
            nextId: IdGenerator.#nextId
        }
    }
}

