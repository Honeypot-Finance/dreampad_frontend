import React from "react";
import { truncate } from "@/lib/format";
import { Copy } from "@/components/Copy";
import { VscCopy } from "react-icons/vsc";
import { Skeleton } from "@nextui-org/react";

interface TokenAddressProps {
  address?: string;
}

const TokenAddress: React.FC<TokenAddressProps> = ({ address }) => {
  return (
    <div className="space-y-2">
      <div className="text-white text-sm font-medium leading-[normal]">
        Token address
      </div>

      {address ? (
        <Copy
          className={"w-full"}
          content="Copy address"
          value={address}
          displayContent={
            <div className="relative">
              <span className="mt-[8px] flex h-[41px] justify-between items-center [background:#3B2912] px-3 py-0 rounded-[10px] cursor-pointer hover:brightness-150 active:brightness-75 select-none">
                {truncate(address, 28)}
              </span>
              <VscCopy className="size-4 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer" />
            </div>
          }
        />
      ) : (
        <Skeleton className="rounded-lg h-10 w-full" />
      )}
    </div>
  );
};

export default TokenAddress;
