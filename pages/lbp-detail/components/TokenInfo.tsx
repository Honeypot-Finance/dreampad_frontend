import React from "react";
import { formatUnits } from "viem";
import { truncate } from "@/lib/format";

export type TokenInfoProps = {
  description?: string;
  tokenAddress?: string;
  token: {
    [key: string]: any;
  };
};

const TokenInfo = ({ tokenAddress, token }: TokenInfoProps) => {
  return (
    <div className="flex flex-col w-full px-2 md:px-10">
      <h1 className="text-lg xl:text-4xl xl:py-16">Token Info</h1>
      <div className="flex flex-col gap-x-2 divide-y-1 divide-[#F0A64A]">
        <div className="flex items-center justify-between py-4">
          <span className="text-[#F0A64A] text-sm">Token Name</span>
          <span className="text-white md:text-xl">
            {token?.name ?? "Token Name"}
          </span>
        </div>
        <div className="flex items-center justify-between py-4">
          <span className="text-[#F0A64A] text-sm">Token Symbol</span>
          <span className="text-white md:text-xl">
            {token?.symbol ?? "Token Symbol"}
          </span>
        </div>
        <div className="flex items-center justify-between py-4">
          <span className="text-[#F0A64A] text-sm">Token supply</span>
          <span className="text-white md:text-xl">
            {new Intl.NumberFormat("en-DE").format(
              Number(
                formatUnits(
                  BigInt(token?.totalSupply ?? "0"),
                  token?.decimals ?? 18
                )
              )
            )}
          </span>
        </div>
        <div className="flex items-center justify-between py-4">
          <span className="text-[#F0A64A] text-sm">INITIAL MARKET CAP</span>
          <span className="text-white md:text-xl">0</span>
        </div>
        <div className="flex items-center justify-between py-4">
          <span className="text-[#F0A64A] text-sm">Token Type</span>
          <span className="text-white md:text-xl">Erc20</span>
        </div>
        <div className="flex items-center justify-between py-4">
          <span className="text-[#F0A64A] text-sm">Token Address</span>
          <span className="text-white md:text-xl">
            {truncate(tokenAddress ?? "", 16)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TokenInfo;
