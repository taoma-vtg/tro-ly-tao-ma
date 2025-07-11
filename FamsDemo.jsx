// Field Asset Management System (FAMS) - Web Demo + Camera + AI Suggestion

import React, { useState, useRef } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#4caf50", "#ff9800", "#f44336", "#9e9e9e"];

export default function FamsDemo() {
  const [data, setData] = useState([
    { name: "Đúng", value: 0 },
    { name: "Thiếu", value: 0 },
    { name: "Sai Serial", value: 0 },
    { name: "Không xác định", value: 0 },
  ]);
  const [inventoryList, setInventoryList] = useState([]);
  const [inputSerial, setInputSerial] = useState("");
  const videoRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const lines = event.target.result.split("\n");
      const assets = lines.slice(1).map((line) => {
        const [id, name, serial] = line.split(",");
        return { id, name, serial: serial?.trim() };
      });
      setInventoryList(assets);
    };
    reader.readAsText(file);
  };

  const handleCheckSerial = (serial = inputSerial) => {
    const updatedData = [...data];
    const found = inventoryList.find((item) => item.serial === serial);
    if (found) {
      updatedData[0].value += 1; // Đúng
    } else {
      updatedData[3].value += 1; // Không xác định
    }
    setData(updatedData);
    setInputSerial("");
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Lỗi camera:", err);
    }
  };

  const getAISuggestion = () => {
    return "AI: Tài sản này thuộc nhóm Thiết bị truyền dẫn. Nên kiểm tra trạng thái kết nối.";
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Tổng quan Kiểm kê</h2>
      <PieChart width={360} height={300}>
        <Pie
          data={data}
          cx={180}
          cy={140}
          innerRadius={60}
          outerRadius={100}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>

      <h2>Nhập danh mục tài sản</h2>
      <input type="file" accept=".csv" onChange={handleFileUpload} />

      <h2>Kiểm kê Serial</h2>
      <input
        type="text"
        value={inputSerial}
        onChange={(e) => setInputSerial(e.target.value)}
        placeholder="Nhập hoặc quét Serial"
      />
      <button onClick={() => handleCheckSerial()}>Kiểm tra Serial</button>

      <button onClick={startCamera}>📷 Bật Camera Kiểm kê</button>
      <video ref={videoRef} autoPlay width="100%" height="240" style={{ border: "1px solid gray" }} />

      <p><i>{getAISuggestion()}</i></p>
    </div>
  );
}
