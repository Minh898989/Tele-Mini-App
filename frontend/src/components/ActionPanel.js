import React, { useState } from 'react';
import { Button, Card, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const { Option } = Select;

const ActionPanel = ({ userId }) => {
  const [missionType, setMissionType] = useState('easy');
  const navigate = useNavigate(); // 👈 dùng để điều hướng

  const performAction = async (endpoint, data = {}, redirectPath = null) => {
    try {
      await axiosClient.post(endpoint, { userId, ...data });
      message.success('Thành công!');
      if (redirectPath) navigate(redirectPath); // 👈 chuyển trang nếu có
    } catch (err) {
      message.error('Lỗi thao tác');
    }
  };

  return (
    <Card title="Hành động" style={{ width: 400 }}>
      <Button
        block
        onClick={() => performAction('/game/score', { score: 10 }, '/game')}
      >
        ➕ Tăng điểm
      </Button>
      <Button
        block
        style={{ marginTop: 10 }}
        onClick={() => performAction('/game/levelup', {}, '/game')}
      >
        🔼 Lên cấp
      </Button>
      <Button
        block
        style={{ marginTop: 10 }}
        onClick={() => performAction('/game/upgrade-gun', {}, '/upgrade')}
      >
        🔫 Nâng cấp súng
      </Button>
      <Select
        value={missionType}
        onChange={setMissionType}
        style={{ width: '100%', marginTop: 10 }}
      >
        <Option value="easy">Nhiệm vụ dễ</Option>
        <Option value="medium">Nhiệm vụ vừa</Option>
        <Option value="hard">Nhiệm vụ khó</Option>
      </Select>
      <Button
          block
          style={{ marginTop: 10 }}
           onClick={() => navigate('/game')} // 👉 điều hướng thẳng tới trang chơi game
         >
  🎮   Chơi Game
      </Button>

      
      <Button
        block
        style={{ marginTop: 10 }}
        onClick={() => performAction('/missions/complete', { missionType }, '/missions')}
      >
        ✅ Hoàn thành nhiệm vụ
      </Button>
    </Card>
  );
};

export default ActionPanel;
