import {
  Node,
  Command,
  mergeAttributes,
  textInputRule,
  textblockTypeInputRule,
  wrappingInputRule,
} from "@tiptap/core";
import {
  NodeViewWrapper,
  NodeViewContent,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Space, Popover, Tag, Input, Typography } from "@douyinfe/semi-ui";
import { useChildrenDocument } from "data/document";
import { DataRender } from "components/data-render";
import { Empty } from "components/empty";
import { IconDocument } from "components/icons";
import styles from "./index.module.scss";

const { Text } = Typography;

declare module "@tiptap/core" {
  interface Commands {
    documentChildren: {
      setDocumentChildren: () => Command;
    };
  }
}

export const DocumentChildrenInputRegex = /^documentChildren\$$/;

const DocumentChildrenExtension = Node.create({
  name: "documentChildren",
  group: "block",
  defining: true,
  draggable: true,

  addAttributes() {
    return {
      color: {
        default: "grey",
      },
      text: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-type=documentChildren]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(
        (this.options && this.options.HTMLAttributes) || {},
        HTMLAttributes
      ),
    ];
  },

  // @ts-ignore
  addCommands() {
    return {
      setDocumentChildren:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {},
          });
        },
    };
  },

  addInputRules() {
    return [
      wrappingInputRule({
        find: DocumentChildrenInputRegex,
        type: this.type,
      }),
    ];
  },
});

const Render = () => {
  const { pathname, query } = useRouter();
  const wikiId = query?.wikiId;
  const documentId = query?.documentId;
  const isShare = pathname.includes("share");
  const {
    data: documents,
    loading,
    error,
  } = useChildrenDocument({ wikiId, documentId, isShare });

  return (
    <NodeViewWrapper as="div" className={styles.wrap}>
      <div>
        <div>
          <Text type="tertiary">子文档</Text>
        </div>
        {wikiId || documentId ? (
          <DataRender
            loading={loading}
            error={error}
            normalContent={() => {
              if (!documents || !documents.length) {
                return <Empty message="暂无子文档" />;
              }
              return (
                <div>
                  {documents.map((doc) => {
                    return (
                      <Link
                        key={doc.id}
                        href={{
                          pathname: `${
                            !isShare ? "" : "/share"
                          }/wiki/[wikiId]/document/[documentId]`,
                          query: { wikiId: doc.wikiId, documentId: doc.id },
                        }}
                      >
                        <a className={styles.itemWrap} target="_blank">
                          <IconDocument />
                          <span>{doc.title}</span>
                        </a>
                      </Link>
                    );
                  })}
                </div>
              );
            }}
          />
        ) : (
          <Text type="tertiary">当前页面无法使用子文档</Text>
        )}
      </div>

      <NodeViewContent></NodeViewContent>
    </NodeViewWrapper>
  );
};

export const DocumentChildren = DocumentChildrenExtension.extend({
  addNodeView() {
    return ReactNodeViewRenderer(Render);
  },
});
