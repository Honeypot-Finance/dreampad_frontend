import { observer } from "mobx-react-lite";
import { swap } from "@/services/swap";
import { Button } from "@/components/button";
import { useEffect, useState } from "react";
import { wallet } from "@/services/wallet";
import { liquidity } from "@/services/liquidity";
import { Input } from "@nextui-org/react";
import Image from "next/image";

import { LoadingContainer } from "@/components/LoadingDisplay/LoadingDisplay";
import { SpinnerContainer } from "@/components/Spinner";
import { ExchangeSvg } from "@/components/svg/exchange";
import { berachainBartioTestnet } from "@/lib/chain";
import { createPublicClientByChain } from "@/lib/client";
import { Address, formatUnits, maxUint256, parseUnits } from "viem";
import { formatErc20Data } from "@/services/lib/helper";
import { useAccount, useWriteContract } from "wagmi";
import useMulticall3 from "@/components/hooks/useMulticall3";
import { ERC20ABI } from "@/lib/abis/erc20";
import { useDebouncedCallback } from "@/hooks";
import { LiquidityBootstrapPoolABI } from "@/lib/abis/LiquidityBootstrapPoolAbi";
import { WrappedToastify } from "@/lib/wrappedToastify";
import { useMutation } from "@tanstack/react-query";
import { waitForTransactionReceipt } from "@wagmi/core";
import { config } from "@/config/wagmi";
import { NumericFormat } from "react-number-format";
import TokenSelected from "./TokenSelected";
import FjordHoneySdk, { TCreateSwap } from "@/services/fjord_honeypot_sdk";

type AssetToken = {
  name: string;
  symbol: string;
  decimals: number;
  address: Address;
  totalSupply: {
    type: "BigNumber";
    hex: string;
  };
};

type Props = {
  sharePriceInAsset: string;
  poolId: string;
  asset: AssetToken;
  share: AssetToken;
  allowSell: boolean;
  poolAddress: Address;
  refetchArgs: () => void;
};

const BuySellTabs = [
  { title: "Buy", key: "buy" },
  { title: "Sell", key: "sell" },
];

type SwapToken = {
  from?: number;
  to?: number;
};

const client = createPublicClientByChain(berachainBartioTestnet);
export const SwapCard = observer(
  ({
    asset,
    share,
    allowSell,
    poolAddress,
    poolId,
    refetchArgs,
    sharePriceInAsset,
  }: Props) => {
    const isInit = wallet.isInit && liquidity.isInit;
    // const isInit = true;

    useEffect(() => {
      if (!wallet.isInit) {
        return;
      }
      liquidity.initPool();
    }, [wallet.isInit]);

    const [actionTab, setActionTab] = useState<"buy" | "sell">("buy");
    const account = useAccount();
    const [isTxLoading, setIsTxLoading] = useState(false);
    const [swapToken, setSwapToken] = useState<SwapToken>({
      from: undefined,
      to: undefined,
    });

    const [tokens, setTokens] = useState<{
      asset: AssetToken;
      share: AssetToken;
    }>();

    const { mutateAsync: createSwapAsync } = useMutation({
      mutationKey: ["createSwap", poolId],
      mutationFn: async (data: TCreateSwap) => {
        return await FjordHoneySdk.createSwap(data);
      },
      onError: (err) => {
        console.log(err);
      },
    });

    const { mutateAsync: previewSharesOut, error: previewSharesOutError } =
      useMutation({
        mutationKey: ["previewSharesOut", poolAddress],
        mutationFn: async (value: bigint) => {
          const res = await client.readContract({
            address: poolAddress as Address,
            abi: LiquidityBootstrapPoolABI,
            functionName: "previewSharesOut",
            args: [value],
          });
          return res;
        },
      });

    const { mutateAsync: previewAssetsIn, error: previewAssetsInError } =
      useMutation({
        mutationKey: ["previewAssetsIn", poolAddress],
        mutationFn: async (value: bigint) => {
          const res = await client.readContract({
            address: poolAddress as Address,
            abi: LiquidityBootstrapPoolABI,
            functionName: "previewAssetsIn",
            args: [value],
          });
          return res;
        },
      });

    const { mutateAsync: previewAssetsOut, error: previewAssetsOutError } =
      useMutation({
        mutationKey: ["previewAssetsOut", poolAddress],
        mutationFn: async (value: bigint) => {
          const res = await client.readContract({
            address: poolAddress as Address,
            abi: LiquidityBootstrapPoolABI,
            functionName: "previewAssetsOut",
            args: [value],
          });
          return res;
        },
      });

    const { mutateAsync: previewSharesIn, error: previewSharesInError } =
      useMutation({
        mutationKey: ["previewSharesIn", poolAddress],
        mutationFn: async (value: bigint) => {
          const res = await client.readContract({
            address: poolAddress as Address,
            abi: LiquidityBootstrapPoolABI,
            functionName: "previewSharesIn",
            args: [value],
          });
          return res;
        },
      });

    const handleChangeTokenValue = useDebouncedCallback(
      async (value: number | undefined, type: "from" | "to") => {
        console.log(value);
        if (value) {
          try {
            if (actionTab === "buy" && type === "from") {
              const data = await previewSharesOut(
                parseUnits(`${value}`, tokens?.asset.decimals ?? 18)
              );

              const formatedData = data
                ? +formatUnits(data, tokens?.share.decimals ?? 18)
                : 0;

              setSwapToken((prev) => ({
                ...prev,
                from: value,
                to: formatedData,
              }));
            }
            if (actionTab === "buy" && type === "to") {
              const data = await previewAssetsIn(
                parseUnits(`${value}`, tokens?.share.decimals ?? 18)
              );
              const formatedData = data
                ? +formatUnits(data, tokens?.asset.decimals ?? 18)
                : 0;
              setSwapToken((prev) => ({
                ...prev,
                to: value,
                from: formatedData,
              }));
            }

            if (actionTab === "sell" && type === "from") {
              const data = await previewAssetsOut(
                parseUnits(`${value}`, tokens?.share.decimals ?? 18)
              );

              const formatedData = data
                ? +formatUnits(data, tokens?.asset.decimals ?? 18)
                : 0;

              setSwapToken((prev) => ({
                ...prev,
                from: value,
                to: formatedData,
              }));
            }

            if (actionTab === "sell" && type === "to") {
              const data = await previewSharesIn(
                parseUnits(`${value}`, tokens?.asset.decimals ?? 18)
              );

              const formatedData = data
                ? +formatUnits(data, tokens?.share.decimals ?? 18)
                : 0;
              setSwapToken((prev) => ({
                ...prev,
                from: formatedData,
                to: value,
              }));
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log("Else");
          setSwapToken({ from: undefined, to: undefined });
        }
      },
      500
    );

    const { writeContractAsync } = useWriteContract();

    const { data, refetch } = useMulticall3({
      queryKey: ["tokens", tokens?.asset.address],
      contractCallContext: [
        {
          abi: ERC20ABI as any,
          contractAddress: tokens?.asset.address!,
          reference: "erc20",
          calls: [
            {
              methodName: "balanceOf",
              reference: "balanceOf",
              methodParameters: [account?.address],
            },
            {
              methodName: "allowance",
              reference: "allowance",
              methodParameters: [account?.address, poolAddress],
            },
            {
              methodName: "decimals",
              reference: "decimals",
              methodParameters: [],
            },
          ],
        },
      ],
      enabled: Boolean(tokens?.asset.address),
    });
    const userAsset =
      data?.results && formatErc20Data(data.results.erc20.callsReturnContext);

    useEffect(() => {
      setTokens({
        asset: asset,
        share: share,
      });
    }, [asset.name && share.name]);

    const handleChangeTab = (key: "buy" | "sell") => {
      if (key === "sell") {
        setTokens({
          asset: share,
          share: asset,
        });
        setActionTab(key);
      } else {
        setTokens({
          asset: asset,
          share: share,
        });
        setActionTab(key);
      }
    };

    const isSufficientBalance =
      +formatUnits(userAsset?.balanceOf ?? 0, userAsset?.decimals ?? 0) -
        (swapToken?.from ?? 0) >=
      0;

    const isApproved = userAsset?.allowance === BigInt(0);

    const handleApproval = async () => {
      if (tokens?.asset) {
        try {
          setIsTxLoading(true);
          const txHash = await writeContractAsync({
            abi: ERC20ABI,
            address: tokens?.asset.address,
            functionName: "approve",
            args: [poolAddress, maxUint256],
          });

          await waitForTransactionReceipt(config, {
            hash: txHash,
            confirmations: 2,
            timeout: 1000 * 60 * 5,
          });

          await refetch();
          WrappedToastify.success({ message: "Approved successfully" });
        } catch (e: any) {
          console.log(e);
          WrappedToastify.error({ message: "Approval Failed" });
        }
      }
      setIsTxLoading(false);
    };

    const handleWriteContract = async () => {
      setIsTxLoading(true);
      try {
        let hash;

        console.log(actionTab);

        if (actionTab === "buy") {
          hash = await writeContractAsync({
            abi: LiquidityBootstrapPoolABI,
            address: poolAddress,
            functionName: "swapExactAssetsForShares",
            args: [
              parseUnits(
                swapToken?.from?.toString() || "",
                tokens!.asset.decimals
              ),
              parseUnits(
                swapToken?.to?.toString() || "",
                tokens!.share.decimals
              ),
              account.address as Address,
            ],
          });
        } else {
          hash = await writeContractAsync({
            abi: LiquidityBootstrapPoolABI,
            address: poolAddress,
            functionName: "swapExactSharesForAssets",
            args: [
              parseUnits(
                swapToken?.from?.toString() || "",
                tokens!.asset.decimals
              ),
              parseUnits(
                swapToken?.to?.toString() || "",
                tokens!.share.decimals
              ),
              account.address as Address,
            ],
          });
        }
        if (hash) {
          const result = await waitForTransactionReceipt(config, {
            hash: hash,
            confirmations: 2,
            timeout: 1000 * 60 * 5,
          });

          await createSwapAsync({
            txHash: hash,
            poolId: poolId,
            type: actionTab,
            tokenIn: asset.address,
            tokenInSym: asset.symbol,
            tokenOut: share.address,
            tokenOutSym: share.symbol,
            tokenAmountIn: parseUnits(
              swapToken?.from?.toString() || "",
              tokens!.asset.decimals
            ).toString(),
            tokenAmountOut: parseUnits(
              swapToken?.to?.toString() || "",
              tokens!.share.decimals
            ).toString(),
            walletAddress: account.address as string,
            blockHash: result.blockHash,
            logIndex: 0,
            status: result.status == "success" ? "success" : "failed",
            assetPriceProxyRoundId: "1",
            assetPriceValue: "1",
            sharePriceInAsset: sharePriceInAsset,
            sharePriceInUsd: "1",
            swapFee: "0.03",
            chainIn: Number(result.chainId.toString()),
            chainOut: Number(result.chainId.toString()),
            blockNumber: Number(result.blockNumber.toString()),
          });

          WrappedToastify.success({ message: "Transaction Successfully" });
        }
      } catch (error: any) {
        console.log(error);
        WrappedToastify.error({
          message: "Something went wrong! Please try again!",
        });
      }
      setIsTxLoading(false);
      refetchArgs();
      setSwapToken({ from: undefined, to: undefined });
    };

    const isInValidInput = Boolean(
      previewSharesOutError ||
        previewAssetsInError ||
        previewAssetsOutError ||
        previewSharesInError
    );

    return (
      <SpinnerContainer
        className="flex flex-1 justify-around items-center lg:max-w-[574px]"
        isLoading={false}
      >
        <div className=" flex flex-1 flex-col justify-center items-start gap-[23px] [background:var(--card-color,#271A0C)] p-[20px] rounded-[20px] border-3 border-solid border-[#F7931A10] hover:border-[#F7931A] transition-all">
          <LoadingContainer isLoading={!isInit}>
            <>
              <div className="flex items-center justify-between w-full  text-[color:var(--Button-Gradient,#F7931A)] text-base font-bold leading-3 tracking-[0.16px]"></div>
              <div className="flex flex-col lg:flex-row justify-between items-center w-full mt-8">
                <div className="flex flex-col gap-2">
                  <div className="text-sm leading-3 font-normal text-white/50">
                    From
                  </div>
                  <NumericFormat
                    customInput={Input}
                    placeholder="0.0"
                    classNames={{
                      inputWrapper:
                        "px-0 bg-transparent data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent",
                      input: "leading-6 text-[21px] font-bold",
                    }}
                    value={swapToken.from ?? ""}
                    onChange={({ target }) =>
                      handleChangeTokenValue(Number(target.value), "from")
                    }
                  />
                </div>
                <div className="flex flex-col items-end w-full lg:w-[unset]">
                  {!!swap.fromToken && (
                    <div className="flex items-center">
                      <div className="text-sub">
                        Balance:{" "}
                        {
                          +formatUnits(
                            userAsset?.balanceOf ?? 0,
                            userAsset?.decimals ?? 0
                          )
                        }
                      </div>
                      <div
                        onClick={() => {
                          handleChangeTokenValue(
                            +formatUnits(
                              userAsset?.balanceOf ?? 0,
                              userAsset?.decimals ?? 0
                            ) || 0,
                            "from"
                          );
                        }}
                        className=" pb-2 cursor-pointer text-[color:var(--Button-Gradient,#F7931A)] ml-[8px] font-bold  underline"
                      >
                        <Image
                          src={"/images/icons/artisticTexts/MAX.svg"}
                          alt={""}
                          width={40}
                          height={40}
                        ></Image>
                      </div>
                    </div>
                  )}
                  <div className="my-3 py-2.5">
                    <TokenSelected
                      address={tokens?.asset?.address ?? ""}
                      symbol={tokens?.asset?.symbol ?? ""}
                    />
                  </div>
                </div>
              </div>
              <div className="flex w-full items-center gap-[5px]">
                <div className=" h-px flex-[1_0_0] [background:rgba(247,147,26,0.20)] rounded-[100px]"></div>
                {allowSell && (
                  <ExchangeSvg
                    className=" cursor-pointer hover:rotate-180 transition-all"
                    onClick={() => {
                      handleChangeTab(actionTab == "buy" ? "sell" : "buy");
                    }}
                  ></ExchangeSvg>
                )}
                <div className=" h-px flex-[1_0_0] [background:rgba(247,147,26,0.20)] rounded-[100px] my-8"></div>
              </div>
              <div className="flex flex-col lg:flex-row justify-between items-center w-full mb-8">
                <div className="flex flex-col gap-2">
                  <div className="text-sm leading-3 font-normal text-white/50">
                    To
                  </div>
                  <NumericFormat
                    customInput={Input}
                    placeholder="0.0"
                    classNames={{
                      inputWrapper:
                        "px-0 bg-transparent data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent",
                      input: "leading-6 text-[21px] font-bold",
                    }}
                    value={swapToken.to ?? ""}
                    onChange={({ target }) =>
                      handleChangeTokenValue(Number(target.value), "to")
                    }
                  />
                </div>
                <div className="flex flex-col items-end w-full lg:w-[unset]">
                  <div className="my-3 py-2.5">
                    <TokenSelected
                      address={tokens?.share?.address ?? ""}
                      symbol={tokens?.share?.symbol ?? ""}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-5 flex flex-col gap-4 w-full">
                {isApproved ? (
                  <Button
                    className="w-full"
                    onClick={handleApproval}
                    isDisabled={isInValidInput}
                  >
                    {isTxLoading ? "Approving" : "Approval"}
                  </Button>
                ) : (
                  <Button
                    isDisabled={
                      !isSufficientBalance || isInValidInput || isTxLoading
                    }
                    className="w-full"
                    onClick={handleWriteContract}
                  >
                    {isSufficientBalance ? (
                      <span>{isTxLoading ? "Buying" : "Buy"}</span>
                    ) : (
                      "Insufficient balance"
                    )}
                  </Button>
                )}
                <div className="text-sm cursor-pointer leading-3 font-normal text-center text-white/50">
                  {/* Add token name to wallet */}
                </div>
              </div>
            </>
          </LoadingContainer>
        </div>
      </SpinnerContainer>
    );
  }
);

export default SwapCard;
