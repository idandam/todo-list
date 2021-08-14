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

todoView.clickChangeCurrentProject("project 1")

todoView.clickAddTodo("clean house", "Medium", new Date(2021,6,23));
console.log("after adding todo to project 1: "+ todoModel.currentProject.todos  );


todoView.clickAddTodo("suck cock", "High", new Date(2021,4,4));
console.log("after adding todo to project 1: "+ todoModel.currentProject.todos  );

todoView.clickChangeCurrentProject("project 3")
todoView.clickAddTodo("see a movie", "Low", new Date(2021,2,28));
console.log("after adding todo to project 3, projects state now: ",todoModel.currentProject.todos);

todoView.clickChangeCurrentProject("project 1");


todoView.clickAddTodo("todo 3", "Medium", new Date(2021,2,27));
console.log("after adding todo  to project 1: " + todoModel.currentProject.todos);


todoView.clickAddTodo("todo 4", "Low", new Date(2021,6,1));
console.log("after adding todo 4  to project 1:  " + todoModel.currentProject.todos);

todoView.clickAddTodo("todo 5", "High", new Date(2021,10,19));
console.log("after adding todo to project 1: "+ todoModel.currentProject.todos + "\n\t\t" + todoModel.currentProject.printTodosByDate()  );


todoView.clickSortProject("Date");
console.log("sort todos of project 1 by Date: " + todoModel.currentProject.printTodosByDate());

todoView.clickAddTodo("todo 6", "High", new Date(2021,7,1));
console.log("after adding todo to project 1: "+ todoModel.currentProject.todos  );

todoView.clickAddTodo("todo 7", "Low", new Date(2021,8,8));
console.log("after adding todo to project 1: "+ todoModel.currentProject.todos   + "\n\t\t" + todoModel.currentProject.printTodosByDate() );

todoView.clickSortProject("Priority");
console.log("sort todos of project 1 by Priority: " + todoModel.currentProject.todos   + "\n\t\t"  +todoModel.currentProject.printTodosByDate());






