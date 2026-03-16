import { Offer } from "@/types/offer";
import { generateGameOffers } from "./aiOfferService";

const games = [
  "Dragon Merge",
  "Puzzle Hero",
  "Speed Runner",
  "Galaxy Shooter",
  "Tower Defense",
  "Monster Clash",
];

const tasks = [
  "Reach Level 10",
  "Complete 5 Matches",
  "Win 3 battles",
  "Finish daily challenge",
  "Collect 100 coins",
];

export const streamOffers = async (addOffer: any, resetOffer: any, setGenerating: any) => {

  const offers = await generateGameOffers();
  resetOffer();
  if (offers.length > 0) {
    for (let i = 0; i < 3; i++) {
      await new Promise((resolve) =>
        setTimeout(resolve, 900)
      );

      addOffer({
        id: Date.now() + Math.random(),
        ...offers[i],
      });
    }
  } else {
    for (let i = 0; i < 3; i++) {
      await new Promise((resolve) =>
        setTimeout(resolve, 900)
      );

      const offer: Offer = {
        id: Date.now() + Math.random(),
        title: games[Math.floor(Math.random() * games.length)],
        task: tasks[Math.floor(Math.random() * tasks.length)],
        reward: (Math.random() * 0.06 + 0.02).toFixed(3),
      };
      addOffer(offer);
    }
  }
  setGenerating(false);
};