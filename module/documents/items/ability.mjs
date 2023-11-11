import {Pl1eItem} from "./item.mjs";
import {Pl1eHelpers} from "../../helpers/helpers.mjs";

export class Pl1eAbility extends Pl1eItem {

    /** @inheritDoc */
    async toggle(options) {
        if (!this.system.isMemorized && this.actor.system.general.slots - this.system.attributes.level < 0) return;

        await this.update({
            ["system.isMemorized"]: !this.system.isMemorized
        });

        await super.toggle(options);
    }

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

        if (itemAttributes.level > 0 && !this.system.isMemorized) {
            ui.notifications.warn(game.i18n.localize("PL1E.NotMemorized"));
            return false;
        }
        if (this._getLinkableItems(characterData).length === 0) {
            ui.notifications.warn(game.i18n.localize("PL1E.NoLinkedItemMatch"));
            return false;
        }
        if (itemAttributes.healthCost > characterData.actor.system.resources.health.value) {
            ui.notifications.warn(game.i18n.localize("PL1E.NotEnoughHealth"));
            return false;
        }
        if (itemAttributes.staminaCost > characterData.actor.system.resources.stamina.value) {
            ui.notifications.warn(game.i18n.localize("PL1E.NotEnoughStamina"));
            return false;
        }
        if (itemAttributes.manaCost > characterData.actor.system.resources.mana.value) {
            ui.notifications.warn(game.i18n.localize("PL1E.NotEnoughMana"));
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
        }
        else {
            characterData.linkedItem = await this._itemsDialog(relatedItems);
            if (characterData.linkedItem === null) return false;
        }

        // Override range attribute
        if (characterData.attributes.weaponMode === "melee") {
            if (characterData.attributes.useParentRange) characterData.attributes.range = characterData.linkedItem.system.attributes.reach;
            if (characterData.attributes.useParentRoll) characterData.attributes.roll = characterData.linkedItem.system.attributes.meleeRoll;
            if (characterData.attributes.useParentOppositeRoll) characterData.attributes.oppositeRoll = characterData.linkedItem.system.attributes.meleeOppositeRoll;
        }
        else if (characterData.attributes.weaponMode === "range") {
            if (characterData.attributes.useParentRange) characterData.attributes.range = characterData.linkedItem.system.attributes.range;
            if (characterData.attributes.useParentRoll) characterData.attributes.roll = characterData.linkedItem.system.attributes.rangeRoll;
            if (characterData.attributes.useParentOppositeRoll) characterData.attributes.oppositeRoll = characterData.linkedItem.system.attributes.rangeOppositeRoll;
        }

        // Use the parent active aspects when launching the ability
        if (characterData.attributes.launchParentActiveAspects) {
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
        for (const item of characterData.item.linkedParents) {
            if (!["weapon", "wearable"].includes(item.type)) continue;
            if (!item.isEnabled) continue;
            if (characterData.attributes.isMajorAction && item.system.majorActionUsed) continue;
            if (characterData.attributes.linkedItem === "melee" && item.system.attributes.reach === 0) continue;
            if (characterData.attributes.linkedItem === "range" && item.system.attributes.range === 0) continue;
            // Item usages are not enough
            if (characterData.attributes.usageCost > 0 && item.system.attributes.uses > 0 &&
                characterData.attributes.usageCost > item.system.attributes.uses - item.system.removedUses) continue;

            relatedItems.push(item);
        }
        return relatedItems;
    }

}