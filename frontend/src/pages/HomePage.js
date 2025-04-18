import React, { useState } from 'react';
import { Layout } from 'antd';
import LoginForm from '../components/LoginForm';
import ActionPanel from '../components/ActionPanel';

const { Header, Content, Footer } = Layout;

const HomePage = () => {
  const [user, setUser] = useState(null);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ color: 'white', fontSize: 24 }}>🐔 Game Bắn Gà</Header>
      <Content style={{ padding: '30px', display: 'flex', justifyContent: 'center' }}>
        {!user ? (
          <LoginForm onLoginSuccess={setUser} />
        ) : (
          <ActionPanel userId={user.id} />
        )}
      </Content>
      <Footer style={{ textAlign: 'center' }}>© 2025 Chicken Game</Footer>
    </Layout>
  );
};

export default HomePage;
