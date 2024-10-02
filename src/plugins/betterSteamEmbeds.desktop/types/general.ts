/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export enum SteamURLType {
    "store"
}

export type SteamURLTypeMatch = {
    type: SteamURLType;
    match: RegExpMatchArray;
};
