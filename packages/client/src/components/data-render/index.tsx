import React from "react";
import { Empty, Spin, Typography } from "@douyinfe/semi-ui";

type RenderProps = React.ReactNode | (() => React.ReactNode);

interface IProps {
  loading: boolean;
  error: Error | null;
  loadingContent?: RenderProps;
  errorContent?: RenderProps;
  normalContent: RenderProps;
}

const { Text } = Typography;

const defaultLoading = () => {
  return <Spin />;
};

const defaultRenderError = (error) => {
  return <Text>{(error && error.message) || "未知错误"}</Text>;
};

const runRender = (fn, ...args) =>
  typeof fn === "function" ? fn.apply(null, args) : fn;

export const DataRender: React.FC<IProps> = ({
  loading,
  error,
  loadingContent = defaultLoading,
  errorContent = defaultRenderError,
  normalContent,
}) => {
  if (loading) {
    return runRender(loadingContent);
  }

  if (error) {
    return runRender(errorContent, error);
  }

  return runRender(normalContent);
};
