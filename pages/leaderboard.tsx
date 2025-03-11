import { useState } from "react";
import { debounce } from "lodash";
import { Link, Tooltip } from "@nextui-org/react";
import { useTotalUsers } from "@/lib/hooks/useTotalUsers";
import CardContainer from "@/components/CardContianer/v3";
import { useLeaderboard } from "@/lib/hooks/useLeaderboard";
import { shortenAddressString, formatVolume } from "@/lib/utils";
import { wallet } from "@/services/wallet";
import {
  useAccounts,
  useTopSwapAccounts,
  useTopPot2PumpDeployer,
  useTopParticipateAccounts,
} from "@/lib/hooks/useAccounts";
import { DynamicFormatAmount } from "@/lib/algebra/utils/common/formatAmount";
import { launchedProjects } from "@/config/launchedProjects";
import Image from "next/image";
interface LeaderboardItem {
  rank: number;
  walletAddress: string;
  username?: string;
  xp: number;
  totalVolume?: number;
  transactions?: number;
  lastActive?: string;
}

interface StatsCard {
  title: string;
  value: string | number;
  subValue?: string;
  decimals?: number;
}

const LeaderboardPage = () => {
  const [searchAddress, setSearchAddress] = useState("");
  const searchDebounceHandler = debounce(setSearchAddress, 500);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const statsCards: StatsCard[] = [
    {
      title: "Total Fund Raised",
      value: launchedProjects.reduce(
        (acc, project) => acc + project.raisedFund,
        0
      ),
      decimals: 2,
    },
    {
      title: "Total Participants",
      value: launchedProjects.reduce(
        (acc, project) => acc + project.participants,
        0
      ),
      decimals: 0,
    },
  ];

  return (
    <CardContainer className="xl:max-w-[1200px] mx-auto w-[calc(100%-32px)]">
      <div className="max-w-[1200px] w-full mx-auto">
        <div className="max-w-full xl:max-w-[1200px] mx-auto">
          {/* 顶部统计卡片 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {statsCards.map((stat, index) => (
              <div
                key={index}
                className="bg-[#202020] rounded-2xl p-5"
              >
                <div className="text-gray-400 text-sm mb-2">{stat.title}</div>
                <div className="text-white text-xl font-medium">
                  {DynamicFormatAmount({
                    amount: stat.value,
                    decimals: stat.decimals,
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* 交易数据表格 */}
          <div className="bg-[#202020] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#5C5C5C]">
              <h2 className="text-xl text-white font-bold">Leaderboard</h2>
            </div>
            <div className="p-6">
              <div className="border border-[#5C5C5C] rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#323232] text-white border-b border-[#5C5C5C]">
                    <tr>
                      <th className="py-4 px-6 text-left text-base font-medium whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-[#FFCD4D] rounded"></div>
                          Project
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left text-base font-medium whitespace-nowrap">
                        Fund Raised
                      </th>
                      <th className="py-4 px-6 text-center text-base font-medium whitespace-nowrap">
                        Participants
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-white divide-y divide-[#5C5C5C]">
                    {launchedProjects.map((project) => (
                      <tr key={project.symbol}>
                        <td className="py-4 px-6 text-left text-base whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Image
                              src={project.image}
                              alt={project.symbol}
                              width={24}
                              height={24}
                              className="rounded-full overflow-hidden object-cover w-6 h-6"
                            />
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-medium">
                                {project.name}
                              </span>
                              <span className="text-sm font-medium">
                                ${project.symbol}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-left text-base whitespace-nowrap">
                          {DynamicFormatAmount({
                            amount: project.raisedFund,
                            decimals: 0,
                          })}
                        </td>
                        <td className="py-4 px-6 text-center text-base whitespace-nowrap">
                          {project.participants}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* <div className="px-6 py-4 flex justify-end border-t border-gray-700">
              <div className="flex items-center gap-6 max-w-[400px]">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a3a3a] transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Previous
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Page</span>
                    <span className="px-3 py-1 bg-[#1a1a1a] rounded text-white min-w-[40px] text-center">
                      {page}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (hasMore) {
                        loadMore().then(() => setPage((p) => p + 1));
                      }
                    }}
                    disabled={!hasMore || accountsLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a3a3a] transition-colors"
                  >
                    Next
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>

                {accountsLoading && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <svg
                      className="animate-spin h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Loading...
                  </div>
                )}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </CardContainer>
  );
};

export default LeaderboardPage;
