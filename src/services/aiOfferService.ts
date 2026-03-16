import { AI_CONFIG } from "@/config/constants";


export interface GameOffer {
    title: string;
    task: string;
    reward: number;
}

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
        const data = await response.json();

        const content = data?.choices?.[0]?.message?.content;

        const offers: GameOffer[] = JSON.parse(content);

        return offers;

    } catch (error) {
        console.log(error)
        return [];
    }
};