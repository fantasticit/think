import React, { useCallback } from "react";
import { Popover, Button, Tooltip, Typography } from "@douyinfe/semi-ui";
import { IconEmoji } from "components/icons";
import { EXPRESSIONES, GESTURES } from "./constants";
import styles from "./index.module.scss";

const { Title } = Typography;

const LIST = [
  {
    title: "表情",
    data: EXPRESSIONES,
  },
  {
    title: "手势",
    data: GESTURES,
  },
];

export const Emoji = ({ editor }) => {
  const setEmoji = useCallback((emoji) => {
    return () => {
      const transaction = editor.state.tr.insertText(emoji);
      editor.view.dispatch(transaction);
    };
  }, []);

  return (
    <Popover
      showArrow
      zIndex={10000}
      trigger="click"
      content={
        <div className={styles.wrap}>
          {LIST.map((item, index) => {
            return (
              <div key={item.title} className={styles.sectionWrap}>
                <Title
                  heading={6}
                  style={{ margin: `${index === 0 ? 0 : 16}px 0 6px` }}
                >
                  {item.title}
                </Title>
                <ul className={styles.listWrap}>
                  {(item.data || []).map((ex) => (
                    <li key={ex} onClick={setEmoji(ex)}>
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      }
    >
      <span>
        <Tooltip zIndex={10000} content="插入表情">
          <Button theme={"borderless"} type="tertiary" icon={<IconEmoji />} />
        </Tooltip>
      </span>
    </Popover>
  );
};
