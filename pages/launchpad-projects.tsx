import Link from "next/link";
import { observer } from "mobx-react-lite";
import { wallet } from "@/services/wallet";
import { useEffect, useState } from "react";
import { Button } from "@/components/button";
import launchpad from "@/services/launchpad";
import { NextLayoutPage } from "@/types/nextjs";
import { Tab, Tabs, Button as NextButton } from "@nextui-org/react";
import { motion } from "framer-motion";
import { defaultContainerVariants, itemPopUpVariants } from "@/lib/animation";
import { WrappedNextInputSearchBar } from "@/components/wrappedNextUI/SearchBar/WrappedInputSearchBar";
import LaunchPadProjectCard from "@/components/LaunchPadProjectCard";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { DataContainer } from "@/components/DataContainer";
import FjordHoneySdk from "@/services/fjord_honeypot_sdk";
import dayjs from "dayjs";
import { LaunchCardV3 } from "@/components/LaunchCard/v3";
import { HoneyContainer } from "@/components/CardContianer";

const MemeLaunchPage: NextLayoutPage = observer(() => {
  const [selectedTab, setSelectedTab] = useState<"all" | "my">("all");
  const [currentTime, setCurrentTime] = useState(dayjs().toISOString());
  const owner = selectedTab == "my" ? wallet.account : "";

  useEffect(() => {
    if (!wallet.isInit) {
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet.isInit]);

  return (
    <div className="w-full grow ">
      <div className="px-7 xl:max-w-[1280px] mx-full flex m-auto grow flex-col justify-center items-center sm:gap-y-5">
        <div className="flex justify-between">
          <Tabs
            aria-label="Options"
            variant="light"
            radius="sm"
            size="lg"
            classNames={{
              tab: "font-bold text-base leading-4 data-[selected=true]:bg-[#E18A2066] data-[selected=true]:backdrop-blur-[200] data-[selected=true]:border-1 data-[selected=true]:border-[#E18A2066s]",
              tabContent: "group-data-[selected=true]:text-[#ffffff]",
              cursor: "group-data-[selected=true]:bg-[#E18A2066]",
            }}
            defaultSelectedKey={selectedTab}
            selectedKey={selectedTab}
            onSelectionChange={(key) => {
              if (key === "all") {
                setSelectedTab(key);
              } else if (key === "my") {
                setSelectedTab(key);
              }
            }}
          >
            <Tab key="all" title="All Projects" />
            <Tab key="my" title="My Projects" />
          </Tabs>

          <div className="flex gap-5">
            <Button className="px-[38px] py-[12.5px] rounded-full outline-1 !bg-[#FFCD4D] border-2 border-[#E18A2066]">
              <Link
                href="/launch-project"
                className="text-black font-bold text-sm leading-4"
              >
                Launch Token
              </Link>
            </Button>
          </div>
        </div>
        <LiveProjects owner={owner} currentTime={currentTime} />
        <EndedProjects owner={owner} currentTime={currentTime} />
      </div>
    </div>
  );
});

export const LiveProjects = ({
  owner,
  currentTime,
}: {
  owner: string;
  currentTime: string;
}) => {
  const [search, setSearch] = useState("");
  const [take, setTake] = useState(10);

  const {
    data: LivePools,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["trendingMEMEs", search, owner, take, currentTime],
    queryFn: () => {
      return FjordHoneySdk.findManyPools({
        page: 1,
        take: take,
        search: search,
        filters: { owner: owner, endsAt: { gt: currentTime } },
      });
    },
    placeholderData: keepPreviousData,
  });

  return (
    <HoneyContainer>
      <div className="flex justify-between py-2 w-full">
        <h2 className="text-2xl font-bold">Live Projects</h2>
        <WrappedNextInputSearchBar
          value={search}
          className="max-w-[305px] w-[305px] h-[46px] flex"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>
      <DataContainer
        hasData={LivePools?.data && LivePools?.data?.length > 0}
        isLoading={isLoading || isFetching}
      >
        <div>
          <motion.div
            variants={defaultContainerVariants}
            initial="hidden"
            animate="visible"
            className={
              "grid gap-8 grid-cols-1 md:grid-cols-2 xl:gap-x-4 xl:gap-y-5 xl:grid-cols-4"
            }
          >
            {LivePools?.data?.map((pair, idx) => (
              <motion.div variants={itemPopUpVariants} key={idx}>
                <LaunchPadProjectCard
                  status={
                    dayjs(pair.startsAt).isAfter(dayjs()) ? "comming" : "live"
                  }
                  coverImg={pair.bannerUrl}
                  isShowCoverImage={true}
                  endDate={pair.endsAt}
                  startDate={pair.startsAt}
                  tokenName={pair.shareTokenName}
                  projectAuthor={pair.owner}
                  fundsRaised={pair.fundsRaised}
                  assetTokenSymbol={pair.assetTokenSymbol}
                  shareTokenSymbol={pair.imageUrl}
                  pairAddress={pair.address}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </DataContainer>
      <div className="flex justify-around my-5">
        <Button
          onClick={() => {
            setTake((prev) => (prev += 10));
          }}
        >
          {isFetching ? "Loading..." : "Load More"}
        </Button>
      </div>
    </HoneyContainer>
  );
};

export const EndedProjects = ({
  owner,
  currentTime,
}: {
  owner: string;
  currentTime: string;
}) => {
  const [search, setSearch] = useState("");
  const [take, setTake] = useState(10);

  const {
    data: endedPools,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["endedPools", search, owner, take, currentTime],
    queryFn: () => {
      return FjordHoneySdk.findManyPools({
        page: 1,
        take: take,
        search: search,
        filters: { owner: owner, endsAt: { lt: currentTime } },
      });
    },
  });

  return (
    <HoneyContainer>
      <div className="flex justify-between py-1 w-full">
        <h2 className="text-2xl font-bold">Ended Projects</h2>
        <WrappedNextInputSearchBar
          value={search}
          className="max-w-[305px] w-[305px] h-[46px] flex"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>
      <DataContainer
        hasData={endedPools?.data && endedPools?.data?.length > 0}
        isLoading={isLoading || isFetching}
        className="w-full"
      >
        <div className="w-full">
          <motion.div
            variants={defaultContainerVariants}
            initial="hidden"
            animate="visible"
            className={"flex flex-col gap-1 w-full"}
          >
            <div className="grid grid-cols-[52px_1fr_1fr_1fr_100px] gap-5 w-full text-black">
              <div className="text-base leading-[20px] font-bold"></div>
              <div className="text-base leading-[20px] font-bold">Project</div>
              <div className="text-base leading-[20px] font-bold">
                Raise Token
              </div>
              <div className="text-base leading-[20px] font-bold text-right"></div>
              <div className="text-base leading-[20px] font-bold">Action</div>
            </div>
            {endedPools?.data?.map((pair, idx) => (
              <motion.div
                variants={itemPopUpVariants}
                key={idx}
                className="w-full"
              >
                <LaunchPadProjectCard
                  status={"ended"}
                  coverImg={pair.bannerUrl}
                  isShowCoverImage={true}
                  endDate={pair.endsAt}
                  startDate={pair.startsAt}
                  tokenName={pair.shareTokenName}
                  projectAuthor={pair.owner}
                  fundsRaised={pair.fundsRaised}
                  assetTokenSymbol={pair.assetTokenSymbol}
                  shareTokenSymbol={pair.imageUrl}
                  pairAddress={pair.address}
                  variant="list"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </DataContainer>
      <div className="flex justify-around my-5">
        <Button
          onClick={() => {
            setTake((prev) => (prev += 10));
          }}
        >
          {isFetching ? "Loading..." : "Load More"}
        </Button>
      </div>
    </HoneyContainer>
  );
};

export default MemeLaunchPage;
