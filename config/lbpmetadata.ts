import { LbpLaunch } from "@/services/contract/launches/lbp/lbpPair";
import { BigNumber } from "bignumber.js";
import { Address } from "viem";

export const lbpMetadatas: Record<Address, Partial<LbpLaunch>> = {
  "0x04beec4684ea780ca817591ea5fbaaeb5fff34aa": {
    chainId: 80094,
    name: "My Token",
    address: "0x04beEc4684EA780cA817591Ea5FBaAeB5fff34aA",
    owner: "0x6592EaFA6d22D51606a2c24B4aEEd74242a23778",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    whitelistUrl: undefined,
    disclaimerUrl: undefined,
    swapCount: 2,
    swapFee: 0.02,
    swapEnabled: 1,
    learnMoreUrl:
      "https://app.fjordfoundry.com/token-sales/create/lbp/project-info",
    imageUrl: "https://placecats.com/1600/900",
    blockNumber: 2816368,
    sellingAllowed: true,
    socials: [
      {
        id: "112320456",
        url: "https://x.com/DavidSchrammel",
        name: "David Schrammel",
        joinedAt: "2010-02-08T02:13:24.000Z",
        provider: "twitter",
        username: "DavidSchrammel",
        followers: 118,
        image_url:
          "https://pbs.twimg.com/profile_images/1726719259781296128/S4rqPs4H_normal.png",
      },
    ],
    blockedCountries: [
      "Afghanistan",
      "American Samoa",
      "Congo",
      "Congo, The Democratic Republic of the",
      "Cote D'Ivoire",
      "Cuba",
      "Guam",
      "Iran, Islamic Republic Of",
      "Iraq",
      "Korea, Democratic People'S Republic of",
      "Libyan Arab Jamahiriya",
      "Mali",
      "Myanmar",
      "Nicaragua",
      "Northern Mariana Islands",
      "Russian Federation",
      "Somalia",
      "Sudan",
      "Syrian Arab Republic",
      "Ukraine",
      "United States Minor Outlying Islands",
      "Virgin Islands, U.S.",
      "Yemen",
      "Zimbabwe",
    ],
    txHash:
      "0x25ec34b88bac635a51ff5b220d6026abc346dacceb6df5c24ce4ef17eeca96f7",
    bannerUrl: undefined,
    lbpBanner: "https://placecats.com/200/200",
    vestCliffStart: "1970-01-01 00:00:00.000",
    vestEnd: "1970-01-01 00:00:00.000",
    ecosystem: "evm",
    resume:
      "0xba5DdD1f9d7F570dc94a51479a000E3BCE9671960xba5DdD1f9d7F570dc94a51479a000E3BCE967196 0xba5DdD1f9d7F570dc94a51479a000E3BCE967196 0xba5DdD1f9d7F570dc94a51479a000E3BCE967196",
  },
  "0x8ab93627ed17cffef78c1729f1beb4ee8f7df20e": {
    owner: "0x28A70673648Ed601c00014C618E22f67FB0A2B1A",
    chainId: 80094,
    name: "BurrBear",
    description: `## 1. What is BurrBear

https://linktr.ee/burrbear 


BurrBear is the “Curve++” of Berachain, where BurrBear does everything that Curve does + supports hyper efficient RWA trades that allow Berachain to replicate real world markets on chain - think tokenized stock markets, betting on real world markets, or basically all of TradFi. 

Achieving $100M in trading volume right out the gate, the Berachain Foundation hand selected BurrBear for its Boyco, RFA and Proof of Liquidity whitelisting where LPs locked millions of dollars in BurrBear pools for native BERA and BGT incentives. 

- [Boyco announcement](https://x.com/moneygoesburr/status/1876295108720775631)
- [RFA announcement](https://x.com/moneygoesburr/status/1877157177242055032)
- [One of first POL integrated Bera projects](https://blog.berachain.com/blog/berachain-governance-phase-1-first-whitelisted-reward-vaults-approved)

BurrBear offers three specialized pool types:

- Multi-Stable Pools → For assets trading near parity (think USDT, USDC, HONEY etc)
- Burr Pools → 20x more efficient than traditional pools, perfect for stablecoins & RWAs.
- Generalized Pools → Classic constant-product pools for everything else.

By making swaps as efficient as they can be, BurrBear maximizes volume flowing through its pools and therefore revenue. 

BurrBear aims to be the hub of all things stablecoin, LSTs/LRTs and RWA on Berachain.

[Learn more about the products here](https://docs.burrbear.io/product-overview/multi-stable-pools)

## 2. Fair Launch

BurrBear has only raised from early NFT collection holders, one Fjord private sale with 480 individual buyers and no VCs. This makes the BURR token sale an entirely fair launch, owned 100% by beras for beras. 

Unused public sale allocations will be BURRnned in a show of BURR. 

There will be no future token sales. 

## 3. Traction: $100M volume in first month live

Fully integrated with Berachain's Proof of Liquidity and partnered with multiple validators. 

- [link to wgBERA:BERA proposal](https://hub.forum.berachain.com/t/request-for-wgbera-bera-reward-vault/265/8)
- [link to wgBERA:NECT proposal](https://hub.forum.berachain.com/t/request-for-wgbera-nect-reward-vault/267)

## 4. Token Utility

BurrBear isn’t just another DeFi project—it’s built on a three-token system to align incentives:

- $BURR → Governance + rewards + boosting
- $BURRRb → Yield booster minted by depositing $BERA
- $BURRRv → Governance token for locking $BURR, increasing voting power & emissions influence

$BURRRv in particular serves as the way BurrBear distributes revenue back to its users. 
This setup rewards active users, benefits long-term holders, and keeps liquidity strong.

[Read more here](https://x.com/0x_cos/status/1876637319865725196)

## 5. Tokenomics 

![Tokenomics Pie Chart](https://docs.burrbear.io/~gitbook/image?url=https%3A%2F%2F2631216751-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FAK6QVvi7Zx4vOBjajakX%252Fuploads%252FtfOcDloZIDKRUHl2vDpe%252Fimage.png%3Falt%3Dmedia%26token%3D1f58e921-27f6-4741-baf3-665e23e81f98&width=768&dpr=4&quality=100&sign=ab733408&sv=2)

[Click here for tokenomics](https://docs.burrbear.io/tokenomics/tokenomics )


## 6. Emissions Schedule 

![Emissions Graph](https://docs.burrbear.io/~gitbook/image?url=https%3A%2F%2F2631216751-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FAK6QVvi7Zx4vOBjajakX%252Fuploads%252FJr24PwzldPvlSnOw4CVr%252Fimage.png%3Falt%3Dmedia%26token%3Dc30b206e-669b-4f7b-877d-faa916feaa66&width=768&dpr=2&quality=100&sign=af8bc268&sv=2)

[Click here for emissions schedule](https://docs.burrbear.io/tokenomics/emissions-schedule )

## 7. About the BurrBear team

The BurrBear team is composed of experienced members who have worked in early crypto exchanges, stablecoin issuers and commercial banks. Until recently they were building hyper-efficient stableswap protocols in the Balancer ecosystem. 


## 8. Community and Partnerships
Our early community (the ""Printers"") can be seen via our NFT collections https://docs.burrbear.io/printing-burrberas-nfts/what-are-the-printing-burrberas. 

BurrBear already integrated with Berachain’s premier aggregator, Ooga Booga (“1inch/Jupiter of Berachain”), meaning additional capital flows through its pools. Other key launch partners are https://beraborrow.com/ (think “DAI of Berachain”), https://smilee.finance/ (think “Lido of Berachain”), BeraPaw (another “Lido of Berachain”) and many more core partners. 

BurrBear is growing and positioned to be a core part of the Berachain ecosystem. BurrBear GO BURRRRR

## 9. Links

https://linktr.ee/burrbear`,
    learnMoreUrl: "https://burrbear.io/",
    imageUrl: "https://img.cryptorank.io/coins/burr_bear1734607799119.png",
    socials: [
      {
        id: "1774652767761760256",
        url: "https://x.com/moneygoesburr",
        name: "BurrBear",
        joinedAt: "2024-04-01T04:19:39.000Z",
        provider: "twitter",
        username: "moneygoesburr",
        followers: 4305,
        image_url:
          "https://pbs.twimg.com/profile_images/1774669053451456512/vuHXY8KT_normal.jpg",
      },
    ],
    blockedCountries: [
      "Afghanistan",
      "American Samoa",
      "Congo",
      "Congo, The Democratic Republic of the",
      'Cote D"Ivoire',
      "Cuba",
      "Guam",
      "Iran, Islamic Republic Of",
      "Iraq",
      'Korea, Democratic People"S Republic of',
      "Libyan Arab Jamahiriya",
      "Mali",
      "Myanmar",
      "Nicaragua",
      "Northern Mariana Islands",
      "Russian Federation",
      "Somalia",
      "Sudan",
      "Syrian Arab Republic",
      "Ukraine",
      "United States Minor Outlying Islands",
      "Virgin Islands, U.S.",
      "Yemen",
      "Zimbabwe",
    ],
    lbpBanner:
      "https://docs.burrbear.io/~gitbook/image?url=https%3A%2F%2F2631216751-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FAK6QVvi7Zx4vOBjajakX%252Fuploads%252FnLKaBWD9WqjUDRGXmzoY%252Fbanner-1600x900.png%3Falt%3Dmedia%26token%3D34edbd12-2730-4482-a704-a2c84374db0d&width=768&dpr=4&quality=100&sign=6ad8ab09&sv=2",
    resume: `BurrBear is the money printer for the Bera ecosystem, showcasing it's protocol as the "One Stop Stablecoin Shop".  Fair launch,  no VC, no vesting and best entry into a core Bera ecosystem project. `,
  },
};
