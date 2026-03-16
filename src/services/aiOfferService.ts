import { AI_CONFIG } from "@/config/constants";


export interface GameOffer {
    title: string;
    task: string;
    reward: number;
}

const isGameOfferArray = (value: unknown): value is GameOffer[] => {
    if (!Array.isArray(value)) return false;
    return value.every((item) => (
        typeof item === "object" &&
        item !== null &&
        typeof (item as { title?: unknown }).title === "string" &&
        typeof (item as { task?: unknown }).task === "string" &&
        (typeof (item as { reward?: unknown }).reward === "number" ||
            typeof (item as { reward?: unknown }).reward === "string")
    ));
};

export const generateGameOffers = async (): Promise<GameOffer[]> => {
    try {
        const response = await fetch(AI_CONFIG.url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${AI_CONFIG.token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "nvidia/nemotron-3-super-120b-a12b:free",
                messages: [
                    {
                        role: "system",
                        content:
                            "You generate reward-based mobile game offers. Return JSON only."
                    },
                    {
                        role: "user",
                        content: `
Generate 3 mobile game reward offers.

Each offer must include:
title
task
reward

Example format:

[
 { "title":"Play Candy Quest", "task":"Reach Level 5", "reward":"0.05" },
 { "title":"Zombie Arena", "task":"Win 2 Matches", "reward":"0.08" }
]

Note task hase max 3 words only
`
                    }
                ],
            }),
        });
        const data: unknown = await response.json();
        if (typeof data !== "object" || data === null) {
            return [];
        }
        const record = data as Record<string, unknown>;
        const choices = record.choices;
        if (!Array.isArray(choices) || choices.length === 0) {
            return [];
        }
        const firstChoice = choices[0] as { message?: { content?: unknown } };
        const content = firstChoice?.message?.content;
        if (typeof content !== "string") {
            return [];
        }

        const parsed: unknown = JSON.parse(content);
        if (!isGameOfferArray(parsed)) {
            return [];
        }

        const offers: GameOffer[] = parsed.map((offer) => ({
            title: offer.title,
            task: offer.task,
            reward: typeof offer.reward === "string" ? Number(offer.reward) : offer.reward,
        })).filter((offer) => Number.isFinite(offer.reward));

        return offers;

    } catch (error) {
        console.log(error)
        return [];
    }
};
