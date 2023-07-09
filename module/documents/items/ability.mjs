import {Pl1eItem} from "../item.mjs";
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
        if (characterData.attributes.weaponLink !== "none") {
            if (!await this._linkItem(characterData)) return false;
        }
        return true;
    }

    /** @inheritDoc */
    _canActivate(characterData) {
        if (!super._canActivate(characterData)) return false;
        const itemAttributes = characterData.attributes;

        if (!this.system.isMemorized) {
            ui.notifications.warn(game.i18n.localize("PL1E.NotMemorized"));
            return false;
        }
        if (itemAttributes.weaponLink !== "none" && this._getLinkableItems(this.characterData).length === 0) {
            ui.notifications.warn(game.i18n.localize("PL1E.NoLinkedItemMatch"));
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
        if (relatedItems.length === 1) {
            characterData.linkedItem = relatedItems[0];
        }
        else {
            characterData.linkedItem = await this._itemsDialog(relatedItems);
            if (characterData.linkedItem === null) return false;
        }

        // Get linked attributes
        if (characterData.attributes.weaponLink !== "special") {
            characterData.attributes.areaShape = "target";
            characterData.attributes.rangeResolutionType = "value";
            characterData.attributes.areaNumber = 1;
        }
        if (characterData.attributes.weaponLink === "melee") {
            characterData.attributes.range = characterData.linkedItem.system.attributes.reach;
        } else if (characterData.attributes.weaponLink === "ranged") {
            characterData.attributes.range = characterData.linkedItem.system.attributes.range;
        }
        characterData.attributes.mastery = Pl1eHelpers.findFirstCommonElement(characterData.attributes.masters,
            characterData.linkedItem.system.attributes.masters)
        Pl1eHelpers.mergeDeep(characterData.activeAspects, characterData.linkedItem.system.activeAspects);

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
     * @returns {Pl1eItem[]}
     */
    _getLinkableItems(characterData) {
        const relatedItems = [];
        for (const item of characterData.actor.items) {
            if (item.type !== "weapon" && item.type !== "wearable") continue;
            if (!item.isEnabled) continue;
            if (characterData.attributes.isMajorAction && item.system.isMajorActionUsed) continue;
            if (characterData.attributes.weaponLink === "melee" && !item.system.attributes.melee) continue;
            if (characterData.attributes.weaponLink === "ranged" && !item.system.attributes.ranged) continue;
            if (!characterData.attributes.masters.some(mastery => item.system.attributes.masters.includes(mastery))) continue;
            relatedItems.push(item);
        }
        return relatedItems;
    }

}