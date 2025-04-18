import React from 'react';
import { Card } from 'antd';

const MissionsPage = () => {
  return (
    <Card title="✅ Nhiệm vụ" style={{ maxWidth: 600, margin: 'auto', marginTop: 40 }}>
      <p>Trang hiển thị danh sách nhiệm vụ và tiến độ hoàn thành.</p>
      <p>Bạn có thể cho phép người chơi nhận, theo dõi, và hoàn thành nhiệm vụ tại đây.</p>
    </Card>
  );
};

export default MissionsPage;
