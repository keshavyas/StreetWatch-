import { jsPDF } from 'jspdf';

/**
 * Generates a professional PDF incident report using jsPDF directly.
 * No html2canvas - builds PDF natively for maximum reliability.
 */
export const generateIncidentPDF = (scan) => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    let y = 15;

    // ─── Background fill ───
    pdf.setFillColor(15, 23, 42); // slate-900
    pdf.rect(0, 0, pageW, pageH, 'F');

    // ─── Header bar ───
    pdf.setFillColor(6, 182, 212); // cyan-500
    pdf.rect(0, 0, pageW, 32, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('STREETWATCH INCIDENT REPORT', pageW / 2, 15, { align: 'center' });
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('AI-Powered CCTV Threat Detection System — Official Record', pageW / 2, 23, { align: 'center' });
    
    pdf.setFontSize(7);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, pageW / 2, 29, { align: 'center' });

    y = 42;

    // ─── Scan ID + Confidence ───
    pdf.setFillColor(30, 41, 59); // slate-800
    pdf.roundedRect(15, y, pageW - 30, 22, 3, 3, 'F');
    
    pdf.setTextColor(6, 182, 212);
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Scan ID: ${scan.id}`, 22, y + 9);
    
    const scoreColor = scan.threatScore > 80 ? [239, 68, 68] : [251, 146, 60]; // red or orange
    pdf.setTextColor(...scoreColor);
    pdf.setFontSize(18);
    pdf.text(`${scan.threatScore}%`, pageW - 22, y + 12, { align: 'right' });
    
    pdf.setTextColor(148, 163, 184);
    pdf.setFontSize(8);
    pdf.text('CONFIDENCE SCORE', pageW - 22, y + 18, { align: 'right' });

    y += 30;

    // ─── Details Grid ───
    const details = [
        ['Date & Time', typeof scan.date === 'string' && isNaN(new Date(scan.date).getTime()) ? scan.date : new Date(scan.date).toLocaleString()],
        ['Location', scan.location],
        ['Threat Type', scan.type],
        ['Status', scan.status || 'COMPLETED'],
        ['Duration', `${scan.duration || 900}s`],
        ['Risk Level', scan.threatScore > 80 ? 'CRITICAL' : 'HIGH'],
    ];

    pdf.setFillColor(30, 41, 59);
    pdf.roundedRect(15, y, pageW - 30, 52, 3, 3, 'F');
    
    pdf.setTextColor(148, 163, 184);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('INCIDENT DETAILS', 22, y + 8);
    
    y += 14;
    const colW = (pageW - 40) / 2;
    
    details.forEach((item, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const xPos = 22 + col * colW;
        const yPos = y + row * 12;
        
        pdf.setTextColor(100, 116, 139); // slate-500
        pdf.setFontSize(7);
        pdf.setFont('helvetica', 'normal');
        pdf.text(item[0].toUpperCase(), xPos, yPos);
        
        pdf.setTextColor(226, 232, 240); // slate-200
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text(String(item[1]), xPos, yPos + 5);
    });

    y += 44;

    // ─── Activity Log ───
    if (scan.incidents && scan.incidents.length > 0) {
        pdf.setFillColor(30, 41, 59);
        const logHeight = 12 + scan.incidents.length * 18;
        pdf.roundedRect(15, y, pageW - 30, logHeight, 3, 3, 'F');
        
        pdf.setTextColor(148, 163, 184);
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.text('ACTIVITY LOG', 22, y + 8);
        
        y += 14;
        
        scan.incidents.forEach((inc, i) => {
            // Timestamp pill
            pdf.setFillColor(22, 78, 99); // cyan-900
            pdf.roundedRect(22, y - 3, 25, 8, 2, 2, 'F');
            pdf.setTextColor(6, 182, 212);
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'bold');
            pdf.text(inc.timestamp || `T+${i}`, 24, y + 2);
            
            // Description
            pdf.setTextColor(203, 213, 225);
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'normal');
            const desc = inc.description || 'Activity detected.';
            const lines = pdf.splitTextToSize(desc, pageW - 85);
            pdf.text(lines[0], 50, y + 2);
            
            // Severity
            const sevColor = inc.severity === 'CRITICAL' ? [239, 68, 68] : [251, 146, 60];
            pdf.setTextColor(...sevColor);
            pdf.setFontSize(7);
            pdf.setFont('helvetica', 'bold');
            pdf.text(inc.severity || 'HIGH', pageW - 22, y + 2, { align: 'right' });
            
            y += 18;
        });
    }

    y += 8;

    // ─── Diagonal Watermark ───
    pdf.saveGraphicsState();
    pdf.setGState(new pdf.GState({ opacity: 0.06 }));
    pdf.setTextColor(6, 182, 212);
    pdf.setFontSize(50);
    pdf.setFont('helvetica', 'bold');
    pdf.text('STREETWATCH OFFICIAL', pageW / 2, pageH / 2, { 
        align: 'center', 
        angle: 35 
    });
    pdf.restoreGraphicsState();

    // ─── Footer ───
    pdf.setFillColor(6, 182, 212);
    pdf.rect(0, pageH - 18, pageW, 18, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    pdf.text('This is a system-generated official record from StreetWatch AI-CCTV Threat Detection Platform.', pageW / 2, pageH - 11, { align: 'center' });
    pdf.text(`Document ID: RPT-${scan.id}-${Date.now().toString(36).toUpperCase()} | Indore Security Command`, pageW / 2, pageH - 6, { align: 'center' });

    // ─── Save ───
    pdf.save(`StreetWatch-Report-${scan.id}.pdf`);
    return true;
};
