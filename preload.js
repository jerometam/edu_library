// ==============================
// 📊 DATA TRANSFORMATION UTILITIES
// ==============================

/**
 * Transforms a column-oriented Retool query result into a row-based array of objects.
 * 
 * Input format:
 * {
 *   columnA: [val1, val2, val3],
 *   columnB: [val1, val2, val3]
 * }
 * 
 * Output format:
 * [
 *   { columnA: val1, columnB: val1 },
 *   { columnA: val2, columnB: val2 },
 *   { columnA: val3, columnB: val3 }
 * ]
 * 
 * @param {object} retoolQueryData - Column-oriented Retool query result
 * @returns {Array<object>} Row-based array of objects
 */
function transformToRows(retoolQueryData) {
  if (!retoolQueryData || typeof retoolQueryData !== 'object') return [];

  const keys = Object.keys(retoolQueryData);
  const rowCount = retoolQueryData[keys[0]]?.length || 0;

  const rows = Array.from({ length: rowCount }, (_, i) => {
    const row = {};
    for (const key of keys) {
      row[key] = retoolQueryData[key]?.[i] ?? null;
    }
    return row;
  });

  return rows;
}

// ==============================
// 📅 ACADEMIC YEAR UTILITIES
// ==============================

/**
 * Calculates the start and end dates for a given academic year.
 * The academic year starts on September 1st of the given year
 * and ends on August 31st of the following year.
 * 
 * Also returns multiple formatted range labels:
 * - rangeFull: "2025-2026"
 * - rangeShort: "25-26"
 * - rangeCompact: "2526"
 * - rangeMixed: "2025-26"
 * - label: "2025–2026" (en dash for display)
 * 
 * @param {string|number} input - Academic year (e.g., "2025" or 2025)
 * @returns {object|null} Object with date range and formatted labels, or null if invalid
 */
function academicYear(input) {
  const year = parseInt(input, 10);

  if (isNaN(year)) {
    console.error("Invalid academic year input:", input);
    return null;
  }

  const startDate = new Date(Date.UTC(year, 8, 1));     // Sept 1
  const endDate = new Date(Date.UTC(year + 1, 7, 31));  // Aug 31

  const start = startDate.toISOString().split('T')[0];
  const end = endDate.toISOString().split('T')[0];

  const fullStart = year.toString();               // "2025"
  const fullEnd = (year + 1).toString();           // "2026"
  const shortStart = fullStart.slice(-2);          // "25"
  const shortEnd = fullEnd.slice(-2);              // "26"

  return {
    start,                            // "2025-09-01"
    end,                              // "2026-08-31"
    rangeFull: `${fullStart}-${fullEnd}`,       // "2025-2026"
    rangeShort: `${shortStart}-${shortEnd}`,    // "25-26"
    rangeCompact: `${shortStart}${shortEnd}`,   // "2526"
    rangeMixed: `${fullStart}-${shortEnd}`,     // "2025-26"
    label: `${fullStart}–${fullEnd}`            // "2025–2026"
  };
}

/**
 * Returns the current academic year as an integer.
 * Assumes academic year starts on September 1st.
 * 
 * For example:
 * - If today is July 2025 → returns 2024
 * - If today is October 2025 → returns 2025
 * 
 * @returns {number} Current academic year
 */
function currentAcademicYear() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth(); // 0 = Jan, 8 = Sept

  // If before September, we're still in the previous academic year
  const academicYear = month < 8 ? year - 1 : year;

  return academicYear;
}
