class PubSub {
    #topicMap;

    constructor() {
        this.#topicMap = new Map();
    }
    /**
     * Notify subscribers for data arrival for a specific topic 
     * @param {String} topic Topic name
     * @param {Object} data Relevant data for subscribers to use
     */
    publish(topic, data) {
        if (this.#topicMap.has(topic)) {
            this.#topicMap.get(topic).forEach(callback => {
                callback(data);
            });
            
        }
        else {
            this.addTopic(topic);
        }
    }
    /**
     * Subscribe to a specific topic 
     * @param {String} topic 
     * @param {Function} callback 
     */
    subscribe(topic, callback) {
        if (!this.#topicMap.has(topic)) {
            this.addTopic(topic);
        }
        this.#topicMap.get(topic).push(callback);
    }
    /**
     * Unsubscribe from a specific topic
     * @param {String} topic 
     * @param {Function} callback 
     */
    unsubscribe(topic, callback) {
        let callbacks = this.#topicMap.get(topic)?.filter((f) => f !== callback);
        if (callbacks) {
            this.#topicMap.set(topic, callbacks);
        }
    }
    /**
     * Add a new topic
     * @param {String} topic 
     */
    addTopic(topic) {
        // If you call this method from this class then you will have a double check for the topic's existence.
        // The check in this method is for the option to first add topic upront and then call the other methods.
        if (!this.#topicMap.has(topic)) {
            this.#topicMap.set(topic, []);

        }
    }
}


const pubsub = new PubSub();
export default pubsub;