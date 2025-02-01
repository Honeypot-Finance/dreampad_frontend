import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectTitleProps {
  name?: string;
  displayName?: string;
}

const ProjectTitle: React.FC<ProjectTitleProps> = ({ name, displayName }) => {
  return (
    <div className="flex flex-col gap-[7.5px] md:text-2xl">
      {name ? (
        <div>{name}</div>
      ) : (
        <Skeleton className="rounded-lg h-8 w-[140px]" />
      )}
      {name ? (
        <div className="text-sm">{displayName}</div>
      ) : (
        <Skeleton className="rounded-lg h-5 w-20" />
      )}
    </div>
  );
};

export default ProjectTitle;
