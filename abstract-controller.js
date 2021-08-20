export default class AbstractController{
    
    init(){throw new Error("Abstract method");}
    addProject(projectName){throw new Error("Abstract method");}
    removeProject(projectName){throw new Error("Abstract method");}
    sortProject(sortName){throw new Error("Abstract method")};
    addTodo(todo){throw new Error("Abstract method")};
    updateTodo(id, properties){throw new Error("Abstract method")};
    removeTodo(id){{throw new Error("Abstract method")};}
    checkTodo(id){throw new Error("Abstract method")};
    removeCheckedTodos(){throw new Error("Abstract method")};

}

