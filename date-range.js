import Range from "./range.js"
class DateRange extends Range {
    /**
     * @override
     * 
     * @param {Date} date 
     */
    includes(date){
        if (!(date instanceof Date)){
            throw new Error("Argument is not an instance of Date");
        }
        return super.includes(date);
    }

}

