import DateRange from "./date-range.js"

export default class TodoDateManager {
   
    #today
    #nextSevenDays
    
    constructor(){
        this.#today = new Date();
        this.#nextSevenDays = new DateRange(this.getFeatureDate({days:1}), this.getFeatureDate({days=8}));

        
    }
    isTodayDate(date){
        return this.#day === date.getDay() &&
            this.#month === date.getMonth() &&
            this.#year === date.getYear();
    }

    getFeatureDate(options){
        return new Date(this.#today.getFullYear(), this.#today.getMonth(), this.#today.getDay() + daysFromNow);
    }
    
    shiftNextSevenDays(){
        //TODO
    }
       
  
}

let instance = new TodoDateManager();
export default instance;