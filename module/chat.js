import { reroll } from './rolls/reroll.js'

export function addChatListeners(chatMessage, html, messageData) {
    html.on("click", ".rerollable", event => {
        event.preventDefault();
        onReroll(event, chatMessage, html, messageData);
    })

}

function onReroll(event, chatMessage, html, messageData) {
    if (chatMessage.isOwner || game.user.isGm) {
        reroll(event, chatMessage, html, messageData);
    } else { ui.notifications.warn("vous tentez de relancer pour un jet que vous n'avez pas fait !") }
}