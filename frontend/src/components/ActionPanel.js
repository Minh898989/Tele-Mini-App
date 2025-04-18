import React, { useState } from 'react';
import { Button, Card, Select, message } from 'antd';
import axiosClient from '../api/axiosClient';

const { Option } = Select;

const ActionPanel = ({ userId }) => {
  const [missionType, setMissionType] = useState('easy');

  const performAction = async (endpoint, data = {}) => {
    try {
      await axiosClient.post(endpoint, { userId, ...data });
      message.success('Thành công!');
    } catch (err) {
      message.error('Lỗi thao tác');
    }
  };

  return (
    <Card title="Hành động" style={{ width: 400 }}>
      <Button block onClick={() => performAction('/game/score', { score: 10 })}>
        ➕ Tăng điểm
      </Button>
      <Button block style={{ marginTop: 10 }} onClick={() => performAction('/game/levelup')}>
        🔼 Lên cấp
      </Button>
      <Button block style={{ marginTop: 10 }} onClick={() => performAction('/game/upgrade-gun')}>
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
        onClick={() => performAction('/missions/complete', { missionType })}
      >
        ✅ Hoàn thành nhiệm vụ
      </Button>
    </Card>
  );
};

export default ActionPanel;
