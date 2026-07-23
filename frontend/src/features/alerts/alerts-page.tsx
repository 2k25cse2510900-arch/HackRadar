"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Navbar } from "@/components/layout/navbar";
import { ProtectedPage } from "@/components/auth/protected-page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  deleteAlert,
  getAlertErrorMessage,
  listAlerts,
  type Alert,
} from "@/lib/api";
import { cn } from "@/lib/utils";

type AlertPreferences = {
  whatsapp: boolean;
  telegram: boolean;
  aiCalls: boolean;
  browser: boolean;
  email: boolean;
  reminderTiming: "168" | "72" | "24" | "1";
};

const defaultPreferences: AlertPreferences = {
  whatsapp: false,
  telegram: false,
  aiCalls: false,
  browser: false,
  email: false,
  reminderTiming: "168",
};

function formatAlertTime(alertTime?: string) {
  if (!alertTime) return "Not available";

  const date = new Date(alertTime);
  return Number.isNaN(date.getTime()) ? "Not available" : date.toLocaleString();
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-border bg-background px-4 py-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
          checked ? "bg-primary" : "bg-border"
        )}
      >
        <span
          className={cn(
            "inline-block size-5 rounded-full bg-surface shadow-sm transition-transform",
            checked ? "translate-x-5" : "translate-x-1"
          )}
        />
      </button>
    </label>
  );
}

function RadioItem({
  label,
  value,
  current,
  onSelect,
}: {
  label: string;
  value: AlertPreferences["reminderTiming"];
  current: AlertPreferences["reminderTiming"];
  onSelect: (value: AlertPreferences["reminderTiming"]) => void;
}) {
  const active = current === value;

  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={cn(
        "rounded-2xl border px-4 py-3 text-left text-sm transition-all",
        active
          ? "border-primary-border bg-primary-soft text-primary dark:bg-[rgba(124,58,237,0.18)] dark:text-[#E9D5FF]"
          : "border-border bg-background text-foreground hover:bg-muted"
      )}
    >
      {label}
    </button>
  );
}

export function AlertsPage() {
  const [preferences, setPreferences] = useState<AlertPreferences>(defaultPreferences);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const nextAlerts = await listAlerts();
      setAlerts(Array.isArray(nextAlerts) ? nextAlerts : []);
    } catch (error) {
      const message = getAlertErrorMessage(error, "Unable to load alerts. Please try again.");
      setAlerts([]);
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    listAlerts()
      .then((nextAlerts) => {
        if (active) {
          setAlerts(Array.isArray(nextAlerts) ? nextAlerts : []);
        }
      })
      .catch((error) => {
        const message = getAlertErrorMessage(error, "Unable to load alerts. Please try again.");
        if (active) {
          setAlerts([]);
          setLoadError(message);
        }
        toast.error(message);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const savePreferences = async () => {
    const channels = [
      preferences.email ? "email" : null,
      preferences.telegram ? "telegram" : null,
      preferences.browser ? "browser" : null,
      preferences.whatsapp ? "whatsapp" : null,
      preferences.aiCalls ? "call" : null,
    ].filter(Boolean) as string[];

    if (channels.length === 0) {
      toast.error("Select at least one notification channel");
      return;
    }

    try {
      setSaving(true);
      toast.success("Preferences Saved Successfully");
    } catch (error) {
      toast.error(getAlertErrorMessage(error, "Unable to save preferences. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  const removeAlert = async (alertId: string) => {
    try {
      await deleteAlert(alertId);
      setAlerts((current) => current.filter((alert) => alert._id !== alertId));
      toast.success("Alert deleted");
    } catch (error) {
      toast.error(getAlertErrorMessage(error, "Unable to delete alert. Please try again."));
    }
  };

  return (
    <ProtectedPage>
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        <section className="py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Alerts
              </div>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Notification Settings
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Manage how HackRadar keeps you updated about your enrolled hackathons.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="mx-auto mt-10 max-w-3xl"
            >
              <Card className="border-border/70 bg-surface p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] sm:p-8">
                <div className="space-y-6">
                  <div className="grid gap-3">
                    <ToggleRow
                      title="WhatsApp Alerts"
                      description="Receive important hackathon reminders on WhatsApp."
                      checked={preferences.whatsapp}
                      onChange={(value) => setPreferences((current) => ({ ...current, whatsapp: value }))}
                    />
                    <ToggleRow
                      title="Telegram Alerts"
                      description="Receive instant Telegram notifications."
                      checked={preferences.telegram}
                      onChange={(value) => setPreferences((current) => ({ ...current, telegram: value }))}
                    />
                    <ToggleRow
                      title="AI Call Alerts"
                      description="Receive an AI-powered reminder call before important deadlines and events."
                      checked={preferences.aiCalls}
                      onChange={(value) => setPreferences((current) => ({ ...current, aiCalls: value }))}
                    />
                    <ToggleRow
                      title="Browser Notifications"
                      description="Receive notifications directly in your browser."
                      checked={preferences.browser}
                      onChange={(value) => setPreferences((current) => ({ ...current, browser: value }))}
                    />
                    <ToggleRow
                      title="Email Notifications"
                      description="Receive updates by email."
                      checked={preferences.email}
                      onChange={(value) => setPreferences((current) => ({ ...current, email: value }))}
                    />
                  </div>

                  <div className="rounded-[1.75rem] border border-border bg-background p-5">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground">
                      Reminder Timing
                    </h2>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <RadioItem
                        label="7 Days Before"
                        value="168"
                        current={preferences.reminderTiming}
                        onSelect={(value) => setPreferences((current) => ({ ...current, reminderTiming: value }))}
                      />
                      <RadioItem
                        label="3 Days Before"
                        value="72"
                        current={preferences.reminderTiming}
                        onSelect={(value) => setPreferences((current) => ({ ...current, reminderTiming: value }))}
                      />
                      <RadioItem
                        label="1 Day Before"
                        value="24"
                        current={preferences.reminderTiming}
                        onSelect={(value) => setPreferences((current) => ({ ...current, reminderTiming: value }))}
                      />
                      <RadioItem
                        label="1 Hour Before"
                        value="1"
                        current={preferences.reminderTiming}
                        onSelect={(value) => setPreferences((current) => ({ ...current, reminderTiming: value }))}
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={savePreferences}
                    disabled={saving}
                    className="w-full"
                  >
                    {saving ? "Saving..." : "Save Preferences"}
                  </Button>
                </div>
              </Card>
            </motion.div>

            <div className="mx-auto mt-6 max-w-3xl">
              <div className="rounded-[1.75rem] border border-border bg-muted/40 px-5 py-4 text-sm leading-6 text-muted-foreground">
                These settings create reminders for your enrolled hackathons using HackRadar backend alerts.
              </div>
            </div>

            <div className="mx-auto mt-6 max-w-3xl">
              <Card className="border-border/70 bg-surface p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] sm:p-8">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">Active Reminders</h2>
                <div className="mt-5 grid gap-3">
                  {loading ? (
                    <p className="text-sm text-muted-foreground">Loading reminders...</p>
                  ) : loadError ? (
                    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-4">
                      <p className="text-sm text-destructive">{loadError}</p>
                      <Button type="button" variant="outline" size="sm" onClick={loadData} className="mt-3">
                        Try again
                      </Button>
                    </div>
                  ) : Array.isArray(alerts) && alerts.length > 0 ? (
                    alerts.map((alert) => (
                      <div
                        key={alert._id}
                        className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-border bg-background px-4 py-4"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">{alert.title}</p>
                          <dl className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                            <div>
                              <dt className="font-medium text-foreground">Reminder time</dt>
                              <dd>{formatAlertTime(alert.alertTime)}</dd>
                            </div>
                            <div>
                              <dt className="font-medium text-foreground">Channels</dt>
                              <dd>
                                {Array.isArray(alert.channels) && alert.channels.length > 0
                                  ? alert.channels.join(", ")
                                  : "None"}
                              </dd>
                            </div>
                            <div>
                              <dt className="font-medium text-foreground">Frequency</dt>
                              <dd>{alert.frequency || "Not specified"}</dd>
                            </div>
                            <div>
                              <dt className="font-medium text-foreground">Status</dt>
                              <dd>{alert.enabled ? "Enabled" : "Disabled"}</dd>
                            </div>
                          </dl>
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={() => removeAlert(alert._id)}>
                          <Trash2 className="size-4" />
                          Delete
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No active reminders yet.</p>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
    </ProtectedPage>
  );
}
