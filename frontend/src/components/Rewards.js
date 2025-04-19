import React, { useEffect, useState } from "react";
import { Button, Card, Row, Col, Tabs, message, InputNumber } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./style.css";

// Cấu hình tàu trong game
const SHIPS = [
  {
    id: "default",
    name: "Tàu mặc định",
    image: "/images/playerShip1_blue.png",
    requirement: null,
  },
  {
    id: "orange",
    name: "Tàu cam mạnh mẽ",
    image: "/images/ufoRed.png",
    requirement: { type: "badge", count: 3 },
  },
  {
    id: "red",
    name: "Tàu trùm đỏ",
    image: "/images/playerShip3_red.png",
    requirement: { type: "badge", count: 5 },
  },
];

// Cấu hình nâng cấp tàu
const UPGRADES = [
  {
    id: "permanentBullet",
    name: "Tăng cấp đạn vĩnh viễn",
    description: "Bắt đầu game với cấp đạn 2",
    requirement: { type: "badge", count: 2 },
  },
  {
    id: "shield",
    name: "Giáp chắn (1 lần miễn sát thương)",
    description: "Tặng 1 lá chắn ở đầu game",
    requirement: { type: "badge", count: 3 },
  },
];

const UpgradeShip = () => {
  const navigate = useNavigate();

  const [killStats, setKillStats] = useState({});
  const [badges, setBadges] = useState(0);
  const [selectedShip, setSelectedShip] = useState("default");
  const [unlockedShips, setUnlockedShips] = useState(["default"]);
  const [unlockedUpgrades, setUnlockedUpgrades] = useState([]);

  // Lấy dữ liệu từ localStorage khi trang được mở
  useEffect(() => {
    const stats = JSON.parse(localStorage.getItem("killStats") || "{}");
    const savedShip = localStorage.getItem("selectedShip") || "default";
    const savedUpgrades = JSON.parse(localStorage.getItem("unlockedUpgrades") || "[]");
    const savedShips = JSON.parse(localStorage.getItem("unlockedShips") || '["default"]');
    const savedBadges = parseInt(localStorage.getItem("badgeCount") || "0");

    setKillStats(stats);
    setSelectedShip(savedShip);
    setUnlockedUpgrades(savedUpgrades);
    setUnlockedShips(savedShips);
    setBadges(savedBadges);
  }, []);

  // Lưu dữ liệu vào localStorage
  const saveData = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  // Kiểm tra nếu có đủ huy hiệu để mở khoá tàu hoặc nâng cấp
  const canUnlock = (requirement) => {
    if (!requirement) return true;
    if (requirement.type === "badge") {
      return badges >= requirement.count;
    }
    return false;
  };

  // Trừ đi huy hiệu khi đổi tàu hoặc nâng cấp
  const deductBadges = (count) => {
    const updated = badges - count;
    setBadges(updated);
    saveData("badgeCount", updated);
  };

  // Chọn tàu
  const handleShipSelect = (ship) => {
    const isUnlocked = unlockedShips.includes(ship.id);

    if (isUnlocked || canUnlock(ship.requirement)) {
      if (!isUnlocked && ship.requirement) {
        const updatedShips = [...unlockedShips, ship.id];
        setUnlockedShips(updatedShips);
        saveData("unlockedShips", updatedShips);
        deductBadges(ship.requirement.count);
      }

      setSelectedShip(ship.id);
      saveData("selectedShip", ship.id);
      message.success(`Đã chọn ${ship.name}`);
    } else {
      message.error("Chưa đủ huy hiệu để mở khoá tàu này.");
    }
  };

  // Mở khoá nâng cấp
  const handleUpgradeUnlock = (upgrade) => {
    if (unlockedUpgrades.includes(upgrade.id)) {
      message.info("Bạn đã mở khoá nâng cấp này.");
      return;
    }

    if (canUnlock(upgrade.requirement)) {
      const updated = [...unlockedUpgrades, upgrade.id];
      setUnlockedUpgrades(updated);
      saveData("unlockedUpgrades", updated);
      deductBadges(upgrade.requirement.count);
      message.success(`Đã mở khoá: ${upgrade.name}`);
    } else {
      message.error("Chưa đủ huy hiệu để nâng cấp.");
    }
  };

  // Chuyển đổi gà thành huy hiệu cho từng loại gà
  const handleConvertChickenToBadge = (type, count) => {
    const ratio = { normal: 5, tough: 10, boss: 15 };
    const badgeFromType = Math.floor(count / ratio[type]);

    if (badgeFromType <= 0) {
      message.info(`Chưa đủ gà ${type} để đổi huy hiệu.`);
      return;
    }

    const updatedStats = { ...killStats };
    updatedStats[type] -= badgeFromType * ratio[type];
    setKillStats(updatedStats);
    saveData("killStats", updatedStats);

    const newBadgeTotal = badges + badgeFromType;
    setBadges(newBadgeTotal);
    saveData("badgeCount", newBadgeTotal);

    message.success(`Đã đổi ${badgeFromType} huy hiệu từ gà ${type}!`);
  };

  // Render tab nâng cấp tàu
  const renderUpgrades = () => (
    <Row gutter={[16, 16]} align="stretch">
      {UPGRADES.map((upgrade) => (
        <Col key={upgrade.id} xs={24} sm={12} md={8}>
          <Card
            style={{ height: "100%" }}
            title={upgrade.name}
            actions={[
              <Button
                type={unlockedUpgrades.includes(upgrade.id) ? "primary" : "default"}
                onClick={() => handleUpgradeUnlock(upgrade)}
              >
                {unlockedUpgrades.includes(upgrade.id) ? "Đã nâng cấp" : "Nâng cấp"}
              </Button>,
            ]}
          >
            <p>{upgrade.description}</p>
            <p>Yêu cầu: {upgrade.requirement.count} huy hiệu</p>
          </Card>
        </Col>
      ))}
    </Row>
  );

  // Render tab tàu
  const renderShips = () => (
    <Row gutter={[16, 16]} align="stretch">
      {SHIPS.map((ship) => (
        <Col key={ship.id} xs={24} sm={12} md={8}>
          <Card
            hoverable
            style={{ height: "100%" }}
            cover={
              <img
                alt={ship.name}
                src={ship.image}
                style={{ height: 150, objectFit: "contain" }}
              />
            }
            actions={[
              <Button
                type={selectedShip === ship.id ? "primary" : "default"}
                onClick={() => handleShipSelect(ship)}
              >
                {selectedShip === ship.id
                  ? "Đang dùng"
                  : unlockedShips.includes(ship.id)
                  ? "Đổi"
                  : "Mở khoá"}
              </Button>,
            ]}
          >
            <Card.Meta
              title={ship.name}
              description={
                <div style={{ minHeight: 40 }}>
                  {ship.requirement
                    ? `Yêu cầu: ${ship.requirement.count} huy hiệu`
                    : "Có sẵn"}
                </div>
              }
            />
          </Card>
        </Col>
      ))}
    </Row>
  );

  // Render tab đổi huy hiệu theo loại gà
  const renderBadgeTab = () => (
    <Card>
      <p>🎖️ Bạn đang có: <strong>{badges}</strong> huy hiệu</p>
      <p>🐔 Gà hiện tại:</p>
      <ul>
        <li>Normal: {killStats.normal || 0}</li>
        <li>Tough: {killStats.tough || 0}</li>
        <li>Boss: {killStats.boss || 0}</li>
      </ul>
      <p>Quy đổi:</p>

      {/* Đổi huy hiệu cho gà Normal */}
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card title="Đổi huy hiệu từ Gà Normal" className="badge-card">
            <div className="badge-info">
              <img
                alt="Gà Normal"
                src="/images/normalChicken.png"
                className="chicken-image"
              />
              <InputNumber
                min={1}
                max={killStats.normal}
                onChange={(value) => handleConvertChickenToBadge("normal", value)}
                style={{ width: "100%" }}
              />
            </div>
            <Button onClick={() => handleConvertChickenToBadge("normal", killStats.normal)} style={{ marginTop: 8 }}>
              Đổi huy hiệu
            </Button>
          </Card>
        </Col>

        {/* Đổi huy hiệu cho gà Tough */}
        <Col span={8}>
          <Card title="Đổi huy hiệu từ Gà Tough" className="badge-card">
            <div className="badge-info">
              <img
                alt="Gà Tough"
                src="/images/toughChicken.png"
                className="chicken-image"
              />
              <InputNumber
                min={1}
                max={killStats.tough}
                onChange={(value) => handleConvertChickenToBadge("tough", value)}
                style={{ width: "100%" }}
              />
            </div>
            <Button onClick={() => handleConvertChickenToBadge("tough", killStats.tough)} style={{ marginTop: 8 }}>
              Đổi huy hiệu
            </Button>
          </Card>
        </Col>

        {/* Đổi huy hiệu cho gà Boss */}
        <Col span={8}>
          <Card title="Đổi huy hiệu từ Gà Boss" className="badge-card">
            <div className="badge-info">
              <img
                alt="Gà Boss"
                src="/images/bossChicken.png"
                className="chicken-image"
              />
              <InputNumber
                min={1}
                max={killStats.boss}
                onChange={(value) => handleConvertChickenToBadge("boss", value)}
                style={{ width: "100%" }}
              />
            </div>
            <Button onClick={() => handleConvertChickenToBadge("boss", killStats.boss)} style={{ marginTop: 8 }}>
              Đổi huy hiệu
            </Button>
          </Card>
        </Col>
      </Row>
    </Card>
  );

  return (
    <div className="upgrade-container">
      <Button
        className="back-button"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/")}
      >
        
      </Button>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Nâng cấp tàu" key="1">
          {renderUpgrades()}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Đổi tàu" key="2">
          {renderShips()}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Đổi huy hiệu" key="3">
          {renderBadgeTab()}
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default UpgradeShip;
