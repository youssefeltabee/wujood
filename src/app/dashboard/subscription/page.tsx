"use client";

import { useEffect, useState } from "react";
import { Card, Button, Badge, Modal, Spinner, useToast } from "@/components/ui";

interface SubscriptionData {
  id: string;
  tier: string;
  status: string;
  interval: string;
  priceEgp: number;
  startedAt: string;
  expiresAt: string | null;
  canceledAt: string | null;
}

const tierLabels: Record<string, string> = {
  kashif: "Kashif",
  mutamayiz: "Mutamayiz",
};

const tierBadgeVariant: Record<string, "gold" | "info" | "default"> = {
  kashif: "gold",
  mutamayiz: "info",
};

const statusBadgeVariant: Record<string, "success" | "danger" | "warning"> = {
  active: "success",
  canceled: "danger",
  expired: "warning",
};

export default function SubscriptionPage() {
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  async function fetchSubscription() {
    const res = await fetch("/api/subscriptions");
    if (res.ok) {
      const data = await res.json();
      setSubscription(data.subscription);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchSubscription();
  }, []);

  async function cancelSubscription() {
    setActionLoading(true);
    const res = await fetch("/api/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cancel" }),
    });
    setActionLoading(false);
    setCancelOpen(false);
    if (res.ok) {
      toast("Subscription canceled", "success");
      await fetchSubscription();
    } else {
      const err = await res.json();
      toast(err.error || "Failed to cancel", "error");
    }
  }

  async function upgradeTier() {
    setActionLoading(true);
    const res = await fetch("/api/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "change-tier", tier: "mutamayiz" }),
    });
    setActionLoading(false);
    setUpgradeOpen(false);
    if (res.ok) {
      toast("Upgraded to Mutamayiz", "success");
      await fetchSubscription();
    } else {
      const err = await res.json();
      toast(err.error || "Failed to upgrade", "error");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-1">Subscription</h1>
        <p className="text-text-secondary">Manage your plan and billing.</p>
      </div>

      <Card variant="elevated" padding="lg">
        <Card.Body>
          {!subscription ? (
            <div className="text-center py-8">
              <p className="text-text-muted mb-4">You don&apos;t have an active subscription yet.</p>
              <p className="text-sm text-text-muted">Complete a payment to get started.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted mb-1">Current Plan</p>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-text-primary">
                      {tierLabels[subscription.tier] || subscription.tier}
                    </h2>
                    <Badge variant={statusBadgeVariant[subscription.status] || "default"} size="sm">
                      {subscription.status}
                    </Badge>
                  </div>
                </div>
                <Badge variant={tierBadgeVariant[subscription.tier] || "default"} size="md">
                  {subscription.interval === "yearly" ? "Yearly" : "Monthly"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 rounded-lg bg-bg-elevated">
                  <p className="text-text-muted mb-0.5">Started</p>
                  <p className="text-text-primary font-medium">
                    {new Date(subscription.startedAt).toLocaleDateString()}
                  </p>
                </div>
                {subscription.expiresAt && (
                  <div className="p-3 rounded-lg bg-bg-elevated">
                    <p className="text-text-muted mb-0.5">Expires</p>
                    <p className="text-text-primary font-medium">
                      {new Date(subscription.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {subscription.canceledAt && (
                  <div className="p-3 rounded-lg bg-bg-elevated">
                    <p className="text-text-muted mb-0.5">Canceled</p>
                    <p className="text-text-primary font-medium">
                      {new Date(subscription.canceledAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {subscription.status === "active" && (
                <div className="flex flex-wrap gap-3 pt-2">
                  {subscription.tier !== "mutamayiz" && (
                    <Button variant="primary" onClick={() => setUpgradeOpen(true)}>
                      Upgrade to Mutamayiz
                    </Button>
                  )}
                  <Button variant="danger" onClick={() => setCancelOpen(true)}>
                    Cancel Subscription
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal open={cancelOpen} onClose={() => setCancelOpen(false)} title="Cancel Subscription" size="sm">
        <p className="text-text-secondary text-sm mb-6">
          Are you sure you want to cancel your subscription? You&apos;ll lose access at the end of the billing period.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setCancelOpen(false)}>Keep Subscription</Button>
          <Button variant="danger" onClick={cancelSubscription} isLoading={actionLoading}>
            Confirm Cancel
          </Button>
        </div>
      </Modal>

      <Modal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} title="Upgrade to Mutamayiz" size="sm">
        <p className="text-text-secondary text-sm mb-6">
          Upgrade to Mutamayiz for EGP 999/month and unlock all premium features. Your current plan will be canceled.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setUpgradeOpen(false)}>Not Now</Button>
          <Button variant="primary" onClick={upgradeTier} isLoading={actionLoading}>
            Upgrade Now
          </Button>
        </div>
      </Modal>
    </div>
  );
}
