import TodoModel from "./todo-model.js";
import TodoController from "./todo-controller.js";
import TodoView from "./todo-view.js";

const todoModel = new TodoModel();
const todoController = new TodoController(todoModel);
const todoView = new TodoView(todoController, todoModel);

todoView.clickAddProject("project 1");
console.log("after adding project 1, projects state now: " + todoModel.projects);
todoView.clickAddProject("project 2");
console.log("after adding project 2, projects state now: " + todoModel.projects);
todoView.clickAddProject("project 3");
console.log("after adding project 3, projects state now: " + todoModel.projects);
todoView.clickRemoveProject("project 2");
console.log("after removeing project 2, projects state now: " + todoModel.projects);

todoView.clickAddTodo(todoModel.projects[1], "clean house", "Medium", "21/10/2021");
console.log("after adding todo to project 1, projects state now: ",todoModel.projects);

todoView.clickAddTodo(todoModel.projects[1], "suck cock", "High", "28/12/2021");
console.log("after adding todo to project 1, projects state now: ",todoModel.projects);

todoView.clickAddTodo(todoModel.projects[2], "see a movie", "Low", "11/11/2021");
console.log("after adding todo to project 3, projects state now: ",todoModel.projects);

todoView.clickChangeCurrentProject("project 1");


todoView.clickAddTodo(todoModel.getCurrentProject, "todo 3", "Medium");
console.log("after adding todo  to project 1");

todoView.clickAddTodo(todoModel.getCurrentProject, "todo 4", "Low");
console.log("after adding todo 4  to project 1");

todoView.clickAddTodo(todoModel.getCurrentProject, "todo 5", "High");
console.log("after adding todo 5 to project 1");

todoView.clickSortProject("priority");
console.log("sort todos of project 1 by priority");





