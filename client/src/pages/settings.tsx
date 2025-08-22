import { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, Save, Key } from "lucide-react";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [apiKey, setApiKey] = useState('');

  const handleSaveSettings = () => {
    // Save settings logic here
    console.log('Settings saved');
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground mt-1">Customize your dashboard experience</p>
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border p-8">
        <div className="space-y-8">
          {/* API Configuration */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Key className="w-5 h-5 mr-2" />
              API Configuration
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="api-key" className="text-sm font-medium text-foreground mb-2 block">
                  Alpha Vantage API Key
                </Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your Alpha Vantage API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Get your free API key from{" "}
                  <a 
                    href="https://www.alphavantage.co/support/#api-key" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Alpha Vantage
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Display Preferences */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <SettingsIcon className="w-5 h-5 mr-2" />
              Display Preferences
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode" className="text-sm font-medium text-foreground">
                    Dark Mode
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Switch between light and dark themes
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium text-foreground">
                    Real-time Updates
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Enable automatic data refresh every 30 seconds
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium text-foreground">
                    Sound Notifications
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Play sound for price alerts and notifications
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Notification Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium text-foreground">
                    Price Alerts
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Notify when stocks reach target prices
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium text-foreground">
                    Daily Summary
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Receive daily portfolio performance summary
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium text-foreground">
                    Market News
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Get notified about important market news
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </div>

          {/* Data Preferences */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Data Preferences</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-foreground mb-2 block">
                  Default Chart Period
                </Label>
                <select className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent">
                  <option value="1D">1 Day</option>
                  <option value="1W">1 Week</option>
                  <option value="1M" selected>1 Month</option>
                  <option value="3M">3 Months</option>
                  <option value="1Y">1 Year</option>
                </select>
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground mb-2 block">
                  Currency Display
                </Label>
                <select className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent">
                  <option value="USD" selected>USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-border">
            <Button onClick={handleSaveSettings} className="flex items-center">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
