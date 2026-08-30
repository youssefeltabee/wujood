"use client";

import { Badge, Skeleton } from "@/components/ui";
import { CatalogCheckout } from "@/components/catalog/CatalogCheckout";
import { useCatalogItems } from "@/hooks/use-catalog";
import { EmptyState, PageHeader } from "../_components/chrome";

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
  const { data, isLoading: loading } = useCatalogItems();
  const items: CatalogItem[] = data?.items ?? [];

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <PageHeader
        eyebrow="Tools"
        title="Catalog"
        subtitle="Your products and services with Fawry checkout."
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2" aria-hidden="true">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="card" className="skeleton h-44 rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 11.625l2.25-2.25M12 11.625l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          }
          title="No catalog items yet"
          hint="Add products to enable Fawry checkout."
        />
      ) : (
        <div className="animate-stagger grid gap-4 sm:grid-cols-2">
          {items.filter((i) => i.isActive).map((item) => (
            <article key={item.id} className="card-lux flex flex-col p-5">
              {item.imageUrl && (
                // ponytail: remote URLs are owner-curated, no next/image domain config needed
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  loading="lazy"
                  className="mb-3 h-40 w-full rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-text-primary">{item.name}</h3>
                  {item.category && <Badge variant="gold" size="sm">{item.category}</Badge>}
                </div>
                {item.description && (
                  <p className="line-clamp-2 text-sm text-text-secondary">{item.description}</p>
                )}
              </div>
              <div className="mt-auto border-t border-border-subtle pt-3">
                {item.priceEgp ? (
                  <CatalogCheckout item={item} />
                ) : (
                  <p className="text-center text-xs text-text-muted">Price not set</p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
