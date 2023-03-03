/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
    return loadTemplates([

        // Actor partials.
        "systems/pl1e/templates/actor/parts/character-stats.hbs",
        "systems/pl1e/templates/actor/parts/character-features.hbs",
        "systems/pl1e/templates/actor/parts/character-items.hbs",
        "systems/pl1e/templates/actor/parts/merchant-items.hbs",
        "systems/pl1e/templates/actor/parts/npc-stats.hbs",

        // Item partials.
        "systems/pl1e/templates/item/parts/ability-attributes.hbs",
        "systems/pl1e/templates/item/parts/item-attributes.hbs",
        "systems/pl1e/templates/item/parts/item-description.hbs",
        "systems/pl1e/templates/item/parts/item-linked.hbs"

    ]);
};
