/**
 * Strip rate/condition advertising from CRM property descriptions (B8).
 * Drops sentences that advertise mortgage rates, payment schedules, or % APR claims.
 * Keeps neutral mortgage-help language and unrelated percentages (e.g. renovation).
 */
export function sanitizeMortgageAdClaims(text: string | null | undefined): string | null {
  if (!text) return text ?? null;

  const rateSentence =
    /ставк|годовых|ежемесячн\w*\s+плат|первоначальн\w*\s+взнос|расчет\s+платежа|базов\w*\s+от\s+\d|ипотек\w*\s+от\s+\d|\d+[.,]?\d*\s*%/i;

  const keepPercentIf =
    /ремонт|готовность|скидк|площад|квартир|отделк|мебел|чистот/i;

  const parts = text.split(/(?<=[.!?…])\s+|\n+/);
  const kept: string[] = [];

  for (const raw of parts) {
    const part = raw.trim();
    if (!part) continue;

    if (/расчет\s+платежа|🔥/i.test(part) && /ипотек|ставк|плат[её]ж/i.test(part)) {
      continue;
    }

    if (/\d+[.,]?\d*\s*%/.test(part)) {
      // Keep sentences where % is clearly not a credit rate
      if (keepPercentIf.test(part) && !/ипотек|ставк|кредит|годов|льготн/.test(part)) {
        kept.push(part);
        continue;
      }
      if (rateSentence.test(part)) continue;
    }

    if (/ставк\w*\s*(до|от)?\s*\d|ипотек\w*\s+от\s+\d|базов\w*\s+от\s+\d|минимальн\w*\s+ставк/i.test(part)) {
      continue;
    }

    // Parenthetical rate-only asides inside otherwise OK sentences
    let cleaned = part
      .replace(/\(\s*ставка\s+(до|от)\s+\d+[.,]?\d*\s*%\s*\)/giu, "")
      .replace(/семейная\s+ипотека\s+от\s+\d+[.,]?\d*\s*%/giu, "семейная ипотека")
      .replace(/,\s*,+/g, ",")
      .replace(/\(\s*\)/g, "")
      .replace(/[ \t]{2,}/g, " ")
      .trim();

    if (!cleaned || /^[,;.\-–—]+$/.test(cleaned)) continue;
    kept.push(cleaned);
  }

  const out = kept.join(" ").replace(/[ \t]{2,}/g, " ").trim();
  return out.length ? out : null;
}
