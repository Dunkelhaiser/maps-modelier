# Maps Modelier

A desktop application for creation of interactive political maps.

## Overview

### Features

- Create and view political maps
- Freely define geography and state borders
- Ethnicities and population of provinces and countries
- State attributes and governments
- Alliances and wars
- Different view modes (countries, ethnicities, population)

### Built With

- [![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
- [![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
- [![Electron.js](https://img.shields.io/badge/Electron-%2320232a?style=for-the-badge&logo=Electron&logoColor=white)](https://www.electronjs.org/)
- [![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://react.dev/)
- [![PixiJs](https://img.shields.io/badge/PixiJs-DB7093?style=for-the-badge&logo=pixijs&logoColor=white)](https://pixijs.com/)
- [![React Query](https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white)](https://tanstack.com/query/latest)
- [![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-%23EC5990.svg?style=for-the-badge&logo=reacthookform&logoColor=white)](https://react-hook-form.com/)
- [![Zustand](https://img.shields.io/badge/-Zustand-59666C?style=for-the-badge&logo=zustand&logoColor=white)](https://zustand.docs.pmnd.rs/getting-started/introduction)
- [![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
- [![Zod](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)
- [![Drizzle ORM](https://img.shields.io/badge/Drizzle-000000?style=for-the-badge&logo=Drizzle&logoColor=white)](https://orm.drizzle.team/)
- [![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/index.html)

### How to use

1. **Start screen**:
   - `Create New Map`
   - `Existing Maps` — list of existing maps with the ability to view, delete, or edit them.
  
To create own map you need to upload an image with provinces (you can use *provinces.png* image as an example).

1. **Map screen**:

Settings (the wheel icon on the right in the top panel) contain the interaction mode and the map view mode. The interaction mode can be *viewing* or *editing*, and the viewing mode can be *countries*, *ethnicities*, or *population*. You can also change the editing mode by pressing `Ctrl+E`.

When you left-click on a province, it becomes highlighted. Holding down the `Shift` key allows you to select several provinces at once. In the editing mode, if you have selected provinces, windows will pop up in the lower left corner of the screen to allow you to change the type of province, add population, and create states. You can close them by clicking on the cross or pressing the `Esc` key.

When you have a state created, clicking on a province will also highlight the state in which it is located. When a state is selected, holding down the `Ctrl` key and clicking on a province will add that province to the state. If the province was already part of another state, it will be automatically removed from it and transferred to the new one. If you click on a state's own province, it will be removed from the state and become unassigned.

Before you can add population to provinces, you need to create ethnicities, which is done in the ethnicities panel.
Before states can be added to countries, these countries have be created in the countries panel. After the country has been created, in order to put it on the map, you need to select a state and select the wanted country as its owner in the drop-down list. After the country has been placed on the map, you can also select the owner of each state from the drop-down list to further expand it. However, this is a long and inefficient process, so you can select a state that already belongs to the country and hold down the `Alt` key to click on the states to add them to country. Similarly to provinces, if you click on a state that already belongs to another country, it will automatically be transferred to the new country, and if you click on country's own state, it will become unassigned.
You can right-click on a country to select it and open a panel with information about it.

All other actions are performed in the corresponding panels located on the left side of the top panel.

### Screenshots

- Start screen

![Start screen](screenshots/start_screen.png)

- New map dialog

![New map dialog](screenshots/new_map_dialog.png)

- Map

![Map](screenshots/filled_map.png)

- Province population form

![Province population form](screenshots/population.png)

- Province and state population

![Province and state population](screenshots/population2.png)

- Countries panel

![Countries panel](screenshots/countries_table.png)

- State attributes

![State attributes](screenshots/attributes.png)

- Demographics

![Demographics](screenshots/demographics.png)

- Politicians

![Politicians](screenshots/politicians.png)

- Parties

![Parties](screenshots/parties.png)

- Party

![Party](screenshots/party.png)

- Government

![Government](screenshots/government.png)

- Parliament

![Parliament](screenshots/parliament.png)

- Parliament (details)

![Parliament](screenshots/parliament_details.png)

- Alliance

![Alliance](screenshots/alliance.png)

- Alliances

![Alliances](screenshots/alliances.png)

- War

![War](screenshots/war.png)

- War participants

![War participants](screenshots/war_participants.png)

- Wars

![Wars](screenshots/wars.png)

- Ethnicities mode

![Ethnicities mode](screenshots/ethnicities_mode.png)

- Population mode

![Population mode](screenshots/population_mode.png)
