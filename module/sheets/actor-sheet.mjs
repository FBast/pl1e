import {PL1E} from "../helpers/config.mjs";
import {Pl1eHelpers} from "../helpers/helpers.mjs";
import {Pl1eEvent} from "../helpers/events.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class Pl1eActorSheet extends ActorSheet {

    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["pl1e", "sheet", "actor"],
            template: "systems/pl1e/templates/actor/actor-sheet.hbs",
            width: 700,
            height: 730,
            scrollY: [
                ".stats",
                ".features",
                ".items"
            ],
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "stats"}]
        });
    }

    /** @override */
    get template() {
        return `systems/pl1e/templates/actor/actor-${this.actor.type}-sheet.hbs`;
    }

    /**
     * Custom header buttons
     * @returns {Application.HeaderButton[]}
     * @private
     */
    _getHeaderButtons() {
        const buttons = super._getHeaderButtons();
        if (game.user.isGM && this.actor.type === 'character') {
            buttons.unshift({
                label: 'PL1E.CreationMod',
                class: 'reset-clones',
                icon: this.actor.system.attributes.creationMod ? 'fas fa-toggle-on' : 'fas fa-toggle-off',
                onclick: () => {
                    this.actor.update({
                        "system.attributes.creationMod": !this.actor.system.attributes.creationMod
                    });
                    this.render(false);
                }
            });
        }
        return buttons;
    }

    /** @override */
    getData() {
        // Retrieve the data structure from the base sheet. You can inspect or log
        // the context variable to see the structure, but some key properties for
        // sheets are the actor object, the data object, whether or not it's
        // editable, the items array, and the effects array.
        const context = super.getData();

        // Use a safe clone of the actor data for further operations.
        const actorData = this.actor.toObject(false);

        // Add the actor's data to context.data for easier access, as well as flags.
        context.system = actorData.system;
        context.flags = actorData.flags;
        context.items = actorData.items;

        this._prepareItems(context);

        // Add roll data for TinyMCE editors.
        context.rollData = context.actor.getRollData();
        // Prepare active effects
        context.effects = Pl1eHelpers.prepareActiveEffectCategories(this.actor.effects);
        // Add the config data
        context.config = PL1E;
        // Add game access
        context.game = game;

        return context;
    }

    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        // Render the item sheet for viewing/editing prior to the editable check.
        html.find('.item-edit').on("click", ev => Pl1eEvent.onItemEdit(ev, this.actor));
        html.find('.item-buy').on("click", ev => Pl1eEvent.onItemBuy(ev, this.actor));

        // -------------------------------------------------------------
        // Everything below here is only needed if the sheet is editable
        if (!this.isEditable) return;

        // Item management
        html.find('.item-create').on("click", ev => Pl1eEvent.onItemCreate(ev, this.actor));
        html.find('.item-delete').on("click", ev => Pl1eEvent.onItemDelete(ev, this.actor));

        // Active Effect management
        html.find(".effect-control").on("click", ev => Pl1eEvent.onManageActiveEffect(ev, this.actor));

        // Chat messages
        html.find('.rollable').on("click", ev => Pl1eEvent.onRoll(ev, this.actor));

        // Currency
        html.find('.currency-control').on("click", ev => Pl1eEvent.onCurrencyChange(ev, this.actor));
        html.find('.currency-convert').on("click", ev => Pl1eEvent.onCurrencyConvert(ev, this.actor));

        // Highlights indications
        html.find('.resource-label,.characteristic-label,.skill-label')
            .on("mouseenter", ev => Pl1eEvent.onCreateHighlights(ev));
        html.find('.resource-label,.characteristic-label,.skill-label')
            .on("mouseleave", ev => Pl1eEvent.onRemoveHighlights(ev));

        // Custom controls
        html.find('.characteristic-control').on("click", ev => this.onCharacteristicChange(ev));
        html.find('.rank-control').on("click", ev => this.onRankChange(ev));
        html.find(".item-toggle").on("click", ev => this.onItemToggle(ev));
        html.find(".item-use").on("click", ev => this.onItemUse(ev));
        html.find(".consumable-reload").on("click", ev => this.onReloadConsumable(ev));

        // Drag events for macros.
        if (this.actor.isOwner) {
            let handler = ev => this._onDragStart(ev);
            html.find('li.item').each((i, li) => {
                if (li.classList.contains("items-header")) return;
                li.setAttribute("draggable", true);
                li.addEventListener("dragstart", handler, false);
            });
        }
    }

    /**
     * Handle sub items to be added as other items
     * @param event
     * @param data
     * @returns {Promise<unknown>}
     * @private
     */
    async _onDropItem(event, data) {
        const item = await Item.implementation.fromDropData(data);
        // Return if same actor
        // if (game.user.character === this.actor) return;
        // filter item to actor possibilites
        if (this.actor.type === 'merchant' && ['feature', 'ability'].includes(item.type)) return;
        // Player to other actor transfer
        if (!this.actor.isOwner) {
            // Player transfer item to a not owned actor
            PL1E.socket.executeAsGM('sendItem', {
                actor: game.user.character,
                targetActor: this.actor,
                item: item
            });
        }
        // Other cases
        else {
            const itemData = item.toObject();
            const newItem = await this._onDropItemCreate(item);
            if (itemData.system.subItemsMap !== undefined && itemData.system.subItemsMap.length > 0) {
                let linkedId = randomID();
                await newItem[0].update({'system.parentId': linkedId});
                for (let subItem of itemData.system.subItemsMap) {
                    const newSubItem = await this._onDropItemCreate(subItem);
                    await newSubItem[0].update({'system.childId': linkedId});
                }
            }
            // Delete the source item if it is embedded
            if (item.isOwned) item.delete();
        }
    }

    /**
     * Organize and classify Items for Character sheets.
     *
     * @param {Object} context The actor to prepare.
     *
     * @return {undefined}
     */
    _prepareItems(context) {
        // Initialize containers.
        const weapons = [];
        const wearables = [];
        const consumables = [];
        const commons = [];
        const gear = [];
        const features = [];
        const abilities = {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: []
        };

        // Iterate through items, allocating to containers
        const sourceIdFlags = [];
        for (let item of context.items) {
            const sourceIdFlag = item.flags.core ? item.flags.core.sourceId : null;
            item.img = item.img || DEFAULT_TOKEN;
            // Append to item categories
            if (item.type === 'weapon') {
                weapons.push(item);
                gear.push(item);
            }
            else if (item.type === 'wearable') {
                wearables.push(item);
                gear.push(item);
            }
            else if (item.type === 'consumable') {
                consumables.push(item);
                gear.push(item);
            }
            else if (item.type === 'common') {
                commons.push(item);
                gear.push(item);
            }
            // Append to features.
            else if (item.type === 'feature') {
                features.push(item);
            }
            // Append to abilities.
            else if (item.type === 'ability' && !sourceIdFlags.includes(sourceIdFlag)) {
                abilities[item.system.attributes.level.value].push(item);
            }
            // Push sourceId flag to handle duplicates
            if (sourceIdFlag && !sourceIdFlags.includes(sourceIdFlag)) sourceIdFlags.push(sourceIdFlag);
        }

        // Assign and return
        context.weapons = weapons;
        context.wearables = wearables;
        context.consumables = consumables;
        context.commons = commons;
        context.gear = gear;
        context.features = features;
        context.abilities = abilities;
    }

    /**
     * Toggle an ability
     * @param {Event} event The originating click event
     */
    async onItemToggle(event) {
        event.preventDefault();
        const itemId = event.currentTarget.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);

        const options = {
            actor: this.actor
        };
        const main = $(event.currentTarget).data("main");
        if (main) options["main"] = main;

        await item.toggle(options);
    }

    /**
     * Use an ability
     * @param {Event} event The originating click event
     */
    async onItemUse(event) {
        event.preventDefault();
        const itemId = event.currentTarget.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);

        const options = {
            actor: this.actor
        };

        await item.use(options);
    }

    /**
     * Handle reload of an Owned Consumable within the Actor.
     * @param {Event} event The triggering click event.
     */
    async onReloadConsumable(event) {
        event.preventDefault();
        const itemId = event.currentTarget.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);

        await item.reload();
    }

    /**
     * Handle characteristics changes
     * @param {Event} event The originating click event
     */
    async onCharacteristicChange(event) {
        event.preventDefault();
        event.stopPropagation();

        const characteristic = $(event.currentTarget).data("characteristic");
        let value = $(event.currentTarget).data("value");
        if (!value || !characteristic) return;

        let remaining = this.actor.system.attributes.remainingCharacteristics;
        if (remaining === 0 && value > 0) return;

        let oldValue = this.actor.system.characteristics[characteristic].base;
        let newValue = oldValue + value;

        if (newValue < 2 || newValue > 5) return;

        await this.actor.update({
            ["system.characteristics." + characteristic + ".base"]: newValue,
            ["system.attributes.remainingCharacteristics"]: remaining - value
        });

        this.render(false);
    }

    /**
     * Handle rank changes
     * @param {Event} event The originating click event
     */
    async onRankChange(event) {
        event.preventDefault();
        event.stopPropagation();
        const skill = $(event.currentTarget).data("skill");
        if (!skill) return;
        let oldValue = this.actor.system.skills[skill].rank;
        let maxRank = this.actor.system.attributes.maxRank;
        let newValue = oldValue + 1;
        if (newValue > maxRank || this.actor.system.attributes.ranks - newValue < 0) {
            if (this.actor.system.attributes.creationMod) newValue = 1;
            else return;
        }
        await this.actor.update({
            ["system.skills." + skill + ".rank"]: newValue
        });
        this.render(false);
    }

}
