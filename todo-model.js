import AbstractTodoModel from './abstract-todo-model.js';
import pubsub from './pubsub.js';
import TodoProject from './todo-project.js';
import { TOPICS } from './utils.js';
import TodayProject from "./today-project.js"
import NextSevenDaysProject from "./next-seven-days-project.js"
import Todo from './todo.js';
import dateManager from "./date-manager.js"


export default class TodoModel extends AbstractTodoModel {
    #projects;
    #currentProject;
    static #specialProjects = { inbox: 0, today: 1, nextSevenDays: 2 };

    constructor() {
        super();
        this.#projects = [];
        this.#defineProjectsProperties();
        this.#currentProject = this.#projects[TodoModel.#specialProjects.today];

    }

    addProject(projectName) {
        // if we don't have a project with that name then add the project  
        if (!this.getProjectByName(projectName)) {
            let project = new TodoProject(projectName)
            this.#projects.push(project);
            this.publish(TOPICS.projectAdded, project);
        }
        // announce that we didn't add the project since a project with this name already exists
        else {
            this.publish(TOPICS.projectAdded, { errorMessage: `A project with the name ${projectName} is already exists` });
        }

    }

    removeProject(projectName) {
        // TODO - what if the removed project is the current project
        let i = TodoModel.#specialProjects.nextSevenDays + 1;
        while (i < this.#projects.length && this.#projects[i].name !== projectName) {
            i++;
        }

        if (i < this.#projects.length) {
            let [removedProject] = this.#projects.splice(i, 1);
            if (removedProject === this.#currentProject) {
                this.changeCurrentProject("Today");
            }
            this.publish(TOPICS.projectRemoved, {
                position: i - Object.keys(TodoModel.#specialProjects).length,
                projectName
            });
        }

    }

    sortProject(sortName) {

        if (this.#currentProject.sort(sortName)) {
            this.publish(TOPICS.projectSorted, { sortName, todos: this.#currentProject.todos });
        }
    }

    addTodo(todo, project = this.#currentProject) {
        let position = project.add(todo);
        let specialProject = this.#updateSpecialProjects("add", todo.dueDate, todo);
        // If added a todo the the current project then publish only the todo and the todo's position
        // If either condition is true then we added the todo to the current project. The first case 
        // The first condition is true when the project is a custom project.
        // The second condition is true when we updated a todo from a special project and the date still holds
        // for that project so first the todo will be added to the containing project and then to the 
        // current special project. 
        if (project === this.#currentProject || specialProject === this.#currentProject) {
            this.publish(TOPICS.todoAdded, { todo, position });
        }// Else we are adding the todo to another project (not to the currently displayed project in the view),
        // so add this information to the publish data.
        // A use case for this can be when we are updating (in the view) a todo in "Today" project and change the date
        // to a date different then today's date, then this information can tell the view not to update
        // the current project, that is actually today's project, since it will not be a valid date for this project. 
        else {
            this.publish(TOPICS.todoAdded, { todo, position, isAddedToAnotherProject: true });
        }

    }
    //TODO - you eed to publish the new length of the todos array and in the view
    // implement the number of todos in a project in the nav 
    removeTodo(id) {
        // data is of the form { todo, position }
        let data = this.#currentProject.remove(id);
        if (data) {
            // If we removed the todo from a dpecial project like "Today" or "Next 7 days"
            // then also ermove the todo from his containing project (that is a custom project);
            if (this.isCurrentProjectSpecial()) {
                data.todo.containingProject.remove(id);
            }
            // Else we removed the todo from a custom project
            // so remove him also from a special project if he currently located in one.
            else {
                this.#updateSpecialProjects("remove", data.todo.dueDate, id);
            }
            // In either case publish the position of the removed todo from the current project
            // and return the removed todo
            this.publish(TOPICS.todoRemoved, data.position);
            return data.todo;
        }

    }


    checkTodo(id) {
        let todo = this.#currentProject.getTodoById(id);
        if (todo) {
            todo.isChecked = !todo.isChecked;
            // TODO handle change in today or sevedays project. publich there a special topic for this
            this.publish(TOPICS.todoChecked, { todo })
        }
    }


    updateTodo(id, updatedTodo) {
        let removedTodo = this.removeTodo(id);
        // If we removed the todo from any special project then add him to the original containing project,
        // that is a custom project and not a special project.
        if (this.isCurrentProjectSpecial()) {
            this.addTodo(updatedTodo, removedTodo.containingProject);
        }
        // Else the current project is not a custom project so jsut add the todo the the current project
        else {
            this.addTodo(updatedTodo);
        }

    }

    moveTodoToProject(id, projectName) {
        let project = this.getProjectByName(projectName);
        if (project) {
            let todo = this.removeTodo(id);
            if (todo) {
                this.addTodo(todo, project);
            }
        }
        pubsub.publish(TOPICS.todoMoved);
    }

    changeCurrentProject(projectName) {
        let project = this.getProjectByName(projectName);
        if (project) {
            this.#currentProject = project;
            this.publish(TOPICS.currentProjectChanged, this.#currentProject);
        }
    }

    isCurrentProjectSpecial() {
        return this.#currentProject === this.#projects[TodoModel.#specialProjects.today] ||
            this.#currentProject === this.#projects[TodoModel.#specialProjects.nextSevenDays];
    }

    get currentProject() {
        return this.#currentProject;
    }

    set currentProject(projectName) {
        let project = this.getProjectByName(projectName);
        if (project) {
            this.#currentProject = project;
            this.publish(TOPICS.currentProjectChanged, { currentProject: this.#currentProject });
        }
    }

    get projects() {
        return this.#projects;
    }

    getCheckedTodos() {
        return this.#currentProject.todos.filter(todo => todo.isChecked);
    }

    publish(topic, data) {
        // delegate to the PubSub instance
        pubsub.publish(topic, data);

    }


    getProjectByName(projectName) {
        return this.#projects.filter(project => project.name === projectName)[0];
    }
    /**
     * Define the first three properties. Make them non-configurable.
     */
    #defineProjectsProperties() {
        Object.defineProperties(this.#projects, {
            0: {
                value: new TodoProject("Inbox"),
                writable: true,
                configurable: false,
                enumerable: true
            },
            1: {
                value: new TodayProject(),
                writable: true,
                configurable: false,
                enumerable: true
            },
            2: {
                value: new NextSevenDaysProject(),
                writable: true,
                configurable: false,
                enumerable: true
            },
        });

    }
    /**
     * @param {String} op an operation in {"add", "remove"}
     */
    #updateSpecialProjects(op, dueDate, todoData) {
        if (dueDate instanceof Date) {
            if (this.#projects[TodoModel.#specialProjects.today].dateRange.includes(dueDate)) {
                this.#projects[TodoModel.#specialProjects.today][op](todoData);
                return this.#projects[TodoModel.#specialProjects.today];
            }
            else if (this.#projects[TodoModel.#specialProjects.nextSevenDays].dateRange.includes(dueDate)) {
                this.#projects[TodoModel.#specialProjects.nextSevenDays][op](todoData);
                return this.#projects[TodoModel.#specialProjects.nextSevenDays];
            }
        }
    }

    getDefaultPriority() {
        return Todo.defaultPriority;
    }

    getTodoById(id) {
        return this.#currentProject.getTodoById(id);
    }
    isSpecialProject(projectName) {
        return projectName === this.#projects[TodoModel.#specialProjects.today].name ||
            projectName === this.#projects[TodoModel.#specialProjects.nextSevenDays].name;
    }

    changeProjectName(projectName, updatedProjectName) {
        if (!this.getProjectByName(updatedProjectName)) {
            this.getProjectByName(projectName).name = updatedProjectName;
            pubsub.publish(TOPICS.projectNameChanged, { projectName, updatedProjectName });
        }
    }

    getCurrentProjectSortName() {
        return this.#currentProject.getCompareBehaviorName();
    }
}