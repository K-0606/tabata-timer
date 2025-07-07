import React, { useState, useEffect } from "react";
import Picker from "react-mobile-picker";

const TimeInput = ({ label, value, onChange, max = 1000 }) => {
  const [pickerValue, setPickerValue] = useState({ seconds: value });

  // 當父層 value 改變，也同步更新 pickerValue
  useEffect(() => {
    setPickerValue({ seconds: value });
  }, [value]);

  const secondsOptions = Array.from({ length: max + 1 }, (_, i) => i);

  const handlePickerChange = (name, val) => {
    setPickerValue({ [name]: val });
    onChange(val * 1000);
  };

  const handleInputChange = (e) => {
    let val = e.target.value === "" ? "" : Number(e.target.value);
    if (val === "") {
      onChange(0);
      setPickerValue({ seconds: 0 });
      return;
    }
    if (val > max) val = max;
    if (val < 0) val = 0;
    onChange(val * 1000);
    setPickerValue({ seconds: val });
  };

  return (
    <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
      <div style={{ flex: 1 }}>
        <h3>{label}</h3>
        <input
          type="number"
          min={0}
          max={max}
          value={value}
          onChange={handleInputChange}
          style={{ width: "100%", fontSize: "1rem" }}
          placeholder="請輸入秒數"
        />
      </div>
      <div style={{ width: "120px" }}>
        <Picker
          optionGroups={{ seconds: secondsOptions }}
          valueGroups={pickerValue}
          onChange={handlePickerChange}
          height={150}
          itemHeight={30}
          wheelMode="natural"
        />
      </div>
    </div>
  );
};

export default TimeInput;
