
import TodoProject from "./todo-project.js";
import TodoView from "./todo-view.js";
import AbstractController from "./abstract-controller.js";

export default class TodoController extends AbstractController {
    #todoView
    #todoModel

    constructor(model) {
        super();
        this.#todoModel = model;
       // this.#todoView = new TodoView(this, model);

    }
   
    addProject(projectName) {
        this.#todoModel.addProject(projectName);
    }
    removeProject(projectName) {
        this.#todoModel.removeProject(projectName);
    }

    sortProject(sortName) {
        this.#todoModel.sortProject(sortName);
    }
    addTodo(todo) {
        this.#todoModel.addTodo(todo);
    }

    removeTodo(id){
        this.#todoModel.removeTodo(id);
    }
    
    checkTodo(id){
        this.#todoModel.checkTodo(id);
    }
    
    updateTodo(id, updatedTodo) {
        this.#todoModel.updateTodo(id, updatedTodo);
    }
    
    removeCheckedTodos() {
        this.#todoModel.getCheckedTodos()
        .forEach(todo =>  this.#todoModel.removeTodo(todo.id));
    }
    
    changeCurrentProject(projectName){
        this.#todoModel.changeCurrentProject(projectName);
    }
    moveTodoToProject(todoId, projectName){
        let project = this.#todoModel.getProjectByName(projectName);
        if (project) {
            let todo = this.#todoModel.removeTodo(todoId);
            if (todo) {
                this.#todoModel.addTodo(todo, project);
            }
        }
    }

    getTodoProperties(id){
        let todo = this.#todoModel.getTodoById(id);
        if (todo){
            return {title:todo.title, description:todo.description, date:todo.dueDate, priority: todo.priority};
        }
    }

}