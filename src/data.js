// FundingStatsZA — Public Development Funding Intelligence
// ─────────────────────────────────────────────────────────
// Sources:
//   NEF: Parliamentary Question 705 (PQ705) — dtic.gov.za
//   IDC: Audited Annual Financial Statements 2024/25 — idc.co.za
//        IDC Integrated Report 2025 — idc.co.za
//        NAFCOC Parliamentary Submission, February 2026
//        IDC Press Statement, March 2026

// ─── NYDA DATA (Annual Report 2023/24 — Audited) ─────────────────────────────
// Source: NYDA Annual Report 2023/24 (financial year ended 31 March 2024)
//         Audited by the Auditor-General of South Africa
//         NYDA_Annual_Report_Data_2024.xlsx

export const NYDA = {
  financialYear: '2023/24',
  label: 'National Youth Development Agency',
  shortLabel: 'NYDA',
  mandate: 'Youth entrepreneurship and employment (ages 18–35)',

  // Revenue
  totalRevenue: 756600000,
  governmentGrant: 615800000,        // Main allocation from Presidency/Department
  partnershipFunds: 420771275,       // Target was R250M — significantly exceeded
  interestIncome: 10400000,

  // Financial position — CRITICAL: technically insolvent
  totalAssets: 138500000,
  totalLiabilities: 217100000,
  netLiabilityDeficit: -78600000,    // Liabilities exceed assets — going concern risk

  // Performance
  jobsCreatedSustained: 7319,        // Entrepreneurship programme impact
  youthPlacedInJobs: 24307,          // Employment placement programmes
  youthSupportedNonFinancial: 43163, // Training, workshops, non-financial support
  businessGrantsDisbursed: 2200,     // Direct financial grants to youth SMMEs
  vouchersDisbursed: 1072,           // Technical support vouchers

  // Grant structure
  grantMin: 1000,
  grantMax: 250000,                  // Agriculture/tech maximum
  grantLifetimeCap: 200000,          // Per individual, lifetime

  // Governance
  auditOpinion: 'Unqualified with findings',
  auditOpinionCode: 'unqualified_findings',
  irregularExpenditure: 71000000,    // R71M — under AGSA assessment
  kpisMet: '29/29',                  // 100% of performance targets met
  goingConcernRisk: true,

  // Procurement equity (all exceeded targets)
  spendYouthOwned: 43,               // Target: 30%
  spendWomenOwned: 73,               // Target: 40%
  spendDisabilityOwned: 5,           // Target: 5% — met

  // Context
  youthUnemployment1524: 59.6,       // Q4 2024
  youthUnemployment2534: 39.4,       // Q4 2024
}

// Calculated cost metrics — using govt grant (R615.8M) for comparability with NEF/IDC
export const NYDA_METRICS = {
  costPerJobCreated:  Math.round(615800000 / 7319),   // ~R84,136
  costPerYouthPlaced: Math.round(615800000 / 24307),  // ~R25,336
  costPerGrant:       Math.round(615800000 / 2200),   // ~R279,909 per business
}

// ─── AGSA DATA (2024/25 PFMA Consolidated General Report) ───────────────────
// Source: AGSA Consolidated General Report on National and Provincial Audit
//         Outcomes 2024/25 — released 26 March 2026
//         AG Tsakani Maluleke: "No noticeable shift towards better performance"

export const AGSA_HEADLINE = {
  financialYear: '2024/25',
  releaseDate: '26 March 2026',
  auditorGeneral: 'Tsakani Maluleke',
  totalAuditees: 417,
  cleanAudits: 151,
  cleanAuditPct: 36,
  cleanAuditExpenditurePct: 12,  // clean audits control only 12% of expenditure
  findingsExpenditurePct: 88,    // 88% of expenditure under entities with findings
  fruitlessWasteful: 1420000000,  // R1.42B fruitless & wasteful expenditure
  fruitlessWastefulPriorYear: 3500000000, // R3.5B prior year
  irregularExpenditure: 42580000000, // R42.58B reported irregular expenditure
  materialIrregularities: 203,        // active material irregularities
  materialIrregularityLoss: 9170000000, // R9.17B estimated losses at risk
  materialIrregularityResolved: 140,   // resolved in year
  materialIrregularityRecovered: 2410000000, // R2.41B recovered/prevented
  budgetOverruns: 6230000000,          // R6.23B budget overruns
  departmentalAccruals: 51250000000,   // R51.25B accruals
  deficitsAuditees: 158,
  deficitsTotal: 58080000000,          // R58.08B deficits at 158 auditees
  fraudAllegationsNotInvestigated: 30, // % of auditees that ignored fraud
  disciplinaryNonCompliance: 43,       // % failing disciplinary legislation (up from 37%)
  soeGoingConcern: 8,                  // SOEs with going concern doubts
  soeGoingConcernConsecutive: 7,       // SOEs with 6+ consecutive years of doubt
  infrastructureProjectsWithFindings: 89, // % of 152 projects with audit findings
  combinedSoeLiabilities: 866000000000, // Transnet + Eskom combined liabilities
  quote: '"Our audits show no clear improvement in audit outcomes, financial management, service delivery performance, accountability, transparency or institutional integrity. This shows that our audit counsel has not been adequately heeded."',
}

// SOE Audit Scorecard 2024/25
// Source: AGSA Consolidated General Report 2024/25
export const AGSA_SOE_SCORECARD = [
  {
    entity: 'Development Bank of SA',
    shortName: 'DBSA',
    opinion: 'Clean',
    opinionCode: 'clean',
    sector: 'Development Finance',
    note: 'One of only 2 SOEs with a clean audit',
    irregularExp: null,
  },
  {
    entity: 'SA Nuclear Energy Corp',
    shortName: 'Necsa',
    opinion: 'Clean',
    opinionCode: 'clean',
    sector: 'Energy',
    note: 'One of only 2 SOEs with a clean audit',
    irregularExp: null,
  },
  {
    entity: 'Industrial Development Corp',
    shortName: 'IDC',
    opinion: 'Unqualified with findings',
    opinionCode: 'unqualified_findings',
    sector: 'Development Finance',
    note: 'Findings despite R26.6B transformation commitment claims',
    irregularExp: null,
  },
  {
    entity: 'Land Bank',
    shortName: 'Land Bank',
    opinion: 'Unqualified with findings',
    opinionCode: 'unqualified_findings',
    sector: 'Agriculture Finance',
    note: 'Recurring findings on financial management',
    irregularExp: null,
  },
  {
    entity: 'SABC',
    shortName: 'SABC',
    opinion: 'Unqualified with findings',
    opinionCode: 'unqualified_findings',
    sector: 'Media',
    note: 'Procurement irregularities; multiple material irregularities',
    irregularExp: null,
  },
  {
    entity: 'Transnet',
    shortName: 'Transnet',
    opinion: 'Unqualified with findings',
    opinionCode: 'unqualified_findings',
    sector: 'Transport / Logistics',
    note: 'Combined liabilities with Eskom near R866B',
    irregularExp: null,
  },
  {
    entity: 'Eskom',
    shortName: 'Eskom',
    opinion: 'Qualified with findings',
    opinionCode: 'qualified',
    sector: 'Energy',
    note: 'Qualified on PFMA compliance; R4.7B irregular expenditure',
    irregularExp: 4700000000,
  },
  {
    entity: 'SA Post Office',
    shortName: 'SAPO',
    opinion: 'Disclaimer',
    opinionCode: 'disclaimer',
    sector: 'Postal Services',
    note: 'Accounts cannot be relied on; serious financial distress',
    irregularExp: null,
  },
  {
    entity: 'SA Airways',
    shortName: 'SAA',
    opinion: 'Disclaimer',
    opinionCode: 'disclaimer',
    sector: 'Aviation',
    note: 'Accounts cannot be relied on',
    irregularExp: null,
  },
  {
    entity: 'Denel',
    shortName: 'Denel',
    opinion: 'Disclaimer',
    opinionCode: 'disclaimer',
    sector: 'Defence',
    note: 'Accounts cannot be relied on; longstanding financial distress',
    irregularExp: null,
  },
]

// AGSA 5-year irregular expenditure context
export const AGSA_FIVE_YEAR = {
  departmentsIrregular: { entities: 38, amount: 50650000000 },
  soeIrregular: { entities: 27, amount: 69350000000 },
  departmentsFruitless: { entities: 36, amount: 1480000000 },
  soeFruitless: { entities: 27, amount: 2080000000 },
  totalMaterialLoss: 14340000000,
  source: 'AGSA briefing to Standing Committee on Appropriations',
}

// SETA audit snapshot (selected, from AGSA/parliamentary committee data)
export const AGSA_SETA_SNAPSHOT = [
  {
    seta: 'BankSETA',
    opinion: 'Unqualified with findings',
    opinionCode: 'unqualified_findings',
    fruitlessWasteful: 23173000,
    performanceScore: 84,
    note: 'R23.2M fruitless & wasteful; performance data overstated',
  },
  {
    seta: 'EWSETA',
    opinion: 'Findings',
    opinionCode: 'unqualified_findings',
    fruitlessWasteful: null,
    performanceScore: null,
    note: 'Payments for non-existent projects flagged as material irregularity',
  },
  {
    seta: 'CETA',
    opinion: 'Findings',
    opinionCode: 'unqualified_findings',
    fruitlessWasteful: null,
    performanceScore: null,
    note: 'Overpayments to service providers — material irregularity',
  },
  {
    seta: 'HWSETA',
    opinion: 'Unqualified with findings',
    opinionCode: 'unqualified_findings',
    fruitlessWasteful: 1700000,
    performanceScore: null,
    note: 'Payments to deceased learners; incorrect salary payments',
  },
]

// ─── UPDATED META ────────────────────────────────────────────────────────────
export const META = {
  lastUpdated: 'March 2026',
  sources: [
    {
      name: 'Parliamentary Question 705 (PQ705)',
      org: 'NEF / dtic.gov.za',
      url: 'https://www.dtic.gov.za',
    },
    {
      name: 'IDC Annual Financial Statements 2024/25',
      org: 'Industrial Development Corporation (Audited)',
      url: 'https://www.idc.co.za/integrated-report/',
    },
    {
      name: 'IDC Integrated Report 2025',
      org: 'Industrial Development Corporation',
      url: 'https://www.idc.co.za/integrated-report/',
    },
    {
      name: 'AGSA Consolidated General Report 2024/25',
      org: 'Auditor-General of South Africa — released 26 March 2026',
      url: 'https://www.agsa.co.za',
    },
    {
      name: 'NAFCOC Parliamentary Submission',
      org: 'Parliament of South Africa, February 2026',
      url: 'https://www.parliament.gov.za',
    },
  ],
}

// ─── IMPORTANT DEFINITIONS ───────────────────────────────────────────────────
// IDC uses two distinct figures in its reporting — the press release conflates them:
//
//   R13.4B  = Total funding APPROVED in 2024/25 (new commitments made)
//   R16.3B  = Actual on-balance-sheet DISBURSEMENTS in 2024/25 (money out the door)
//   R26.6B  = Cumulative "transformation commitment" figure (multi-year, not one year's spend)
//
// The News24 sponsored article cited R26.6B alongside 15,000 jobs without clarifying
// these are different metrics — creating a misleading cost-per-job impression.
// We use R16.3B (actual disbursements) as the denominator for cost-per-job.
// ─────────────────────────────────────────────────────────────────────────────

// ─── NEF DATA (PQ705) ────────────────────────────────────────────────────────
export const NEF = {
  label: 'National Empowerment Fund',
  shortLabel: 'NEF',
  color: '#9A7B2E',
  period: 'Cumulative (PQ705)',
  totalCompanies: 392,
  totalDisbursed: 3596404994,
  totalJobs: 31654,
  costPerJob: 113616,
  totalLoans: 3516172591,
  totalGrants: 194763000,
  avgLoanPerCompany: 8969828,
  avgJobsPerCompany: 80.8,
  grantPctOfTotal: 5.2,
  companiesWithGrants: 77,
  medianDisbursement: 5550000,
  maxDisbursement: 534000000,
  maxVsMedianRatio: 96.2,
  companiesUnder10Jobs: 21.4,
}

// ─── IDC DATA (Audited 2024/25) ──────────────────────────────────────────────
export const IDC = {
  label: 'Industrial Development Corporation',
  shortLabel: 'IDC',
  color: '#1B3A5C',
  period: '2024/25 Financial Year (Audited)',

  // Funding figures — three distinct numbers, all real, all meaning different things
  fundingApproved: 13400000000,          // R13.4B — new deals approved in 2024/25
  actualDisbursements: 16300000000,      // R16.3B — actual money disbursed in 2024/25
  transformationCommitment: 26600000000, // R26.6B — cumulative transformation commitment (multi-year)

  // Jobs — from audited financial statements (FTE, created AND saved)
  totalJobsFTE: 15732,                   // 15,732 FTE jobs created/saved (audited figure)
  jobsLabel: 'Created and/or saved (FTE)', // important nuance — not all new jobs

  // Cost per job using actual disbursements (R16.3B ÷ 15,732)
  costPerJobActual: 1036000,             // ~R1.04M per job (using R16.3B disbursed)
  costPerJobCommitment: 1690000,         // ~R1.69M per job (using R26.6B commitment — how IDC PR presents it)

  // Black Industrialist programme
  blackIndustrialistFunding: 23400000000, // R23.4B to Black Industrialists in 2024/25
  blackIndustrialistPrior: 10000000000,   // R10B in prior year (272% increase claimed)

  // Other transformation
  youthEntrepreneurs: 1700000000,         // R1.7B to youth entrepreneurs
  womenEntrepreneurs: 5600000000,         // R5.6B to women (down from R11.4B prior year)
  townshipBusinesses: 2200000000,         // R2.2B to 450 township businesses

  // Financial health
  netProfit: 1800000000,                  // R1.8B net profit (down from R7B in 2023/24)
  totalAssets: 144300000000,              // R144.3B total assets

  // Distress — from NAFCOC parliamentary submission (IDC has not publicly confirmed exact figure)
  // Note: IDC acknowledges distressed partners exist; R30B figure is from NAFCOC's submission
  distressPortfolioNAFCOC: 30000000000,  // R30B — NAFCOC's claimed distress figure (unconfirmed by IDC)
  distressNote: 'R30B distress figure sourced from NAFCOC parliamentary submission Feb 2026. IDC has not confirmed this exact figure. IDC acknowledges non-performing loans are "actively managed".',
}

// ─── COMPARISON (using audited actuals) ──────────────────────────────────────
export const COMPARISON = {
  // Using R16.3B actual disbursements vs NEF cumulative
  efficiencyRatioActual: Math.round(IDC.costPerJobActual / NEF.costPerJob), // ~9x
  // Using R26.6B commitment figure (as presented in IDC's press materials)
  efficiencyRatioCommitment: Math.round(IDC.costPerJobCommitment / NEF.costPerJob), // ~15x
  // Disbursements comparison
  idcDisbursedVsNEF: (IDC.actualDisbursements / NEF.totalDisbursed).toFixed(1), // 4.5x
  // Jobs comparison
  nefJobsVsIDC: (NEF.totalJobs / IDC.totalJobsFTE).toFixed(1), // ~2x more jobs
  // Key nuance
  nuance: 'NEF figures are cumulative. IDC figures are for one financial year (2024/25). Direct comparison requires this context.',
}

// ─── NEF PROVINCIAL ──────────────────────────────────────────────────────────
export const NEF_PROVINCES = [
  { province: 'Gauteng',       deals: 135, disbursed: 1041268998, jobs: 14138, costPerJob: 73650,   pct: 29.0, jobPct: 44.7 },
  { province: 'KwaZulu-Natal', deals: 122, disbursed: 970531000,  jobs: 8440,  costPerJob: 114992,  pct: 27.0, jobPct: 26.7 },
  { province: 'Northern Cape', deals: 14,  disbursed: 641399999,  jobs: 326,   costPerJob: 1967485, pct: 17.8, jobPct: 1.0  },
  { province: 'Western Cape',  deals: 31,  disbursed: 271905000,  jobs: 1363,  costPerJob: 199490,  pct: 7.6,  jobPct: 4.3  },
  { province: 'Eastern Cape',  deals: 23,  disbursed: 203399997,  jobs: 1904,  costPerJob: 106828,  pct: 5.7,  jobPct: 6.0  },
  { province: 'Mpumalanga',    deals: 18,  disbursed: 150042000,  jobs: 1098,  costPerJob: 136650,  pct: 4.2,  jobPct: 3.5  },
  { province: 'Limpopo',       deals: 19,  disbursed: 132963000,  jobs: 1741,  costPerJob: 76372,   pct: 3.7,  jobPct: 5.5  },
  { province: 'Free State',    deals: 10,  disbursed: 109239000,  jobs: 1881,  costPerJob: 58075,   pct: 3.0,  jobPct: 5.9  },
  { province: 'North West',    deals: 20,  disbursed: 75656000,   jobs: 763,   costPerJob: 99156,   pct: 2.1,  jobPct: 2.4  },
]

// ─── NEF DEAL SIZE ───────────────────────────────────────────────────────────
export const NEF_DEAL_SIZES = [
  { bracket: 'Under R1m',  deals: 47,  pctDeals: 12.0, disbursed: 24435000,   pctDisbursed: 0.7  },
  { bracket: 'R1m–R5m',    deals: 130, pctDeals: 33.2, disbursed: 335069999,  pctDisbursed: 9.3  },
  { bracket: 'R5m–R10m',   deals: 106, pctDeals: 27.0, disbursed: 746499996,  pctDisbursed: 20.8 },
  { bracket: 'R10m–R25m',  deals: 87,  pctDeals: 22.2, disbursed: 1175799999, pctDisbursed: 32.7 },
  { bracket: 'R25m–R50m',  deals: 20,  pctDeals: 5.1,  disbursed: 703400000,  pctDisbursed: 19.6 },
  { bracket: 'R50m+',      deals: 2,   pctDeals: 0.5,  disbursed: 611200000,  pctDisbursed: 17.0 },
]

// ─── NEF TOP DISBURSEMENTS ───────────────────────────────────────────────────
export const TOP_DISBURSEMENTS = [
  { rank: 1,  company: 'Khatu Industrial and Chemical',   province: 'Northern Cape',  disbursed: 534000000, jobs: 26,  costPerJob: 20538462 },
  { rank: 2,  company: 'CK Mafutha (Pty) Ltd',           province: 'Western Cape',   disbursed: 77200000,  jobs: 4,   costPerJob: 19300000 },
  { rank: 3,  company: 'Devland Gardens (Pty) Ltd',       province: 'Gauteng',        disbursed: 49000000,  jobs: 16,  costPerJob: 3062500  },
  { rank: 4,  company: "Africa's Best 350 (Pty) Ltd",     province: 'Eastern Cape',   disbursed: 44500000,  jobs: 442, costPerJob: 100679   },
  { rank: 5,  company: 'Mandini Group',                   province: 'Gauteng',        disbursed: 44400000,  jobs: 142, costPerJob: 312676   },
  { rank: 6,  company: 'Hayett Investments (Pty) Ltd',    province: 'KwaZulu-Natal',  disbursed: 43600000,  jobs: 230, costPerJob: 189565   },
  { rank: 7,  company: 'Dandelton Investments (Pty) Ltd', province: 'KwaZulu-Natal',  disbursed: 43300000,  jobs: 96,  costPerJob: 451042   },
  { rank: 8,  company: 'Salim Munshi Family Trust',       province: 'KwaZulu-Natal',  disbursed: 38700000,  jobs: 613, costPerJob: 63132    },
  { rank: 9,  company: 'Greyline Holdings',               province: 'Gauteng',        disbursed: 38200000,  jobs: 258, costPerJob: 148062   },
  { rank: 10, company: 'Suntrans CC',                     province: 'KwaZulu-Natal',  disbursed: 38100000,  jobs: 74,  costPerJob: 514865   },
]

// ─── NEF TOP JOB CREATORS ────────────────────────────────────────────────────
export const TOP_JOB_CREATORS = [
  { rank: 1, company: 'Umnotho Maize (Pty) Ltd',           province: 'Gauteng',       jobs: 2352, disbursed: 9000000,  costPerJob: 3827  },
  { rank: 2, company: 'Icebolethu Burial Services Pty Ltd', province: 'KwaZulu-Natal', jobs: 1843, disbursed: 19100000, costPerJob: 10364 },
  { rank: 3, company: 'Tshellaine Holdings',                province: 'Gauteng',       jobs: 1664, disbursed: 37800000, costPerJob: 22716 },
  { rank: 4, company: 'Lebowakgomo Poultry (Pty) Ltd',      province: 'Limpopo',       jobs: 887,  disbursed: 1600000,  costPerJob: 1804  },
  { rank: 5, company: 'KPML Group (Pty) Ltd',               province: 'Gauteng',       jobs: 805,  disbursed: 2000000,  costPerJob: 2484  },
  { rank: 6, company: 'Bibi Cash & Carry Superstore',       province: 'Free State',    jobs: 785,  disbursed: 27700000, costPerJob: 35287 },
  { rank: 7, company: 'Salim Munshi Family Trust',          province: 'KwaZulu-Natal', jobs: 613,  disbursed: 38700000, costPerJob: 63132 },
  { rank: 8, company: 'Ubettina Wethu Company (Pty) Ltd',   province: 'Gauteng',       jobs: 593,  disbursed: 5000000,  costPerJob: 8432  },
]

// ─── EQUITY INSIGHTS ─────────────────────────────────────────────────────────
export const EQUITY_INSIGHTS = [
  { metric: 'Gauteng + KZN share of NEF disbursed',           value: '55.9%',  flag: 'red',   note: 'Two provinces dominate the entire NEF portfolio' },
  { metric: 'Deals under R1m — share of NEF disbursed',       value: '0.7%',   flag: 'red',   note: 'Micro-enterprises receive almost nothing' },
  { metric: 'NEF max vs median disbursement ratio',           value: '96.2×',  flag: 'red',   note: 'Extreme concentration — R534M to one company' },
  { metric: 'NEF companies with 10 or fewer jobs',            value: '21.4%',  flag: 'red',   note: '1 in 5 NEF deals had negligible job impact' },
  { metric: 'IDC women entrepreneur funding decline',         value: '−51%',   flag: 'red',   note: 'Dropped from R11.4B to R5.6B — IDC\'s own report' },
  { metric: 'IDC Black Industrialist funding increase',       value: '+134%',  flag: 'gold',  note: 'Rose from R10B to R23.4B — heavily concentrated' },
  { metric: 'NEF cost/job vs IDC cost/job (actual disbursed)',value: '~9×',    flag: 'gold',  note: 'NEF: R113K · IDC: R1.04M (using R16.3B disbursed)' },
  { metric: 'Free State NEF cost per job',                    value: 'R58K',   flag: 'green', note: 'Most efficient NEF province — well below average' },
]

// ─── UTILITY ─────────────────────────────────────────────────────────────────
export function fmtZAR(n, compact = false) {
  if (compact) {
    if (n >= 1e9) return `R${(n / 1e9).toFixed(2)}B`
    if (n >= 1e6) return `R${(n / 1e6).toFixed(1)}M`
    if (n >= 1e3) return `R${(n / 1e3).toFixed(0)}K`
    return `R${n}`
  }
  return `R${n.toLocaleString('en-ZA')}`
}

export function fmtNum(n) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`
  return n.toLocaleString()
}
