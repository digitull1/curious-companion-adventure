
import React, { useState } from "react";
import { AlertCircle, Key } from "lucide-react";

interface ApiKeyInputProps {
  onSave: (apiKey: string) => void;
  onCancel: () => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onSave, onCancel }) => {
  const [apiKey, setApiKey] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSave(apiKey.trim());
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="flex items-center mb-4">
        <Key className="h-5 w-5 text-wonder-purple mr-2" />
        <h2 className="text-lg font-semibold">OpenAI API Key</h2>
      </div>
      
      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start">
        <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <p className="mb-1">Your API key is stored locally in your browser and never sent to our servers.</p>
          <p>You can get an API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-900">OpenAI's dashboard</a>.</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
            API Key
          </label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wonder-purple/30 focus:border-wonder-purple"
            required
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm bg-wonder-purple text-white rounded-md hover:bg-wonder-purple-dark transition-colors"
          >
            Save Key
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApiKeyInput;
