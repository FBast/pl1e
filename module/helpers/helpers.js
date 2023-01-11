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
    static async getDragnDropTargetObject(event) {
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

}
