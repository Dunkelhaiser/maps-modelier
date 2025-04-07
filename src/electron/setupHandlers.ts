/* eslint-disable @typescript-eslint/no-explicit-any */
import { ipcMain, IpcMainInvokeEvent } from "electron";
import { IpcChannels, IpcRequest } from "../shared/types.js";
import { addMembers } from "./lib/alliances/addMembers.js";
import { createAlliance } from "./lib/alliances/createAlliance.js";
import { deleteAlliance } from "./lib/alliances/deleteAlliance.js";
import { getAllAlliances } from "./lib/alliances/getAllAlliances.js";
import { getAlliance } from "./lib/alliances/getAlliance.js";
import { getMembers } from "./lib/alliances/getMembers.js";
import { updateAlliance } from "./lib/alliances/updateAlliance.js";
import { addOffmapPopulation } from "./lib/countries/addOffmapPopulation.js";
import { addStates } from "./lib/countries/addStates.js";
import { createCountry } from "./lib/countries/createCountry.js";
import { deleteCountry } from "./lib/countries/deleteCountry.js";
import { getCountriesBase } from "./lib/countries/getCountriesBase.js";
import { getCountriesStates } from "./lib/countries/getCountriesStates.js";
import { getCountriesTable } from "./lib/countries/getCountriesTable.js";
import { getCountryById } from "./lib/countries/getCountryById.js";
import { getPopulation } from "./lib/countries/getPopulation.js";
import { removeStates } from "./lib/countries/removeStates.js";
import { updateCountry } from "./lib/countries/updateCountry.js";
import { createEthnicity } from "./lib/ethnicities/createEthnicity.js";
import { deleteEthnicity } from "./lib/ethnicities/deleteEthnicity.js";
import { getAllEthnicities } from "./lib/ethnicities/getAllEthnicities.js";
import { renameEthnicity } from "./lib/ethnicities/renameEthnicity.js";
import { addParties } from "./lib/government/addParties.js";
import { assignHeadOfGovernment } from "./lib/government/assignHeadOfGovernment.js";
import { assignHeadOfState } from "./lib/government/assignHeadOfState.js";
import { createParliament } from "./lib/government/createParliament.js";
import { getHeadOfGovernment } from "./lib/government/getHeadOfGovernment.js";
import { getHeadOfState } from "./lib/government/getHeadOfState.js";
import { getParliament } from "./lib/government/getParliament.js";
import { getParties } from "./lib/government/getParties.js";
import { updateParliament } from "./lib/government/updateParliament.js";
import { createIdeology } from "./lib/ideologies/createIdeology.js";
import { deleteIdeology } from "./lib/ideologies/deleteIdeology.js";
import { getAllIdeologies } from "./lib/ideologies/getAllIdeologies.js";
import { updateIdeology } from "./lib/ideologies/updateIdeology.js";
import { createMap } from "./lib/maps/createMap.js";
import { deleteMap } from "./lib/maps/deleteMap.js";
import { getMaps } from "./lib/maps/getMaps.js";
import { renameMap } from "./lib/maps/renameMap.js";
import { addMembers as addProminentMembers } from "./lib/parties/addMembers.js";
import { createParty } from "./lib/parties/createParty.js";
import { deleteParty } from "./lib/parties/deleteParty.js";
import { getAllParties } from "./lib/parties/getAllParties.js";
import { getMembers as getPartyMembers } from "./lib/parties/getMembers.js";
import { getParty } from "./lib/parties/getParty.js";
import { updateParty } from "./lib/parties/updateParty.js";
import { createPolitician } from "./lib/politicians/createPolitician.js";
import { deletePolitician } from "./lib/politicians/deletePolitician.js";
import { getAllPoliticians } from "./lib/politicians/getAllPoliticians.js";
import { getIndependent } from "./lib/politicians/getIndependent.js";
import { getPolitician } from "./lib/politicians/getPolitician.js";
import { updatePolitician } from "./lib/politicians/updatePolitician.js";
import { addPopulation } from "./lib/provinces/addPopulation.js";
import { changeProvinceType } from "./lib/provinces/changeProvinceType.js";
import { getAllProvinces } from "./lib/provinces/getAllProvinces.js";
import { addProvinces } from "./lib/states/addProvinces.js";
import { createState } from "./lib/states/createState.js";
import { deleteState } from "./lib/states/deleteState.js";
import { getAllStates } from "./lib/states/getAllStates.js";
import { getStateById } from "./lib/states/getStateById.js";
import { removeProvinces } from "./lib/states/removeProvinces.js";
import { renameState } from "./lib/states/renameState.js";
import { addParticipants } from "./lib/wars/addParticipants.js";
import { createWar } from "./lib/wars/createWar.js";
import { deleteWar } from "./lib/wars/deleteWar.js";
import { getAllWars } from "./lib/wars/getAllWars.js";
import { getParticipants } from "./lib/wars/getParticipants.js";
import { getWar } from "./lib/wars/getWar.js";
import { updateWar } from "./lib/wars/updateWar.js";

const handlers: HandlersType = {
    maps: {
        getAll: getMaps,
        create: createMap,
        rename: renameMap,
        delete: deleteMap,
    },
    provinces: {
        getAll: getAllProvinces,
        changeType: changeProvinceType,
        addPopulation,
    },
    states: {
        getAll: getAllStates,
        getById: getStateById,
        create: createState,
        rename: renameState,
        delete: deleteState,
        addProvinces,
        removeProvinces,
    },
    countries: {
        getTable: getCountriesTable,
        create: createCountry,
        update: updateCountry,
        delete: deleteCountry,
        addStates,
        removeStates,
        getStates: getCountriesStates,
        getById: getCountryById,
        getBases: getCountriesBase,
        addOffmapPopulation,
        getPopulation,
    },
    ethnicities: {
        getAll: getAllEthnicities,
        create: createEthnicity,
        update: renameEthnicity,
        delete: deleteEthnicity,
    },
    alliances: {
        create: createAlliance,
        getAll: getAllAlliances,
        update: updateAlliance,
        addMembers,
        get: getAlliance,
        getMembers,
        delete: deleteAlliance,
    },
    wars: {
        create: createWar,
        update: updateWar,
        getAll: getAllWars,
        get: getWar,
        getParticipants,
        addParticipants,
        delete: deleteWar,
    },
    politicians: {
        create: createPolitician,
        update: updatePolitician,
        delete: deletePolitician,
        getAll: getAllPoliticians,
        get: getPolitician,
        getIndependent,
    },
    ideologies: {
        create: createIdeology,
        update: updateIdeology,
        delete: deleteIdeology,
        getAll: getAllIdeologies,
    },
    parties: {
        create: createParty,
        delete: deleteParty,
        getAll: getAllParties,
        get: getParty,
        getMembers: getPartyMembers,
        update: updateParty,
        addMembers: addProminentMembers,
    },
    government: {
        assignHeadOfState,
        assignHeadOfGovernment,
        getHeadOfState,
        getHeadOfGovernment,
        createParliament,
        updateParliament,
        getParliament,
        addParties,
        getParties,
    },
};

type HandlerFunction<Args extends any[], Return> = (event: IpcMainInvokeEvent, ...args: Args) => Promise<Return>;

type HandlersType = {
    [D in keyof IpcChannels]: {
        [C in keyof IpcChannels[D]]: HandlerFunction<
            Parameters<Extract<IpcChannels[D][C], (...args: any[]) => any>>,
            Awaited<ReturnType<Extract<IpcChannels[D][C], (...args: any[]) => any>>>
        >;
    };
};

export const setupHandlers = () => {
    ipcMain.handle("ipc", async (event: IpcMainInvokeEvent, request: IpcRequest) => {
        const { domain, command, args } = request;

        if (!isValidDomain(domain) || !isValidCommand(domain, command)) {
            throw new Error(`Invalid command: ${String(domain)}.${String(command)}`);
        }

        // @ts-expect-error - this is a valid call
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return
        return await handlers[domain][command](event, ...args);
    });
};

const isValidDomain = (key: string): key is keyof typeof handlers => {
    return Object.prototype.hasOwnProperty.call(handlers, key);
};

const isValidCommand = (
    domain: keyof typeof handlers,
    key: string | number | symbol
): key is keyof (typeof handlers)[typeof domain] => {
    return Object.prototype.hasOwnProperty.call(handlers[domain], key);
};
