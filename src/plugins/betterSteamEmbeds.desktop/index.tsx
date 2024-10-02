/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { addAccessory, removeAccessory } from "@api/MessageAccessories";
import { definePluginSettings } from "@api/Settings";
import ErrorBoundary from "@components/ErrorBoundary";
import { Devs } from "@utils/constants";
import { Logger } from "@utils/Logger";
import definePlugin, { OptionType, PluginNative } from "@utils/types";

import { SteamAppStorePage } from "./pages/store";
import { Regions } from "./regions";
import { SteamURLType } from "./types/general";
import { matchSteamURLType } from "./utils";


export const logger = new Logger("MIMJA", "purple");
export const Native = VencordNative.pluginHelpers.BetterSteamEmbeds as PluginNative<typeof import("./native")>;

export const BaseSteamStoreURLRegex = /https:\/\/(www. || ?www.)store.steampowered.com/m;
export const AppSteamStorePageURLRegex = /https:\/\/(www. || ?www.)store.steampowered.com\/app\/(\d+)/m;

let style: HTMLStyleElement;
let currentChannel: null | string = null;
let hiddenEmbeds: { channel_id: string; message_id: string; }[] = [];
let hiddenEmbedPurgeInterval: NodeJS.Timer | null;


export const settings = definePluginSettings({
    cc: {
        type: OptionType.SELECT,
        description: "region/language",
        options: Regions // defaults to the United States
    },
    openStorePageIn: {
        type: OptionType.SELECT,
        description: "determines how the \"Open Store Page\" link behaves",
        options: [
            { label: "open in default browser", value: "WEB" },
            { label: "open in Steam app", value: "APP", default: true }
        ]
    }
});

export default definePlugin({
    name: "BetterSteamEmbeds",
    description: "Overhauls how certain steam page links are displayed.",
    authors: [Devs.mimja],
    dependencies: ["MessageAccessoriesAPI", "MessageUpdaterAPI"],

    settings: settings,

    start() {
        style = document.createElement("style");
        style.id = "BetterSteamEmbedsCustomStyles";
        document.head.appendChild(style);

        hiddenEmbedPurgeInterval = setInterval(() => {
            hiddenEmbeds = hiddenEmbeds.filter(val => val.channel_id === currentChannel);
        }, 30 * 1000);

        addAccessory("betterSteamEmbeds", props => {
            const steamURLTypeMatch = matchSteamURLType(props.message.content);
            if (steamURLTypeMatch === null) return null;

            if (!hiddenEmbeds.find(val => val.message_id === props.message.id)) {
                hiddenEmbeds.push({
                    channel_id: props.message.channel_id,
                    message_id: props.message.id
                });
                currentChannel = props.message.channel_id;

                const elements = [...hiddenEmbeds].map(embed => `#message-accessories-${embed.message_id}`).join(",");
                style.textContent = `
                    :is(${elements}) :is([class*="embedWrapper"], [class*="clickableSticker"]) {
                        display: none;
                    }
                `;
            }

            let component: JSX.Element | null = null;

            switch (steamURLTypeMatch?.type) {
                case SteamURLType.store: {
                    if (steamURLTypeMatch.match.length > 2) {
                        component = <SteamAppStorePage id={steamURLTypeMatch.match[2]} />;
                    }
                }
            }

            return (
                <ErrorBoundary>
                    {component}
                </ErrorBoundary>
            );
        }, 4);
    },

    stop() {
        removeAccessory("betterSteamEmbeds");
        if (hiddenEmbedPurgeInterval) clearInterval(hiddenEmbedPurgeInterval);
    }
});
