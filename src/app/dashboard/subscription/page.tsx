"use client";

import { useState } from "react";
import { Button, Badge, useToast } from "@/components/ui";
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
import { EmptyState, PageHeader } from "../_components/chrome";

const tierLabels: Record<string, string> = {
  KASHIF: "Kashif",
  SANE: "Sane'",
  RAED: "Ra'ed",
};

const tierBadgeVariant: Record<string, "gold" | "info" | "default"> = {
  KASHIF: "gold",
  SANE: "info",
  RAED: "default",
};

const statusBadgeVariant: Record<string, "success" | "danger" | "warning"> = {
  ACTIVE: "success",
  CANCELED: "danger",
  EXPIRED: "warning",
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
      <div className="mx-auto w-full max-w-3xl px-6 py-10" aria-hidden="true">
        <div className="skeleton mb-2 h-4 w-24 rounded" />
        <div className="skeleton mb-8 h-9 w-48 rounded-lg" />
        <div className="skeleton h-72 rounded-2xl" />
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
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      <PageHeader
        eyebrow="Account"
        title="Subscription"
        subtitle="Manage your plan and billing."
      />

      <div className="card-lux p-6 hover:translate-y-0 md:p-8">
        {!subscription ? (
          <EmptyState
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="No active subscription"
            hint="Complete a payment from the pricing page to get started."
          />
        ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted mb-1">Current Plan</p>
                  <div className="flex items-center gap-2">
                    <h2 className="stat-value text-2xl font-bold text-text-primary">
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

              {subscription.status === "ACTIVE" && (
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
      </div>

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
