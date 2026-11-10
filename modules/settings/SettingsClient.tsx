"use client";

import React from "react";
import SettingsForm from "./SettingsForm";
import DataManagement from "./DataManagement";

export default function SettingsClient() {
  return (
    <>
      <SettingsForm />
      <DataManagement />
    </>
  );
}