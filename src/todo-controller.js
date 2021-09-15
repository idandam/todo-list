import TodoView from "./todo-view.js";
import Todo from "./todo.js";
import AbstractController from "./abstract-controller.js";
import TodoStorage from './todo-storage.js'
import TodoModel from "./todo-model.js";

export default class TodoController extends AbstractController {
    #todoView
    #todoModel

    constructor(model) {
        super();
       // localStorage.clear();
        this.#todoModel = model.assign(TodoStorage.getModelState());
        this.#handleStorageSpecialProjects();
        this.#todoView = new TodoView(this, model);
        this.#todoView.subscribeAll();
        this.#todoView.createView();
        this.#todoView.populateProjects(this.#getProjectsNames());

    }
   
    #handleStorageSpecialProjects(){
        for(  let project of this.#todoModel.projects){
            for (let todo of project.todos){
                this.#todoModel.updateSpecialProjects("add", todo.dueDate, todo);
            }
        }
    }

    addProject(projectName) {
        this.#todoModel.addProject(projectName);
        TodoStorage.setModelState(this.#todoModel);
    }
    
    removeProject(projectName) {
        this.#todoModel.removeProject(projectName);
        TodoStorage.setModelState(this.#todoModel);
    }

    sortProject(sortName) {
        this.#todoModel.sortProject(sortName);
        TodoStorage.setModelState(this.#todoModel);
    }
    addTodo(todoProperties) {
        this.#todoModel.addTodo(new Todo(todoProperties.title, todoProperties.description,
             todoProperties.priority, todoProperties.date));
             
        TodoStorage.setModelState(this.#todoModel);
       
    }

    removeTodo(id){
        this.#todoModel.removeTodo(id);
        TodoStorage.setModelState(this.#todoModel);
    }
    
    checkTodo(id){
        this.#todoModel.checkTodo(id);
        TodoStorage.setModelState(this.#todoModel);
    }
    
    updateTodo(id, updatedTodo) {
        this.#todoModel.updateTodo(id, updatedTodo);
        TodoStorage.setModelState(this.#todoModel);
    }
    
    removeCheckedTodos() {
        this.#todoModel.getCheckedTodos()
        .forEach(todo =>  this.#todoModel.removeTodo(todo.id));

        TodoStorage.setModelState(this.#todoModel);
    }
    
    changeCurrentProject(projectName){
        this.#todoModel.changeCurrentProject(projectName);

        TodoStorage.setModelState(this.#todoModel);
    }
    moveTodoToProject(id, projectName){
       this.#todoModel.moveTodoToProject(id, projectName);
       TodoStorage.setModelState(this.#todoModel);
    }

    getTodoProperties(id){
        let todo = this.#todoModel.getTodoById(id);
        if (todo){
            return {title:todo.title, description:todo.description, date:todo.dueDate, priority: todo.priority};
        }
    }
    
    changeProjectName(projectName, updatedProjectName){
        this.#todoModel.changeProjectName(projectName, updatedProjectName);
        TodoStorage.setModelState(this.#todoModel);

    }

    #getProjectsNames(){
    
        return this.#todoModel.projects.map(project => project.name)
        .slice(TodoModel.getSpecialProjectsLength());
    }

}