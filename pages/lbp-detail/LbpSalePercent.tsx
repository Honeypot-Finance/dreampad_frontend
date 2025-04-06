import { DynamicFormatAmount } from "@/lib/algebra/utils/common/formatAmount";
import { LbpLaunch } from "@/services/contract/launches/lbp/lbpPair";

export const LbpSalePercent = ({ lbpLaunch }: { lbpLaunch: LbpLaunch }) => {
  return (
    <div className="bg-white rounded-[16px] border-2 border-[#5A4A4A] p-2 shadow-[2px_2px_0px_0px_#202020,2px_4px_0px_0px_#202020]">
      <div className="text-center">
        <div className="text-lg font-bold">
          {DynamicFormatAmount({
            amount:
              lbpLaunch?.totalPurchased
                ?.div(lbpLaunch?.totalShares ?? 0)
                .times(100)
                .toString() ?? 0,
            decimals: 2,
            endWith: "%",
          })}
        </div>
        <div className="text-sm text-[#4D4D4D]">
          {DynamicFormatAmount({
            amount: lbpLaunch?.totalPurchased?.toString() ?? 0,
            decimals: 2,
            endWith: lbpLaunch?.shareToken?.symbol ?? "",
          })}{" "}
          /{" "}
          {DynamicFormatAmount({
            amount: lbpLaunch?.totalShares?.toString() ?? 0,
            decimals: 2,
            endWith: lbpLaunch?.shareToken?.symbol ?? "",
          })}
        </div>
      </div>
    </div>
  );
};
