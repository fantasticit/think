import { Banner, Button, Typography } from '@douyinfe/semi-ui';
import { OrganizationDeletor } from 'components/organization/delete';

const { Paragraph } = Typography;

export const More = ({ organizationId }) => {
  return (
    <div style={{ marginTop: 16 }}>
      <Banner
        fullMode={false}
        type="danger"
        closeIcon={null}
        description={<Paragraph>删除组织及内部所有知识库以及文档，不可恢复！</Paragraph>}
        style={{ marginBottom: 16 }}
      />
      <OrganizationDeletor organizationId={organizationId}>
        <Button type="danger" theme="solid">
          删除组织
        </Button>
      </OrganizationDeletor>
    </div>
  );
};
