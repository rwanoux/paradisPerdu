import {
    rollCF
} from "./rollCF.js";



export async function reroll(event, chatMessage, html, messageData) {

    let succes = html.find("span.resultat")[html.find("span.resultat").length - 1];

    let targetDie = event.currentTarget;
    let newDie = targetDie.cloneNode();


    let nbrRelance = html.find("span.nbrRelance")[html.find("span.nbrRelance").length - 1];

    if (parseInt(nbrRelance.innerText) > 0) {
        targetDie.classList.add(`rerolled`);
        targetDie.classList.remove(`rerollable`);

        let r = new Roll('1d6x6cs>3');
        await r.evaluate({ async: true });

        for (let d of r.terms[0].results) {
            console.log(r);
            if (parseInt(targetDie.innerText) > 3) {
                succes.innerText = parseInt(succes.innerText) - 1;
            }
            newDie.classList.forEach(cl => {
                if (cl.indexOf('dice') > -1) { newDie.classList.remove(cl); }
            });

            let reroll = d.result;
            newDie.innerText = reroll;
            newDie.classList.add(`dice${reroll}`);

            event.currentTarget.parentNode.append(newDie);
            if (reroll > 3) {
                succes.innerText = parseInt(succes.innerText) + 1;
            }
        }
        nbrRelance.innerText = parseInt(nbrRelance.innerText) - 1;
        let contentHTML = targetDie.closest('div.message-content').innerHTML;

        let chatData = {
            content: contentHTML
        };
        if (game.dice3d) {
            game.dice3d.showForRoll(r).then(
                chatMessage.update(chatData)
            );
        } else {
            chatMessage.update(chatData);
        }

        /*
        r.toMessage(chatData).then(
            chatMessage.delete()
        );

*/
    } else {
        ui.notifications.warn("Vous n'avez plus de relances disponible");
    }

}