import React from "react";
import BigNumber from "bignumber.js";
import { Skeleton } from "@nextui-org/react";

interface TokenRaisedProps {
  depositedAmount: string | null;
  minCapAmount: string | null;
}

const TokenRaised: React.FC<TokenRaisedProps> = ({
  depositedAmount,
  minCapAmount,
}) => {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="text-white md:text-base text-sm font-bold leading-[normal]">
        Token Raised
      </div>
      <div className="text-[color:var(--Button-Gradient,var(--card-stroke,#F7931A))] flex items-center gap-x-1">
        {depositedAmount ? (
          <span className="font-bold">${depositedAmount}</span>
        ) : (
          <Skeleton className="rounded-lg h-6 w-24" />
        )}
        <span className="text-sm">/</span>
        {minCapAmount ? (
          <span className="text-sm">${minCapAmount}</span>
        ) : (
          <Skeleton className="rounded-lg h-5 w-20" />
        )}
      </div>
    </div>
  );
};

export default TokenRaised;
