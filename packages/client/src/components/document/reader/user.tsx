import { Space, Typography, Avatar } from "@douyinfe/semi-ui";
import { IconUser } from "@douyinfe/semi-icons";
import { IDocument } from "@think/share";
import { LocaleTime } from "components/locale-time";

const { Text } = Typography;

export const CreateUser: React.FC<{ document: IDocument }> = ({ document }) => {
  if (!document.createUser) return null;

  return (
    <Text type="tertiary" size="small">
      <Space>
        <Avatar
          size="extra-extra-small"
          src={document.createUser && document.createUser.avatar}
        >
          <IconUser />
        </Avatar>
        <div>
          <p>
            创建者：
            {document.createUser && document.createUser.name}
          </p>
          <p>
            最近更新日期：
            <LocaleTime date={document.updatedAt} timeago />
            {" ⦁ "}阅读量：
            {document.views}
          </p>
        </div>
      </Space>
    </Text>
  );
};
