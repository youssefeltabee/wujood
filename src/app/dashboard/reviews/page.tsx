"use client";

import { useEffect, useState } from "react";
import { Card, Badge, Button, Input, Select, Modal, Spinner, useToast } from "@/components/ui";

interface Review {
  id: string;
  authorName: string;
  content: string;
  rating: number;
  source: string | null;
  isApproved: boolean;
  createdAt: string;
}

const sources = [
  { value: "", label: "Select source" },
  { value: "google", label: "Google" },
  { value: "facebook", label: "Facebook" },
  { value: "website", label: "Website" },
  { value: "other", label: "Other" },
];

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <svg key={i} className={`size-4 ${i < rating ? "text-accent-gold" : "text-text-muted/30"}`} viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

function ReviewCard({ review, onToggle, onDelete }: { review: Review; onToggle: () => void; onDelete: () => void }) {
  return (
    <Card variant="elevated" padding="md">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-text-primary">{review.authorName}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <StarRating rating={review.rating} />
            <span className="text-xs text-text-muted">
              {new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
            </span>
          </div>
        </div>
        <Badge variant={review.isApproved ? "success" : "warning"}>
          {review.isApproved ? "Approved" : "Pending"}
        </Badge>
      </div>
      <p className="text-sm text-text-secondary mb-3">{review.content}</p>
      <div className="flex items-center gap-2 text-xs text-text-muted mb-3">
        {review.source && <><Badge variant="info" size="sm">{review.source}</Badge><span>·</span></>}
        <span>{review.rating}/5</span>
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={onToggle}>
          {review.isApproved ? "Reject" : "Approve"}
        </Button>
        <Button variant="secondary" size="sm" onClick={onDelete}>Delete</Button>
      </div>
    </Card>
  );
}

export default function ReviewsPage() {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState("5");
  const [source, setSource] = useState("");

  async function fetchReviews() {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews");
      if (res.status === 401) { window.location.href = "/login"; return; }
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch {
      toast("Failed to load reviews", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchReviews(); }, []);

  function resetForm() {
    setAuthorName("");
    setContent("");
    setRating("5");
    setSource("");
  }

  async function handleCreate() {
    if (!authorName.trim() || !content.trim()) {
      toast("Author name and content are required", "error");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorName, content, rating: Number(rating), source: source || null }),
      });
      if (!res.ok) throw new Error();
      toast("Review created", "success");
      setFormOpen(false);
      resetForm();
      fetchReviews();
    } catch {
      toast("Failed to create review", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(review: Review) {
    try {
      const res = await fetch(`/api/reviews/${review.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: !review.isApproved }),
      });
      if (!res.ok) throw new Error();
      toast(review.isApproved ? "Review rejected" : "Review approved", "success");
      fetchReviews();
    } catch {
      toast("Failed to update review", "error");
    }
  }

  async function handleDelete(review: Review) {
    if (!confirm("Delete this review permanently?")) return;
    try {
      const res = await fetch(`/api/reviews/${review.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast("Review deleted", "success");
      fetchReviews();
    } catch {
      toast("Failed to delete review", "error");
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-1">Reviews</h1>
          <p className="text-text-secondary">Manage customer testimonials and reviews.</p>
        </div>
        <Button onClick={() => { resetForm(); setFormOpen(true); }}>Add Review</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : reviews.length === 0 ? (
        <Card variant="surface" padding="lg" className="text-center py-16">
          <svg className="size-12 mx-auto text-text-muted mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <p className="text-text-muted font-medium">No reviews yet</p>
          <p className="text-text-muted text-sm mt-1">Add testimonials from your customers.</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onToggle={() => handleToggle(review)}
              onDelete={() => handleDelete(review)}
            />
          ))}
        </div>
      )}

      <Modal open={formOpen} onClose={() => { setFormOpen(false); resetForm(); }} title="Add Review">
        <div className="space-y-4">
          <Input label="Author Name" value={authorName} onChange={(e) => setAuthorName(e.target.value)} required />
          <Input label="Content" value={content} onChange={(e) => setContent(e.target.value)} required />
          <Select
            label="Rating"
            options={[5, 4, 3, 2, 1].map((n) => ({ value: n.toString(), label: `${n} Star${n > 1 ? "s" : ""}` }))}
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
          <Select label="Source" options={sources} value={source} onChange={(e) => setSource(e.target.value)} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => { setFormOpen(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
