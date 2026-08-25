"use client";

import { useState } from "react";
import { Badge, Button, Input, Select, useToast, Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui";
import { useReviews, useCreateReview, useUpdateReview, useDeleteReview } from "@/hooks/use-reviews";
import { EmptyState, PageHeader } from "../_components/chrome";

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
        <svg key={i} className={`size-3.5 ${i < rating ? "text-accent-gold" : "text-text-muted/30"}`} viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

export default function ReviewsPage() {
  const { toast } = useToast();
  const { data, isLoading: loading } = useReviews();
  const reviews: Review[] = data?.reviews ?? [];
  const createReview = useCreateReview();
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState("5");
  const [source, setSource] = useState("");

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
    createReview.mutate(
      { authorName, content, rating: Number(rating), source: source || undefined },
      {
        onSuccess: () => {
          toast("Review created", "success");
          setFormOpen(false);
          resetForm();
        },
        onError: () => toast("Failed to create review", "error"),
        onSettled: () => setSaving(false),
      }
    );
  }

  function handleToggle(review: Review) {
    updateReview.mutate(
      { id: review.id, isApproved: !review.isApproved },
      {
        onSuccess: () => toast(review.isApproved ? "Review rejected" : "Review approved", "success"),
        onError: () => toast("Failed to update review", "error"),
      }
    );
  }

  function handleDelete(review: Review) {
    if (!confirm("Delete this review permanently?")) return;
    deleteReview.mutate(review.id, {
      onSuccess: () => toast("Review deleted", "success"),
      onError: () => toast("Failed to delete review", "error"),
    });
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <PageHeader
        eyebrow="Reputation"
        title="Reviews"
        subtitle="Manage customer testimonials and reviews."
        action={<Button onClick={() => { resetForm(); setFormOpen(true); }}>Add Review</Button>}
      />

      {loading ? (
        <div className="card-lux p-6 hover:translate-y-0" aria-hidden="true">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton mb-2 h-12 rounded-lg last:mb-0" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          }
          title="No reviews yet"
          hint="Add testimonials from your customers to build trust."
          cta={<Button size="sm" onClick={() => { resetForm(); setFormOpen(true); }}>Add first review</Button>}
        />
      ) : (
        <div className="card-lux overflow-hidden hover:translate-y-0">
          <div className="overflow-x-auto">
            <table className="table-lux w-full text-sm">
              <thead>
                <tr>
                  <th scope="col" className="px-6 pb-3 pt-5 text-start font-medium">Review</th>
                  <th scope="col" className="px-6 pb-3 pt-5 text-start font-medium">Rating</th>
                  <th scope="col" className="px-6 pb-3 pt-5 text-start font-medium">Status</th>
                  <th scope="col" className="px-6 pb-3 pt-5 text-start font-medium">Date</th>
                  <th scope="col" className="px-6 pb-3 pt-5 text-end font-medium"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.id}>
                    <td className="max-w-xs px-6 pe-4">
                      <p className="font-medium text-text-primary">{review.authorName}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-text-secondary">{review.content}</p>
                      {review.source && <Badge variant="info" size="sm" className="mt-1.5">{review.source}</Badge>}
                    </td>
                    <td className="px-6">
                      <StarRating rating={review.rating} />
                      <span className="ms-1.5 text-xs text-text-muted">{review.rating}/5</span>
                    </td>
                    <td className="px-6">
                      <Badge variant={review.isApproved ? "success" : "warning"} size="sm">
                        {review.isApproved ? "Approved" : "Pending"}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-6 text-text-secondary">
                      {new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td className="px-6 text-end">
                      <div className="inline-flex gap-2">
                        <Button variant="secondary" size="sm" onClick={() => handleToggle(review)}>
                          {review.isApproved ? "Reject" : "Approve"}
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(review)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={formOpen} onOpenChange={(o) => { if (!o) { setFormOpen(false); resetForm(); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Review</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => { e.preventDefault(); handleCreate(); }}
            className="flex flex-col gap-lg"
          >
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
              <Button type="button" variant="secondary" onClick={() => { setFormOpen(false); resetForm(); }}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
