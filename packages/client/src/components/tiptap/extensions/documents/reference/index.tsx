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
import {
  Space,
  Select,
  Popover,
  Tag,
  Input,
  Typography,
} from "@douyinfe/semi-ui";
import { useWikiTocs } from "data/wiki";
import { useDocumentDetail } from "data/document";
import { DataRender } from "components/data-render";
import { Empty } from "components/empty";
import { IconDocument } from "components/icons";
import styles from "./index.module.scss";

const { Text } = Typography;

declare module "@tiptap/core" {
  interface Commands {
    documentReference: {
      setDocumentReference: () => Command;
    };
  }
}

export const DocumentReferenceInputRegex = /^documentReference\$$/;

const DocumentReferenceExtension = Node.create({
  name: "documentReference",
  group: "block",
  defining: true,
  draggable: true,

  addAttributes() {
    return {
      wikiId: {
        default: "",
      },
      documentId: {
        default: "",
      },
      title: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-type=documentReference]" }];
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
      setDocumentReference:
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
        find: DocumentReferenceInputRegex,
        type: this.type,
      }),
    ];
  },
});

const Render = ({ editor, node, updateAttributes }) => {
  const { pathname, query } = useRouter();
  const wikiIdFromUrl = query?.wikiId;
  const isShare = pathname.includes("share");
  const isEditable = editor.isEditable;
  const { wikiId, documentId, title } = node.attrs;
  const {
    data: tocs,
    loading,
    error,
  } = useWikiTocs(isShare ? null : wikiIdFromUrl);

  return (
    <NodeViewWrapper as="div" className={styles.wrap}>
      <div>
        {isEditable && (
          <Select
            placeholder="请选择文档"
            defaultValue={JSON.stringify({
              wikiId,
              documentId,
              title,
            })}
            onChange={(v) => updateAttributes(JSON.parse(v as string))}
          >
            {(tocs || []).map((toc) => (
              <Select.Option
                key={toc.id}
                value={JSON.stringify({
                  wikiId: toc.wikiId,
                  documentId: toc.id,
                  title: toc.title,
                })}
              >
                {toc.title}
              </Select.Option>
            ))}
          </Select>
        )}

        <Link
          key={documentId}
          href={{
            pathname: `${
              !isShare ? "" : "/share"
            }/wiki/[wikiId]/document/[documentId]`,
            query: { wikiId, documentId },
          }}
        >
          <a className={styles.itemWrap} target="_blank">
            <IconDocument />
            <span>{title}</span>
          </a>
        </Link>
      </div>
      {/* <div>
        <Text type="tertiary">子文档</Text>
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
      </div> */}
      <NodeViewContent></NodeViewContent>
    </NodeViewWrapper>
  );
};

export const DocumentReference = DocumentReferenceExtension.extend({
  addNodeView() {
    return ReactNodeViewRenderer(Render);
  },
});
