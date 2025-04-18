import React from "react";
import { Button, Space } from "antd";
import { PlayCircleOutlined, GiftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();

  return (
    <div className="page">
      <h1>🐔 Chicken Shooter</h1>
      <Space direction="vertical" size="large">
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          size="large"
          onClick={() => navigate("/play")}
        >
          Vào chơi
        </Button>
        <Button
          icon={<GiftOutlined />}
          size="large"
          onClick={() => navigate("/rewards")}
        >
          Nhiệm vụ & Nâng cấp
        </Button>
      </Space>
    </div>
  );
};

export default Menu;
