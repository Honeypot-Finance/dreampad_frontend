"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import CardContainer from "@/components/CardContianer/v3";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import { useRouter } from "next/router";
import BigNumber from "bignumber.js";
import { Address } from "viem";
import dayjs from "dayjs";
import { WarningBanner } from "./WarningBanner";
import { networksMap } from "@/services/chain";
import { DEFAULT_CHAIN_ID } from "@/config/algebra/default-chain-id";
import Countdown from "react-countdown";
import { DynamicFormatAmount } from "@/lib/algebra/utils/common/formatAmount";
import { useLbpLaunch } from "@/lib/algebra/graphql/clients/lbp";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Tooltip } from "@nextui-org/react";
import { truncate } from "@/lib/format";
import { observer } from "mobx-react-lite";
import { isObservable } from "mobx";
import { LbpLaunch } from "@/services/contract/launches/lbp/lbpPair";
import LbpActionComponent from "./LbpActionComponent";
import { LbpSalePercent } from "./LbpSalePercent";
import { LbpTransactionTable } from "./LbpTransactionTable";

const LBPDetailPage = observer(() => {
  const router = useRouter();
  const [lbpLaunch, setLbpLaunch] = useState<LbpLaunch | null>(null);
  const { pair: pairAddress } = router.query;
  const { data, loading, error } = useLbpLaunch(
    pairAddress?.toString().toLowerCase() as Address
  );

  useEffect(() => {
    if (data) {
      setLbpLaunch(data);
    }
  }, [data]);

  return (
    <div className="min-h-screen relative w-full font-gliker">
      <div className="container mx-auto max-w-[1520px] space-y-[72px]">
        <CardContainer showBottomBorder={false}>
          <div className="w-full lg:grid lg:grid-cols-5 gap-8 p-8">
            <div className="w-full space-y-4 lg:col-span-2 lg:pr-5 mb-5">
              <div className="space-y-2">
                <div className="flex justify-center items-center w-[74px] h-[32px] bg-white rounded-[4px] border-[0.75px] border-[#202020] shadow-[1px_1px_0px_0px_#000] text-[14px]">
                  ${lbpLaunch?.shareToken?.symbol}
                </div>

                <h1 className="text-[30px] text-[#0D0D0D] font-gliker text-stroke-0.5 text-stroke-white text-shadow-[1px_2px_0px_#AF7F3D]">
                  {lbpLaunch?.shareToken?.name}
                </h1>
                <p className="text-[#4D4D4D]">{lbpLaunch?.resume}</p>
              </div>

              <div className="rounded-[16px] border border-black bg-white shadow-[4px_4px_0px_0px_#D29A0D] p-4">
                <div className="divide-y divide-black">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-[#4D4D4D] text-xs">
                      Token Sale Type
                    </span>
                    <div className="text-[#202020] text-base flex items-center gap-1">
                      LBP
                      {/* <Image
                        src="/images/lbp-detail/logo/link.svg"
                        alt="link"
                        width={16}
                        height={16}
                      /> */}
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-[#4D4D4D] text-xs">
                      Network Chain
                    </span>
                    <div className="text-[#202020] text-base flex items-center gap-1">
                      {
                        networksMap[lbpLaunch?.chainId ?? DEFAULT_CHAIN_ID]
                          .chain.name
                      }
                      <Image
                        src={
                          networksMap[lbpLaunch?.chainId ?? DEFAULT_CHAIN_ID]
                            .chainImageUrl
                        }
                        alt="chain"
                        width={16}
                        height={16}
                      />
                    </div>
                  </div>
                  {/* <div className="flex items-center justify-between py-2">
                    <span className="text-[#4D4D4D] text-xs">
                      Token Vesting
                    </span>
                    <div className="text-[#202020] text-base flex items-center gap-1">
                      None
                      <Image
                        src="/images/lbp-detail/logo/lock.svg"
                        alt="lock"
                        width={16}
                        height={16}
                      />
                    </div>
                  </div> */}
                  <div className="flex items-center justify-between py-2">
                    <span className="text-[#4D4D4D] text-xs">
                      Launch Partner
                    </span>
                    <div className="text-[#202020] text-base flex items-center gap-1 text-right">
                      Honeypot Finance
                      <Image
                        src="/images/lbp-detail/logo/honeypot.png"
                        alt="honeypot"
                        width={16}
                        height={16}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-[#4D4D4D] text-xs">Round Type</span>
                    <div className="text-[#202020] text-base flex items-center gap-1">
                      Public
                      <Image
                        src="/images/lbp-detail/logo/person.svg"
                        alt="person"
                        width={16}
                        height={16}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Logo */}
            <div className="relative w-full h-[400px] object-contain col-span-3 lg:pl-[50px]">
              <Image
                src={lbpLaunch?.imageUrl ?? ""}
                alt="Logo"
                className="absolute h-[150px] w-[150px] object-cover top-[50%] left-[50%] lg:left-[0px] translate-x-[-50%] lg:translate-x-[-10%] translate-y-[-50%] z-10 rounded-full border-amber-300 border-[1rem] bg-amber-300 "
                width={500}
                height={500}
                priority
              />
              <Image
                src={lbpLaunch?.lbpBanner || lbpLaunch?.bannerUrl || ""}
                alt="Banner"
                className="relative w-full h-full object-cover col-span-3"
                width={500}
                height={500}
                priority
              />
            </div>
          </div>
        </CardContainer>

        <CardContainer
          className="bg-transparent border-3 border-[#FFCD4D] px-8 grid grid-cols-6 gap-y-7 gap-x-6 items-start"
          showBottomBorder={false}
        >
          <WarningBanner />

          <CardContainer className="col-span-6 lg:col-span-4">
            <div className="space-y-6 w-full">
              <div className="lg:grid lg:grid-cols-[220px_1fr] gap-6 items-start ">
                <div className="space-y-4 mb-2">
                  <div className="bg-white rounded-[16px] border border-black p-5 shadow-[4px_4px_0px_0px_#D29A0D] hover:shadow-[2px_2px_0px_0px_#D29A0D] transition-shadow">
                    <div className="text-sm text-[#4D4D4D] mb-2 text-center">
                      Price per {lbpLaunch?.assetToken?.symbol}
                    </div>
                    <div className="text-[24px] text-white text-shadow-[1.481px_2.963px_0px_#AF7F3D] text-stroke-1 text-stroke-black text-center">
                      {DynamicFormatAmount({
                        amount:
                          lbpLaunch?.assetTokenPerShareToken.toString() ?? 0,
                        decimals: 2,
                        endWith: lbpLaunch?.shareToken?.symbol ?? "",
                      })}
                    </div>
                  </div>
                  <div className="bg-white rounded-[16px] border border-black p-5 shadow-[4px_4px_0px_0px_#D29A0D] hover:shadow-[2px_2px_0px_0px_#D29A0D] transition-shadow">
                    <div className="text-sm text-[#4D4D4D] mb-2 text-center">
                      Funds Raised
                    </div>
                    <div className="text-[24px] text-white text-shadow-[1.481px_2.963px_0px_#AF7F3D] text-stroke-1 text-stroke-black text-center">
                      {DynamicFormatAmount({
                        amount: lbpLaunch?.fundsRaised.toString() ?? 0,
                        decimals: 2,
                        endWith: lbpLaunch?.assetToken?.symbol ?? "",
                      })}
                    </div>
                  </div>
                  <div className="bg-white rounded-[16px] border border-black p-5 shadow-[4px_4px_0px_0px_#D29A0D] hover:shadow-[2px_2px_0px_0px_#D29A0D] transition-shadow">
                    <div className="text-sm text-[#171414] mb-2 text-center">
                      Sale Marketcap
                    </div>
                    <div className="text-[24px] text-white text-shadow-[1.481px_2.963px_0px_#AF7F3D] text-stroke-1 text-stroke-black text-center">
                      {DynamicFormatAmount({
                        amount: lbpLaunch?.maxAssets?.toString() ?? 0,
                        decimals: 2,
                        endWith: lbpLaunch?.assetToken?.symbol ?? "",
                      })}
                    </div>
                  </div>
                </div>
                {lbpLaunch && <LbpTransactionTable lbpLaunch={lbpLaunch} />}
              </div>
              {lbpLaunch && <LbpSalePercent lbpLaunch={lbpLaunch} />}
            </div>
          </CardContainer>

          <div className="col-span-6 lg:col-span-2 h-full">
            <CardContainer>
              <div className="space-y-4 w-full">
                {lbpLaunch && <LbpActionComponent lbpLaunch={lbpLaunch} />}
              </div>
            </CardContainer>
          </div>
        </CardContainer>
        <CardContainer
          className="bg-white border-3 border-[#FFCD4D] px-[50px] py-[100px]"
          showBottomBorder={false}
        >
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => (
                <a
                  {...props}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {props.children}
                </a>
              ),
            }}
            remarkPlugins={[remarkGfm]}
          >
            {lbpLaunch?.description}
          </ReactMarkdown>
        </CardContainer>
      </div>
    </div>
  );
});

export default LBPDetailPage;
