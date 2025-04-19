import React, { useEffect, useState } from "react";
import { Button, Card, Row, Col, Tabs, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./style.css"

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
    requirement: { type: "tough", count: 30 },
  },
  {
    id: "red",
    name: "Tàu trùm đỏ",
    image: "/images/playerShip3_red.png",
    requirement: { type: "boss", count: 10 },
  },
];

// === Cấu hình nâng cấp ===
const UPGRADES = [
  {
    id: "permanentBullet",
    name: "Tăng cấp đạn vĩnh viễn",
    description: "Bắt đầu game với cấp đạn 2",
    requirement: { type: "normal", count: 100 },
  },
  {
    id: "shield",
    name: "Giáp chắn (1 lần miễn sát thương)",
    description: "Tặng 1 lá chắn ở đầu game",
    requirement: { type: "tough", count: 50 },
  },
];

const UpgradeShip = () => {
  const navigate = useNavigate();

  const [killStats, setKillStats] = useState({});
  const [selectedShip, setSelectedShip] = useState("default");
  const [unlockedShips, setUnlockedShips] = useState(["default"]);
  const [unlockedUpgrades, setUnlockedUpgrades] = useState([]);

  // Load dữ liệu từ localStorage khi mở trang
  useEffect(() => {
    const stats = JSON.parse(localStorage.getItem("killStats") || "{}");
    const savedShip = localStorage.getItem("selectedShip") || "default";
    const savedUpgrades = JSON.parse(localStorage.getItem("unlockedUpgrades") || "[]");
    const savedShips = JSON.parse(localStorage.getItem("unlockedShips") || '["default"]');

    setKillStats(stats);
    setSelectedShip(savedShip);
    setUnlockedUpgrades(savedUpgrades);
    setUnlockedShips(savedShips);
  }, []);

  // === Tiện ích ===
  const saveData = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const canUnlock = (requirement) => {
    if (!requirement) return true;
    return (killStats[requirement.type] || 0) >= requirement.count;
  };

  const deductKills = (requirement) => {
    if (!requirement) return;
    const updatedStats = { ...killStats };
    updatedStats[requirement.type] -= requirement.count;
    setKillStats(updatedStats);
    saveData("killStats", updatedStats);
  };

  // === Xử lý chọn tàu ===
  const handleShipSelect = (ship) => {
    const isUnlocked = unlockedShips.includes(ship.id);

    if (isUnlocked || canUnlock(ship.requirement)) {
      if (!isUnlocked && ship.requirement) {
        const updatedShips = [...unlockedShips, ship.id];
        setUnlockedShips(updatedShips);
        saveData("unlockedShips", updatedShips);
        deductKills(ship.requirement);
      }

      setSelectedShip(ship.id);
      saveData("selectedShip", ship.id);
      message.success(`Đã chọn ${ship.name}`);
    } else {
      message.error("Chưa đủ điều kiện để mở khoá tàu này.");
    }
  };

  // === Xử lý nâng cấp ===
  const handleUpgradeUnlock = (upgrade) => {
    if (unlockedUpgrades.includes(upgrade.id)) {
      message.info("Bạn đã mở khoá nâng cấp này.");
      return;
    }

    if (canUnlock(upgrade.requirement)) {
      const updatedUpgrades = [...unlockedUpgrades, upgrade.id];
      setUnlockedUpgrades(updatedUpgrades);
      saveData("unlockedUpgrades", updatedUpgrades);
      deductKills(upgrade.requirement);
      message.success(`Đã mở khoá: ${upgrade.name}`);
    } else {
      message.error("Chưa đủ điều kiện để nâng cấp.");
    }
  };

  // === Render nâng cấp ===
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
            <p>
              Yêu cầu: {upgrade.requirement.count} gà{" "}
              <strong>{upgrade.requirement.type}</strong>
            </p>
          </Card>
        </Col>
      ))}
    </Row>
  );

  // === Render tàu ===
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
                    ? `Yêu cầu: ${ship.requirement.count} gà ${ship.requirement.type}`
                    : "Có sẵn"}
                </div>
              }
            />
          </Card>
        </Col>
      ))}
    </Row>
  );

  const tabItems = [
    {
      key: "1",
      label: "🔧 Nâng cấp tàu",
      children: renderUpgrades(),
    },
    {
      key: "2",
      label: "🚀 Đổi tàu mới",
      children: renderShips(),
    },
  ];

  return (
    <div className="page">
      <h2>⚙️ Trung tâm nâng cấp</h2>
      <Tabs defaultActiveKey="1" items={tabItems} />
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginTop: 24 }}
      >
        Trở lại
      </Button>
    </div>
  );
};

export default UpgradeShip;
