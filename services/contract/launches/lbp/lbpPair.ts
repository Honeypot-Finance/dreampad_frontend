import { lbpMetadatas } from "@/config/lbpmetadata";
import BigNumber from "bignumber.js";
import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Address, getContract, zeroAddress } from "viem";
import { Token } from "../../token";
import { LiquidityBootstrapPoolABI } from "@/lib/abis/LiquidityBootstrapPoolAbi";
import { wallet } from "../../../wallet";
import { DEFAULT_CHAIN_ID } from "@/config/algebra/default-chain-id";
import dayjs, { Dayjs } from "dayjs";
import { ContractWrite } from "@/services/utils";

export enum LAUNCH_STATUS {
  NOT_STARTED,
  STARTED,
  ENDED,
  CANCELLED,
  CLOSED,
}

export class LbpLaunch {
  address: Address | undefined;
  abi = LiquidityBootstrapPoolABI;

  //input data
  amountIn: BigNumber = new BigNumber(0);

  //calculated data
  amountOut: BigNumber = new BigNumber(0);

  //subgraph data
  totalAssetsIn: BigNumber | undefined;
  closed: boolean | undefined;

  buys: {
    id: string;
    caller: Address;
    shares: BigNumber;
    assets: BigNumber;
    timestamp: string;
  }[] = [];

  sells: {
    id: string;
    caller: Address;
    shares: BigNumber;
    assets: BigNumber;
    timestamp: number;
  }[] = [];

  //onchain data
  assetToken: Token | undefined;
  shareToken: Token | undefined;
  startsAt: Dayjs = dayjs();
  endsAt: Dayjs = dayjs();
  canccled: boolean = false;
  assetTokenPerShareToken: BigNumber = new BigNumber(0);
  fundsRaised: BigNumber = new BigNumber(0);
  maxAssets: BigNumber = new BigNumber(0);
  totalPurchased: BigNumber = new BigNumber(0);
  assetReserves: BigNumber = new BigNumber(0);
  shareReserves: BigNumber = new BigNumber(0);
  assetWeight: BigNumber = new BigNumber(0);
  shareWeight: BigNumber = new BigNumber(0);
  userPurchasedShares: BigNumber = new BigNumber(0);

  //metadata
  chainId: number = DEFAULT_CHAIN_ID;
  name: string = "";
  owner: Address = zeroAddress;
  description: string = "";
  whitelistUrl: string = "";
  disclaimerUrl: string = "";
  swapCount: number = 0;
  swapFee: number = 0;
  swapEnabled: number = 0;
  learnMoreUrl: string = "";
  imageUrl: string = "";
  blockNumber: number = 0;
  sellingAllowed: boolean = false;
  socials: {
    id: string;
    url: string;
    name: string;
    joinedAt: string;
    provider: string;
    username: string;
    followers: number;
    image_url: string;
  }[] = [];
  version: number = 0;
  blockedCountries: string[] = [];
  txHash: string = "";
  bannerUrl: string = "";
  lbpBanner: string = "";
  lbpMarketcap: BigNumber = new BigNumber(0);
  liquidity: BigNumber = new BigNumber(0);
  platformFee: number = 0;
  sharesInitial: BigNumber = new BigNumber(0);
  sharesReleased: BigNumber = new BigNumber(0);
  vestCliffStart: string = "";
  vestEnd: string = "";
  volume: BigNumber = new BigNumber(0);
  weightEnd: BigNumber = new BigNumber(0);
  weightStart: BigNumber = new BigNumber(0);
  assetsCurrent: BigNumber = new BigNumber(0);
  numberParticipants: number = 0;
  customTotalSupply: BigNumber = new BigNumber(0);
  liquidiyTransparency: string = "";
  virtualAssets: BigNumber = new BigNumber(0);
  ecosystem: string = "evm";
  resume: string = "";

  constructor({ address, ...args }: { address: Address } & Partial<LbpLaunch>) {
    Object.assign(this, args);
    this.address = address;
    makeAutoObservable(this);
  }

  get contract() {
    return getContract({
      address: this.address as `0x${string}`,
      abi: this.abi,
      client: { public: wallet.publicClient, wallet: wallet.walletClient },
    });
  }

  get totalShares() {
    return this.totalPurchased?.plus(this.shareReserves);
  }

  get launchStatus() {
    if (this.canccled) {
      return LAUNCH_STATUS.CANCELLED;
    }

    if (this.closed) {
      return LAUNCH_STATUS.CLOSED;
    }

    if (this.startsAt.isAfter(dayjs())) {
      return LAUNCH_STATUS.NOT_STARTED;
    }

    if (this.endsAt.isBefore(dayjs())) {
      return LAUNCH_STATUS.ENDED;
    }

    return LAUNCH_STATUS.STARTED;
  }
  get launchStatusDisplay() {
    switch (this.launchStatus) {
      case LAUNCH_STATUS.CANCELLED:
        return "Cancelled";
      case LAUNCH_STATUS.CLOSED:
        return "Closed";
      case LAUNCH_STATUS.ENDED:
        return "Ended";
      case LAUNCH_STATUS.NOT_STARTED:
        return "Not Started";
      case LAUNCH_STATUS.STARTED:
        return "Started";
    }
  }

  get saleStatus() {
    const now = dayjs();
    if (now.isBefore(this.startsAt)) {
      return "upcoming";
    }
  }

  async loadOnchainData() {
    if (!this.address) {
      return;
    }

    //load both tokens
    await Promise.all([
      this.loadAssetToken(),
      this.loadShareToken(),
      this.loadSaleTimeFrame(),
      this.loadIsProjectClosed(),
      this.loadIsProjectCancelled(),
      this.loadUserPurchasedShares(),
    ]);

    //load onchain data functions that depends on the other data
    await Promise.all([
      this.loadAssetTokenPerShareToken(),
      this.loadTotalPurchasedShares(),
      this.loadReservesAndWeight(),
      this.loadFundsRaised(),
      this.loadMaxAssets(),
    ]);
  }

  async loadMetadata() {
    if (!this.address) {
      return;
    }

    const metadata = lbpMetadatas[this.address.toLowerCase() as Address];
    if (metadata) {
      Object.assign(this, metadata);
    }
  }

  async loadAssetToken() {
    if (!this.address) {
      return;
    }
    const asset = await this.contract.read.asset();
    const assetToken = Token.getToken({
      address: asset,
      force: true,
    });

    this.assetToken = assetToken;

    console.log("assetToken", this.assetToken);
    return this.assetToken;
  }

  async loadShareToken() {
    if (!this.address) {
      return;
    }

    const share = await this.contract.read.share();

    const shareToken = Token.getToken({
      address: share,
      force: true,
    });

    this.shareToken = shareToken;

    console.log("shareToken", this.shareToken);

    return this.shareToken;
  }

  async simulateBuyAmountOut(amountIn: BigNumber) {
    if (
      !this.address ||
      this.closed ||
      this.saleStatus === "upcoming" ||
      this.saleStatus === "ended"
    ) {
      return new BigNumber(0);
    }
    console.log("simulateBuyAmountOut", amountIn);

    const amountOut = await this.contract.read.previewSharesOut([
      BigInt(
        amountIn.times(10 ** (this.assetToken?.decimals ?? 18)).toString()
      ),
    ]);
    console.log("amountOut", amountOut);

    this.amountOut = new BigNumber(amountOut.toString()).div(
      10 ** (this.shareToken?.decimals ?? 18)
    );

    return this.amountOut;
  }

  async loadIsProjectClosed(): Promise<boolean> {
    if (!this.address) {
      return false;
    }

    const isClosed = await this.contract.read.closed();

    this.closed = isClosed;

    return isClosed;
  }

  async loadIsProjectCancelled(): Promise<boolean> {
    if (!this.address) {
      return false;
    }

    const isCancelled = await this.contract.read.cancelled();

    this.canccled = isCancelled;

    return isCancelled;
  }

  async loadSaleTimeFrame(): Promise<{
    startsAt: Date;
    endsAt: Date;
  }> {
    if (!this.address) {
      return {
        startsAt: new Date(),
        endsAt: new Date(),
      };
    }

    const startsAt = await this.contract.read.saleStart();
    const endsAt = await this.contract.read.saleEnd();

    this.startsAt = dayjs(Number(startsAt) * 1000);
    this.endsAt = dayjs(Number(endsAt) * 1000);

    return {
      startsAt: new Date(startsAt.toString()),
      endsAt: new Date(endsAt.toString()),
    };
  }

  async loadAssetTokenPerShareToken() {
    if (
      !this.address ||
      this.saleStatus === "upcoming" ||
      this.saleStatus === "ended" ||
      this.closed
    ) {
      return new BigNumber(0);
    }

    const assetTokenPerShareToken = await this.contract.read.previewSharesOut([
      BigInt(10 ** ((this.assetToken?.decimals ?? 18) - 2)),
    ]);

    this.assetTokenPerShareToken = new BigNumber(
      assetTokenPerShareToken.toString()
    ).div(10 ** ((this.shareToken?.decimals ?? 18) + 2));

    return this.assetTokenPerShareToken;
  }

  async loadFundsRaised() {
    if (!this.address) {
      return new BigNumber(0);
    }

    const fundsRaised = await this.contract.read.totalAssetsIn();

    this.fundsRaised = new BigNumber(fundsRaised.toString()).div(
      10 ** (this.assetToken?.decimals ?? 18)
    );

    return this.fundsRaised;
  }

  async loadMaxAssets() {
    if (!this.address) {
      return new BigNumber(0);
    }

    const maxAssets = await this.contract.read.maxTotalAssetsInDeviation();

    this.maxAssets = new BigNumber(maxAssets.toString()).div(
      10 ** (this.assetToken?.decimals ?? 18)
    );

    return this.maxAssets;
  }

  async loadTotalPurchasedShares() {
    if (!this.address) {
      return new BigNumber(0);
    }

    const totalPurchased = await this.contract.read.totalPurchased();

    this.totalPurchased = new BigNumber(totalPurchased.toString()).div(
      10 ** (this.shareToken?.decimals ?? 18)
    );

    return this.totalPurchased;
  }

  async loadReservesAndWeight() {
    if (
      !this.address ||
      this.saleStatus === "upcoming" ||
      this.saleStatus === "ended" ||
      this.closed
    ) {
      return {
        reserves: new BigNumber(0),
        weight: new BigNumber(0),
      };
    }

    const reservesAndWeights = await this.contract.read.reservesAndWeights();

    this.assetReserves = new BigNumber(reservesAndWeights[0].toString()).div(
      10 ** (this.assetToken?.decimals ?? 18)
    );

    this.shareReserves = new BigNumber(reservesAndWeights[1].toString()).div(
      10 ** (this.shareToken?.decimals ?? 18)
    );

    this.assetWeight = new BigNumber(reservesAndWeights[2].toString());

    this.shareWeight = new BigNumber(reservesAndWeights[3].toString());

    console.log("assetReserves", {
      assetReserves: this.assetReserves.toString(),
      shareReserves: this.shareReserves.toString(),
      assetWeight: this.assetWeight.toString(),
      shareWeight: this.shareWeight.toString(),
    });

    return {
      assetReserves: this.assetReserves,
      shareReserves: this.shareReserves,
      assetWeight: this.assetWeight,
      shareWeight: this.shareWeight,
    };
  }

  setAmountIn(amountIn: string) {
    runInAction(() => {
      this.amountIn = new BigNumber(amountIn);
    });
    console.log("setAmountIn", this.amountIn);
    this.simulateBuyAmountOut(this.amountIn);
  }

  async buyShares() {
    if (!this.address) {
      return;
    }

    await this.assetToken?.approveIfNoAllowance({
      amount: this.amountIn
        .times(10 ** (this.assetToken?.decimals ?? 18))
        .toFixed(0)
        .toString(),
      spender: this.address,
    });

    console.log("buyShares", [
      BigInt(
        this.amountIn
          .times(10 ** (this.assetToken?.decimals ?? 18))
          .toFixed(0)
          .toString()
      ),
      BigInt(
        this.amountOut
          .times(10 ** (this.shareToken?.decimals ?? 18))
          .times(0.99)
          .toFixed(0)
          .toString()
      ),
      wallet.account as `0x${string}`,
    ]);

    try {
      // const simulate = await this.contract.simulate.swapExactAssetsForShares([
      //   BigInt(
      //     this.amountIn
      //       .times(10 ** (this.assetToken?.decimals ?? 18))
      //       .toFixed(0)
      //       .toString()
      //   ),
      //   BigInt(
      //     this.amountOut
      //       .times(0.99)
      //       .times(10 ** (this.shareToken?.decimals ?? 18))
      //       .toFixed(0)
      //       .toString()
      //   ),
      //   wallet.account as `0x${string}`,
      // ]);

      // console.log("simulate", simulate);

      const tx = await new ContractWrite(
        this.contract.write.swapExactAssetsForShares
      ).call([
        BigInt(
          this.amountIn
            .times(10 ** (this.assetToken?.decimals ?? 18))
            .toFixed(0)
            .toString()
        ),
        BigInt(
          this.amountOut
            .times(0.99)
            .times(10 ** (this.shareToken?.decimals ?? 18))
            .toFixed(0)
            .toString()
        ),
        wallet.account as `0x${string}`,
      ]);
      console.log("tx", tx);
    } catch (error) {
      console.error("error", error);
    }
  }

  async loadUserPurchasedShares() {
    if (!this.address) {
      return new BigNumber(0);
    }

    const userPurchasedShares = await this.contract.read.purchasedShares([
      wallet.account as `0x${string}`,
    ]);

    this.userPurchasedShares = new BigNumber(
      userPurchasedShares.toString()
    ).div(10 ** (this.shareToken?.decimals ?? 18));

    return this.userPurchasedShares;
  }

  async redeemTokens() {
    if (!this.address || this.userPurchasedShares.eq(0)) {
      return;
    }

    const tx = await new ContractWrite(this.contract.write.redeem, {
      action: "redeem",
      isSuccessEffect: true,
    }).call();

    console.log("tx", tx);
  }
}
