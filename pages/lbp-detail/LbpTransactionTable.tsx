import { truncate } from "@/lib/format";
import { LbpLaunch } from "@/services/contract/launches/lbp/lbpPair";
import { Tooltip } from "@nextui-org/react";
import { useState } from "react";
import { useEffect } from "react";
import dayjs from "dayjs";
import Image from "next/image";
import { DynamicFormatAmount } from "@/lib/algebra/utils/common/formatAmount";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";

export const LbpTransactionTable = ({
  lbpLaunch,
}: {
  lbpLaunch: LbpLaunch;
}) => {
  const [currentTransactionPage, setCurrentTransactionPage] =
    useState<number>(1);

  return (
    <div className="bg-white rounded-[16px] border border-black border-dashed p-4 h-full w-full overflow-x-auto ">
      <div className="h-[85%]">
        <table className="w-full border-separate border-spacing-0 h-full min-w-max">
          <thead>
            <tr>
              <th className="text-left text-xs text-[#4D4D4D] py-2">Time</th>
              <th className="text-left text-xs text-[#4D4D4D] py-2">Caller</th>
              <th className="text-left text-xs text-[#4D4D4D] py-2">
                Amount In
              </th>
              <th className="text-left text-xs text-[#4D4D4D] py-2">
                Amount Out
              </th>
              <th className="text-left text-xs text-[#4D4D4D] py-2">Type</th>
            </tr>
          </thead>
          <tbody>
            {lbpLaunch?.buys
              ?.slice(
                (currentTransactionPage - 1) * 5,
                currentTransactionPage * 5
              )
              .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
              .map((buy, index) => (
                <tr key={index}>
                  <td className="text-sm text-[#4D4D4D] py-3 border-b border-black">
                    {dayjs(Number(buy.timestamp) * 1000).format("DD/MM/YYYY")}
                  </td>
                  <td className="text-sm text-[#4D4D4D] font-mono py-3 border-b border-black">
                    <Tooltip content={buy.caller}>
                      <span>{truncate(buy.caller, 8)}</span>
                    </Tooltip>
                  </td>
                  <td className="py-3 border-b border-black">
                    <div className="flex items-center gap-1">
                      <Image
                        src="/images/lbp-detail/logo/arb.png"
                        alt="eth"
                        width={16}
                        height={16}
                        className="inline-block"
                      />
                      <span className="text-[#4BC964] text-sm">
                        {DynamicFormatAmount({
                          amount:
                            buy.assets
                              .div(
                                10 ** (lbpLaunch?.assetToken?.decimals ?? 18)
                              )
                              .toString() ?? 0,
                          decimals: 2,
                          endWith: lbpLaunch?.assetToken?.symbol ?? "",
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 border-b border-black">
                    <div className="flex items-center gap-1">
                      <Image
                        src="/images/lbp-detail/logo/arb.png"
                        alt="token"
                        width={16}
                        height={16}
                        className="inline-block"
                      />
                      <span className="text-sm">
                        {DynamicFormatAmount({
                          amount:
                            buy.shares
                              .div(
                                10 ** (lbpLaunch?.shareToken?.decimals ?? 18)
                              )
                              .toString() ?? 0,
                          decimals: 2,
                          endWith: lbpLaunch?.shareToken?.symbol ?? "",
                        })}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 border-b border-black">
                    <span className="text-[#4BC964] text-sm">Buy</span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-6 gap-4">
        <button
          disabled={currentTransactionPage === 1}
          onClick={() => setCurrentTransactionPage(currentTransactionPage - 1)}
          className="w-8 h-8 flex items-center justify-center text-base"
        >
          <HiOutlineChevronLeft size={16} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center border border-black rounded-[4.571px] bg-[#FFCD4D] shadow-[1px_1px_0px_0px_#000] text-base font-bold">
          {currentTransactionPage}
        </button>
        <button
          disabled={
            currentTransactionPage === Math.ceil(lbpLaunch?.buys?.length / 5)
          }
          onClick={() => setCurrentTransactionPage(currentTransactionPage + 1)}
          className="w-8 h-8 flex items-center justify-center text-base"
        >
          <HiOutlineChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default LbpTransactionTable;
