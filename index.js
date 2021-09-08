import TodoController from "./todo-controller.js"
import TodoModel from "./todo-model.js"
import TodoSorage from "./todo-storage.js";

//localStorage.clear();
let modelState = TodoSorage.getModelState();
console.log(modelState);
new TodoController(new TodoModel().assign(modelState));

