"use client";

import { useState } from "react";
import { Button, Modal, Card, Badge, useToast } from "@/components/ui";

interface CatalogItem {
  id: string;
  name: string;
  description?: string;
  priceEgp?: number | string;
  category?: string;
  imageUrl?: string;
}

export function CatalogCheckout({ item }: { item: CatalogItem }) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const price = Number(item.priceEgp) || 0;

  const handleBuy = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payments/fawry/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ catalogItemId: item.id, quantity }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");

      if (data.checkoutUrl) {
        window.open(data.checkoutUrl, "_blank");
      }
      toast(`Checkout created — ${data.payment.status}`, data.checkoutUrl ? "success" : "info");
      setOpen(false);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Checkout failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button size="sm" fullWidth onClick={() => setOpen(true)}>
        Buy Now - {price} EGP
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="Checkout" size="sm">
        <div className="space-y-4">
          <Card variant="surface" padding="sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-text-primary">{item.name}</p>
                {item.description && (
                  <p className="text-sm text-text-secondary mt-1">{item.description}</p>
                )}
              </div>
              <Badge variant="gold">{price} EGP</Badge>
            </div>
          </Card>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="size-8 rounded-lg border border-border-subtle flex items-center justify-center text-text-primary hover:bg-bg-elevated transition-colors"
              aria-label="Decrease quantity"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /></svg>
            </button>
            <span className="text-lg font-semibold text-text-primary min-w-[2rem] text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="size-8 rounded-lg border border-border-subtle flex items-center justify-center text-text-primary hover:bg-bg-elevated transition-colors"
              aria-label="Increase quantity"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14m7-7H5" /></svg>
            </button>
          </div>

          <div className="border-t border-border-subtle pt-3">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Total</span>
              <span className="font-semibold text-text-primary">{(price * quantity).toFixed(2)} EGP</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" fullWidth onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button fullWidth onClick={handleBuy} isLoading={loading}>
              Proceed to Payment
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
