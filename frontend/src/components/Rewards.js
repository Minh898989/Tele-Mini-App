import React from "react";
import { Button, List} from "antd";
import { StarOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const data = [
  "🗓 Đăng nhập mỗi ngày nhận 100 xu",
  "🔥 Tiêu xu để nâng cấp vũ khí",
  "🎯 Hoàn thành nhiệm vụ để nhận thưởng thêm"
];

const Rewards = () => {
  const navigate = useNavigate();

  return (
    <div className="page">
      <h2>
        <StarOutlined /> Nhiệm vụ & Nâng cấp
      </h2>
      <List
        size="large"
        bordered
        dataSource={data}
        renderItem={(item) => <List.Item>{item}</List.Item>}
        style={{ marginBottom: 20 }}
      />
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
        Trở lại
      </Button>
    </div>
  );
};

export default Rewards;
