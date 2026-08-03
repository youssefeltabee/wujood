export type JobType = "audit-scan" | "pdf-generation";

export interface AuditScanJob {
  type: "audit-scan";
  payload: {
    auditId: string;
    url: string;
    userId: string;
  };
}

export interface PdfGenerationJob {
  type: "pdf-generation";
  payload: {
    auditId: string;
  };
}

export type Job = AuditScanJob | PdfGenerationJob;
