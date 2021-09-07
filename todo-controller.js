import TodoView from "./todo-view.js";
import Todo from "./todo.js";
import AbstractController from "./abstract-controller.js";
import TodoStorage from './todo-storage.js'

export default class TodoController extends AbstractController {
    #todoView
    #todoModel

    constructor(model) {
        super();
        this.#todoModel = model;
        this.#todoView = new TodoView(this, model);
        this.#todoView.subscribeAll();
        this.#todoView.createView();

    }
   
    addProject(projectName) {
        this.#todoModel.addProject(projectName);
        TodoStorage.setProjects(this.#todoModel.projects);
    }
    removeProject(projectName) {
        this.#todoModel.removeProject(projectName);
        TodoStorage.setProjects(this.#todoModel.projects);
    }

    sortProject(sortName) {
        this.#todoModel.sortProject(sortName);
        TodoStorage.setProjects(this.#todoModel.projects);
    }
    addTodo(todoProperties) {
        this.#todoModel.addTodo(new Todo(todoProperties.title, todoProperties.description,
             todoProperties.priority, todoProperties.date));
       
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
    moveTodoToProject(id, projectName){
       this.#todoModel.moveTodoToProject(id, projectName);
    }

    getTodoProperties(id){
        let todo = this.#todoModel.getTodoById(id);
        if (todo){
            return {title:todo.title, description:todo.description, date:todo.dueDate, priority: todo.priority};
        }
    }
    
    changeProjectName(projectName, updatedProjectName){
        this.#todoModel.changeProjectName(projectName, updatedProjectName);

    }

}