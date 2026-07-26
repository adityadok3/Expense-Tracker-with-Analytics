import { Response } from "express";
import { PDFService } from "../services/pdfService";
import { AuthenticatedRequest } from "../types";

export class ReportController {
  static async downloadMonthlyPDF(req: AuthenticatedRequest, res: Response) {
    const userId = req.user!.id;
    const pdfBuffer = await PDFService.generateMonthlyReport(userId);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=financial-report-${Date.now()}.pdf`);
    res.setHeader("Content-Length", pdfBuffer.length);

    return res.send(pdfBuffer);
  }
}
