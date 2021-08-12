
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
    addTodo(todo, project) {
        this.#todoModel.addTodo(todo, project);
    }

    removeTodo(id){
        this.#todoModel.removeTodo(id);
    }
    
    checkTodo(id){
        this.#todoModel.checkTodo(id);
    }
    
    updateTodo(id, properties) {
        this.#todoModel.updateTodo(id, properties);
    }
    changeCurrentProject(project) {
        if (project !== this.#todoModel.currentProject)
            this.#todoModel.currentProject = project;
    }
    removeCheckedTodos() {
        this.#todoModel.currentProject.todos.filter((todo) => { todo.isChecked })
        .forEach(todo => {
            model.removeTodo(todo.id);
        });
    }
    changeCurrentProject(projectName){
        this.#todoModel.changeCurrentProject(projectName);
    }
}