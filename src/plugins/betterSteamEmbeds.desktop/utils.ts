/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { AppSteamStorePageURLRegex, BaseSteamStoreURLRegex } from ".";
import { SteamURLType, SteamURLTypeMatch } from "./types/general";

export function matchSteamURLType(url: string): SteamURLTypeMatch | null {
    if (!BaseSteamStoreURLRegex.test(url)) return null;

    if (AppSteamStorePageURLRegex.test(url)) {
        return {
            type: SteamURLType.store,
            match: url.match(AppSteamStorePageURLRegex)!
        };
    }

    return null;
}
