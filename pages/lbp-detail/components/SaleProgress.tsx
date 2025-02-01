import React from "react";
import BigNumber from "bignumber.js";
import { Skeleton } from "@nextui-org/react";
import { amountFormatted } from "@/lib/format";
import ProgressBar from "@/components/atoms/ProgressBar/ProgressBar";

interface SaleProgressProps {
  raisedTokenMinCap: string | null;
  depositedAmount: string | null;
  progressLabel: string;
  progressValue: number;
}

const SaleProgress: React.FC<SaleProgressProps> = ({
  raisedTokenMinCap,
  depositedAmount,
  progressLabel,
  progressValue,
}) => {
  return (
    <div className="space-y-2">
      <div className="text-white text-sm font-bold leading-[normal]">
        Sale progress
      </div>
      <ProgressBar label={progressLabel} value={+progressValue} />
      <div className="flex items-center text-[#FFCD4D] gap-x-1">
        {depositedAmount ? (
          <span className="font-bold">{depositedAmount}</span>
        ) : (
          <Skeleton className="rounded-lg h-6 w-24" />
        )}
        <span className="text-sm">/</span>
        {raisedTokenMinCap ? (
          <span className="text-sm text-white">{raisedTokenMinCap}</span>
        ) : (
          <Skeleton className="rounded-lg h-5 w-20" />
        )}
      </div>
    </div>
  );
};

export default SaleProgress;
