import React from "react";
import "./Popup.css";
import { SettingsPanel } from "../shared/components/SettingsPanel";

export const Popup = () => {
  return (
    <div className="popup-container">
      <SettingsPanel showHeader={false} className="popup-settings" />
    </div>
  );
};
