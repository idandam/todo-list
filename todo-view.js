import AbstractSubscriber from "./abstract-subscriber.js"
import pubsub from "./pubsub.js"
import TodoProject from "./todo-project.js"
import Todo from "./todo.js"
import dateManager from "./date-manager.js"
import { TOPICS } from "./utils.js"

export default class TodoView extends AbstractSubscriber {
    #todoModel;
    #todoController;

    #projects;
    #constantProjects;
    #currentProject;
    #customProjects;
    #addProjectBtn;
    #addTodoListItem
    #editTodoForm
    #editTodoFormContainer
    #priorityList
    #projectContent;

    #projectsQueue;

    #todos


    constructor(controller, model) {
        super();
        this.#todoController = controller;
        this.#todoModel = model;
        this.#projectsQueue = [];
        this.#subscribeAll();
        this.createView();

    }

    createView() {
        this.#projects = document.querySelector(".nav-projects");
        this.#constantProjects = document.querySelector(".constant-projects");
        this.#customProjects = document.querySelector(".custom-projects");
        this.#addProjectBtn = document.querySelector(".add-project-btn")
        this.#projectContent = document.querySelector(".project-content");
        this.#todos = document.querySelector(".todos");
        this.#editTodoForm = this.#todos.querySelector(".edit-todo-form");
        this.#addTodoListItem = this.#todos.querySelector(".add-todo-list-item");
        this.#editTodoFormContainer = this.#todos.querySelector(".edit-todo-list-item");
        this.#priorityList = document.querySelector(".edit-todo-priorities-list");

        this.#currentProject = this.#constantProjects.firstElementChild.nextElementSibling;
        this.#currentProject.classList.add("current-project");
        // Don't allow adding todos to today's todo list.
        // Remove the option to add a todo.
        this.#toggleAddTodoDisplay(this.#todoModel.isTodayCurrentProject());
        this.#projectContent.querySelector("h3").innerHTML = this.#todoModel.currentProject.name;

        this.#populateTodos(this.#todoModel.currentProject.todos);

        this.#editTodoForm.querySelector(".edit-todo-area").onclick = (event) => {
            event.preventDefault();
            event.stopPropagation();
        };

        this.#addListeners();
    }

    /**
     * Assuming data is the position of the todo to be removed
     */
    onTodoRemoved(data) {
        this.#todos.children[data].remove();
    }

    #toggleAddTodoDisplay(isTodayCurrentProject) {

        if (isTodayCurrentProject) {
            this.#addTodoListItem.style.display = "none";
        }
        else {
            this.#addTodoListItem.style.display = "block";
        }
    }
    /**
     * Add a todo list item in his position according to the way todos are sorted in the model
     * @param {Object} data an object of the form {todo, postion}
     */
    onTodoAdded(data) {
        if (data.todo instanceof Todo) {
            this.#todos.children[data.position].before(this.#createTodoListItem(data.todo));

        }
    }

    #createTodoListItem(todo) {
        let todoListItem = this.#createTodoStructure();
        this.#injectTodoDetails(todoListItem, todo);
        return todoListItem;
    }

    #injectTodoDetails(todoListItem, todo) {
        todoListItem.dataset.id = todo.id;
        todoListItem.querySelector(".todo-list-item-title").innerHTML = todo.title;
        todoListItem.querySelector(".todo-list-item-date").innerHTML = dateManager.toDateString(todo.dueDate);
        todoListItem.querySelector(".todo-list-item-priority").innerHTML = todo.priority;

    }

    #createTodoStructure() {
        let todoListItemTemplate = this.#todos.querySelector("template");
        return todoListItemTemplate.content.cloneNode(true).children[0];

    }
    /**
     * Depends on the target, perform the related operation. 
     * @param {*} event click event in side the todos list
     */
    onTodosClick(event) {
        // If the user clicked on the delete todo icon then delete the todo
        if (event.target.tagName === "I") {
            this.#todoController.removeTodo(event.target.closest("li").dataset.id);
        }
        else {
            let listItem = this.#getContainingListItem(event.target);
            // If the user clicked on a todo 
            if (listItem) {
                // If the user wants to add a new todo
                if (listItem.classList.contains("add-todo-list-item")) {
                    this.#addTodo();
                    event.preventDefault();
                    event.stopPropagation();
                }
                // Else if the user wants to expand an existing todo
                else {
                    let todo = this.#todoModel.getTodoById(listItem.dataset.id);
                    this.#editTodoForm.elements.title.value = todo.title;
                    this.#editTodoForm.elements.description.value = todo.description;
                    this.#editTodoForm.elements.date.value = dateManager.toInputDateFormat(todo.dueDate);
                    for (let priority of this.#priorityList.children) {
                        if (priority.firstChild.firstChild.nodeValue === todo.priority) {
                            priority.classList.add("chosen");
                        }
                    }
                    this.#handlePriorityClick();

                    this.#editTodoForm.elements.submit.onclick = function (event) {
                        let title = this.#editTodoForm.elements.title.value?.trim();
                        if (title) {
                            let updatedTodo = new Todo(title, this.#editTodoForm.elements.description.value,
                                this.#priorityList.dataset.priority, this.#editTodoForm.elements.date.valueAsDate)
                            
                                this.#todoController.updateTodo(listItem.dataset.id, updatedTodo);
                            
                        }

                        this.#hideEditTodoForm();
                        event.preventDefault();
                        event.stopPropagation();

                    }.bind(this);

                    listItem.style.display = "none"
                    listItem.after(this.#editTodoFormContainer);
                    this.#showEditTodoForm();

                }
            }
        }
    }
    /**
     * Add a new todo
     * 
     */
    #addTodo() {

        this.#handlePriorityClick();

        this.#editTodoForm.elements.submit.onclick = function (event) {
            let title = this.#editTodoForm.elements.title.value?.trim();
            if (title) {
                this.#todoController.addTodo(new Todo(title, this.#editTodoForm.elements.description.value,
                    this.#priorityList.dataset.priority, this.#editTodoForm.elements.date.valueAsDate));
            }

            this.#hideEditTodoForm();
            event.preventDefault();
            event.stopPropagation();

        }.bind(this);



        this.#editTodoForm.elements.cancel.onclick = function (event) {
            this.#hideEditTodoForm();
            event.stopPropagation();
        }.bind(this);

        this.#showEditTodoForm();

    }


    /**
     * get the priority that the user clicked on and use setPriority closure to set the priority in the caller
     * @param {Function} setPriority 
     */
    #handlePriorityClick() {
        // Get the priorities list
        let priorityList = this.#priorityList;
        // Get the priorities list elements as an array
        let priorities = Array.from(priorityList.children);
        // When the user click on a priority it will change color for it and remove color for the other two priorities
        priorityList.onclick = function (event) {
            let priority = event.target.closest("li");
            // Return if the user didn't click on a priority or this priority already marked as chosen
            if (!priority || priority.classList.contains("chosen"))
                return;

            let targetIndex = priorities.indexOf(priority);
            priority.classList.add("chosen");
            priorities[(targetIndex + 1) % 3].classList.remove("chosen");
            priorities[(targetIndex + 2) % 3].classList.remove("chosen");
            priorityList.dataset.priority = priority.firstChild.firstChild.nodeValue;


        }

    }


    // TODO this method is good. Test it When the time is right.
    #populateTodos(todos) {
        //  for (let todo of todos){
        //      this.#todos.append(this.#createTodoListItem(todo));
        //  }    
    }


    onCurrentProjectChanged(data) {
        if (data instanceof TodoProject && this.#projectsQueue.length > 0) {
            this.#currentProject.classList.remove("current-project");
            this.#currentProject = this.#projectsQueue.splice(0, 1)[0];
            this.#currentProject.classList.add("current-project");
            this.#projectContent.querySelector("h3").innerHTML = data.name;
            this.#toggleAddTodoDisplay(this.#todoModel.isTodayCurrentProject());


            //TODO update todos for the current project
        }
    }

    onClickChangeCurrentProject(event) {
        let project = this.#getContainingListItem(event.target);
        if (project && this.#currentProject !== project) {
            this.#projectsQueue.push(project);
            this.#todoController.changeCurrentProject(project.querySelector("button").innerText);
        }
    }

    #getContainingListItem(element) {
        return element.closest("li");
    }

    #addListeners() {
        document.addEventListener("click", this.#onDocumentClick.bind(this))
        this.#addProjectBtn.addEventListener("click", this.onClickAddProject.bind(this));
        this.#projects.addEventListener("click", this.onClickChangeCurrentProject.bind(this));
        this.#todos.addEventListener("click", this.onTodosClick.bind(this));

    }
    #onDocumentClick(event) {
        let nav = event.target.closest(".nav-projects");
        if (nav) {
            this.#hideEditTodoForm();
        }
    }

    #showEditTodoForm() {
        this.#editTodoFormContainer.style.display = "block";
        this.#addTodoListItem.style.display = "none";
    }

    #hideEditTodoForm() {
        this.#editTodoFormContainer.style.display = "none";

        this.#editTodoForm.reset();
        this.#editTodoForm.dataset.priority = this.#todoModel.getDefaultPriority();
        for (let priority of this.#editTodoForm.querySelector(".edit-todo-priorities-list").children) {
            priority.classList.remove("chosen");
        }

        if (!this.#todoModel.isTodayCurrentProject()) {
            this.#addTodoListItem.style.display = "block";
        }
    }



    onProjectAdded(data) {
        if (data instanceof TodoProject) {
            let li = document.createElement("li");
            let button = document.createElement("button");
            button.append(data.name);
            li.append(button);
            this.#customProjects.prepend(li);
        }

    }
    onProjectRemoved(data) {
        console.log(data);
    }
    onProjectSorted(data) {
        console.log(data);
    }


    onTodoUpdated(data) {
        console.log(data);
    }
    onTodoChecked(data) {
        console.log(data);
    }
    onCheckedTodosRemoved(data) {
        console.log(data);
    }


    /* on clicks */

    onClickAddProject() {

        let form = document.querySelector(".one-input-project-form");
        let formContainer = this.#attachFormContainer(form, "Add New Project", "form-container");
        let modalCover = this.#createModalCover();


        // Get the project name from the form.
        // Let controller handle logic given the name of the project.
        // Quit the form and hide the modal cover.
        form.onsubmit = function () {
            let value = form.elements.text.value;
            if (value) {
                this.#todoController.addProject(value);
            }
            this.#hideModalForm(modalCover, form, formContainer);
            return false;
        }.bind(this);

        form.cancel.onclick = function () {
            this.#hideModalForm(modalCover, form, formContainer);
            return false;
        }.bind(this);

        this.#showModalForm(modalCover, form);


    }

    #attachFormContainer(form, formSubject, containerClass) {
        let formContainer = document.createElement("div");
        formContainer.classList.add(containerClass);

        form.before(formContainer);
        formContainer.innerHTML = `<span>${formSubject}</span>`;
        formContainer.append(form);

        return formContainer;
    }

    #createModalCover() {
        let modalCover = document.createElement("div");
        modalCover.classList.add("modal-cover");
        return modalCover;
    }

    #hideModalForm(modalCover, form, formContainer) {
        // Remove the form container from the DOM and replace it with the form
        formContainer.replaceWith(form);
        // Hide the form
        form.style.display = "none";
        // Remove the modal cover from the DOM and allow scrolling the body
        modalCover.remove();
        document.body.overflowY = "";
    }

    #showModalForm(modalCover, form) {
        this.#handleFocusTrap(modalCover, form);
        // Add the modal cover to the DOM 
        document.body.append(modalCover);
        // don't allow scrolling the body
        document.body.style.overflowY = "hidden";

        // Show the form 
        form.style.display = "block";
        form.elements.text.value = "";
        form.elements.text.focus();
    }
    /**
     * Make sure that when inside the form, the natural flow of passing between elements will accur
     * but when we're on the first form element and we try to go to the previous element using shift+tab
     * then we will actually go to the lsat element of the form. 
     * Also, handle the symmetric case.
     * @param {HTMLDivEelement} modalCover 
     * @param {HTMLFormElement} form 
     */
    #handleFocusTrap(modalCover, form) {
        let firstElement = form.elements[0];
        let lastElement = form.elements[form.elements.length - 1];

        lastElement.onkeydown = function (e) {
            if (e.key == 'Tab' && !e.shiftKey) {
                firstElement.focus();
                return false;
            }
        };

        firstElement.onkeydown = function (e) {
            if (e.key == 'Tab' && e.shiftKey) {
                lastElement.focus();
                return false;
            }
        };
        // When a click outside the form accurs, the form will not loose focus
        modalCover.onclick = function () { firstElement.focus() }

    }

    /**
     * Substribe to all of the topics.
     */
    #subscribeAll() {
        // for each topic subscribe with a function who's name is the topic name with a capital first letter
        // prepended with "on"
        // for example if topic == "projectAdded" then onTopic == "onProjectAdded"
        for (let topic in TOPICS) {
            let first = topic.charAt(0).toUpperCase();
            let onTopic = `on${first}${topic.substring(1)}`;
            this.subscribe(TOPICS[topic], this[onTopic].bind(this));
        }
    }

    subscribe(topic, callback) {
        pubsub.subscribe(topic, callback);
    }

    unsubscribe(topic, callback) {
        pubsub.unsubscribe(topic, callback);
    }

    clickRemoveProject(name) {
        this.#todoController.removeProject(name);
    }




    clickCheckTodo(id) {
        this.#todoController.checkTodo(id);
    }

    clickSortProject(sortName) {
        this.#todoController.sortProject(sortName);
    }

    clickMoveTodoToProject(todoId, projectName) {
        this.#todoController.moveTodoToProject(todoId, projectName);
    }

    clickRemoveCheckedTodos() {
        this.#todoController.removeCheckedTodos();
    }




}
