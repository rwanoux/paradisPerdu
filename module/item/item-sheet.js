import { systemConfig } from "../config/config.js";

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class paradisPerduItemSheet extends ItemSheet {




    /** @override */
    static get defaultOptions() {
        console.log(this)

        switch (this.object.data.type) {


            case "spécialité":
                return mergeObject(super.defaultOptions, {
                    classes: ["paradisPerdu", "sheet", "item"],
                    width: 430,
                    height: 200

                });
                break;
            case "arme":
                return mergeObject(super.defaultOptions, {
                    classes: ["paradisPerdu", "sheet", "item"],
                    width: 550,
                    height: 410

                });
                break;
            case "objet":
                return mergeObject(super.defaultOptions, {
                    classes: ["paradisPerdu", "sheet", "item"],
                    width: 550,
                    height: 410

                });
                break;
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