import { gql } from "@apollo/client";

export const LBP_PAIRS = gql`
  query lbpPairs {
    lbppools {
      ...LBP_PAIR_FRAGMENT
    }
  }
`;

export const LBP_PAIR = gql`
  query lbpPair($id: ID!) {
    lbppool(id: $id) {
      ...LBP_PAIR_FRAGMENT
    }
  }
`;

export const LBP_PAIR_FRAGMENT = gql`
  fragment LBP_PAIR_FRAGMENT on LBPPool {
    id
    address
    totalAssetsIn
    totalPurchased
    closed
    buys(orderBy: timestamp, orderDirection: desc) {
      id
      caller
      shares
      assets
      timestamp
    }
    sells(orderBy: timestamp, orderDirection: desc) {
      id
      caller
      shares
      assets
      timestamp
    }
  }
`;
