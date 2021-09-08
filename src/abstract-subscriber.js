export default class AbstractSubscriber{
    subscribe(topic, callback){throw new Error("Abstract method");}
    unsubscribe(topic, callback){throw new Error("Abstract method");}
}