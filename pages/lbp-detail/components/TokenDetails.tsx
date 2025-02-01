import React from "react";
import Image from "next/image";
import { amountFormatted } from "@/lib/format";
import { Skeleton } from "@nextui-org/react";
import BigNumber from "bignumber.js";

interface TokenDetailsProps {
  price?: string;
  fundsRaised?: string;
  fullDiluted: string;
  startTimeDisplay?: string;
  endTimeDisplay?: string;
}

const TokenDetails: React.FC<TokenDetailsProps> = ({
  fundsRaised,
  price,
  fullDiluted,
  startTimeDisplay,
  endTimeDisplay,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5 *:margin">
      <div className="flex flex-col items-center">
        <div className="flex gap-[4px] text-white text-[12.165px] font-bold leading-[normal]">
          Token Price
        </div>
        <div className="text-[#FFCD4D] text-xs font-medium leading-[normal] mt-[4px]">
          {price !== undefined ? (
            amountFormatted(price, {
              decimals: 0,
              fixed: 3,
              prefix: "$",
            })
          ) : (
            <Skeleton className="rounded-lg h-6 w-24 bg-white/40" />
          )}
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex gap-[4px] text-white text-[12.165px] font-bold leading-[normal] text-center">
          Funds Raised
        </div>
        <div className="text-[#FFCD4D] text-xs font-medium leading-[normal] mt-[4px]">
          {fundsRaised !== undefined ? (
            amountFormatted(fundsRaised, {
              decimals: 0,
              fixed: 3,
              prefix: "$",
            })
          ) : (
            <Skeleton className="rounded-lg h-6 w-24 bg-white/40" />
          )}
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex gap-[4px] text-white text-[12.165px] font-bold leading-[normal] text-center">
          Full Diluted Value
        </div>
        <div className="text-[#FFCD4D] text-xs font-medium leading-[normal] mt-[4px]">
          {fundsRaised !== undefined ? (
            amountFormatted(fullDiluted, {
              decimals: 0,
              fixed: 3,
              prefix: "$",
            })
          ) : (
            <Skeleton className="rounded-lg h-6 w-24 bg-white/40" />
          )}
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex items-center gap-[4px] text-white text-xs font-bold leading-[normal]">
          <Image
            width={12}
            height={12}
            alt="Start Date"
            src="/images/calendar.png"
          />
          <span>Start Date</span>
        </div>
        <div className="text-[#FFCD4D] text-xs font-medium leading-[normal] mt-[4px]">
          {startTimeDisplay ? (
            startTimeDisplay !== "-" ? (
              <>
                {new Date(startTimeDisplay).toLocaleDateString()}
                <br />
                {new Date(startTimeDisplay).toLocaleTimeString()}
              </>
            ) : (
              "--"
            )
          ) : (
            <Skeleton className="rounded-lg h-6 w-24 bg-white/40" />
          )}
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex gap-1 text-white text-xs font-bold leading-[normal]">
          <Image
            width={12}
            height={12}
            alt="End Date"
            src="/images/calendar.png"
          />
          <span>End Date</span>
        </div>
        <div className="text-[#FFCD4D] text-xs font-medium leading-[normal] mt-[4px]">
          {endTimeDisplay ? (
            endTimeDisplay !== "-" ? (
              <>
                {new Date(endTimeDisplay).toLocaleDateString()}
                <br />
                {new Date(endTimeDisplay).toLocaleTimeString()}
              </>
            ) : (
              "--"
            )
          ) : (
            <Skeleton className="rounded-lg h-6 w-24 bg-white/40" />
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenDetails;
