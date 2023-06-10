import {PL1E} from "./config.mjs";

export function getConfigJournals() {
    PL1E.locationTypes = {
        "area": "PL1E.Area",
        "settlement": "PL1E.Settlement",
        "building": "PL1E.Building"
    }

    PL1E.areaTypes = {
        "none": "PL1E.None",
        "forest": "PL1E.Forest",
        "mountains": "PL1E.Mountains",
        "mesa": "PL1E.Mesa",
        "plain": "PL1E.Plain",
        "swamp": "PL1E.Swamp",
        "dunes": "PL1E.Dunes",
        "bay": "PL1E.Bay",
        "coastline": "PL1E.Coastline", // Littoral
        "strait": "PL1E.Strait", // Détroit
        "island": "PL1E.Island",
        "archipelago": "PL1E.Archipelago",
        "sea": "PL1E.Sea",
        "wall": "PL1E.Wall",
        "anomaly": "PL1E.Anomaly"
    }

    PL1E.settlementTypes = {
        "city": "PL1E.City",
        "town": "PL1E.Town",
        "village": "PL1E.Village",
        "fort": "PL1E.Fort",
        "temple": "PL1E.Temple"
    }

    PL1E.buildingTypes = {
        "tavern": "PL1E.Tavern",
        "inn": "PL1E.Inn",
        "smithy": "PL1E.Smithy",
        "armory": "PL1E.Armory",
        "alchemy": "PL1E.Alchemy",
        "jewelry": "PL1E.Jewelry",
        "market": "PL1E.Market",
        "guardhouse": "PL1E.Guardhouse",
        "barrack": "PL1E.Barrack",
        "guild": "PL1E.Guild",
        "district": "PL1E.District",
        "access": "PL1E.Access"
    }

    PL1E.climates = {
        "special": "PL1E.Special",
        "polar": "PL1E.Polar",
        "subarctic": "PL1E.Subarctic",
        "temperate": "PL1E.Temperate",
        "arid": "PL1E.Arid",
        "subtropical": "PL1E.SubTropical",
        "tropical": "PL1E.Tropical",
    }

    PL1E.organizationType = {
        "nation": "PL1E.Nation",
        "guild": "PL1E.Guild",
        "cult": "PL1E.Cult",
        "family": "PL1E.Family"
    }

    PL1E.powers = {
        "null": "PL1E.Null",
        "trivial": "PL1E.Trivial",
        "weak": "PL1E.Weak",
        "real": "PL1E.Real",
        "substantial": "PL1E.Substantial",
        "mighty": "PL1E.Mighty",
        "extreme": "PL1E.Extreme",
        "divine": "PL1E.Divine",
        "unfathomable": "PL1E.Unfathomable"
    }
}