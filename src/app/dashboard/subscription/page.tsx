"use client";

import { useState } from "react";
import { Card, Button, Badge, Spinner, useToast } from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useSubscription,
  useCancelSubscription,
  useChangeTier,
} from "@/hooks/use-subscription";
import { siteConfig } from "@/config/site";

const tierLabels: Record<string, string> = {
  kashif: "Kashif",
  sane: "Sane'",
  raed: "Ra'ed",
};

const tierBadgeVariant: Record<string, "gold" | "info" | "default"> = {
  kashif: "gold",
  sane: "info",
  raed: "default",
};

const statusBadgeVariant: Record<string, "success" | "danger" | "warning"> = {
  active: "success",
  canceled: "danger",
  expired: "warning",
};

export default function SubscriptionPage() {
  const { toast } = useToast();
  const { data, isLoading } = useSubscription();
  const subscription = data?.subscription ?? null;

  const cancelMutation = useCancelSubscription();
  const changeTierMutation = useChangeTier();

  const [cancelOpen, setCancelOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  function handleCancel() {
    cancelMutation.mutate(undefined, {
      onSuccess: () => {
        toast("Subscription canceled", "success");
        setCancelOpen(false);
      },
      onError: (err: Error) => {
        toast(err.message || "Failed to cancel", "error");
      },
    });
  }

  function handleUpgrade() {
    if (!selectedTier) return;
    changeTierMutation.mutate(selectedTier, {
      onSuccess: () => {
        toast(`Upgraded to ${tierLabels[selectedTier]}`, "success");
        setUpgradeOpen(false);
        setSelectedTier(null);
      },
      onError: (err: Error) => {
        toast(err.message || "Failed to upgrade", "error");
      },
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  // Tiers the user can upgrade to (higher price than current)
  const upgradeableTiers = subscription
    ? siteConfig.tiers.filter((t) => {
        const current = siteConfig.tiers.find((x) => x.id === subscription.tier);
        return current && t.price > current.price;
      })
    : siteConfig.tiers;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-1">
          Subscription
        </h1>
        <p className="text-text-secondary">Manage your plan and billing.</p>
      </div>

      <Card variant="elevated" padding="lg">
        <Card.Body>
          {!subscription ? (
            <div className="text-center py-8">
              <p className="text-text-muted mb-4">
                You don&apos;t have an active subscription yet.
              </p>
              <p className="text-sm text-text-muted">
                Complete a payment to get started.
              </p>
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
                    <Badge
                      variant={
                        statusBadgeVariant[subscription.status] || "default"
                      }
                      size="sm"
                    >
                      {subscription.status}
                    </Badge>
                  </div>
                </div>
                <Badge
                  variant={tierBadgeVariant[subscription.tier] || "default"}
                  size="md"
                >
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
                  {upgradeableTiers.length > 0 && (
                    <Button
                      variant="primary"
                      onClick={() => setUpgradeOpen(true)}
                    >
                      Upgrade Plan
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    onClick={() => setCancelOpen(true)}
                  >
                    Cancel Subscription
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card.Body>
      </Card>

      <Dialog
        open={cancelOpen}
        onOpenChange={(o) => setCancelOpen(o)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
          </DialogHeader>
          <p className="text-text-secondary text-sm mb-6">
            Are you sure you want to cancel your subscription? You&apos;ll lose
            access at the end of the billing period.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setCancelOpen(false)}>
              Keep Subscription
            </Button>
            <Button
              variant="danger"
              onClick={handleCancel}
              isLoading={cancelMutation.isPending}
            >
              Confirm Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={upgradeOpen}
        onOpenChange={(o) => {
          setUpgradeOpen(o);
          if (!o) setSelectedTier(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upgrade Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mb-6">
            {upgradeableTiers.map((tier) => (
              <button
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  selectedTier === tier.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-bg-elevated hover:border-border/80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-text-primary">
                      {tier.name.en}
                      <span className="text-text-muted ms-2">{tier.name.ar}</span>
                    </p>
                    <p className="text-sm text-text-secondary">
                      EGP {tier.price.toLocaleString()}/month
                    </p>
                  </div>
                  {tier.popular && (
                    <Badge variant="info" size="sm">
                      Popular
                    </Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setUpgradeOpen(false);
                setSelectedTier(null);
              }}
            >
              Not Now
            </Button>
            <Button
              variant="primary"
              onClick={handleUpgrade}
              isLoading={changeTierMutation.isPending}
              disabled={!selectedTier}
            >
              Upgrade Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
