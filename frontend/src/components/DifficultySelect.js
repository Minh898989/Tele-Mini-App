import React from "react";
import { Button, Space } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const DifficultySelect = () => {
  const navigate = useNavigate();

  return (
    <div className="page">
      <h2>Chọn cấp độ chơi</h2>
      <Space direction="vertical" size="middle">
        <Button type="primary" size="large" onClick={() => navigate("/game/easy")}>
          😺 Dễ
        </Button>
        <Button size="large" onClick={() => navigate("/game/medium")}>
          😼 Trung bình
        </Button>
        <Button danger size="large" onClick={() => navigate("/game/hard")}>
          😾 Khó
        </Button>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </Space>
    </div>
  );
};

export default DifficultySelect;
