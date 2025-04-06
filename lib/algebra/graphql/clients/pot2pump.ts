import { gql } from "@apollo/client";
import { infoClient } from ".";
import { pot2PumpListToMemePairList, pot2PumpToMemePair } from "./pair";
import { Pot2Pump } from "./type";

export const getPot2PumpDetail = async (id: string, accountId?: string) => {
  return undefined;
};

export const subgraphPot2PumpToMemePair = async (
  id: string,
  accountId?: string
) => {
  return undefined;
};

export const canClaimPot2Pump = async (accountId: string) => {
  return [];
};

export const canRefundPot2Pump = async (accountId: string) => {
  const timeNow = Math.floor(Date.now() / 1000);

  return [];
};

export const getParticipantDetail = async (
  accountId: string,
  pot2PumpId: string
) => {
  return undefined;
};
