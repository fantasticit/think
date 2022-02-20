import { Table, Skeleton } from "@douyinfe/semi-ui";

const columns = [
  {
    title: "用户名",
    dataIndex: "userName",
    key: "userName",
  },
  {
    title: "成员角色",
    dataIndex: "userRole",
    key: "userRole",
  },
  {
    title: "加入时间",
    dataIndex: "createdAt",
    key: "createdAt",
  },
  {
    title: "操作",
    dataIndex: "actions",
    key: "actions",
  },
];

const PLACEHOLDER_DATA = Array.from({ length: 3 }).fill({
  name: <Skeleton.Paragraph style={{ width: 50 }} rows={1} />,
  userRole: <Skeleton.Paragraph style={{ width: 100 }} rows={1} />,
  createdAt: <Skeleton.Paragraph style={{ width: 120 }} rows={1} />,
});

export const Placeholder = () => {
  return (
    <Skeleton
      placeholder={
        <Table
          size="small"
          style={{ margin: "24px 0" }}
          columns={columns}
          dataSource={PLACEHOLDER_DATA}
          pagination={false}
        />
      }
      loading={true}
    ></Skeleton>
  );
};
