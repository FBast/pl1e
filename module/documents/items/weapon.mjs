import {Pl1eItem} from "../item.mjs";

export class Pl1eWeapon extends Pl1eItem {

    /** @override */
    async toggle(options) {
        const hands = this.system.attributes.hands.value;

        // Toggle item hands
        if (hands === 2) {
            await this.update({
                ["system.isEquippedMain"]: !foundry.utils.getProperty(this.item, "system.isEquippedMain"),
                ["system.isEquippedSecondary"]: !foundry.utils.getProperty(this.item, "system.isEquippedSecondary")
            });
        }
        else if (options.main) {
            // Switch hand case
            if (!this.system.isEquippedMain && this.system.isEquippedSecondary) {
                await this.update({["system.isEquippedSecondary"]: false});
            }
            await this.update({["system.isEquippedMain"]: !foundry.utils.getProperty(this.item, "system.isEquippedMain")})
        }
        else {
            // Switch hand case
            if (!this.system.isEquippedSecondary && this.system.isEquippedMain) {
                await this.update({["system.isEquippedMain"]: false});
            }
            await this.update({["system.isEquippedSecondary"]: !foundry.utils.getProperty(this.item, "system.isEquippedSecondary")});
        }
        // Unequip other refItems
        for (let otherItem of this.actor.items) {
            // Ignore if otherItem is not a weapon
            if (otherItem.type !== 'weapon') continue;
            // Ignore if otherItem is item
            if (otherItem === this.item) continue;
            // If other item is equipped on main and this item is equipped on main
            if (otherItem.system.isEquippedMain && this.system.isEquippedMain) {
                // If other item is equipped on two hands
                if (otherItem.system.attributes.hands.value === 2) {
                    await otherItem.update({
                        ["system.isEquippedMain"]: false,
                        ["system.isEquippedSecondary"]: false
                    });
                }
                // Else other item only equip main hand
                else {
                    await otherItem.update({
                        ["system.isEquippedMain"]: false
                    });
                }
            }
            // If other item is equipped on secondary and this item is equipped on secondary
            if (otherItem.system.isEquippedSecondary && this.system.isEquippedSecondary) {
                // If other item is equipped on two hands
                if (otherItem.system.attributes.hands.value === 2) {
                    await otherItem.update({
                        ["system.isEquippedMain"]: false,
                        ["system.isEquippedSecondary"]: false
                    });
                }
                // Else other item only equip secondary hand
                else {
                    await otherItem.update({
                        ["system.isEquippedSecondary"]: false
                    });
                }
            }
        }
        this.actor.sheet.render(false);
    }

}