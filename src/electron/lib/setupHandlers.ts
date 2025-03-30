/* eslint-disable @typescript-eslint/no-explicit-any */
import { ipcMain, IpcMainInvokeEvent } from "electron";
import { IpcChannels, IpcRequest } from "../../shared/types.js";
import { addMembers } from "./alliances/addMembers.js";
import { createAlliance } from "./alliances/createAlliance.js";
import { deleteAlliance } from "./alliances/deleteAlliance.js";
import { getAllAlliances } from "./alliances/getAllAlliances.js";
import { getAlliance } from "./alliances/getAlliance.js";
import { getMembers } from "./alliances/getMembers.js";
import { updateAlliance } from "./alliances/updateAlliance.js";
import { addStates } from "./countries/addStates.js";
import { createCountry } from "./countries/createCountry.js";
import { deleteCountry } from "./countries/deleteCountry.js";
import { getCountriesBase } from "./countries/getCountriesBase.js";
import { getCountriesStates } from "./countries/getCountriesStates.js";
import { getCountriesTable } from "./countries/getCountriesTable.js";
import { getCountryById } from "./countries/getCountryById.js";
import { removeStates } from "./countries/removeStates.js";
import { updateCountry } from "./countries/updateCountry.js";
import { createEthnicity } from "./ethnicities/createEthnicity.js";
import { deleteEthnicity } from "./ethnicities/deleteEthnicity.js";
import { getAllEthnicities } from "./ethnicities/getAllEthnicities.js";
import { renameEthnicity } from "./ethnicities/renameEthnicity.js";
import { assignHeadOfGovernment } from "./government/assignHeadOfGovernment.js";
import { assignHeadOfState } from "./government/assignHeadOfState.js";
import { getHeadOfGovernment } from "./government/getHeadOfGovernment.js";
import { getHeadOfState } from "./government/getHeadOfState.js";
import { createIdeology } from "./ideologies/createIdeology.js";
import { deleteIdeology } from "./ideologies/deleteIdeology.js";
import { getAllIdeologies } from "./ideologies/getAllIdeologies.js";
import { updateIdeology } from "./ideologies/updateIdeology.js";
import { createMap } from "./maps/createMap.js";
import { deleteMap } from "./maps/deleteMap.js";
import { getMaps } from "./maps/getMaps.js";
import { renameMap } from "./maps/renameMap.js";
import { addMembers as addProminentMembers } from "./parties/addMembers.js";
import { createParty } from "./parties/createParty.js";
import { deleteParty } from "./parties/deleteParty.js";
import { getAllParties } from "./parties/getAllParties.js";
import { getMembers as getPartyMembers } from "./parties/getMembers.js";
import { getParty } from "./parties/getParty.js";
import { updateParty } from "./parties/updateParty.js";
import { createPolitician } from "./politicians/createPolitician.js";
import { deletePolitician } from "./politicians/deletePolitician.js";
import { getAllPoliticians } from "./politicians/getAllPoliticians.js";
import { getIndependent } from "./politicians/getIndependent.js";
import { getPolitician } from "./politicians/getPolitician.js";
import { updatePolitician } from "./politicians/updatePolitician.js";
import { addPopulation } from "./provinces/addPopulation.js";
import { changeProvinceType } from "./provinces/changeProvinceType.js";
import { getAllProvinces } from "./provinces/getAllProvinces.js";
import { addProvinces } from "./states/addProvinces.js";
import { createState } from "./states/createState.js";
import { deleteState } from "./states/deleteState.js";
import { getAllStates } from "./states/getAllStates.js";
import { getStateById } from "./states/getStateById.js";
import { removeProvinces } from "./states/removeProvinces.js";
import { renameState } from "./states/renameState.js";
import { addParticipants } from "./wars/addParticipants.js";
import { createWar } from "./wars/createWar.js";
import { deleteWar } from "./wars/deleteWar.js";
import { getAllWars } from "./wars/getAllWars.js";
import { getParticipants } from "./wars/getParticipants.js";
import { getWar } from "./wars/getWar.js";
import { updateWar } from "./wars/updateWar.js";

const handlers: HandlersType = {
    maps: {
        getAll: getMaps,
        create: createMap,
        rename: renameMap,
        delete: deleteMap,
    },
    provinces: {
        getAll: getAllProvinces,
        // getByColor: getProvinceByColor,
        // getById: getProvinceById,
        changeType: changeProvinceType,
        addPopulation,
    },
    states: {
        getAll: getAllStates,
        getById: getStateById,
        create: createState,
        rename: renameState,
        delete: deleteState,
        // getByProvinceId: getStateByProvinceId,
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

        // eslint-disable-next-line no-useless-catch
        try {
            // @ts-expect-error - this is a valid call
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return
            return await handlers[domain][command](event, ...args);
        } catch (error) {
            throw error;
        }
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
