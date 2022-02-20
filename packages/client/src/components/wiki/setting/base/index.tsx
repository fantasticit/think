import { useRef, useEffect, useState } from "react";
import { Form, Button, Toast } from "@douyinfe/semi-ui";
import { FormApi } from "@douyinfe/semi-ui/lib/es/form";
import { IWiki, WIKI_AVATARS } from "@think/share";
import { Upload } from "components/upload";
import styles from "./index.module.scss";

type IUpdateWIKI = Partial<IWiki>;

interface IProps {
  wiki: IWiki;
  update: (arg: IUpdateWIKI) => Promise<void>;
}

export const Base: React.FC<IProps> = ({ wiki, update }) => {
  const $form = useRef<FormApi>();
  const [currentCover, setCurrentCover] = useState("");

  const onSubmit = () => {
    $form.current.validate().then((values) => {
      update(values).then(() => {
        Toast.success("操作成功");
      });
    });
  };

  const setCover = (url) => {
    $form.current.setValue("avatar", url);
    setCurrentCover(url);
  };

  useEffect(() => {
    if (!wiki) return;
    $form.current.setValues(wiki);
    setCurrentCover(wiki.avatar);
  }, [wiki]);

  return (
    <Form
      initValues={wiki}
      style={{ width: "100%" }}
      getFormApi={(formApi) => ($form.current = formApi)}
      onSubmit={onSubmit}
    >
      <Form.Input
        label="名称"
        field="name"
        style={{ width: "100%" }}
        placeholder="请输入知识库名称"
        rules={[{ required: true, message: "请输入知识库名称" }]}
      ></Form.Input>
      <Form.TextArea
        label="描述"
        field="description"
        style={{ width: "100%" }}
        placeholder="请输入知识库简介"
        autosize
        rules={[{ required: true, message: "请输入知识库简介" }]}
      ></Form.TextArea>
      <Form.Slot label="封面">
        <div className={styles.coverWrap}>
          <div className={styles.cover}>
            <img src={currentCover} />
          </div>
          <div className={styles.right}>
            <div className={styles.placeholderWrapper}>
              {WIKI_AVATARS.map((cover) => {
                return (
                  <div
                    key={cover}
                    className={styles.coverPlaceholder}
                    onClick={() => setCover(cover)}
                  >
                    <img src={cover} alt="系统默认图片" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <Upload onOK={setCover}></Upload>
      </Form.Slot>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button htmlType="submit" type="primary" theme="solid">
          保存
        </Button>
      </div>
    </Form>
  );
};
