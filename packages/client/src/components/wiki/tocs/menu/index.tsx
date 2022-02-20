import { IDocument } from "@think/share";
import React from "react";
import { MenuItem } from "../menu-item";
import styles from "./index.module.scss";

interface IProps {
  data: Array<IDocument>;
  docAsLink?: string;
  getDocLink?: (arg: string) => string;
  parentIds: Array<string>;
  activeId: string;
  isShareMode?: boolean;
}

const PADDING_LEFT = 22;

const Menu = ({
  data,
  depth,
  docAsLink,
  getDocLink,
  parentIds,
  activeId,
  isShareMode,
}) => {
  return (
    <ul
      key={"menu" + depth}
      style={{ paddingLeft: depth > 0 ? PADDING_LEFT : 0 }}
    >
      {data.map((item) => {
        const hasChildren = item.children && item.children.length;
        return (
          <MenuItem
            key={item.id}
            data={item}
            hasChildren={hasChildren}
            docAsLink={docAsLink}
            getDocLink={getDocLink}
            parentIds={parentIds}
            activeId={activeId}
            isShareMode={isShareMode}
          >
            {hasChildren ? (
              <Menu
                key={item.id + "menu"}
                data={item.children}
                depth={depth + 1}
                docAsLink={docAsLink}
                getDocLink={getDocLink}
                parentIds={parentIds}
                activeId={activeId}
                isShareMode={isShareMode}
              />
            ) : null}
          </MenuItem>
        );
      })}
    </ul>
  );
};

export const TreeMenu: React.FC<IProps> = ({
  data,
  docAsLink,
  getDocLink,
  parentIds,
  activeId,
  isShareMode,
}) => {
  return (
    <div className={styles.wrap}>
      <Menu
        key={"root-menu"}
        data={data}
        depth={0}
        docAsLink={docAsLink}
        getDocLink={getDocLink}
        parentIds={parentIds}
        activeId={activeId}
        isShareMode={isShareMode}
      />
    </div>
  );
};
