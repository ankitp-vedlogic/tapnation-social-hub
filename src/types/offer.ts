export interface Offer {
  id: number;
  title: string;
  task: string;
  reward: string;
  claimed?: boolean;
}