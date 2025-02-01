import { Button } from "@/components/button";
import React, { useEffect, useState } from "react";
import Confirm from "@/components/LBPFormItems/Confirm";
import CreateAndBranding from "@/components/LBPFormItems/CreateAndBranding";
import ProjectInfo from "@/components/LBPFormItems/ProjectInfo";
import Review from "@/components/LBPFormItems/Review";
import SalesStructure from "@/components/LBPFormItems/SalesStructure";
import SocialsAndCommunity from "@/components/LBPFormItems/SocialsAndCommunity";
import TermsConditions from "@/components/LBPFormItems/TermsConditions";
import TokenomicsAndPreview from "@/components/LBPFormItems/TokenomicsAndPreview";
import TokenVesting from "@/components/LBPFormItems/TokenVesting";
import Stepper from "@/components/LBPFormItems/stepper";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateAndBrandingForm,
  ProjectInfoForm,
  ReviewForm,
  SalesStructureForm,
  SocialCommunityForm,
  TermsAndConditionsForm,
  TokenomicsAndPreviewForm,
  // TokenVestingForm,
} from "@/types/launch-project";
import {
  confirmationSchema,
  createAndBrandingSchema,
  DEFAULT_LAUNCH_PROJECT_FORM,
  projectInfoFormSchema,
  reviewSchema,
  salesStructureSchema,
  socialCommunitySchema,
  termsAndConditionsSchema,
  tokenomicsAndPreviewSchema,
  // tokenVestingSchema,
} from "@/constants/launch-project";
import { LBPButton } from "@/components/LBPFormItems/Components";
import BackButton from "@/components/LBPFormItems/Components/back-button";
import { useRouter } from "next/navigation";

const STEP_DATA = [
  {
    title: "Creation & Branding",
  },
  {
    title: "Sales Structure",
  },
  {
    title: "Tokenomics & Preview",
  },
  // {
  //   title: "Token Vesting",
  // },
  {
    title: "Project Info",
  },
  // {
  //   title: "Socials & Community",
  // },
  {
    title: "Review",
  },
  {
    title: "Terms & Conditions",
  },
  {
    title: "Confirm",
  },
];

type LaunchProjectForm = CreateAndBrandingForm &
  SalesStructureForm &
  TokenomicsAndPreviewForm &
  // TokenVestingForm &
  ProjectInfoForm &
  SocialCommunityForm &
  ReviewForm &
  TermsAndConditionsForm;

const LaunchProject = () => {
  const router = useRouter()

  const [stepData, setStepData] = useState(
    STEP_DATA.map((item) => ({ ...item, isValid: false }))
  );
  const [currentStep, setCurrentStep] = useState<number>(0);

  const validationSchema = [
    createAndBrandingSchema,
    salesStructureSchema,
    tokenomicsAndPreviewSchema,
    // tokenVestingSchema,
    projectInfoFormSchema,
    socialCommunitySchema,
    reviewSchema,
    termsAndConditionsSchema,
    confirmationSchema,
  ];

  const methods = useForm<LaunchProjectForm>({
    resolver: zodResolver(validationSchema[currentStep]),
    defaultValues: DEFAULT_LAUNCH_PROJECT_FORM,
    mode: "onChange",
    shouldUnregister: false,
    reValidateMode: "onChange",
  });

  const CurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <CreateAndBranding />;
      case 1:
        return <SalesStructure />;
      case 2:
        return <TokenomicsAndPreview />;
      // case 3:
      //   return <TokenVesting />;
      case 3:
        return <ProjectInfo />;
      // case 4:
      //   return <SocialsAndCommunity />;
      case 4:
        return <Review changeStep={setCurrentStep} />;
      case 5:
        return <TermsConditions />;
      case 6:
        return <Confirm />;
      default:
        return <div />;
    }
  };

  const handleNextStep = async () => {
    const isValid = await methods.trigger();
    if (currentStep === 3) {
      // const isTokenVestingEnabled = methods.getValues("isTokenVestingEnabled");
      // const isVestingCliffTimeEnabled = methods.getValues(
      //   "isVestingCliffTimeEnabled"
      // );
      const endTime = methods.getValues("endTime");
      // const vestingCliffTime = methods.getValues("vestingCliffTime");

      // if (
      //   isTokenVestingEnabled &&
      //   isVestingCliffTimeEnabled &&
      //   vestingCliffTime &&
      //   dayjs(vestingCliffTime).isBefore(endTime)
      // ) {
      //   methods.setError("vestingCliffTime", {
      //     type: "manual",
      //     message: "Vesting cliff time should be greater than end time",
      //   });
      //   return;
      // }
    }
    if (isValid && currentStep < STEP_DATA.length - 1) {
      setCurrentStep((prevStep) => prevStep + 1);
      const step = [...stepData];
      step[currentStep].isValid = true;
      setStepData(step);
      router.push(`#step-${currentStep + 1}`)
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  return (
    <div className="w-full text-[#202020]/80 px-4 md:p-6 md:max-w-full xl:max-w-[1322px] mx-auto mb-[160px] font-gliker mt-[50px] md:mt-[220px] relative">
      {/* Sticky icon */}
      <div className="absolute bottom-full left-2 md:bottom-[calc(100%-25px)] md:left-0" >
        <img src="/images/launch-project/launch-project-sticky1.png" alt="sticky1" className="w-[83.91px] md:w-full" />
      </div>
      <div className="absolute bottom-full right-2 md:bottom-[calc(100%-25px)] md:right-0" >
        <img src="/images/launch-project/launch-project-sticky2.png" alt="sticky2" className='w-[56.13px] md:w-full' />
      </div>
      {/* Progress */}
      <div className="px-4 py-5 md:px-8 md:py-6 rounded-3xl bg-white border-2 border-[#FBCA4D] border-dashed ">
        <Stepper
          steps={stepData}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
        />
      </div>
      {/* Form */}
      <div className="relative w-full">
        <div className="absolute top-0 left-0 -translate-x-[70%] -translate-y-[30%] hidden xl:block" >
          <img src="/images/launch-project/launch-project-sticky3.png" alt="sticky3" />
        </div>
        <div className="absolute bottom-6 right-0 translate-x-[70%] hidden xl:block" >
          <img src="/images/launch-project/launch-project-sticky4.png" alt="sticky4" />
        </div>
        <div className="relative w-ful rounded-3xl mt-[39px] px-4 md:px-9 pb-[90px] md:pb-[120px]" style={{
          background: "url('/images/launch-project/subtract-sticky.png'), url('/images/launch-project/subtract-bg.png')",
          backgroundSize: "contain, cover",
          backgroundRepeat: 'no-repeat, no-repeat',
        }}>
          <FormProvider {...methods}  >
            <form onSubmit={(e) => e.preventDefault()} className="pt-10 md:pt-20">
              {currentStep !== 0 &&
                <BackButton type="button" onClick={handleBack}>
                  Back
                </BackButton>
              }
              <CurrentStep />
              <div className="mt-10 flex items-center gap-8">
                {currentStep !== STEP_DATA.length - 1 && (
                  <div className='px-3 py-4 bg-[#202020] w-full rounded-2xl'>
                    <LBPButton type="button" onClick={handleNextStep} className='w-full !bg-[#FFCD4D] text-black text-lg h-14'>
                      {`${STEP_DATA[currentStep + 1]?.title}`}
                    </LBPButton>
                  </div>
                )}
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default LaunchProject;




