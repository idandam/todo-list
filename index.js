import TodoController from "./todo-controller.js"
import TodoModel from "./todo-model.js"
import TodoSorage from "./todo-storage.js";

//localStorage.clear();

new TodoController(new TodoModel());

