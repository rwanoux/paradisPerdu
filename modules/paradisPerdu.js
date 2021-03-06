// Import Modules
import {
    reroll
} from "./rolls/reroll.js";
import {
    paradisPerduActor
} from "./actor/actor.js";
import {
    paradisPerduActorSheet
} from "./actor/actor-sheet.js";
import {
    paradisPerduItem
} from "./item/item.js";
import {
    paradisPerduItemSheet
} from "./item/item-sheet.js";
import {
    systemConfig
} from "./config/config.js";
import * as Chat from "./chat.js"
import { registerHelpers } from "./handlebarHelpers.js";
import { sheetResize } from "./sheetResize.js";
import { Map3d } from "./3DMap.js";



Hooks.once('init', async function() {

    CONFIG.debug.hooks = true;
    game.paradisPerdu = {
        paradisPerduActor,
        paradisPerduItem,
        rollItemMacro,
        systemConfig
    };

    /**
     * Set an initiative formula for the system
     * @type {String}
     */
    CONFIG.Combat.initiative = {
        formula: "",
        decimals: 2
    };

    // Define custom document classes
    CONFIG.Actor.documentClass = paradisPerduActor;
    CONFIG.Item.documentClass = paradisPerduItem;

    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("paradisPerdu", paradisPerduActorSheet, {
        makeDefault: true
    });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("paradisPerdu", paradisPerduItemSheet, {
        makeDefault: true
    });

    CONFIG.canvasTextStyle.fontFamily = "built";
    CONFIG.fontFamilies.push("built", "Ddin", "aileron");
    CONFIG.defaultFontFamily = "Ddin";


    registerHelpers();
    console.log('init done')
});
//----reroll button chat ---

Hooks.on("renderChatMessage", (chatMessage, html, messageData) => {
    Chat.addChatListeners(chatMessage, html, messageData)
});

Hooks.on("getSceneControlButtons", (controls) => {
    controls.push({
        name: "3d",
        title: "3d",
        icon: "fas fa-magic",
        layer: "tokens",
        visible: true,
        tools: [],
    });
});

Hooks.once("ready", async function() {
    var logo = document.getElementById("logo");
    logo.setAttribute("src", "/systems/paradisPerdu/img/paradisPerdu_titre.png");
    logo.style.maxWidth = "100px";
    sheetResize();
    /*
        //creating 3d container

        let container = document.createElement('div');
        container.id = 'container3d';
        document.body.append(container)

        const map3d = new Map3d(container);
        console.log(map3d);
        map3d.init();

        */
    // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
    Hooks.on("hotbarDrop", (bar, data, slot) => createparadisPerduMacro(data, slot));
    console.log(game.get)

});

Hooks.on("renderActorSheet", async function() {



})

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createparadisPerduMacro(data, slot) {
    if (data.type !== "Item") return;
    if (!("data" in data)) return ui.notifications.warn("You can only create macro buttons for owned Items");
    const item = data.data;

    // Create the macro command
    const command = `game.paradisPerdu.rollItemMacro("${item.name}");`;
    let macro = game.macros.entities.find(m => (m.name === item.name) && (m.command === command));
    if (!macro) {
        macro = await Macro.create({
            name: item.name,
            type: "script",
            img: item.img,
            command: command,
            flags: {
                "paradisPerdu.itemMacro": true
            }
        });
    }
    game.user.assignHotbarMacro(macro, slot);
    return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemName
 * @return {Promise}
 */
function rollItemMacro(itemName) {
    const speaker = ChatMessage.getSpeaker();
    let actor;
    if (speaker.token) actor = game.actors.tokens[speaker.token];
    if (!actor) actor = game.actors.get(speaker.actor);
    const item = actor ? actor.items.find(i => i.name === itemName) : null;
    if (!item) return ui.notifications.warn(`Your controlled Actor does not have an item named ${itemName}`);

    // Trigger the item roll
    return item.roll();
}