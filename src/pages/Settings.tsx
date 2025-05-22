
import React from "react";
import Layout from "../components/Layout";
import SettingsForm from "@/components/settings/SettingsForm";

const Settings = () => {
  return (
    <Layout>
      <div className="p-4 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Configurações
          </h1>
          <p className="text-gray-500">
            Personalize sua experiência no aplicativo
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <SettingsForm />
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
