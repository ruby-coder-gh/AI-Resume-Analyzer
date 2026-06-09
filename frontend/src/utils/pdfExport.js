import jsPDF from 'jspdf';

export function exportAnalysisAsPdf(analysis, filename) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  const lineHeight = 7;

  function addTitle(text, size = 14) {
    doc.setFontSize(size);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text(text, margin, y);
    y += size * 0.5 + 4;
  }

  function addBody(text, color = 100) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(color, color, color);
    const lines = doc.splitTextToSize(text || '', maxWidth);
    lines.forEach((line) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(line, margin, y);
      y += lineHeight;
    });
    y += 3;
  }

  function addBulletList(items, color = 80) {
    (items || []).forEach((item) => {
      const text = typeof item === 'string' ? item : item.text || item.keyword || item.name || '';
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(color, color, color);
      const lines = doc.splitTextToSize(`• ${text}`, maxWidth);
      lines.forEach((line) => { doc.text(line, margin, y); y += lineHeight; });
    });
    y += 3;
  }

  // Cover
  doc.setFillColor(15, 15, 25);
  doc.rect(0, 0, pageWidth, 297, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('ResumeIQ AI Report', margin, 80);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`File: ${filename}`, margin, 100);
  doc.text(`Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin, 112);
  doc.text(`Overall Score: ${analysis.overall_score}/100`, margin, 128);
  doc.text(`ATS Compatibility: ${analysis.ats_compatibility_score}/100`, margin, 140);
  doc.text(`Hiring Readiness: ${analysis.hiring_readiness}`, margin, 152);
  doc.addPage();

  // Summary
  addTitle('Executive Summary', 16);
  addBody(analysis.summary);

  // Scores
  addTitle('Score Overview', 14);
  addBody(`Overall Resume Score: ${analysis.overall_score}/100`);
  addBody(`ATS Compatibility Score: ${analysis.ats_compatibility_score}/100`);
  addBody(`Hiring Readiness: ${analysis.hiring_readiness}`);
  y += 4;

  if (analysis.ats_breakdown) {
    addTitle('ATS Breakdown', 14);
    addBody(`Formatting: ${analysis.ats_breakdown.formatting_score}/100`);
    addBody(`Keyword Optimization: ${analysis.ats_breakdown.keyword_optimization}/100`);
    addBody(`Section Completeness: ${analysis.ats_breakdown.section_completeness}/100`);
    addBody(`Readability: ${analysis.ats_breakdown.readability}/100`);
    addBody(`Achievement Focus: ${analysis.ats_breakdown.achievement_focus}/100`);
    y += 4;
  }

  // Skills
  addTitle('Skills Identified', 14);
  addBulletList(analysis.skills_identified);

  // Missing Keywords
  addTitle('Missing Keywords', 14);
  addBulletList(analysis.missing_keywords);

  // Strengths
  addTitle('Strengths', 14);
  addBulletList(analysis.strengths);

  // Areas for Improvement
  addTitle('Areas for Improvement', 14);
  addBulletList(analysis.areas_for_improvement);

  // Recommendations
  if (analysis.recommendations?.length) {
    addTitle('Recommendations', 14);
    addBulletList(analysis.recommendations);
  }

  doc.save(`ResumeIQ-${filename.replace('.pdf', '')}.pdf`);
}
