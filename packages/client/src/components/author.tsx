import { Space, Typography } from "@douyinfe/semi-ui";
import { IconLikeHeart } from "@douyinfe/semi-icons";

const { Text } = Typography;

export const Author = () => {
  return (
    <div style={{ padding: "16px 0", textAlign: "center" }}>
      <Text>
        <Space>
          Develop by
          <Text link={{ href: "https://github.com/fantasticit/think" }}>
            fantasticit
          </Text>
          with <IconLikeHeart style={{ color: "red" }} />
        </Space>
      </Text>
    </div>
  );
};
