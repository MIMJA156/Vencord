/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./store.css";

import { useEffect, useState } from "@webpack/common";
import { MouseEvent, ReactNode } from "react";

import { Native, settings } from "..";
import { GameApiResponse, GameData } from "../types/SteamAPIResponse";


function OpenInStore({ url, children }: { url: string; children: ReactNode; }) {
    function clicked(event: MouseEvent<HTMLAnchorElement>) {
        if (settings.store.openStorePageIn === "APP") {
            event.preventDefault();
            VencordNative.native.openExternal(`steam://openurl/${event.currentTarget.href}`);
        }
    }

    return (
        <a
            href={url}
            title={url}
            target="_blank"
            rel="noreferrer noopener"
            onClick={clicked}
        >
            {children}
        </a>
    );
}

function PriceContainer({ data }: { data: GameData; }) {
    let priceString = data.price_overview.final_formatted;

    if (data.price_overview === undefined) {
        priceString = "No Price Data";
    }

    if (data.price_overview.discount_percent !== 0) {
        priceString = `${priceString} | ${data.price_overview.discount_percent}% off`;
    }

    return (
        <div className="price-container">
            <span>{priceString}</span>
        </div>
    );
}

function ImageCarousel({ data }: { data: string[]; }) {
    let [index, setIndex] = useState<number>(0);
    let item = data[index];

    const up = () => {
        let tmpIndex = index + 1;
        if (tmpIndex > data.length - 1) tmpIndex = 0;
        setIndex(tmpIndex);
    };

    const down = () => {
        let tmpIndex = index - 1;
        if (tmpIndex < 0) tmpIndex = data.length - 1;
        setIndex(tmpIndex);
    };

    return (
        <div style={{ width: "100%", height: "100%", backgroundColor: "#36393e", position: "relative" }}>
            <img src={`${item}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}></img>
            <button className="image-carousel-button left" onClick={down}>{"<"}</button>
            <button className="image-carousel-button right" onClick={up}>{">"}</button>
        </div>
    );
}

export function SteamAppStorePage({ id }) {
    const [info, setInfo] = useState<GameApiResponse | null>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const inner = async () => {
            try {
                const steamAppInfo = await Native.getSteamAppDetails(id, settings.store.cc ?? null);
                setInfo(steamAppInfo);
            } finally {
                setLoading(false);
            }
        };
        inner();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (info![id] === null || info![id] === undefined || info![id].data === undefined) {
        return <div>Bad Steam Page URL</div>;
    }

    const { data } = info![id];
    const images = data.screenshots.map(value => { return value.path_full; });

    return (
        <div className="foreground-view">
            <div className="foreground-view-inner">
                <div className="foreground-panel-left">
                    <div className="foreground-panel-left-upper">
                        <div className="name-container">{data.name}</div>
                    </div>
                    <ImageCarousel data={images} />
                    <div className="foreground-panel-left-lower">
                        <PriceContainer data={data} />
                    </div>
                </div>
                <div className="foreground-panel-right">
                    <div className="foreground-panel-right-upper">
                        <img src={data.header_image} alt="Header Image" />

                        <div className="text-container">
                            <span className="game-description">{data.short_description}</span>
                        </div>
                    </div>
                    <div className="foreground-panel-right-lower">
                        <OpenInStore url={`http://store.steampowered.com/app/${data.steam_appid}`}>
                            Open Store Page
                        </OpenInStore>
                    </div>
                </div>
            </div>
        </div>
    );
}
