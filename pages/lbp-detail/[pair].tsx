import { Spinner } from "@nextui-org/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Address, formatUnits, isAddress, parseUnits } from "viem";
import { LiquidityBootstrapPoolABI } from "@/lib/abis/LiquidityBootstrapPoolAbi";
import { BigNumber } from "ethers";
import useMulticall3 from "@/components/hooks/useMulticall3";
import {
  formatErc20Data,
  formatLBPPoolData,
  Pool,
} from "@/services/lib/helper";
import { ERC20ABI } from "@/lib/abis/erc20";
import { useReadContract } from "wagmi";
import dayjs from "dayjs";
import ProjectTitle from "./components/ProjectTitle";
import ProjectStatus from "./components/ProjectStatus";
import TokenRaised from "./components/TokenRaised";
import SaleProgress from "./components/SaleProgress";
import { amountFormatted } from "@/lib/format";
import TokenAddress from "./components/TokenAddress";
import TokenDetails from "./components/TokenDetails";
import { Logo } from "@/components/svg/logo";
import CountdownTimer from "./components/Countdown";
import ProjectDetails from "./components/ProjectDetails";
import { useQuery } from "@tanstack/react-query";
import FjordHoneySdk from "@/services/fjord_honeypot_sdk";
import { SwapCard } from "./components/Swap";
import { motion } from "framer-motion";
import { itemPopUpVariants } from "@/lib/animation";
import V3SwapCard from "@/components/algebra/swap/V3SwapCard";
import { wallet } from "@/services/wallet";
import KlineChart from "@/pages/launch-detail/components/KlineChart";
import { cn } from "@/lib/tailwindcss";

const RankProjectData = [
  { icon: "🚀", value: 10 },
  { icon: "🔥", value: 10 },
  { icon: "💩", value: 10 },
  { icon: "🚩", value: 10 },
];

const ProjectDetailTabs = [
  { title: "Token Info", key: 1 },
  { title: "About the Project", key: 2 },
  { title: "Transactions", key: 3 },
];

const LBPDetail = () => {
  const router = useRouter();
  const { pair: pairAddress } = router.query;

  const { data: pool } = useQuery({
    queryKey: ["lbp-detail", pairAddress],
    queryFn: async () => {
      return await FjordHoneySdk.findPool(pairAddress as string);
    },
  });

  const {
    data,
    refetch: refetchArgs,
    isLoading: isArgsLoading,
  } = useMulticall3({
    queryKey: [pairAddress],
    contractCallContext: [
      {
        abi: LiquidityBootstrapPoolABI as any,
        reference: "LiquidityBootstrapPool",
        contractAddress: pairAddress as Address,
        calls: [
          { methodName: "args", reference: "args", methodParameters: [] },
          {
            methodName: "totalAssetsIn",
            reference: "totalAssetsIn",
            methodParameters: [],
          },
        ],
      },
    ],
    select: (data: any) => {
      const result: { args: Pool | {}; totalAssetsIn: BigInt } = {
        args: {},
        totalAssetsIn: BigInt(0),
      };
      data.LiquidityBootstrapPool.callsReturnContext.forEach((data: any) => {
        if (data.reference === "args") {
          result.args = formatLBPPoolData(data.returnValues ?? []);
        } else if (data.reference === "totalAssetsIn") {
          result.totalAssetsIn = BigNumber.from(
            data?.returnValues?.[0]?.hex ?? 0
          ).toBigInt();
        }
      });

      return result;
    },
  });

  const { data: tokenData, isLoading: isErc20Loading } = useMulticall3({
    queryKey: ["erc20", data?.args?.share],
    contractCallContext: [
      {
        reference: "shareToken",
        contractAddress: data?.args?.share,
        abi: ERC20ABI as any,
        calls: [
          { reference: "name", methodName: "name", methodParameters: [] },
          { reference: "symbol", methodName: "symbol", methodParameters: [] },
          {
            reference: "decimals",
            methodName: "decimals",
            methodParameters: [],
          },
          {
            reference: "totalSupply",
            methodName: "totalSupply",
            methodParameters: [],
          },
        ],
      },
      {
        reference: "assetToken",
        contractAddress: data?.args?.asset,
        abi: ERC20ABI as any,
        calls: [
          { reference: "name", methodName: "name", methodParameters: [] },
          { reference: "symbol", methodName: "symbol", methodParameters: [] },
          {
            reference: "decimals",
            methodName: "decimals",
            methodParameters: [],
          },
          {
            reference: "totalSupply",
            methodName: "totalSupply",
            methodParameters: [],
          },
        ],
      },
    ],
    enabled: Boolean(data?.args?.shares && data?.args?.asset),
  });

  const token = formatErc20Data(
    tokenData?.results?.shareToken?.callsReturnContext ?? []
  );

  const assetToken = formatErc20Data(
    tokenData?.results?.assetToken?.callsReturnContext ?? []
  );

  const { data: previewAssetsIn } = useReadContract({
    abi: LiquidityBootstrapPoolABI,
    address: pairAddress as Address,
    functionName: "previewAssetsIn",
    args: [parseUnits("1", token?.decimals ?? 18)],
    query: {
      enabled: Boolean(token?.decimals),
    },
  });

  useEffect(() => {
    if (!isAddress((pairAddress as Address) ?? "")) {
      router.push("/");
    }
  }, [pairAddress, router]);
  const [activeProjectDetailTab, setActiveProjectDetailTab] = useState<
    1 | 2 | 3
  >(1);

  const percentOfTokenSold =
    data?.args?.totalPurchased && data?.args?.shares
      ? Math.round(
          (+formatUnits(data?.args?.totalPurchased, token.decimals) /
            +formatUnits(data?.args?.shares, token.decimals)) *
            100
        )
      : 0;

  const isStart =
    data?.args?.saleStart && dayjs().unix() - data?.args?.saleStart > 0;

  const isSaleEnd = data?.args?.saleEnd * 1000 < Date.now();

  return (
    <div className="px-2 md:px-6 xl:max-w-[1200px] mx-auto pb-[20vh]">
      {isErc20Loading || isArgsLoading ? (
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <div
            className={cn(
              "grid grid-cols-2 gap-4 xl:w-[1170px]",
              isSaleEnd && "grid-cols-[1fr_400px]"
            )}
          >
            <div className="bg-[#271A0C] col-span-2 px-5 py-2.5 rounded-[30px] flex md:items-center md:justify-between md:flex-row flex-col gap-2 md:gap-0">
              <div className="flex items-center gap-x-4 md:gap-x-[7.5px]">
                <div className="size-10 md:size-[77px] bg-[#ECC94E] flex items-center justify-center rounded-full">
                  <Image
                    src="/images/icons/tokens/thpot-token-yellow-icon.png"
                    alt={token?.name}
                    width={77}
                    height={77}
                    className="rounded-full hidden md:inline-block"
                  />
                </div>
                <ProjectTitle name={token?.name} displayName={token?.symbol} />
              </div>

              <div className="flex items-center md:gap-x-8 gap-x-0 justify-between md:justify-start">
                <CountdownTimer
                  label={isStart ? "Ends In" : "Start In"}
                  date={
                    isStart
                      ? data.args.saleEnd * 1000
                      : data.args.saleStart * 1000
                  }
                />
                {!isSaleEnd && <ProjectStatus isStart={isStart} />}
              </div>
            </div>

            {isSaleEnd ? (
              <div className="hidden md:block">
                <KlineChart height={500} />
              </div>
            ) : (
              <div className="bg-[#271A0C] p-5 rounded-2xl space-y-3 col-span-2 lg:col-span-1">
                <TokenRaised
                  depositedAmount={Number(
                    formatUnits(data?.args?.totalPurchased, token.decimals)
                  ).toFixed(3)}
                  minCapAmount={Number(
                    formatUnits(data?.args?.shares, token.decimals)
                  ).toFixed(3)}
                />

                <SaleProgress
                  progressValue={percentOfTokenSold}
                  progressLabel={`${percentOfTokenSold.toFixed(2)}%`}
                  depositedAmount={amountFormatted(data?.args?.totalPurchased, {
                    decimals: token.decimals,
                    fixed: 3,
                    prefix: "$",
                  })}
                  raisedTokenMinCap={amountFormatted(data?.args?.shares, {
                    decimals: token.decimals,
                    fixed: 3,
                    prefix: "$",
                  })}
                />

                <TokenAddress address={data?.args?.share} />

                <TokenDetails
                  fullDiluted={formatUnits(
                    data?.args?.maxTotalAssetsInDeviation,
                    14
                  )}
                  price={formatUnits(
                    previewAssetsIn ?? BigInt(0),
                    assetToken?.decimals ?? 18
                  )}
                  fundsRaised={formatUnits(
                    data?.totalAssetsIn ?? 0,
                    assetToken?.decimals || 18
                  )}
                  startTimeDisplay={dayjs
                    .unix(Number(data?.args?.saleStart ?? 0))
                    .format("MMMM D, YYYY")}
                  endTimeDisplay={dayjs
                    .unix(Number(data?.args?.saleEnd ?? 0))
                    .format("MMMM D, YYYY")}
                />

                <hr />
                <p className="text-white/65 text-sm mt-2.5">Rank Project</p>
                <div className="flex gap-5">
                  {RankProjectData.map((project, i) => {
                    return (
                      <div
                        key={i}
                        className="mt-[8px] flex-1 flex flex-col  justify-center items-center [background:#3B2912] px-3 py-3 rounded-[10px] hover:[background:#FFCD4D] active:[background:#F0A000] cursor-pointer select-none"
                      >
                        <p>{project.icon}</p>
                        <p> {project.value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="rounded-2xl space-y-3 col-span-2 lg:col-span-1">
              {isSaleEnd ? (
                <motion.div
                  variants={itemPopUpVariants}
                  initial="hidden"
                  animate="visible"
                  className="relative w-full h-full flex flex-col items-center justify-start col-span-2 lg:col-span-1"
                >
                  <V3SwapCard
                    fromTokenAddress={data?.args?.share ?? undefined}
                    toTokenAddress={
                      data?.args?.asset ??
                      wallet.currentChain.platformTokenAddress.HPOT
                    }
                  />
                </motion.div>
              ) : (
                <SwapCard
                  sharePriceInAsset={previewAssetsIn?.toString() ?? ""}
                  poolId={pool?.id ?? ""}
                  asset={{
                    decimals: assetToken.decimals,
                    name: assetToken.name,
                    symbol: assetToken.symbol,
                    totalSupply: assetToken.totalSupply,
                    address: data?.args?.asset as Address,
                  }}
                  share={{
                    decimals: token.decimals,
                    name: token.name,
                    symbol: token.symbol,
                    totalSupply: token.totalSupply,
                    address: data?.args?.share as Address,
                  }}
                  poolAddress={pairAddress as Address}
                  allowSell={Boolean(data?.args?.sellingAllowed)}
                  refetchArgs={refetchArgs}
                />
              )}
            </div>
          </div>

          <div className="w-full flex items-center justify-between my-4 md:my-12">
            <div className="text-lg md:text-xl">Project Details</div>
            <div className="flex items-center gap-x-1">
              <Logo />
              <span className='text-[#FFCD4D] [font-family:"Bebas_Neue"] text-lg md:text-3xl'>
                Honeypot Finance
              </span>
            </div>
          </div>

          <ProjectDetails
            token={token}
            tokenAddress={data?.args?.share}
            description={pool?.description}
          />
        </>
      )}
    </div>
  );
};

export default LBPDetail;
