import {
    systemConfig
} from "../config/config.js";

export async function rollCF(actor, apt, relanceDispo, spe, dgt) {
    if (apt === "degats") {

        let aptiName = "dégats";
        let formula = `${dgt}d6x6cs>3`;

        let r = new Roll(formula, {
            apti: dgt
        });
        r.roll();

        let dicesResults = [];
        for (let res of r.terms[0].results) {
            dicesResults.push(res.result);
        }
        let aptiDice = r.terms[0].results.length;
        console.log(aptiDice);
        let result = parseInt(r.result);
        let rollConfig = {
            "aptiName": aptiName,
            "aptiDice": aptiDice,
            "result": result,
            "dicesResults": dicesResults,
            relanceDispo: relanceDispo
        };
        const rollResultTemplate = 'systems/paradisPerdu/templates/rolls/dgtCF-result.html';
        renderTemplate(rollResultTemplate, rollConfig).then(c => {

            r.toMessage({
                speaker: ChatMessage.getSpeaker({
                    actor: actor.name
                }),
                flags: {
                    paradisPerdu: "roll"
                },
                content: c,
            });

        })


    } else {


        //----------configs
        let diff = systemConfig.difficultes;
        let regCarac = /['  -]/;
        let apti = actor.data.data.aptitudes[apt.replace(regCarac, "")].label;
        let aptDice = actor.data.data.aptitudes[apt.replace(regCarac, "")].value;
        let ress = actor.data.data.compteurs.adrenaline.value;
        let newRess = ress;
        let formula = "(@apti)d6x6cs>3";
        const rollCFDialog = 'systems/paradisPerdu/templates/rolls/rollCF-dialog.html';
        const rollCFContent = await renderTemplate(rollCFDialog, {
            diff: diff,
            actor: actor,
            apti: apti,
            ress: ress,
            usedRess: 0
        });


        //----------le dialog pour la difficulté
        let aptiDialog = new Dialog({

            title: "jet d'aptitude ",
            content: rollCFContent,
            buttons: {
                one: {
                    label: "jeter les dés",
                    callback: (html) => roll(html, actor)
                },
                two: {
                    label: "fermer",
                }
            },
            default: "one",
            close: () => {}
        });
        aptiDialog.render(true);

        //--------------jet de dés ----------------
        //----------------------------------------
        async function roll(html, actor) {

            let diffRoll = html.find("#diff").val();
            let adrenaline = html.find("#adrenaline").val()
            let reussite = false;
            let echec = false;
            let reussiteT = false;
            let echecT = false;
            //lancé du jet
            let r = new Roll(formula, {
                apti: aptDice
            });
            await r.evaluate();

            //interprétation
            let nbDes = r.dice[0].results.length;
            let dicesResults = [];
            let relances = nbDes - parseInt(aptDice);
            let result = parseInt(r.result);

            if (result + adrenaline == diffRoll) {
                reussite = true;
            }
            if (result + adrenaline > diffRoll) {
                newRess++;
                reussiteT = true;
            }
            if (result + adrenaline < diffRoll) {
                echec = true;
            }
            if (result + adrenaline == 0) {
                echec = false;
                newRess--;
                echecT = true;
            }

            for (let res of r.terms[0].results) {
                dicesResults.push(res.result);
            }
            if (adrenaline) { newRess = newRess - adrenaline };
            if (newRess > 6) { newRess = 6 };

            let rollConfig = {
                adrenaline: adrenaline,
                spe: spe,
                dicesResults: dicesResults,
                actor: actor,
                aptiName: apti,
                aptiDice: aptDice,
                relances: relances,
                result: result,
                difficulte: diffRoll,
                reussite: reussite,
                echec: echec,
                reussiteT: reussiteT,
                echecT: echecT,
                relanceDispo: relanceDispo,
                newRess: newRess
            };



            await actor.update({
                "data.compteurs.adrenaline.value": newRess
            });

            //envoyer le resultat dans le chat
            const rollResultTemplate = 'systems/paradisPerdu/templates/rolls/rollCF-result.html';
            let content = await renderTemplate(rollResultTemplate, rollConfig);

            r.toMessage({
                speaker: ChatMessage.getSpeaker({
                    actor: actor.name
                }),
                flags: {
                    paradisPerdu: "roll"
                },
                content: content,
            });
        }
    }
}