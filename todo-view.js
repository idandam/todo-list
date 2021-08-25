import AbstractSubscriber from "./abstract-subscriber.js"
import pubsub from "./pubsub.js"
import TodoProject from "./todo-project.js"
import Todo from "./todo.js"
import { TOPICS } from "./utils.js"

export default class TodoView extends AbstractSubscriber {
    #todoModel
    #todoController

    #customProjects
    #addProjectBtn


    constructor(controller, model) {
        super();
        this.#todoController = controller;
        this.#todoModel = model;
        this.#subscribeAll();
        this.createView();

    }

    createView() {

        this.#customProjects = document.querySelector(".custom-projects");
        this.#addProjectBtn = document.querySelector(".add-project-btn")
        this.#addProjectBtn.addEventListener("click", this.onClickAddProject.bind(this));

    }



    onProjectAdded(data) {
        if (data instanceof TodoProject) {
            let button = document.createElement("button");
            button.append(data.name);
            this.#customProjects.prepend(button);
        }

    }
    onProjectRemoved(data) {
        console.log(data);
    }
    onProjectSorted(data) {
        console.log(data);
    }
    onTodoAdded(data) {
        console.log(data);
    }
    onTodoRemoved(data) {
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
    onCurrentProjectChanged(data) {
        console.log(data);
    }

    /* on clicks*/

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
        this.#handleFocusTrap(modalCover,form);
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
    #handleFocusTrap(modalCover, form){
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
        modalCover.onclick = function(){firstElement.focus()}

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

    clickAddTodo(title, priority, date) {
        this.#todoController.addTodo(new Todo(title, priority, date));

    }
    clickRemoveTodo(id) {
        this.#todoController.removeTodo(id);
    }

    clickChangeCurrentProject(name) {
        this.#todoController.changeCurrentProject(name);
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
