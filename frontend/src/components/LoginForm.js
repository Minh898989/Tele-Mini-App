import React, { useState } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import axiosClient from '../api/axiosClient';

const LoginForm = ({ onLoginSuccess }) => {
  const [telegramId, setTelegramId] = useState('');

  const login = async () => {
    try {
      const res = await axiosClient.post('/users/login', { telegramId });
      message.success('Đăng nhập thành công!');
      onLoginSuccess(res.data);
    } catch (err) {
      message.error('Lỗi đăng nhập');
    }
  };

  return (
    <Card title="Đăng nhập" style={{ width: 400 }}>
      <Form layout="vertical">
        <Form.Item label="Telegram ID">
          <Input value={telegramId} onChange={(e) => setTelegramId(e.target.value)} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" block onClick={login}>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default LoginForm;
