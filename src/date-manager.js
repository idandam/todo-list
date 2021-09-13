import DateRange from "./date-range.js"
/**
 * Take care of dates operations
 */
class DateManager {

    #today

    static get noDateValue() {
        return "No date";
    }

    constructor() {
        this.#today = new Date();
        // Not interested with time
        this.#today.setHours(0, 0, 0, 0);
    }
    /**
     * 
     * @param {Date} date 
     * @returns True if date is today's date, false otherwise.
     */
    isTodayDate(date) {
        if (!(date instanceof Date)) {
            throw new Error("Argument must be an instance of Date");
        }

        return this.#today.getTime() === date.getTime();
    }
    /**
     * 
     * @returns Today's date.
     */
    getTodayDate() {

        return this.#today;
    }

    /**
     * 
     * @param {Object} options Triplet of the form {years:y, months:m, days:d}, such that y,m,d are non-negative integers. 
     * @returns A Date in the feature.
     */
    getFutureDate(options) {
        return new Date(this.#today.getFullYear() + options.years, this.#today.getMonth() + options.months,
            this.#today.getDate() + options.days, 0, 0, 0, 0);
    }

    toDateString(date) {
        if (date instanceof Date) {
            return date.toLocaleDateString();
        }
        return DateManager.noDateValue;
    }

    equals(d1, d2) {
        return d1 === d2  || (d1 instanceof Date && d2 instanceof Date && d1.getTime() === d2.getTime());
        
    }

    toInputDateFormat(date) {
        if (date instanceof Date) {
            let dateParts = [1 + date.getMonth() + "", date.getDate() + ""];

            dateParts.forEach((datePart, index, dateParts) => {
                if (dateParts[index].length < 2) {
                    dateParts[index] = "0" + datePart;
                }
            });

            return [date.getFullYear(), ...dateParts].join("-");
        }
        return date;
    }

    getProperTodoDate(date) {
        if (!(date instanceof Date)){
            date = new Date(date);
            if (isNaN(date.getTime())){
                return DateManager.noDateValue;
            }
        }
        if (isNaN(date.getTime()) ||
            (Math.trunc(date.getFullYear() / 1000)) !== (Math.trunc(this.#today.getFullYear() / 1000)) ||
            date < this.#today) {
            return DateManager.noDateValue;
        }

        return date;

    }

    resetHours(date) {
        if (date instanceof Date && !(isNaN(date.getTime()))) {
            date.setHours(0, 0, 0, 0);
        }

        return date;
    }
}

let instance = new DateManager();
export default instance;