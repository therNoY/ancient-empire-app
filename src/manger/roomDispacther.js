import store from "../store";
import eventBus from "../manger/EventBus"

var roomDispatcher = {
  dispath(event) {
    console.log("分发处理房间事件", event);
    if (event.send_message) {
      eventBus.publish("roomMessage", event.send_message)
    } else if (event.message){
      eventBus.publish("roomMessage", event.message)
    }

    if (event.room_commend == 'ARMY_CHANGE') {
      eventBus.publish("roomChangeArmy", event)
    } else if (event.room_commend == 'CHANG_ROOM_OWNER') {
      eventBus.publish("changeRoomOwner", event)
    } else if (event.room_commend == 'START_GAME') {
      eventBus.publish("startGame", event)
    }
  }
}

export default roomDispatcher;
