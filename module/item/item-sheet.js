import { systemConfig } from "../config/config.js";

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class paradisPerduItemSheet extends ItemSheet {


    constructor(...args) {
        super(...args);

        switch (this.object.data.type) {


            case "spécialité":

                this.options.height = this.position.height = 450;
                this.options.height = this.position.height = 220;
                break;


            default:
                this.options.width = this.position.width = 550;
                this.options.height = this.position.height = 430;
        }

    }

    /** @override */
    get template() {
        const path = "systems/paradisPerdu/templates/item";
        // Return a single sheet for all item types.
        // return `${path}/item-sheet.html`;

        // Alternatively, you could use the following return statement to do a
        // unique item sheet by type, like `weapon-sheet.html`.
        return `${path}/item-${this.item.data.type}-sheet.html`;
    }

    /* -------------------------------------------- */

    /** @override */
    getData() {
        const data = super.getData();
        data.config = systemConfig;
        return data;
    }

    /* -------------------------------------------- */

    /** @override */
    setPosition(options = {}) {
        const position = super.setPosition(options);
        const sheetBody = this.element.find(".sheet-body");
        const bodyHeight = position.height - 192;
        sheetBody.css("height", bodyHeight);
        return position;
    }

    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) return;

        // Roll handlers, click handlers, etc. would go here.
        if (this.item.type === "spécialité") {
            let select = html.find("select");
            let apt = systemConfig.aptitude;
            select.selectedIndex = apt.indexOf(select.value);
        }


    }
}