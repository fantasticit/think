import React from "react";
import { Skeleton } from "@douyinfe/semi-ui";

export const DocumentSkeleton = () => {
  const placeholder = (
    <>
      <Skeleton.Title
        style={{ width: 240, height: "1.8em", marginBottom: 12, marginTop: 12 }}
      />
      <Skeleton.Paragraph style={{ width: "100%" }} rows={15} />
    </>
  );

  return <Skeleton placeholder={placeholder} loading={true} active></Skeleton>;
};
