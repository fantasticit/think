import React from "react";
import { Layout as SemiLayout, Nav, Space } from "@douyinfe/semi-ui";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import { User } from "components/user";
import { WikiOrDocumentCreator } from "components/wiki-or-document-creator";
import { LogoImage, LogoText } from "components/logo";
import { Theme } from "components/theme";
import { Message } from "components/message";
import { useWindowSize } from "hooks/useWindowSize";
import { Recent } from "./Recent";
import { Wiki } from "./Wiki";

const { Header: SemiHeader } = SemiLayout;

export const RouterHeader: React.FC = () => {
  const { pathname } = useRouter();
  const windowSize = useWindowSize();

  return (
    <SemiHeader>
      <Nav
        mode="horizontal"
        style={{ overflow: "auto" }}
        header={
          <Space>
            <LogoImage />
            {windowSize.width >= 576 && <LogoText />}
          </Space>
        }
        selectedKeys={[pathname || "/"]}
        items={[
          {
            itemKey: "/",
            text: (
              <Link href="/">
                <a>主页</a>
              </Link>
            ),
            onClick: () => {
              Router.push({
                pathname: `/`,
              });
            },
          },
          {
            itemKey: "/recent",
            text: <Recent />,
          },
          {
            itemKey: "/wiki",
            text: <Wiki />,
          },
          {
            itemKey: "/star",
            text: (
              <Link href="/star">
                <a>收藏</a>
              </Link>
            ),
            onClick: () => {
              Router.push({
                pathname: `/star`,
              });
            },
          },
          {
            itemKey: "/template",
            text: (
              <Link href="/template">
                <a>模板</a>
              </Link>
            ),
            onClick: () => {
              Router.push({
                pathname: `/template`,
              });
            },
          },
        ]}
        footer={
          <Space>
            <WikiOrDocumentCreator />
            <Message />
            <Theme />
            <User />
          </Space>
        }
      ></Nav>
    </SemiHeader>
  );
};
