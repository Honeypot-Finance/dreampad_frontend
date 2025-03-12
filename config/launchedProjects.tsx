import { StaticImageData } from "next/image";
import bearCage from "./launchedProjectsAsset/bearcage.webp";
import overlay from "./launchedProjectsAsset/overlay.webp";
import burrBear from "./launchedProjectsAsset/burrbear.webp";
import berally from "./launchedProjectsAsset/berally.webp";

export type LaunchedProject = {
  name: string;
  symbol: string;
  image: StaticImageData;
  raisedFund: number;
  participants: number;
};

export const launchedProjects: LaunchedProject[] = [
  {
    name: "BearCage",
    symbol: "xBEAR",
    image: bearCage,
    raisedFund: 234800,
    participants: 319,
  },
  {
    name: "Overlay",
    symbol: "OVL",
    image: overlay,
    raisedFund: 704200,
    participants: 268,
  },
  {
    name: "BurrBear",
    symbol: "BURR",
    image: burrBear,
    raisedFund: 425800,
    participants: 456,
  },
  {
    name: "Berally",
    symbol: "xBRLY",
    image: berally,
    raisedFund: 1393000,
    participants: 635,
  },
];
