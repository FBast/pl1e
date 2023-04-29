/**
 * Extends the actor to process special things from PL1E.
 */
export class Pl1eHelpers {

    /**
     * Return true is a GM is connected
     * @returns {boolean}
     */
    static isGMConnected() {
        let isGMConnected = false;
        for (let user of game.users) {
            if (user.role === 4 && user.active) { // 4 is the role ID for GM
                isGMConnected = true;
                break;
            }
        }
        return isGMConnected;
    }

    /**
     * Simple object check.
     * @param item
     * @returns {boolean}
     */
    static isObject(item) {
        return (item && typeof item === 'object' && !Array.isArray(item));
    }

    /**
     * Deep merge two objects.
     * @param target
     * @param sources
     */
    static mergeDeep(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();
        if (this.isObject(target) && this.isObject(source)) {
            for (const key in source) {
                if (this.isObject(source[key])) {
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    this.mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }
        return this.mergeDeep(target, ...sources);
    }

    /**
     * Reset all clones using their sourceUuid
     * @param {Item} originalItem
     * @returns {Promise<void>}
     */
    static async resetClones(originalItem) {
        for (const actor of game.actors) {
            let updateDocument = false;
            const itemsData = [];
            for (let item of actor.items) {
                if (!item.getFlag("core", "sourceUuid") || item.getFlag("core", "sourceUuid") !== originalItem.uuid) continue
                if (['feature', 'ability', 'weapon', 'wearable', 'consumable', 'common'].includes(item.type)) {
                    itemsData.push({
                        "_id": item._id,
                        "name": originalItem.name,
                        "img": originalItem.img,
                        "system.price": originalItem.system.price,
                        "system.description": originalItem.system.description,
                        "system.attributes": originalItem.system.attributes,
                        "system.passiveAspects": originalItem.system.passiveAspects,
                        "system.activeAspects": originalItem.system.activeAspects,
                        "system.refItems": originalItem.system.refItems
                    });
                    updateDocument = true;
                }
                else {
                    console.warn("Unknown type : " + item.type);
                }
            }
            if (updateDocument) {
                await actor.updateEmbeddedDocuments("Item", itemsData);
            }
        }
        // Render all visible sheets
        const sheets = Object.values(ui.windows).filter(sheet => sheet.rendered);
        sheets.forEach(sheet => sheet.render(true));
    }

    /**
     * Convert a value to money with gold, silver and copper
     * @param value the units sum
     * @returns {{gold: number, copper: number, silver: number}}
     */
    static unitsToMoney(value) {
        let money = {
            "gold": 0,
            "silver": 0,
            "copper": 0
        };
        money['gold'] = Math.floor(value / 100);
        value -= money['gold'] * 100
        money['silver'] = Math.floor(value / 10);
        value -= money['silver'] * 10;
        money['copper'] = value;
        return money;
    }

    /**
     * Convert money to value
     * @param money gold, silver and copper
     * @returns number
     */
    static moneyToUnits(money) {
        return money.gold * 100 + money.silver * 10 + money.copper;
    }

    static deepen(obj) {
        const result = {};

        // For each object path (property key) in the object
        for (const objectPath in obj) {
            // Split path into component parts
            const parts = objectPath.split('.');

            // Create sub-objects along path as needed
            let target = result;
            while (parts.length > 1) {
                const part = parts.shift();
                target = target[part] = target[part] || {};
            }

            // Set value at end of path
            target[parts[0]] = obj[objectPath]
        }

        return result;
    }

    static rankCost(rank) {
        return ((rank * (rank + 1) / 2) - 1);
    }

    /**
     * Center of the screen
     * @returns {{x: number, y: number}}
     */
    static screenCenter() {
        // const canvas = document.getElementById("board");
        return {
            x: window.innerWidth / 4,
            y: window.innerHeight / 4
        }
    }

}
