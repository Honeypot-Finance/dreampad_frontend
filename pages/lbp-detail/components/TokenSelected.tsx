import { Copy } from "@/components/Copy";
import { wallet } from "@/services/wallet";
import Link from "next/link";
import React from "react";
import { BiLinkExternal } from "react-icons/bi";

type Props = {
  address: string;
  symbol: string;
};

const TokenSelected = ({ address, symbol }: Props) => {
  return (
    <div className="flex">
      <div className="flex items-center">
        <Link
          href={`${wallet.currentChain?.chain.blockExplorers?.default.url}/token/${address}`}
          target="_blank"
        >
          <BiLinkExternal className=" cursor-pointer hover:text-primary "></BiLinkExternal>
        </Link>
        <Copy value={address} className="ml-[8px] mr-[8px]"></Copy>
      </div>
      <div className="px-[22px] py-2 flex items-center gap-1 bg-[#3E2A0F] border border-[#F7931A1A] rounded-[30px]">
        <div className="size-5 rounded-full bg-[#C8EE44]"></div>
        <div className="font-bold text-sm leading-6">{symbol}</div>
      </div>
    </div>
  );
};

export default TokenSelected;
