import AbstractPublisher from './abstract-publisher.js'

export default class AbstractTodoModel extends AbstractPublisher {
    init(){throw new Error("Abstract method");}
    addProject(projectName){throw new Error("Abstract method");}
    removeProject(projectName){throw new Error("Abstract method");}
    sortProject(sortName,){throw new Error("Abstract method")};
    addTodo(todo, project){throw new Error("Abstract method")};
    removeTodo(id){throw new Error("Abstract method")};
    updateTodo(todo, properties){throw new Error("Abstract method")};
    checkTodo(todo){throw new Error("Abstract method")};
    
}

