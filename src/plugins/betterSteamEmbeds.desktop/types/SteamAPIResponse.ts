/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export type GameRequirements = {
    minimum: string;
    recommended: string;
};

export type PriceOverview = {
    currency: string;
    initial: number;
    final: number;
    discount_percent: number;
    initial_formatted: string;
    final_formatted: string;
};

export type PackageSub = {
    packageid: number;
    percent_savings_text: string;
    percent_savings: number;
    option_text: string;
    option_description: string;
    can_get_free_license: string;
    is_free_license: boolean;
    price_in_cents_with_discount: number;
};

export type PackageGroup = {
    name: string;
    title: string;
    description: string;
    selection_text: string;
    save_text: string;
    display_type: number;
    is_recurring_subscription: string;
    subs: PackageSub[];
};

export type Metacritic = {
    score: number;
    url: string;
};

export type Category = {
    id: number;
    description: string;
};

export type Genre = {
    id: string;
    description: string;
};

export type Screenshot = {
    id: number;
    path_thumbnail: string;
    path_full: string;
};

export type Movie = {
    id: number;
    name: string;
    thumbnail: string;
    webm: {
        480: string;
        max: string;
    };
    mp4: {
        480: string;
        max: string;
    };
    highlight: boolean;
};

export type GameData = {
    type: string;
    name: string;
    steam_appid: number;
    required_age: string;
    is_free: boolean;
    controller_support: string;
    dlc: number[];
    detailed_description: string;
    about_the_game: string;
    short_description: string;
    supported_languages: string;
    reviews: string;
    header_image: string;
    capsule_image: string;
    capsule_imagev5: string;
    website: string | null;
    pc_requirements: GameRequirements;
    mac_requirements: GameRequirements;
    linux_requirements: GameRequirements;
    legal_notice: string;
    developers: string[];
    publishers: string[];
    price_overview: PriceOverview;
    packages: number[];
    package_groups: PackageGroup[];
    platforms: {
        windows: boolean;
        mac: boolean;
        linux: boolean;
    };
    metacritic: Metacritic;
    categories: Category[];
    genres: Genre[];
    screenshots: Screenshot[];
    movies: Movie[];
};

export type GameApiResponse = {
    [key: string]: {
        success: boolean;
        data: GameData;
    };
};
