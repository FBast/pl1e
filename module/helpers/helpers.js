import {Pl1eItem} from "../documents/item.mjs";

/**
 * Extends the actor to process special things from PL1E.
 */
export class HelpersPl1e {

    /**
     * Return the target object on a drag n drop event, or null if not found
     * @param {DragEvent} event
     * @return {Promise<null>}
     */
    static async getDragNDropTargetObject(event) {
        let data;
        try {
            data = JSON.parse(event.dataTransfer?.getData("text/plain"));
        } catch (err) {
            return null;
        }
        return await HelpersPl1e.getObjectGameOrPack(data);
    }

    /**
     * Return the object from Game or Pack by his ID, or null if not found
     * @param {string}      uuid     "Item.5qI6SU85VSFqji8W"
     * @param {string}      id       "5qI6SU85VSFqji8W"
     * @param {string}      type     Type ("Item", "JournalEntry"...)
     * @param {any[]|null}  data     Plain document data
     * @param {string|null} pack     Pack name
     * @param {string|null} parentId Used to avoid an infinite loop in properties if set
     * @return {Promise<null>}
     */
    static async getObjectGameOrPack({ uuid, id, type, data = null, pack = null, parentId = null }) {
        let document = null;

        try {
            // Direct Object
            if (data?._id) {
                document = HelpersPl1e.createDocumentFromCompendium({ type, data });
            } else if (!uuid && (!id || !type)) {
                return null;
            }

            // UUID
            if (!document && !!uuid) {
                document = await fromUuid(uuid);
            }
            // TODO need to migrate to UUID

            // Named pack
            if (!document) {
                // If no pack passed, but it's a core item, we know the pack to get it
                if (!pack && id.substring(0, 7) === "PLCore") {
                    pack = HelpersPl1e.getPackNameForCoreItem(id);
                }

                if (pack) {
                    const tmpData = await game.packs.get(pack).getDocument(id);
                    if (tmpData) {
                        document = HelpersPl1e.createDocumentFromCompendium({ type, data: tmpData });
                    }
                }
            }

            // Game object
            if (!document) {
                document = CONFIG[type].collection.instance.get(id);
            }

            // Unknown pack object, iterate all packs
            if (!document) {
                for (const comp of game.packs) {
                    const tmpData = await comp.getDocument(id);
                    if (tmpData) {
                        document = HelpersPl1e.createDocumentFromCompendium({ type, data: tmpData });
                    }
                }
            }

            // Final
            if (document) {
                // Flag the source GUID
                if (document.uuid && !document.pack && !document.getFlag("core", "sourceId")) {
                    document.updateSource({ "flags.core.sourceId": document.uuid });
                }

                // Care to infinite loop in properties
                if (!parentId) {
                    await HelpersPl1e.refreshItemProperties(document);
                }
                document.prepareData();
            }
        } catch (err) {
            console.warn("PL1E | ", err);
        }
        return document;
    }

    /**
     * Make a temporary item for compendium drag n drop
     * @param {string}          type
     * @param {Pl1eItem|JournalPl1e|any[]} data
     * @return {Pl1eItem}
     */
    static createDocumentFromCompendium({ type, data }) {
        let document = null;

        switch (type) {
            case "Item":
                if (data instanceof Pl1eItem) {
                    document = data;
                } else {
                    document = new Pl1eItem(data);
                }
                break;

            // case "JournalEntry":
            //     if (data instanceof game.l5r5e.JournalL5r5e) {
            //         document = data;
            //     } else {
            //         document = new game.l5r5e.JournalL5r5e(data);
            //     }
            //     break;

            default:
                console.log(`PL1E | createObjectFromCompendium - Unmanaged type ${type}`);
                break;
        } // swi

        return document;
    }

    /**
     * Babele and properties specific
     * @param {Document} document
     * @return {Promise<void>}
     */
    static async refreshItemProperties(document) {
        if (document.system?.properties && typeof Babele !== "undefined") {
            document.system.properties = await Promise.all(
                document.system.properties.map(async (property) => {
                    const gameProp = await HelpersPl1e.getObjectGameOrPack({
                        id: property.id,
                        type: "Item",
                        parentId: document._id || 1,
                    });
                    if (gameProp) {
                        return { id: gameProp.id, name: gameProp.name };
                    } else {
                        console.warn(`L5R5E | Unknown property id[${property.id}]`);
                    }
                    return property;
                })
            );
            document.updateSource({ "system.properties": document.system.properties });
        }
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
     * Reset all clones using their sourceId
     * @returns {Promise<void>}
     */
    static async resetClones(sourceId) {
        let updateCount = 0;
        let content = '';
        for (let [uuid, key] of Object.entries(game.documentIndex.uuids)) {
            for (let leaf of key.leaves) {
                let document = leaf.entry;

                // Resetting sub items
                if (document.system.subItemsMap !== undefined) {
                    for (let [key, subItem] of document.system.subItemsMap) {
                        if (subItem.getFlag('core', 'sourceId') === undefined) continue;
                        if (subItem.getFlag('core', 'sourceId').split('.')[1] !== sourceId) continue;
                        let original = await fromUuid(subItem.getFlag('core', 'sourceId'));
                        if (['feature', 'ability', 'weapon', 'wearable', 'consumable', 'common'].includes(subItem.type)) {
                            subItem.name = original.name;
                            subItem.img = original.img;
                            subItem.system.description = original.system.description;
                            subItem.system.attributes = original.system.attributes;
                            updateCount++;
                            content += subItem._id + '\n'
                        }
                    }
                    document.saveEmbedItems();
                }

                // Resetting item
                if (document.getFlag('core', 'sourceId') === undefined) continue;
                if (document.getFlag('core', 'sourceId').split('.')[1] !== sourceId) continue;
                let original = await fromUuid(document.getFlag('core', 'sourceId'));
                if (['feature', 'ability', 'weapon', 'wearable', 'consumable', 'common'].includes(document.type)) {
                    await document.update({
                        "name": original.name,
                        "img": original.img,
                        "system.description": original.system.description,
                        "system.attributes": original.system.attributes
                    })
                    updateCount++;
                    content += document._id + '\n'
                } else {
                    console.warn("Unknown type : " + document.type);
                }
            }
        }

        if (updateCount > 0) {
            await ChatMessage.create({
                rollMode: game.settings.get('core', 'rollMode'),
                flavor: game.i18n.localize("PL1E.ChatFlavorCloneReset"),
                content: content
            });
        }
    }

    /**
     * Reset this document (if sourceId is corresponding source)
     * @param document
     * @param sourceId
     * @returns {Promise<void>}
     */
    static async resetClone(document, sourceId) {
        if (document.getFlag('core', 'sourceId') === undefined) return;
        if (document.getFlag('core', 'sourceId').split('.')[1] !== sourceId) return;
        let original = await fromUuid(document.getFlag('core', 'sourceId'));
        if (['feature', 'ability', 'weapon', 'wearable', 'consumable', 'common'].includes(document.type)) {
            await ChatMessage.create({
                rollMode: game.settings.get('core', 'rollMode'),
                flavor: '[admin] Clone reset',
                content: 'Document ' + document._id + ' has been reset using ' + original._id + ' data'
            });
            await document.update({
                "name": original.name,
                "img": original.img,
                "system.description": original.system.description,
                "system.attributes": original.system.attributes
            })
        } else {
            console.warn("Unknown type : " + document.type);
        }
    }

    /**
     * Convert a value to currencies with gold, silver and copper
     * @param value the currencies sum
     * @returns {gold, silver, copper}
     */
    static valueToCurrencies(value) {
        let currencies = {};
        currencies['gold'] = Math.floor(value / 100);
        value -= currencies['gold'] * 100
        currencies['silver'] = Math.floor(value / 10);
        value -= currencies['silver'] * 10;
        currencies['copper'] = value;
        return currencies;
    }

    /**
     * Convert currencies to value
     * @param currencies gold, silver and copper
     * @returns integer
     */
    static currenciesToValue(currencies) {
        return currencies.gold.value * 100 + currencies.silver.value * 10 + currencies.copper.value;
    }

}
