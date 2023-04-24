import {Pl1eItem} from "./item.mjs";
import {Pl1eItemProxy} from "./itemProxy.mjs";
import {Pl1eHelpers} from "../helpers/helpers.mjs";

export class Pl1eActorItem extends Pl1eItem {

    /**
     * Augment the basic Item data model with additional dynamic data.
     */
    async prepareData() {
        // As with the actor class, subItems are documents that can have their data
        super.prepareData();

        // Prepare refItems
        if (this.system.refItemsUuid) {
            this.system.refItemsUuid = Object.values(this.system.refItemsUuid);
            this.system.refItems = Object.values(this.system.refItems);
            for (let i = 0; i < this.system.refItemsUuid.length; i++) {
                const uuid = this.system.refItemsUuid[i];
                const itemData = this.system.refItems[i];
                let originalItem = game.items.find(item => item.uuid === uuid);
                // Item does not exist then remove from the arrays
                if (!originalItem) {
                    this.system.refItems.splice(i, 1);
                    this.system.refItemsUuid.splice(i, 1);
                    await this.update({
                        "system.refItems": this.system.refItems,
                        "system.refItemsUuid": this.system.refItemsUuid
                    });
                    i--;
                }
                else {
                    const originalData = originalItem.toObject(false);
                    Pl1eHelpers.mergeDeep(originalData, itemData);
                    originalData._id = this.system.refItemsId[i];
                    originalData.system.sourceUuid = uuid;
                    originalItem = new Pl1eItemProxy(originalData);
                    this.system.refItems[i] = originalItem;
                }
            }
        }
    }

    /**
     * Prepare a data object which is passed to any Roll formulas which are created related to this Item
     * @private
     */
    getRollData() {
        // If present, return the actor's roll data.
        if (!this.actor) return null;
        const rollData = this.actor.getRollData();
        // Grab the item's system data as well.
        rollData.item = foundry.utils.deepClone(this.system);
        return rollData;
    }

    //region Item interactions

    /**
     * Roll the item
     */
    async roll() {
        const item = this;

        // Initialize chat data.
        const speaker = ChatMessage.getSpeaker({actor: this.actor});
        const rollMode = game.settings.get('core', 'rollMode');
        const label = `[${item.type}] ${item.name}`;

        // If there's no roll data, send a chat message.
        if (!this.system.formula) {
            ChatMessage.create({
                speaker: speaker,
                rollMode: rollMode,
                flavor: label,
                content: item.description ?? ''
            });
        }
        // Otherwise, create a roll and send a chat message from it.
        else {
            // Retrieve roll data.
            const rollData = this.getRollData();

            // Invoke the roll and submit it to chat.
            const roll = new Roll(rollData.item.formula, rollData);
            // If you need to store the value first, uncomment the next line.
            // let result = await roll.roll({async: true});
            roll.toMessage({
                speaker: speaker,
                rollMode: rollMode,
                flavor: label,
            });
            return roll;
        }
    }

    /**
     * Toggle the state of the item (could be necessary to be used)
     * @param options
     * @returns {Promise<void>}
     */
    async toggle(options) {
        throw new Error("PL1E | toggle method is not implemented");
    }

    /**
     * Use the item
     * @returns {Promise<void>}
     */
    async activate() {
        throw new Error("PL1E | use method is not implemented");
    }

    /**
     * Apply the item effect after usage
     * @returns {Promise<void>}
     */
    async apply(characterData, targetsData) {
        throw new Error("PL1E | apply method is not implemented");
    }

    /**+
     * Reload the item
     * @returns {Promise<void>}
     */
    async reload(options) {
        throw new Error("PL1E | reload method is not implemented");
    }

    //endregion

}