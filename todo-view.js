import AbstractSubscriber from "./abstract-subscriber.js"
import pubsub from "./pubsub.js"
import TodoProject from "./todo-project.js"
import Todo from "./todo.js"
import { TOPICS } from "./utils.js"

export default class TodoView extends AbstractSubscriber {
    #todoModel
    #todoController


    constructor(controller, model) {
        super();
        this.#todoController = controller;
        this.#todoModel = model;
        this.#subscribeAll();

    }

    createView() {
        // TODO - create all UI components here

    }

    subscribe(topic, callback) {
        pubsub.subscribe(topic, callback);
    }

    unsubscribe(topic, callback) {
        pubsub.unsubscribe(topic, callback);
    }

    onProjectAdded(data) {
        console.log(data);

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
    onCurrentProjectChanged(data){
        console.log(data);
    }

    clickAddProject(name) {
        this.#todoController.addProject(name);
    }

    clickRemoveProject(name) {
        this.#todoController.removeProject(name);
    }

    clickAddTodo(project, title, priority, date){
        this.#todoController.addTodo(new Todo(project, title, priority, date), project);

    }
    clickRemoveTodo(id){
        this.#todoController.removeTodo(id);
    }

    clickChangeCurrentProject(name){
        this.#todoController.changeCurrentProject(name);
    }

    clickCheckTodo(id){
        this.#todoController.checkTodo(id);
    }

    clickSortProject(sortName){
        this.#todoController.sortProject(sortName);
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


}
