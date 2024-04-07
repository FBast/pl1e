import {Pl1eResting} from "../apps/resting.mjs";
import {PL1E} from "../pl1e.mjs";
import {Pl1eHelpers} from "./helpers.mjs";

export class Pl1eMacro {

    /**
    * Trigger an item to roll when a macro.mjs is clicked.
    * @param {string} itemName                Name of the item on the selected actor to trigger.
    * @returns {Promise<ChatMessage|object>}  Roll result.
    */
    static rollItem(itemName) {
        return this.getTarget(itemName, "Item")?.use();
    }

    /**
    * Toggle an effect on and off when a macro.mjs is clicked.
    * @param {string} effectLabel       Label for the effect to be toggled.
    * @returns {Promise<ActiveEffect>}  The effect after it has been toggled.
    */
    static toggleEffect(effectLabel) {
        const effect = this.getTarget(effectLabel, "ActiveEffect");
        return effect?.update({disabled: !effect.disabled});
    }

    /**
     * Activate an item when a macro is clicked
     * @param {string} itemName
     * @returns {Promise<boolean>}
     */
    static async activateItem(itemName) {
        const target = this.getTarget(itemName, "Item");
        if (target) await target.activate();
    }

    static async deleteAllDynamicMacros() {
        // Retrieve all macros in the game
        const allMacros = game.macros.contents;

        // Filter to only include macros marked as dynamic
        const dynamicMacros = allMacros.filter(macro => macro.getFlag('pl1e', 'isDynamic'));

        // Delete each dynamic macro found
        for (let macro of dynamicMacros) {
            await macro.delete();
        }
    }

    /**
     * Generate macros for items for a given token based on a filtering function,
     * ignoring items with commands already in the hotbar.
     * Items are sorted by level and then by name.
     * @param {Token} token - The token for which to generate item macros
     * @return {Promise<void>}
     */
    static async generateTokenMacros(token) {
        let slot = 1; // Start assigning macros from slot 1

        // Filter items based on the provided filter function
        let abilities = token.actor.items.filter(item => item.type === "ability"
            && item.system.attributes.activation !== "passive" && item.isEnabled);

        // Process and categorize items
        let filteredAbilities = [];
        const sourceIdFlags = [];
        for (const ability of abilities) {
            if (sourceIdFlags.includes(ability.sourceId)) continue;
            filteredAbilities.push(ability);
            sourceIdFlags.push(ability.sourceId);
        }

        // Group all items into a documents object
        let documents = {
            abilities: filteredAbilities,
        };

        // Sort each type of item
        abilities = Pl1eHelpers.sortDocuments(documents).abilities;

        for (let item of abilities) {
            // Create dropData structure for each filtered item
            const dropData = {
                type: "Item",
                data: item,
                id: item.id
            };

            // Proceed to create and assign the macro for this item
            await Pl1eMacro.createMacro(dropData, slot, {
                "pl1e.isDynamic": true
            });

            // Increment slot for the next item/macro, consider logic for slot management here
            slot++;
        }

        // Clear other slots
        for (let i = slot; i <= 50; i++) {
            await game.user.assignHotbarMacro(null, i);
        }
    }

    /**
     * Attempt to create a macro.mjs from the dropped data. Will use an existing macro.mjs if one exists.
     * @param {object} dropData     The dropped data
     * @param {number} slot         The hotbar slot to use
     * @param flags
     */
    static async createMacro(dropData, slot, flags = {}) {
        const macroData = {type: "script", scope: "actor"};
        if (dropData.type !== "Item") return;
        const itemData = await Item.implementation.fromDropData(dropData);
        if (!itemData) return ui.notifications.info(game.i18n.localize("PL1E.Unowned"));
        foundry.utils.mergeObject(macroData, {
            name: itemData.name,
            img: itemData.img,
            command: `game.pl1e.Pl1eMacro.activateItem("${itemData.name}")`,
            flags: flags
        });

        // Assign the macro.mjs to the hotbar
        const macro = game.macros.find(m => (m.name === macroData.name) && (m.command === macroData.command)
            && m.author === game.user) || await Macro.create(macroData);
        await game.user.assignHotbarMacro(macro, slot);
    }

    /**
     * Find a document of the specified name and type on an assigned or selected actor.
     * @param {string} name          Document name to locate.
     * @param {string} documentType  Type of embedded document (e.g. "Item" or "ActiveEffect").
     * @returns {Pl1eItem}           Document if found, otherwise nothing.
     */
    static getTarget(name, documentType) {
        let actor;
        const speaker = ChatMessage.getSpeaker();
        if ( speaker.token ) actor = game.actors.tokens[speaker.token];
        actor ??= game.actors.get(speaker.actor);
        if ( !actor ) {
            ui.notifications.info(game.i18n.localize("PL1E.NoActorSelected"));
            return null;
        }

        const collection = (documentType === "Item") ? actor.items : actor.effects;
        const nameKeyPath = (documentType === "Item") ? "name" : "label";

        // Find item in collection
        const documents = collection.filter(i => foundry.utils.getProperty(i, nameKeyPath) === name);
        const type = game.i18n.localize(`DOCUMENT.${documentType}`);
        if ( documents.length === 0 ) {
            ui.notifications.info(game.i18n.format("PL1E.NoItemFound", { actor: actor.name, type, name }));
            return null;
        }
        return documents[0];
    }

    /**
     * Display the sleeping window for the actor
     */
    static displayRestWindow(actor) {
        const app = new Pl1eResting(actor, {
            title: `${game.i18n.localize("PL1E.Rest")} : ${actor.name}`
        });
        app.render(true);
    }

}