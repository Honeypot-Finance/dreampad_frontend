import { cn } from "@/lib/tailwindcss";
import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";

interface ProjectStatusDisplayProps {
  isStart: boolean;
}

const ProjectStatus = observer(({ isStart }: ProjectStatusDisplayProps) => {
  return (
    <div className="flex flex-col gap-[5px]">
      <motion.div
        animate={{
          boxShadow: [
            `inset 0px 0px 5px 0px rgba(255,255,255,0.3)`,
            `inset 0px 0px 10px 2px rgba(255,255,255,0.3)`,
          ],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn(
          "flex px-[8px] h-[29px] justify-center items-center gap-[5px] rounded-[20px] select-none",
          {
            "bg-[rgba(131,194,233,0.1)]": isStart,
            "text-[#83C2E9]": isStart,
            "text-white": !isStart,
            "bg-[#4bbdea58]": !isStart,
          }
        )}
      >
        <div className="rounded-full bg-current w-2 h-2"></div>
        <span className="text-ss text-current xs:text-xs">
          {isStart ? "Live Now" : "Coming Soon"}
        </span>
      </motion.div>
    </div>
  );
});

export default ProjectStatus;
