"use client";

import { useEffect, useState } from "react";
import { Card, Badge, Skeleton, Button } from "@/components/ui";
import { CatalogCheckout } from "@/components/catalog/CatalogCheckout";

interface CatalogItem {
  id: string;
  name: string;
  description?: string;
  priceEgp?: number;
  category?: string;
  imageUrl?: string;
  isActive: boolean;
}

export default function CatalogPage() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/catalog")
      .then(async (r) => {
        if (!r.ok) { if (r.status === 401) window.location.href = "/login"; return; }
        return r.json();
      })
      .then((d) => { if (d) setItems(d.items || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-1">Catalog</h1>
        <p className="text-text-secondary">Your products and services with Fawry checkout.</p>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="card" className="h-44" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card variant="surface" padding="lg" className="text-center py-16">
          <svg className="size-12 mx-auto text-text-muted mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 11.625l2.25-2.25M12 11.625l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
          <p className="text-text-muted font-medium">No catalog items yet</p>
          <p className="text-text-muted text-sm mt-1">Add products to enable Fawry checkout.</p>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.filter((i) => i.isActive).map((item) => (
            <Card key={item.id} variant="interactive" padding="md" className="flex flex-col">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-text-primary">{item.name}</h3>
                  {item.category && <Badge variant="default" size="sm">{item.category}</Badge>}
                </div>
                {item.description && (
                  <p className="text-sm text-text-secondary line-clamp-2 mb-3">{item.description}</p>
                )}
              </div>
              <div className="pt-3 border-t border-border-subtle mt-auto">
                {item.priceEgp ? (
                  <CatalogCheckout item={item} />
                ) : (
                  <p className="text-xs text-text-muted text-center">Price not set</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
