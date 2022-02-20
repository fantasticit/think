import React, { useState, useEffect, useCallback } from "react";
import { Anchor } from "@douyinfe/semi-ui";
import styles from "./style.module.scss";

export const Toc = ({ editor, getContainer }) => {
  const [items, setItems] = useState([]);

  const handleUpdate = useCallback(() => {
    if (!editor) return;

    const headings = [];

    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === "heading") {
        const id = `heading-${headings.length + 1}`;

        headings.push({
          level: node.attrs.level,
          text: node.textContent,
          id,
        });
      }
    });

    setItems(headings);
  }, [editor]);

  useEffect(handleUpdate, []);

  useEffect(() => {
    if (!editor) {
      return null;
    }

    editor.on("update", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
    };
  }, [editor]);

  return (
    <Anchor railTheme={"tertiary"} getContainer={getContainer}>
      {items.map((item, index) => (
        <Anchor.Link
          href={`#${item.id}`}
          title={item.text}
          style={{ paddingLeft: (item.level - 1) * 1 + "rem" }}
        />
      ))}
    </Anchor>
  );

  // return (
  //   <ul className={styles.list}>
  //     {items.map((item, index) => (
  //       <li key={index} className={`${styles.list} ${item.level}`}>
  //         <a href={`#${item.id}`}>{item.text}</a>
  //       </li>
  //     ))}
  //   </ul>
  // );
};
