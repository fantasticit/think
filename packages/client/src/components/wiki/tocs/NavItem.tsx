import type { UrlObject } from "url";
import cls from "classnames";
import React from "react";
import Link from "next/link";
import styles from "./index.module.scss";

interface IProps {
  icon: React.ReactNode;
  text: React.ReactNode;
  rightNode?: React.ReactNode;
  href?: {
    pathname: string;
    query: Record<string, unknown>;
  };
  isActive?: boolean;
  hoverable?: boolean;
}

export const NavItem: React.FC<IProps> = ({
  icon,
  text,
  rightNode,
  href,
  isActive = false,
  hoverable = true,
}) => {
  const right = rightNode ? (
    <span className={styles.rightWrap}>{rightNode}</span>
  ) : null;
  const content = (
    <>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.title}>{text}</span>
    </>
  );

  return (
    <div
      className={cls(
        styles.navItemWrap,
        isActive && styles.isActive,
        hoverable && styles.hoverable
      )}
      style={{ marginTop: 4 }}
    >
      {href ? (
        <Link href={href as UrlObject}>
          <a className={styles.navItem}>{content}</a>
        </Link>
      ) : (
        <div className={styles.navItem}>{content}</div>
      )}
      <span className={styles.rightWrap}>{right}</span>
    </div>
  );
};
