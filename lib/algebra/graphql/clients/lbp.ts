import { Address } from "viem";
import {
  useLbpPairQuery,
  LbpPairQuery,
  LbpPairQueryVariables,
  LbpPairDocument,
  LbpPool,
  useLbpPairsQuery,
} from "../generated/graphql";
import { LbpLaunch } from "@/services/contract/launches/lbp/lbpPair";
import { useEffect, useState } from "react";
import { infoClient, lbpClient } from ".";
import BigNumber from "bignumber.js";

export const useLbpLaunchList = () => {
  const [lbpLaunchList, setLbpLaunchList] = useState<LbpLaunch[]>([]);
  const { data, loading, error } = useLbpPairsQuery({
    client: lbpClient,
  });

  useEffect(() => {
    if (!data?.lbppools) return;

    const lbpLaunchEntities = data.lbppools.map((lbp) =>
      subgraphLbpToLbpEntity(lbp as LbpPool)
    );

    Promise.all(
      lbpLaunchEntities.map((entity) =>
        Promise.all([entity.loadMetadata(), entity.loadOnchainData()])
      )
    ).then(() => {
      setLbpLaunchList(lbpLaunchEntities);
    });
  }, [data]);

  return {
    data: lbpLaunchList,
    loading,
    error,
  };
};

export const useLbpLaunch = (lbpAddress: Address) => {
  const [lbpLaunch, setLbpLaunch] = useState<LbpLaunch | undefined>(undefined);
  const { data, loading, error } = useLbpPairQuery({
    client: lbpClient,
    variables: {
      id: lbpAddress,
    },
  });

  useEffect(() => {
    if (lbpLaunch?.address || !data?.lbppool) return;

    const lbpLaunchEntity = subgraphLbpToLbpEntity(data?.lbppool as LbpPool);

    Promise.all([
      lbpLaunchEntity.loadMetadata(),
      lbpLaunchEntity.loadOnchainData(),
    ]).then(() => {
      setLbpLaunch(lbpLaunchEntity);
    });
  }, [data]);

  return {
    data: lbpLaunch,
    loading,
    error,
  };
};

const subgraphLbpToLbpEntity = (lbp: LbpPool): LbpLaunch => {
  const lbpLaunch = new LbpLaunch({
    address: lbp.id as Address,
    buys: lbp.buys.map((buy) => ({
      ...buy,
      assets: new BigNumber(buy.assets),
      shares: new BigNumber(buy.shares),
    })),
    sells: lbp.sells.map((sell) => ({
      ...sell,
      assets: new BigNumber(sell.assets),
      shares: new BigNumber(sell.shares),
    })),
    closed: lbp.closed,
  });

  return lbpLaunch;
};
