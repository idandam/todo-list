
export default class TodoSorage {

    static setProjects(projects){
        localStorage.setItem("projects", JSON.stringify(projects));
    }
    static getProjects(){
        return JSON.parse(localStorage.getItem(projects) || []);
    }

}

