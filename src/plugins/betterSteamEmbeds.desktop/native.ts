/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { IpcMainInvokeEvent } from "electron";
import { request } from "https";

import { GameApiResponse } from "./types/SteamAPIResponse";

export async function getSteamAppDetails(_: IpcMainInvokeEvent, steamAppId: string, cc: string | null) {
    const possibleCC = cc === null ? "" : `&cc=${cc}`;
    const steamAppDetailsURL = `https://store.steampowered.com/api/appdetails?appids=${steamAppId}${possibleCC}&_=${new Date().getTime()}`;

    return new Promise<GameApiResponse>((resolve, reject) => {
        const req = request(
            new URL(steamAppDetailsURL),
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                    "Pragma": "no-cache",
                    "Expires": "0"
                }
            },
            res => {
                let data = "";

                res.on("data", chunk => {
                    data += chunk.toString();
                });

                res.on("end", () => {
                    try {
                        const parsed = JSON.parse(data);
                        resolve(parsed);
                    } catch {
                        reject("error parsing json");
                    }
                });

                res.on("error", reject);
            }
        );

        req.on("error", reject);
        req.end();
    });
}
