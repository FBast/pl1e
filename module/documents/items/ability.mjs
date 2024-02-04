import {Pl1eItem} from "./item.mjs";
import {Pl1eHelpers} from "../../helpers/helpers.mjs";

export class Pl1eAbility extends Pl1eItem {

    /** @inheritDoc */
    async _preActivate(characterData) {
        // Get linked attributes
        return await this._linkItem(characterData);
    }

    /** @inheritDoc */
    async _postActivate(characterData) {
        // If a linked item has no usage limit then reset it's removedUses
        if (characterData.linkedItem && characterData.linkedItem.system.attributes.uses === 0) {
            await characterData.linkedItem.update({
                "system.removedUses": 0
            })
        }
    }

    /** @inheritDoc */
    _canActivate(characterData) {
        if (!super._canActivate(characterData)) return false;
        const itemAttributes = characterData.attributes;

        if (this._getLinkableItems(characterData).length === 0) {
            ui.notifications.info(game.i18n.localize("PL1E.NoLinkedItemMatch"));
            return false;
        }
        if (itemAttributes.healthCost > characterData.actor.system.resources.health.value) {
            ui.notifications.info(game.i18n.localize("PL1E.NotEnoughHealth"));
            return false;
        }
        if (itemAttributes.staminaCost > characterData.actor.system.resources.stamina.value) {
            ui.notifications.info(game.i18n.localize("PL1E.NotEnoughStamina"));
            return false;
        }
        if (itemAttributes.manaCost > characterData.actor.system.resources.mana.value) {
            ui.notifications.info(game.i18n.localize("PL1E.NotEnoughMana"));
            return false;
        }
        return true;
    }

    /**
     * Add item attributes and dynamic attributes if ability link defined
     * @return {Promise<boolean>}
     * @private
     */
    async _linkItem(characterData) {
        // Get weapons using the same mastery
        const relatedItems = this._getLinkableItems(characterData);
        if (relatedItems.length === 0) {
            return true;
        }
        else if (relatedItems.length === 1) {
            characterData.linkedItem = relatedItems[0];
            characterData.linkedItemId = relatedItems[0].id;
        }
        else {
            characterData.linkedItem = await this._itemsDialog(relatedItems);
            if (characterData.linkedItem === null) return false;
        }

        // Assuming characterData is already defined
        const attributes = characterData.attributes;
        const linkedItemAttributes = characterData.linkedItem.system.attributes;

        switch (attributes.weaponMode) {
            case "melee":
                Pl1eHelpers.assignIfDefined(linkedItemAttributes, attributes, attributes.useParentRange, 'reach', 'range');
                Pl1eHelpers.assignIfDefined(linkedItemAttributes, attributes, attributes.useParentRoll, 'meleeRoll', 'roll');
                Pl1eHelpers.assignIfDefined(linkedItemAttributes, attributes, attributes.useParentOppositeRoll, 'meleeOppositeRoll', 'oppositeRoll');
                Pl1eHelpers.assignIfDefined(linkedItemAttributes, attributes, attributes.useParentActivationMacro, 'meleeActivationMacro', 'activationMacro');
                Pl1eHelpers.assignIfDefined(linkedItemAttributes, attributes, attributes.useParentPreLaunchMacro, 'meleePreLaunchMacro', 'preLaunchMacro');
                Pl1eHelpers.assignIfDefined(linkedItemAttributes, attributes, attributes.useParentPostLaunchMacro, 'meleePostLaunchMacro', 'postLaunchMacro');
                break;
            case "range":
                Pl1eHelpers.assignIfDefined(linkedItemAttributes, attributes, attributes.useParentRange, 'range');
                Pl1eHelpers.assignIfDefined(linkedItemAttributes, attributes, attributes.useParentRoll, 'rangeRoll', 'roll');
                Pl1eHelpers.assignIfDefined(linkedItemAttributes, attributes, attributes.useParentOppositeRoll, 'rangeOppositeRoll', 'oppositeRoll');
                Pl1eHelpers.assignIfDefined(linkedItemAttributes, attributes, attributes.useParentActivationMacro, 'rangeActivationMacro', 'activationMacro');
                Pl1eHelpers.assignIfDefined(linkedItemAttributes, attributes, attributes.useParentPreLaunchMacro, 'rangePreLaunchMacro', 'preLaunchMacro');
                Pl1eHelpers.assignIfDefined(linkedItemAttributes, attributes, attributes.useParentPostLaunchMacro, 'rangePostLaunchMacro', 'postLaunchMacro');
                break;
            case "magic":
                Pl1eHelpers.assignIfDefined(linkedItemAttributes, attributes, attributes.useParentRoll, 'magicRoll', 'roll');
                Pl1eHelpers.assignIfDefined(linkedItemAttributes, attributes, attributes.useParentOppositeRoll, 'magicOppositeRoll', 'oppositeRoll');
                Pl1eHelpers.assignIfDefined(linkedItemAttributes, attributes, attributes.useParentActivationMacro, 'magicActivationMacro', 'activationMacro');
                Pl1eHelpers.assignIfDefined(linkedItemAttributes, attributes, attributes.useParentPreLaunchMacro, 'magicPreLaunchMacro', 'preLaunchMacro');
                Pl1eHelpers.assignIfDefined(linkedItemAttributes, attributes, attributes.useParentPostLaunchMacro, 'magicPostLaunchMacro', 'postLaunchMacro');
                break;
        }

        // Use the parent active aspects when launching the ability
        if (attributes.launchParentActiveAspects) {
            Pl1eHelpers.mergeDeep(characterData.activeAspects, await characterData.linkedItem.getCombinedActiveAspects());
        }
        return true;
    }

    /**
     * @param items
     * @return {Pl1eItem}
     * @private
     */
    _itemsDialog(items) {
        // Generate the HTML for the buttons dynamically based on the item data
        let buttonsHTML = "";
        for (const key in items) {
            const item = items[key];
            const imageSrc = item.img; // Replace with your item image source getter
            const altText = `Button ${key}`;
            buttonsHTML += `<button style="width: 100px; height: 100px; margin-right: 10px;" data-action="${key}">
                    <img style="width: 100%; height: 100%;" src="${imageSrc}" alt="${altText}">
                </button>`;
        }

        return new Promise((resolve) => {
            const dialog = new Dialog({
                title: `${this.name} : ${game.i18n.localize("PL1E.SelectAnItem")}`,
                content: `<div style="display: flex;">${buttonsHTML}</div>`,
                buttons: {},
                close: (html) => resolve(null),
                render: (html) => {
                    html.find("button[data-action]").on("click", (event) => {
                        const button = event.currentTarget;
                        const action = button.dataset.action;
                        resolve(items[Number(action)]);
                        dialog.close();
                    });
                },
                default: "",
                closeOnSubmit: false,
                submitOnClose: false,
                jQuery: false,
                resizable: false
            }).render(true);
        });
    }

    /**
     * Return the linkable items for this ability
     * @param {CharacterData} characterData
     * @returns {Pl1eItem[]}
     */
    _getLinkableItems(characterData) {
        const relatedItems = [];
        for (/** @type {Pl1eItem} **/ const item of characterData.actor.items) {
            // Only same source id item provide a valid linkable item
            if (item.sourceId !== characterData.item.sourceId) continue;
            const parentItem = item.linkableParentItem;
            // If no parent found then check next sharing source id item
            if (!parentItem) continue;
            // Extra conditions
            if (characterData.attributes.isMajorAction && parentItem.system.majorActionUsed) continue;
            // Weapon mode is melee but parent does not use melee
            if (characterData.attributes.weaponMode === "melee" && parentItem.system.attributes.meleeUse !== undefined
                && !parentItem.system.attributes.meleeUse) continue;
            // Weapon mode is range but parent does not use ranged
            if (characterData.attributes.weaponMode === "range" && parentItem.system.attributes.rangedUse !== undefined
                && !parentItem.system.attributes.rangedUse) continue;
            // Weapon mode is magic but parent does not use magic
            if (characterData.attributes.weaponMode === "magic" && parentItem.system.attributes.magicUse !== undefined
                && !parentItem.system.attributes.magicUse) continue;
            // Parent usages are not enough
            if (parentItem.system.attributes.uses !== undefined && parentItem.system.attributes.uses > 0 && parentItem.system.removedUses !== undefined
                && characterData.attributes.usageCost >= parentItem.system.attributes.uses - parentItem.system.removedUses) continue;
            // The parent is a valid linkable item
            relatedItems.push(parentItem);
        }
        return relatedItems;
    }

}