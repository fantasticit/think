import cls from 'classnames';
import Link from 'next/link';
import React from 'react';
import type { UrlObject } from 'url';

import styles from './index.module.scss';

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
  openNewTab?: boolean;
}

const marginTopStyle = { marginTop: 4 };

export const NavItem: React.FC<IProps> = ({
  icon,
  text,
  rightNode,
  href,
  isActive = false,
  hoverable = true,
  openNewTab = false,
}) => {
  const right = rightNode ? <span className={styles.rightWrap}>{rightNode}</span> : null;
  const content = (
    <>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.title}>{text}</span>
    </>
  );

  return (
    <div
      className={cls(styles.navItemWrap, isActive && styles.isActive, hoverable && styles.hoverable)}
      style={marginTopStyle}
    >
      {href ? (
        <Link href={href as UrlObject}>
          <a className={styles.navItem} target={openNewTab ? '_blank' : '_self'}>
            {content}
          </a>
        </Link>
      ) : (
        <div className={styles.navItem}>{content}</div>
      )}
      <span className={styles.rightWrap}>{right}</span>
    </div>
  );
};
