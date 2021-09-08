
export default class TodoSorage {

    static setModelState(model){
        localStorage.setItem("model", JSON.stringify(model));
    }
    static getModelState(){
        return JSON.parse(localStorage.getItem("model"));
    }

}

