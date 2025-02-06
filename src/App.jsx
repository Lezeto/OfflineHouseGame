// App.jsx
import { useState, useEffect } from "react";
import "./App.css";
import coinImg from "./coin.png";
import house1Img from "./casa1.png";
import house2Img from "./casa2.png";

export default function App() {
  const targetDate = new Date("2025-02-06T02:30:00");
  const [secondsElapsed, setSecondsElapsed] = useState(() => {
    return Math.floor((Date.now() - targetDate) / 1000);
  });
  const [gold, setGold] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [upgradeCost, setUpgradeCost] = useState(10);
  const [houseLevel, setHouseLevel] = useState(1);
  const [houseUpgradeCost, setHouseUpgradeCost] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed(Math.floor((Date.now() - targetDate) / 1000));
      setGold((prevGold) => parseFloat((prevGold + increment).toFixed(1)));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate, increment]);

  const upgradeIncrement = () => {
    if (gold >= upgradeCost) {
      setGold((prevGold) => prevGold - upgradeCost);
      setIncrement((prevIncrement) => parseFloat((prevIncrement * 1.2).toFixed(1)));
      setUpgradeCost((prevCost) => Math.ceil(prevCost * 1.2));
    }
  };

  const upgradeHouse = () => {
    if (gold >= houseUpgradeCost) {
      setGold((prevGold) => prevGold - houseUpgradeCost);
      setHouseLevel((prevLevel) => prevLevel + 1);
      setHouseUpgradeCost((prevCost) => prevCost * 10);
    }
  };

  const saveGame = () => {
    const gameData = {
      gold,
      increment,
      upgradeCost,
      houseLevel,
      houseUpgradeCost,
      savedSecondsElapsed: secondsElapsed,
    };
    localStorage.setItem("gameData", JSON.stringify(gameData));
  };

  const loadGame = () => {
    const savedData = JSON.parse(localStorage.getItem("gameData"));
    if (savedData) {
      const currentSecondsElapsed = Math.floor((Date.now() - targetDate) / 1000);
      const offlineSeconds = currentSecondsElapsed - savedData.savedSecondsElapsed;
      const offlineGold = offlineSeconds * savedData.increment;
      setGold(parseFloat((savedData.gold + offlineGold).toFixed(1)));
      setIncrement(savedData.increment);
      setUpgradeCost(savedData.upgradeCost);
      setHouseLevel(savedData.houseLevel);
      setHouseUpgradeCost(savedData.houseUpgradeCost);
      setSecondsElapsed(currentSecondsElapsed);
    }
  };

  return (
    <div className="container">
      <h1>Game Server Time:</h1>
      <p className="date">{targetDate.toLocaleString()}</p>
      <p className="seconds">{secondsElapsed} seconds since server opened.</p>
      <div className="gold-container">
        <h2>Gold: {gold.toFixed(1)}</h2>
        <img src={coinImg} alt="Coin" className="coin-img" />
      </div>
      <button onClick={upgradeIncrement} disabled={gold < upgradeCost}>
        Upgrade Gold Rate (+20%) - Cost: {upgradeCost} Gold
      </button>
      <div className="house-container">
        <h2>House Level: {houseLevel}</h2>
        <img src={houseLevel === 1 ? house1Img : house2Img} alt="House" className="house-img" />
      </div>
      <button onClick={upgradeHouse} disabled={gold < houseUpgradeCost}>
        Upgrade House Level - Cost: {houseUpgradeCost} Gold
      </button>
      <div className="controls">
        <button onClick={saveGame}>Save Game</button>
        <button onClick={loadGame}>Load Game</button>
      </div>
    </div>
  );
}
