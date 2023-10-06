import {PL1E} from "./config.mjs";

export function getConfigAspects() {

    PL1E.passiveAspectsObjects = [
        {
            "name": "modify",
            "dataGroup": "aspectsResources",
            "data": "health",
            "operator": "add",
            "value": 0,
            "createEffect": false,
            "effectIcon": "systems/pl1e/assets/icons/modify.svg",
            "effectIconTint": "#ffffff"
        },
    ]

    PL1E.activeAspectsObjects = [
        {
            "name": "modify",
            "dataGroup": "aspectsResources",
            "data": "health",
            "operator": "add",
            "damageType": "raw",
            "value": 0,
            "resolutionType": "fixed",
            "targetGroup": "all",
            "createEffect": false,
            "effectDuration": 1,
            "effectDurationResolutionType": "fixed",
            "effectIcon": "systems/pl1e/assets/icons/modify.svg",
            "effectIconTint": "#ffffff"
        },
        {
            "name": "transfer",
            "value": 0,
            "dataGroup": "aspectsResources",
            "data": "health",
            "resolutionType": "fixed",
            "targetGroup": "all",
            "transferSource": "all",
            "transferDestination": "all",
            "damageType": "raw",
            "effectIcon": "systems/pl1e/assets/icons/transfer.svg",
            "effectIconTint": "#ffffff"
        },
        {
            "name": "status",
            "value": 0,
            "dataGroup": "statuses",
            "data": "stunned",
            "targetGroup": "all",
            "statusType": "permanent",
            "effectDuration": 1,
        },
        {
            "name": "movement",
            "value": 0,
            "dataGroup": "movements",
            "data": "standard",
            "targetGroup": "all"
        },
        {
            "name": "invocation",
            "value": 0,
            "dataGroup": "invocations",
            "data": "standard",
            "resolutionType": "fixed",
            "invocation": ""
        }
    ]

    PL1E.aspects = {
        "modify": {
            "label": "PL1E.Modify",
            "img": "systems/pl1e/assets/icons/modify.svg",
            "dataGroups": {
                "aspectsResources": "PL1E.Resources",
                "characteristics": "PL1E.Characteristics",
                "aspectsSkills": "PL1E.Skills",
                "general": "PL1E.General",
                "reductions": "PL1E.Reductions",
                "aspectsMisc": "PL1E.Misc"
            }
        },
        "transfer": {
            "label": "PL1E.Transfer",
            "img": "systems/pl1e/assets/icons/transfer.svg",
            "dataGroups": {
                "aspectsResources": "PL1E.Resources",
                "characteristics": "PL1E.Characteristics",
                "reductions": "PL1E.Reductions"
            }
        },
        "status": {
            "label": "PL1E.Status",
            "img": "systems/pl1e/assets/icons/status.svg",
            "dataGroups": {
                "statuses": "PL1E.Statuses"
            }
        },
        "movement": {
            "label": "PL1E.Movement",
            "img": "systems/pl1e/assets/icons/movement.svg",
            "dataGroups": {
                "movements": "PL1E.Movements"
            }
        },
        "invocation": {
            "label": "PL1E.Invocation",
            "img": "systems/pl1e/assets/icons/invocation.svg",
            "dataGroups": {
                "invocations": "PL1E.Invocations"
            }
        }
    }

    PL1E.aspectsResources = {
        "health": {
            "label": "PL1E.Health",
            "path": "system.resources.health.value",
            "type": "number"
        },
        "healthMax": {
            "label": "PL1E.MaxHealth",
            "path": "system.resources.health.max",
            "type": "number"
        },
        "healthTemp": {
            "label": "PL1E.TempHealth",
            "path": "system.resources.health.temp",
            "type": "number"
        },
        "stamina": {
            "label": "PL1E.Stamina",
            "path": "system.resources.stamina.value",
            "type": "number"
        },
        "staminaMax": {
            "label": "PL1E.MaxStamina",
            "path": "system.resources.stamina.max",
            "type": "number"
        },
        "staminaTemp": {
            "label": "PL1E.TempStamina",
            "path": "system.resources.stamina.temp",
            "type": "number"
        },
        "mana": {
            "label": "PL1E.Mana",
            "path": "system.resources.mana.value",
            "type": "number"
        },
        "manaMax": {
            "label": "PL1E.MaxMana",
            "path": "system.resources.mana.max",
            "type": "number"
        },
        "manaTemp": {
            "label": "PL1E.TempMana",
            "path": "system.resources.mana.temp",
            "type": "number"
        }
    }

    PL1E.aspectsSkills = {
        "coverNumber": {
            "label": "PL1E.CoverBonus",
            "path": "system.skills.cover.numberMod",
            "type": "number"
        },
        // "coverDice": {
        //     "label": "PL1E.CoverDice",
        //     "path": "system.skills.cover.numberMod",
        //     "type": "number"
        // },
        "coverExplosion": {
            "label": "PL1E.CoverExplosion",
            "path": "system.skills.cover.explosion",
            "type": "bool"
        },
        "coverImplosion": {
            "label": "PL1E.CoverImplosion",
            "path": "system.skills.cover.implosion",
            "type": "bool"
        },
        "coverUsable": {
            "label": "PL1E.CoverUsable",
            "path": "system.skills.cover.usable",
            "type": "bool"
        },
        "parryNumber": {
            "label": "PL1E.ParryBonus",
            "path": "system.skills.parry.numberMod",
            "type": "number"
        },
        // "parryDice": {
        //     "label": "PL1E.ParryDice",
        //     "path": "system.skills.parry.numberMod",
        //     "type": "number"
        // },
        "parryExplosion": {
            "label": "PL1E.ParryExplosion",
            "path": "system.skills.parry.explosion",
            "type": "bool"
        },
        "parryImplosion": {
            "label": "PL1E.ParryImplosion",
            "path": "system.skills.parry.implosion",
            "type": "bool"
        },
        "parryUsable": {
            "label": "PL1E.ParryUsable",
            "path": "system.skills.parry.usable",
            "type": "bool"
        },
        "reflexNumber": {
            "label": "PL1E.ReflexBonus",
            "path": "system.skills.reflex.numberMod",
            "type": "number"
        },
        // "reflexDice": {
        //     "label": "PL1E.ReflexDice",
        //     "path": "system.skills.reflex.numberMod",
        //     "type": "number"
        // },
        "reflexExplosion": {
            "label": "PL1E.ReflexExplosion",
            "path": "system.skills.reflex.explosion",
            "type": "bool"
        },
        "reflexImplosion": {
            "label": "PL1E.ReflexImplosion",
            "path": "system.skills.reflex.implosion",
            "type": "bool"
        },
        "vigorNumber": {
            "label": "PL1E.VigorBonus",
            "path": "system.skills.vigor.numberMod",
            "type": "number"
        },
        // "vigorDice": {
        //     "label": "PL1E.VigorDice",
        //     "path": "system.skills.vigor.numberMod",
        //     "type": "number"
        // },
        "vigorExplosion": {
            "label": "PL1E.VigorExplosion",
            "path": "system.skills.vigor.explosion",
            "type": "bool"
        },
        "vigorImplosion": {
            "label": "PL1E.VigorImplosion",
            "path": "system.skills.vigor.implosion",
            "type": "bool"
        },
        "resilienceNumber": {
            "label": "PL1E.ResilienceBonus",
            "path": "system.skills.resilience.numberMod",
            "type": "number"
        },
        // "resilienceDice": {
        //     "label": "PL1E.ResilienceDice",
        //     "path": "system.skills.resilience.numberMod",
        //     "type": "number"
        // },
        "resilienceExplosion": {
            "label": "PL1E.ResilienceExplosion",
            "path": "system.skills.resilience.explosion",
            "type": "bool"
        },
        "resilienceImplosion": {
            "label": "PL1E.ResilienceImplosion",
            "path": "system.skills.resilience.implosion",
            "type": "bool"
        },
        "intuitionNumber": {
            "label": "PL1E.IntuitionBonus",
            "path": "system.skills.intuition.numberMod",
            "type": "number"
        },
        // "intuitionDice": {
        //     "label": "PL1E.IntuitionDice",
        //     "path": "system.skills.intuition.numberMod",
        //     "type": "number"
        // },
        "intuitionExplosion": {
            "label": "PL1E.IntuitionExplosion",
            "path": "system.skills.intuition.explosion",
            "type": "bool"
        },
        "intuitionImplosion": {
            "label": "PL1E.IntuitionImplosion",
            "path": "system.skills.intuition.implosion",
            "type": "bool"
        },
        "handlingNumber": {
            "label": "PL1E.HandlingBonus",
            "path": "system.skills.handling.numberMod",
            "type": "number"
        },
        // "handlingDice": {
        //     "label": "PL1E.HandlingDice",
        //     "path": "system.skills.handling.numberMod",
        //     "type": "number"
        // },
        "handlingExplosion": {
            "label": "PL1E.HandlingExplosion",
            "path": "system.skills.handling.explosion",
            "type": "bool"
        },
        "handlingImplosion": {
            "label": "PL1E.HandlingImplosion",
            "path": "system.skills.handling.implosion",
            "type": "bool"
        },
        "throwingNumber": {
            "label": "PL1E.ThrowingBonus",
            "path": "system.skills.throwing.numberMod",
            "type": "number"
        },
        // "throwingDice": {
        //     "label": "PL1E.ThrowingDice",
        //     "path": "system.skills.throwing.numberMod",
        //     "type": "number"
        // },
        "throwingExplosion": {
            "label": "PL1E.ThrowingExplosion",
            "path": "system.skills.throwing.explosion",
            "type": "bool"
        },
        "throwingImplosion": {
            "label": "PL1E.ThrowingImplosion",
            "path": "system.skills.throwing.implosion",
            "type": "bool"
        },
        "athleticsNumber": {
            "label": "PL1E.AthleticsBonus",
            "path": "system.skills.athletics.numberMod",
            "type": "number"
        },
        // "athleticsDice": {
        //     "label": "PL1E.AthleticsDice",
        //     "path": "system.skills.athletics.numberMod",
        //     "type": "number"
        // },
        "athleticsExplosion": {
            "label": "PL1E.AthleticsExplosion",
            "path": "system.skills.athletics.explosion",
            "type": "bool"
        },
        "athleticsImplosion": {
            "label": "PL1E.AthleticsImplosion",
            "path": "system.skills.athletics.implosion",
            "type": "bool"
        },
        "acrobaticsNumber": {
            "label": "PL1E.AcrobaticsBonus",
            "path": "system.skills.acrobatics.numberMod",
            "type": "number"
        },
        // "acrobaticsDice": {
        //     "label": "PL1E.AcrobaticsDice",
        //     "path": "system.skills.acrobatics.numberMod",
        //     "type": "number"
        // },
        "acrobaticsExplosion": {
            "label": "PL1E.AcrobaticsExplosion",
            "path": "system.skills.acrobatics.explosion",
            "type": "bool"
        },
        "acrobaticsImplosion": {
            "label": "PL1E.AcrobaticsImplosion",
            "path": "system.skills.acrobatics.implosion",
            "type": "bool"
        },
        "accuracyNumber": {
            "label": "PL1E.AccuracyBonus",
            "path": "system.skills.accuracy.numberMod",
            "type": "number"
        },
        // "accuracyDice": {
        //     "label": "PL1E.AccuracyDice",
        //     "path": "system.skills.accuracy.numberMod",
        //     "type": "number"
        // },
        "accuracyExplosion": {
            "label": "PL1E.AccuracyExplosion",
            "path": "system.skills.accuracy.explosion",
            "type": "bool"
        },
        "accuracyImplosion": {
            "label": "PL1E.AccuracyImplosion",
            "path": "system.skills.accuracy.implosion",
            "type": "bool"
        },
        "searchNumber": {
            "label": "PL1E.SearchBonus",
            "path": "system.skills.search.numberMod",
            "type": "number"
        },
        // "searchDice": {
        //     "label": "PL1E.SearchDice",
        //     "path": "system.skills.search.numberMod",
        //     "type": "number"
        // },
        "searchExplosion": {
            "label": "PL1E.SearchExplosion",
            "path": "system.skills.search.explosion",
            "type": "bool"
        },
        "searchImplosion": {
            "label": "PL1E.SearchImplosion",
            "path": "system.skills.search.implosion",
            "type": "bool"
        },
        "vigilanceNumber": {
            "label": "PL1E.VigilanceBonus",
            "path": "system.skills.vigilance.numberMod",
            "type": "number"
        },
        // "vigilanceDice": {
        //     "label": "PL1E.VigilanceDice",
        //     "path": "system.skills.vigilance.numberMod",
        //     "type": "number"
        // },
        "vigilanceExplosion": {
            "label": "PL1E.VigilanceExplosion",
            "path": "system.skills.vigilance.explosion",
            "type": "bool"
        },
        "vigilanceImplosion": {
            "label": "PL1E.VigilanceImplosion",
            "path": "system.skills.vigilance.implosion",
            "type": "bool"
        },
        "discretionNumber": {
            "label": "PL1E.DiscretionBonus",
            "path": "system.skills.discretion.numberMod",
            "type": "number"
        },
        // "discretionDice": {
        //     "label": "PL1E.DiscretionDice",
        //     "path": "system.skills.discretion.numberMod",
        //     "type": "number"
        // },
        "discretionExplosion": {
            "label": "PL1E.DiscretionExplosion",
            "path": "system.skills.discretion.explosion",
            "type": "bool"
        },
        "discretionImplosion": {
            "label": "PL1E.DiscretionImplosion",
            "path": "system.skills.discretion.implosion",
            "type": "bool"
        },
        "performanceNumber": {
            "label": "PL1E.PerformanceBonus",
            "path": "system.skills.performance.numberMod",
            "type": "number"
        },
        // "performanceDice": {
        //     "label": "PL1E.PerformanceDice",
        //     "path": "system.skills.performance.numberMod",
        //     "type": "number"
        // },
        "performanceExplosion": {
            "label": "PL1E.PerformanceExplosion",
            "path": "system.skills.performance.explosion",
            "type": "bool"
        },
        "performanceImplosion": {
            "label": "PL1E.PerformanceImplosion",
            "path": "system.skills.performance.implosion",
            "type": "bool"
        },
        "diplomacyNumber": {
            "label": "PL1E.DiplomacyBonus",
            "path": "system.skills.diplomacy.numberMod",
            "type": "number"
        },
        // "diplomacyDice": {
        //     "label": "PL1E.DiplomacyDice",
        //     "path": "system.skills.diplomacy.numberMod",
        //     "type": "number"
        // },
        "diplomacyExplosion": {
            "label": "PL1E.DiplomacyExplosion",
            "path": "system.skills.diplomacy.explosion",
            "type": "bool"
        },
        "diplomacyImplosion": {
            "label": "PL1E.DiplomacyImplosion",
            "path": "system.skills.diplomacy.implosion",
            "type": "bool"
        },
        "intimidationNumber": {
            "label": "PL1E.IntimidationBonus",
            "path": "system.skills.intimidation.numberMod",
            "type": "number"
        },
        // "intimidationDice": {
        //     "label": "PL1E.IntimidationDice",
        //     "path": "system.skills.intimidation.numberMod",
        //     "type": "number"
        // },
        "intimidationExplosion": {
            "label": "PL1E.IntimidationExplosion",
            "path": "system.skills.intimidation.explosion",
            "type": "bool"
        },
        "intimidationImplosion": {
            "label": "PL1E.IntimidationImplosion",
            "path": "system.skills.intimidation.implosion",
            "type": "bool"
        },
        "bluffNumber": {
            "label": "PL1E.BluffBonus",
            "path": "system.skills.bluff.numberMod",
            "type": "number"
        },
        // "bluffDice": {
        //     "label": "PL1E.BluffDice",
        //     "path": "system.skills.bluff.numberMod",
        //     "type": "number"
        // },
        "bluffExplosion": {
            "label": "PL1E.BluffExplosion",
            "path": "system.skills.bluff.explosion",
            "type": "bool"
        },
        "bluffImplosion": {
            "label": "PL1E.BluffImplosion",
            "path": "system.skills.bluff.implosion",
            "type": "bool"
        },
        "craftNumber": {
            "label": "PL1E.CraftBonus",
            "path": "system.skills.craft.numberMod",
            "type": "number"
        },
        // "craftDice": {
        //     "label": "PL1E.CraftDice",
        //     "path": "system.skills.craft.numberMod",
        //     "type": "number"
        // },
        "craftExplosion": {
            "label": "PL1E.CraftExplosion",
            "path": "system.skills.craft.explosion",
            "type": "bool"
        },
        "craftImplosion": {
            "label": "PL1E.CraftImplosion",
            "path": "system.skills.craft.implosion",
            "type": "bool"
        },
        "eruditionNumber": {
            "label": "PL1E.EruditionBonus",
            "path": "system.skills.erudition.numberMod",
            "type": "number"
        },
        // "eruditionDice": {
        //     "label": "PL1E.EruditionDice",
        //     "path": "system.skills.erudition.numberMod",
        //     "type": "number"
        // },
        "eruditionExplosion": {
            "label": "PL1E.EruditionExplosion",
            "path": "system.skills.erudition.explosion",
            "type": "bool"
        },
        "eruditionImplosion": {
            "label": "PL1E.EruditionImplosion",
            "path": "system.skills.erudition.implosion",
            "type": "bool"
        },
        "natureNumber": {
            "label": "PL1E.NatureBonus",
            "path": "system.skills.nature.numberMod",
            "type": "number"
        },
        // "natureDice": {
        //     "label": "PL1E.NatureDice",
        //     "path": "system.skills.nature.numberMod",
        //     "type": "number"
        // },
        "natureExplosion": {
            "label": "PL1E.NatureExplosion",
            "path": "system.skills.nature.explosion",
            "type": "bool"
        },
        "natureImplosion": {
            "label": "PL1E.NatureImplosion",
            "path": "system.skills.nature.implosion",
            "type": "bool"
        },
        "magicNumber": {
            "label": "PL1E.MagicBonus",
            "path": "system.skills.magic.numberMod",
            "type": "number"
        },
        // "magicDice": {
        //     "label": "PL1E.MagicDice",
        //     "path": "system.skills.magic.numberMod",
        //     "type": "number"
        // },
        "magicExplosion": {
            "label": "PL1E.MagicExplosion",
            "path": "system.skills.magic.explosion",
            "type": "bool"
        },
        "magicImplosion": {
            "label": "PL1E.MagicImplosion",
            "path": "system.skills.magic.implosion",
            "type": "bool"
        }
    }

    PL1E.aspectsMisc = {
        "size": {
            "label": "PL1E.Size",
            "icon": "fa-arrow-up-big-small",
            "type": "select",
            "path": "system.misc.size",
            "select": "sizes"
        },
        "speed": {
            "label": "PL1E.Speed",
            "icon": "fa-person-running",
            "type": "select",
            "path": "system.misc.speed",
            "select": "speeds"
        },
        "unconsciousDoor": {
            "label": "PL1E.UnconsciousDoor",
            "icon": "fa-face-sleeping",
            "type": "number",
            "path": "system.misc.unconsciousDoor"
        },
        "deathDoor": {
            "label": "PL1E.DeathDoor",
            "icon": "fa-skull",
            "type": "number",
            "path": "system.misc.deathDoor"
        },
        "flexibility": {
            "label": "PL1E.Flexibility",
            "icon": "fa-weight-hanging",
            "type": "number",
            "path": "system.misc.flexibility"
        },
        "nightVisionRange": {
            "label": "PL1E.NightVisionRange",
            "icon": "fa-eye",
            "type": "number",
            "path": "system.misc.nightVisionRange"
        },
        "faithPower": {
            "label": "PL1E.FaithPower",
            "icon": "fa-reply-clock",
            "type": "bool",
            "path": "system.misc.faithPower"
        },
        "gesturalMagic": {
            "label": "PL1E.GesturalMagic",
            "icon": "fa-reply-clock",
            "type": "bool",
            "path": "system.misc.gesturalMagic"
        },
        "vocalMagic": {
            "label": "PL1E.VocalMagic",
            "icon": "fa-reply-clock",
            "type": "bool",
            "path": "system.misc.vocalMagic"
        }
    }

    PL1E.damageTypes = {
        "raw": "PL1E.Raw",
        "slashing": "PL1E.Slashing",
        "crushing": "PL1E.Crushing",
        "piercing": "PL1E.Piercing",
        "burn": "PL1E.Burn",
        "cold": "PL1E.Cold",
        "acid": "PL1E.Acid",
        "shock": "PL1E.Shock"
    }

    PL1E.targetGroups = {
        "all": "PL1E.All",
        "self": "PL1E.Self",
        "allies": "PL1E.Allies",
        "opponents": "PL1E.Opponents",
    }

    PL1E.statusTypes = {
        "permanentIfSuccess": "PL1E.PermanentIfSuccess",
        "durationFromSuccess": "PL1E.DurationFromSuccess",
        "durationIfSuccess": "PL1E.DurationIfSuccess"
    }

    PL1E.statusImmunities = {
        "charmed": "PL1E.StatusCharmed",
        "paralysis": "PL1E.StatusParalysis",
        "asleep": "PL1E.StatusAsleep",
        "restrained": "PL1E.StatusRestrained",
        "slow": "PL1E.StatusSlow",
        "fast": "PL1E.StatusFast",
        "stunned": "PL1E.StatusStunned",
        "invigorated": "PL1E.StatusInvigorated",
        "sick": "PL1E.StatusSick",
        "healthy": "PL1E.StatusHealthy",
        "confused": "PL1E.StatusConfused",
        "composed": "PL1E.StatusComposed",
        "bleeding": "PL1E.StatusBleeding",
        "regenerate": "PL1E.StatusRegenerate",
        "downgraded": "PL1E.StatusDowngraded",
        "upgraded": "PL1E.StatusUpgraded",
        "blind": "PL1E.StatusBlind",
        "deaf": "PL1E.StatusDeaf",
        "invisible": "PL1E.StatusInvisible",
        "clairvoyant": "PL1E.StatusClairvoyant",
        "tremorsense": "PL1E.StatusTremorsense"
    }

    PL1E.movements = {
        "walk": {
            "label": "PL1E.Walk"
        },
        "push": {
            "label": "PL1E.Push"
        },
        "teleport": {
            "label": "PL1E.Teleport"
        }
    }

    PL1E.invocations = {
        "standard": {
            "label": "PL1E.Standard"
        }
    }

    PL1E.numberOperators = {
        "add": "PL1E.Add",
        "remove": "PL1E.Remove",
        "set": "PL1E.Set"
    }

}