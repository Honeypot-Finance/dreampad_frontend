import Image from "next/image";
import { useState } from "react";

export const WarningBanner = () => {
  const [userAcceptWarning, setUserAcceptWarning] = useState<boolean>(false);

  if (userAcceptWarning) return <></>;
  return (
    <div className="rounded-[24px] border-2 border-dashed border-black bg-white p-8 text-center col-span-6">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Image
          src="/images/lbp-detail/logo/warning.svg"
          alt="warning"
          width={24}
          height={24}
        />
        <span className="font-bold text-[#FFCD4D] text-shadow-[1.081px_2.162px_0px_#AF7F3D] text-stroke-0.5 text-stroke-black text-2xl">
          Warning!
        </span>
      </div>
      <p className="text-[#4D4D4D] mb-4 text-xs w-[80%] mx-auto">
        Please be aware that engaging with a Token Sale on Fjord Foundry carries
        significant risk. The tokens acquired through Sales can potentially lose
        all value. Fjord Foundry assumes no responsibility for losses. Exercise
        caution and conduct thorough research (DYOR) before investing.
      </p>
      <p className="text-[#4D4D4D] mb-2 text-xs w-[80%] mx-auto">
        Additionally, third party curation is not an indicator of project
        quality and token value always investigate independently.
      </p>
      <button
        onClick={() => setUserAcceptWarning(true)}
        className="bg-white rounded-[16px] border border-black py-3 px-8 shadow-[4px_4px_0px_0px_#000000] mt-6"
      >
        I Accept These Risks
      </button>
    </div>
  );
};

export default WarningBanner;
