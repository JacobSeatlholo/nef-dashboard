import { useState, useEffect, useRef, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import {
  Users, DollarSign, MapPin, Filter, AlertTriangle,
  ExternalLink, Shield, Calculator, Award, BarChart2,
  Scale, Info, FileText,
} from 'lucide-react'
import {
  NEF, IDC, COMPARISON, NEF_PROVINCES, NEF_DEAL_SIZES,
  TOP_DISBURSEMENTS, TOP_JOB_CREATORS, EQUITY_INSIGHTS,
  NYDA, NYDA_METRICS,
  AGSA_HEADLINE, AGSA_SOE_SCORECARD, AGSA_FIVE_YEAR, AGSA_SETA_SNAPSHOT,
  META, fmtZAR,
} from './data.js'

const C = {
  navy:'#1B3A5C', navyL:'#2A5280', navyBg:'#EEF3F8', navyBdr:'#B8CDE0',
  gold:'#9A7B2E', goldD:'#7A5F20', goldBg:'#F9F4E8', goldBdr:'#E2CFA0',
  green:'#1E6644', greenBg:'#EEF7F2', greenBdr:'#A8D4BB',
  red:'#9B2020', redBg:'#FDF0F0', redBdr:'#E0AAAA',
  ink:'#1A1915', ink5:'#4A4840', ink4:'#6B6860', ink3:'#9A9790',
  border:'#E2DDD5', page:'#F4F2ED', surface:'#FFFFFF', s2:'#F9F8F5', s3:'#F0EDE6',
}

const CHART_COLORS = [C.navy,C.gold,'#2E6B8A','#8A6B2E','#4A7C59','#6B2E8A','#2E8A6B','#8A2E2E','#2E4A8A']

// ── animated counter ──────────────────────────────────────────────────────────
function Counter({ target, prefix='', suffix='', decimals=0, duration=1800 }) {
  const [val, setVal] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  useEffect(() => {
    if (!started) return
    let s = null
    const step = ts => {
      if (!s) s = ts
      const p = Math.min((ts-s)/duration, 1)
      setVal((1-Math.pow(1-p,3))*target)
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [started, target, duration])
  const display = decimals > 0 ? val.toFixed(decimals) : Math.floor(val).toLocaleString('en-ZA')
  return <span ref={ref}>{prefix}{display}{suffix}</span>
}

// ── section header ────────────────────────────────────────────────────────────
function SH({ icon: Icon, title, subtitle, accent='navy' }) {
  const col = {navy:C.navy,gold:C.gold,red:C.red,green:C.green}[accent]
  return (
    <div style={{display:'flex',alignItems:'flex-start',gap:12,marginBottom:20}}>
      <div style={{padding:8,borderRadius:8,background:`${col}14`,flexShrink:0}}>
        <Icon size={16} style={{color:col}} />
      </div>
      <div>
        <h2 style={{fontFamily:'Playfair Display,serif',fontSize:20,fontWeight:700,color:C.ink,margin:0}}>{title}</h2>
        {subtitle && <p style={{fontSize:13,color:C.ink4,margin:'2px 0 0'}}>{subtitle}</p>}
      </div>
    </div>
  )
}

// ── chart tooltip ─────────────────────────────────────────────────────────────
const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:'10px 12px',fontSize:12,boxShadow:'0 4px 12px rgba(0,0,0,0.08)'}}>
      <p style={{fontWeight:600,color:C.ink,marginBottom:6}}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{color:p.color,margin:'2px 0',display:'flex',justifyContent:'space-between',gap:16}}>
          <span>{p.name}</span>
          <span style={{fontFamily:'DM Mono,monospace',fontWeight:500}}>{p.value > 1000 ? fmtZAR(p.value,true) : p.value?.toLocaleString()}</span>
        </p>
      ))}
    </div>
  )
}

// ── card ──────────────────────────────────────────────────────────────────────
const card = (extra={}) => ({background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,...extra})
const tinted = (bg,bdr,extra={}) => ({background:bg,border:`1px solid ${bdr}`,borderRadius:12,...extra})

// ── comparison panel ──────────────────────────────────────────────────────────
function ComparisonPanel() {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>

      {/* Methodology note */}
      <div style={tinted(C.navyBg,C.navyBdr,{padding:'14px 16px',display:'flex',gap:10,alignItems:'flex-start'})}>
        <Info size={14} style={{color:C.navy,flexShrink:0,marginTop:1}} />
        <div>
          <p style={{fontSize:12,fontWeight:600,color:C.navy,marginBottom:4}}>How we compare these numbers</p>
          <p style={{fontSize:12,color:C.ink5,lineHeight:1.6,margin:0}}>
            The IDC uses three distinct figures: <strong style={{color:C.ink}}>R13.4B</strong> (new approvals),{' '}
            <strong style={{color:C.ink}}>R16.3B</strong> (actual disbursements — money out the door), and{' '}
            <strong style={{color:C.ink}}>R26.6B</strong> (multi-year cumulative transformation commitment).
            The News24 sponsored article cited R26.6B next to 15,000 jobs without clarifying these are different metrics.
            We use <strong style={{color:C.ink}}>R16.3B actual disbursements</strong> — the fairest comparison.
          </p>
        </div>
      </div>

      {/* Institution cards — stack on mobile */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:16}}>

        {/* NEF */}
        <div style={card({overflow:'hidden'})}>
          <div style={{padding:'14px 16px',background:C.goldBg,borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
            <div>
              <p style={{fontSize:10,fontWeight:700,color:C.gold,textTransform:'uppercase',letterSpacing:'0.08em',margin:0}}>National Empowerment Fund</p>
              <p style={{fontFamily:'Playfair Display,serif',fontSize:16,fontWeight:700,color:C.ink,margin:'2px 0 0'}}>NEF — PQ705 Data</p>
            </div>
            <span style={{fontSize:10,fontWeight:700,padding:'3px 10px',borderRadius:99,background:C.goldBg,border:`1px solid ${C.goldBdr}`,color:C.goldD}}>CUMULATIVE</span>
          </div>
          <div style={{padding:'0 16px'}}>
            {[
              {label:'Total Disbursed (cumulative)', value:fmtZAR(NEF.totalDisbursed,true), color:C.gold},
              {label:'Jobs Created',                 value:NEF.totalJobs.toLocaleString(),   color:C.ink},
              {label:'Cost per Job',                 value:fmtZAR(NEF.costPerJob,true),      color:C.green},
              {label:'Companies Funded',             value:NEF.totalCompanies,               color:C.ink},
              {label:'Avg Loan per Company',         value:fmtZAR(NEF.avgLoanPerCompany,true), color:C.ink},
            ].map(r => (
              <div key={r.label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'11px 0',borderBottom:`1px solid ${C.border}`,gap:12}}>
                <span style={{fontSize:13,color:C.ink4}}>{r.label}</span>
                <span style={{fontFamily:'DM Mono,monospace',fontWeight:600,fontSize:13,color:r.color,flexShrink:0}}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* IDC */}
        <div style={card({overflow:'hidden'})}>
          <div style={{padding:'14px 16px',background:C.navyBg,borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
            <div>
              <p style={{fontSize:10,fontWeight:700,color:C.navy,textTransform:'uppercase',letterSpacing:'0.08em',margin:0}}>Industrial Development Corporation</p>
              <p style={{fontFamily:'Playfair Display,serif',fontSize:16,fontWeight:700,color:C.ink,margin:'2px 0 0'}}>IDC — Audited 2024/25</p>
            </div>
            <span style={{fontSize:10,fontWeight:700,padding:'3px 10px',borderRadius:99,background:C.navyBg,border:`1px solid ${C.navyBdr}`,color:C.navy}}>2024/25</span>
          </div>
          <div style={{padding:'0 16px'}}>
            {[
              {label:'Actual Disbursements (used for CPJ)', value:fmtZAR(IDC.actualDisbursements,true),      color:C.navy},
              {label:'Funding Approved (new deals)',         value:fmtZAR(IDC.fundingApproved,true),          color:C.ink4},
              {label:'Transformation Commitment (multi-yr)',value:fmtZAR(IDC.transformationCommitment,true), color:C.ink4},
              {label:'Jobs Created / Saved (FTE)',           value:IDC.totalJobsFTE.toLocaleString(),          color:C.ink},
              {label:'Cost per Job (actual disbursements)',  value:fmtZAR(IDC.costPerJobActual,true),          color:C.red},
            ].map(r => (
              <div key={r.label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'11px 0',borderBottom:`1px solid ${C.border}`,gap:12}}>
                <span style={{fontSize:13,color:C.ink4,lineHeight:1.3}}>{r.label}</span>
                <span style={{fontFamily:'DM Mono,monospace',fontWeight:600,fontSize:13,color:r.color,flexShrink:0}}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Efficiency gap */}
      <div style={card({overflow:'hidden'})}>
        <div style={{padding:'14px 16px',background:C.goldBg,borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',gap:10}}>
          <Scale size={16} style={{color:C.gold}} />
          <p style={{fontFamily:'Playfair Display,serif',fontWeight:700,fontSize:16,color:C.ink,margin:0}}>The Efficiency Gap — Audited Figures</p>
        </div>
        <div style={{padding:20}}>
          <p style={{fontSize:14,color:C.ink5,lineHeight:1.7,marginBottom:16}}>
            Using IDC's own audited disbursement figure of R16.3B and 15,732 FTE jobs (created <em>and</em> saved),
            the cost per job is <strong style={{color:C.red}}>~R1.04M</strong> — roughly <strong style={{color:C.ink}}>9× worse</strong> than the NEF's R113,616.
            If you use the R26.6B commitment figure the way IDC's press release implies, the ratio rises to ~15×.
            Either way, the efficiency gap is substantial and documented.
          </p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:14}}>
            {[
              {label:'NEF cost per job',          value:fmtZAR(NEF.costPerJob,true),           color:C.green, bg:C.greenBg},
              {label:'IDC cost per job (actual)', value:fmtZAR(IDC.costPerJobActual,true),      color:C.red,   bg:C.redBg  },
              {label:'Efficiency gap',            value:`~${COMPARISON.efficiencyRatioActual}×`,color:C.gold,  bg:C.goldBg },
            ].map(s => (
              <div key={s.label} style={{background:s.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:'12px 10px',textAlign:'center'}}>
                <p style={{fontFamily:'Playfair Display,serif',fontSize:'clamp(18px,4vw,24px)',fontWeight:700,color:s.color,margin:0}}>{s.value}</p>
                <p style={{fontSize:11,color:C.ink4,margin:'4px 0 0',lineHeight:1.3}}>{s.label}</p>
              </div>
            ))}
          </div>
          <p style={{fontSize:11,color:C.ink4,fontStyle:'italic',borderTop:`1px solid ${C.border}`,paddingTop:12,margin:0}}>
            Note: NEF data is cumulative across multiple years. IDC data is for 2024/25 only. Direct year-on-year comparison requires NEF annual data not available via PQ705.
          </p>
        </div>
      </div>

      {/* What the article didn't say */}
      <div style={card({overflow:'hidden'})}>
        <div style={{padding:'14px 16px',background:C.redBg,borderBottom:`1px solid ${C.redBdr}`,display:'flex',alignItems:'center',gap:10}}>
          <AlertTriangle size={16} style={{color:C.red}} />
          <p style={{fontFamily:'Playfair Display,serif',fontWeight:700,fontSize:16,color:C.ink,margin:0}}>What the Sponsored Article Didn't Mention</p>
        </div>
        <div style={{padding:20}}>
          <p style={{fontSize:14,color:C.ink5,lineHeight:1.7,marginBottom:16}}>
            The IDC's News24 branded content cited R26.6B next to 15,000 jobs without clarifying that R26.6B is a multi-year cumulative commitment, not 2024/25 disbursements. These material facts from their own reports were also absent:
          </p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:10,marginBottom:14}}>
            {[
              {label:'Women entrepreneur funding decline', value:'−51%',   color:C.red,  note:'Dropped from R11.4B to R5.6B — IDC Integrated Report 2025'},
              {label:'Net profit decline',                value:'−74%',   color:C.red,  note:'From R7B to R1.8B — IDC audited results 2024/25'},
              {label:'NAFCOC distress portfolio claim',   value:'R30B',   color:C.red,  note:'Unconfirmed by IDC — Parliament has opened a formal inquiry'},
              {label:'Parliament inquiry',                value:'Opened', color:C.gold, note:'Portfolio Committee: IDC "may need to reform" its processes'},
            ].map(s => (
              <div key={s.label} style={{background:C.s3,border:`1px solid ${C.border}`,borderRadius:10,padding:14}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6,gap:8}}>
                  <span style={{fontSize:12,color:C.ink4,lineHeight:1.3,flex:1}}>{s.label}</span>
                  <span style={{fontFamily:'Playfair Display,serif',fontSize:22,fontWeight:700,color:s.color,flexShrink:0}}>{s.value}</span>
                </div>
                <p style={{fontSize:11,color:C.ink4,fontStyle:'italic',margin:0,lineHeight:1.4}}>{s.note}</p>
              </div>
            ))}
          </div>
          <p style={{fontSize:11,color:C.ink4,fontStyle:'italic',borderTop:`1px solid ${C.border}`,paddingTop:12,margin:0}}>
            Sources: IDC Integrated Report 2025 · NAFCOC Parliamentary Submission, February 2026 · Parliament Portfolio Committee on Trade and Industry, February 2026.
            The R30B distress figure is NAFCOC's claim — IDC acknowledges distressed partners but has not confirmed the exact figure.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── provincial section ────────────────────────────────────────────────────────
function ProvincialSection() {
  const sorted = [...NEF_PROVINCES].sort((a,b) => b.disbursed - a.disbursed)
  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:16}}>
        <div style={card({padding:20})}>
          <SH icon={BarChart2} title="Funding by Province" subtitle="Share of R3.59B total" />
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={sorted} dataKey="disbursed" nameKey="province" cx="50%" cy="50%" outerRadius={85} innerRadius={38} paddingAngle={2}>
                {sorted.map((_,i) => <Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]} stroke="#fff" strokeWidth={2} />)}
              </Pie>
              <Tooltip formatter={v => fmtZAR(v,true)} contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,fontSize:12}} />
              <Legend formatter={v => <span style={{fontSize:11,color:C.ink4}}>{v}</span>} iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={card({padding:20})}>
          <SH icon={Users} title="Jobs by Province" subtitle="Total employment supported" />
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={[...NEF_PROVINCES].sort((a,b)=>b.jobs-a.jobs)} layout="vertical" margin={{top:0,right:10,left:70,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
              <XAxis type="number" tick={{fontSize:10,fill:C.ink4}} tickFormatter={v=>v>=1000?`${(v/1000).toFixed(0)}K`:v} />
              <YAxis type="category" dataKey="province" tick={{fontSize:11,fill:C.ink5}} width={68} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="jobs" name="Jobs" fill={C.navy} radius={[0,3,3,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={card({overflow:'hidden'})}>
        <div style={{padding:'14px 16px',borderBottom:`1px solid ${C.border}`}}>
          <SH icon={MapPin} title="Full Provincial Breakdown" subtitle="All 9 provinces · NEF PQ705 data" />
        </div>
        <div style={{overflowX:'auto',WebkitOverflowScrolling:'touch'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:13,minWidth:580}}>
            <thead>
              <tr style={{background:C.s3}}>
                {['Province','Deals','Disbursed','Jobs','Cost/Job','vs Avg'].map(h => (
                  <th key={h} style={{padding:'10px 14px',textAlign:'left',fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em',color:C.ink4,whiteSpace:'nowrap'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {NEF_PROVINCES.map((p,i) => {
                const good = p.costPerJob < NEF.costPerJob
                return (
                  <tr key={p.province} style={{background:i%2===0?C.surface:C.s2,borderBottom:`1px solid ${C.border}`}}>
                    <td style={{padding:'10px 14px',fontWeight:600,color:C.ink,whiteSpace:'nowrap'}}>
                      <span style={{display:'flex',alignItems:'center',gap:6}}>
                        <MapPin size={11} style={{color:C.gold,flexShrink:0}} />{p.province}
                      </span>
                    </td>
                    <td style={{padding:'10px 14px',color:C.ink4}}>{p.deals}</td>
                    <td style={{padding:'10px 14px',fontFamily:'DM Mono,monospace',fontWeight:600,color:C.navy,whiteSpace:'nowrap'}}>{fmtZAR(p.disbursed,true)}</td>
                    <td style={{padding:'10px 14px',color:C.ink}}>{p.jobs.toLocaleString()}</td>
                    <td style={{padding:'10px 14px'}}>
                      <span style={{fontSize:12,fontWeight:600,padding:'3px 8px',borderRadius:6,
                        background:good?C.greenBg:C.goldBg,
                        color:good?C.green:C.goldD,
                        border:`1px solid ${good?C.greenBdr:C.goldBdr}`,
                        whiteSpace:'nowrap'}}>
                        {fmtZAR(p.costPerJob,true)}
                      </span>
                    </td>
                    <td style={{padding:'10px 14px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:6}}>
                        <div style={{width:48,height:6,borderRadius:3,background:C.s3,overflow:'hidden'}}>
                          <div style={{height:'100%',borderRadius:3,background:good?C.green:C.gold,width:`${Math.min(100,(NEF.costPerJob/p.costPerJob)*80)}%`}} />
                        </div>
                        <span style={{fontSize:11,color:good?C.green:C.gold}}>{good?'✓':'—'}</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── leaderboards ──────────────────────────────────────────────────────────────
function Leaderboards() {
  return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:16}}>
      <div style={card({overflow:'hidden'})}>
        <div style={{padding:'14px 16px',background:C.goldBg,borderBottom:`1px solid ${C.border}`}}>
          <SH icon={DollarSign} title="Top 10 Largest Disbursements" subtitle="Biggest single NEF allocations" accent="gold" />
        </div>
        <div>
          {TOP_DISBURSEMENTS.map(c => (
            <div key={c.rank} style={{display:'flex',alignItems:'flex-start',gap:12,padding:'12px 16px',borderBottom:`1px solid ${C.border}`}}>
              <div style={{width:28,height:28,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,flexShrink:0,
                background:c.rank<=3?C.gold:C.s3,color:c.rank<=3?'#fff':C.ink4}}>
                {c.rank}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:13,fontWeight:600,color:C.ink,margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.company}</p>
                <p style={{fontSize:11,color:C.ink4,margin:'2px 0 0'}}>{c.province} · {c.jobs} jobs</p>
              </div>
              <div style={{textAlign:'right',flexShrink:0}}>
                <p style={{fontFamily:'DM Mono,monospace',fontWeight:700,fontSize:13,color:C.navy,margin:0}}>{fmtZAR(c.disbursed,true)}</p>
                <p style={{fontSize:11,color:c.costPerJob>500000?C.red:C.green,margin:'2px 0 0'}}>{fmtZAR(c.costPerJob,true)}/job</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={card({overflow:'hidden'})}>
        <div style={{padding:'14px 16px',background:C.navyBg,borderBottom:`1px solid ${C.border}`}}>
          <SH icon={Users} title="Top 8 Job Creators" subtitle="Highest employment impact per rand" accent="navy" />
        </div>
        <div>
          {TOP_JOB_CREATORS.map(c => (
            <div key={c.rank} style={{display:'flex',alignItems:'flex-start',gap:12,padding:'12px 16px',borderBottom:`1px solid ${C.border}`}}>
              <div style={{width:28,height:28,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,flexShrink:0,
                background:c.rank<=3?C.navy:C.s3,color:c.rank<=3?'#fff':C.ink4}}>
                {c.rank}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:13,fontWeight:600,color:C.ink,margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.company}</p>
                <p style={{fontSize:11,color:C.ink4,margin:'2px 0 0'}}>{c.province} · {fmtZAR(c.disbursed,true)}</p>
              </div>
              <div style={{textAlign:'right',flexShrink:0}}>
                <p style={{fontWeight:700,fontSize:13,color:C.navy,margin:0}}>{c.jobs.toLocaleString()} <span style={{fontSize:11,fontWeight:400,color:C.ink4}}>jobs</span></p>
                <p style={{fontSize:11,color:C.green,margin:'2px 0 0'}}>{fmtZAR(c.costPerJob,true)}/job</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── equity insights ───────────────────────────────────────────────────────────
function EquityInsights() {
  const st = {
    red:  {bg:C.redBg,  bdr:C.redBdr,  val:C.red,  dot:C.red  },
    gold: {bg:C.goldBg, bdr:C.goldBdr, val:C.goldD,dot:C.gold },
    green:{bg:C.greenBg,bdr:C.greenBdr,val:C.green, dot:C.green},
  }
  return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:12}}>
      {EQUITY_INSIGHTS.map((ins,i) => {
        const s = st[ins.flag]
        return (
          <div key={i} style={{background:s.bg,border:`1px solid ${s.bdr}`,borderRadius:10,padding:14}}>
            <div style={{display:'flex',alignItems:'flex-start',gap:8,marginBottom:8}}>
              <div style={{width:8,height:8,borderRadius:'50%',background:s.dot,flexShrink:0,marginTop:4}} />
              <p style={{fontSize:12,color:C.ink4,margin:0,lineHeight:1.4}}>{ins.metric}</p>
            </div>
            <p style={{fontFamily:'Playfair Display,serif',fontSize:24,fontWeight:700,color:s.val,margin:0}}>{ins.value}</p>
            <p style={{fontSize:11,color:C.ink4,margin:'4px 0 0',lineHeight:1.4}}>{ins.note}</p>
          </div>
        )
      })}
    </div>
  )
}

// ── deal size ─────────────────────────────────────────────────────────────────
function DealSizeSection() {
  return (
    <div style={card({overflow:'hidden'})}>
      <div style={{padding:'14px 16px',borderBottom:`1px solid ${C.border}`}}>
        <SH icon={Filter} title="NEF Deal Size Distribution" subtitle="How public funding is spread across deal sizes" />
      </div>
      <div style={{overflowX:'auto',WebkitOverflowScrolling:'touch'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:13,minWidth:480}}>
          <thead>
            <tr style={{background:C.s3}}>
              {['Bracket','Deals','% of Deals','Total Disbursed','% of Disbursed'].map(h => (
                <th key={h} style={{padding:'10px 14px',textAlign:'left',fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em',color:C.ink4}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {NEF_DEAL_SIZES.map((d,i) => (
              <tr key={d.bracket} style={{background:i%2===0?C.surface:C.s2,borderBottom:`1px solid ${C.border}`}}>
                <td style={{padding:'10px 14px',fontWeight:600,color:C.ink}}>{d.bracket}</td>
                <td style={{padding:'10px 14px',color:C.ink4}}>{d.deals}</td>
                <td style={{padding:'10px 14px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <div style={{width:56,height:6,borderRadius:3,background:C.s3,overflow:'hidden'}}>
                      <div style={{height:'100%',borderRadius:3,background:C.gold,width:`${d.pctDeals}%`}} />
                    </div>
                    <span style={{fontSize:12,color:C.ink4}}>{d.pctDeals}%</span>
                  </div>
                </td>
                <td style={{padding:'10px 14px',fontFamily:'DM Mono,monospace',fontWeight:600,color:C.navy,whiteSpace:'nowrap'}}>{fmtZAR(d.disbursed,true)}</td>
                <td style={{padding:'10px 14px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <div style={{width:56,height:6,borderRadius:3,background:C.s3,overflow:'hidden'}}>
                      <div style={{height:'100%',borderRadius:3,background:C.navy,width:`${d.pctDisbursed}%`}} />
                    </div>
                    <span style={{fontSize:12,color:C.ink4}}>{d.pctDisbursed}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── calculator ────────────────────────────────────────────────────────────────
function CPJCalculator() {
  const [funding, setFunding] = useState('')
  const [jobs, setJobs] = useState('')
  const result = useMemo(() => {
    const f = parseFloat(funding.replace(/[^0-9.]/g,''))
    const j = parseFloat(jobs)
    if (!f||!j||j<=0) return null
    const cpj = f/j
    return {cpj, vsNEF:cpj/NEF.costPerJob, vsIDC:cpj/IDC.costPerJobActual}
  }, [funding,jobs])

  const rating = result ? (
    result.cpj < NEF.costPerJob*0.5  ? {label:'Exceptional — top quartile',           color:C.green, bg:C.greenBg, bdr:C.greenBdr} :
    result.cpj < NEF.costPerJob      ? {label:'Below NEF average — efficient',         color:C.green, bg:C.greenBg, bdr:C.greenBdr} :
    result.cpj < NEF.costPerJob*2    ? {label:'Near NEF average — acceptable',         color:C.goldD, bg:C.goldBg,  bdr:C.goldBdr } :
    result.cpj < IDC.costPerJobActual? {label:'Above NEF average — needs scrutiny',    color:'#B45300',bg:'#FFF4E8',bdr:'#F5C080'  } :
                                       {label:'Above IDC actual rate — very poor ROI', color:C.red,   bg:C.redBg,   bdr:C.redBdr  }
  ) : null

  return (
    <div style={{maxWidth:480,margin:'0 auto'}}>
      <div style={card({padding:24})}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
          <div style={{padding:10,borderRadius:10,background:C.navyBg}}>
            <Calculator size={18} style={{color:C.navy}} />
          </div>
          <div>
            <p style={{fontFamily:'Playfair Display,serif',fontWeight:700,fontSize:17,color:C.ink,margin:0}}>Cost-per-Job Calculator</p>
            <p style={{fontSize:12,color:C.ink4,margin:'2px 0 0'}}>Compare against NEF and IDC benchmarks</p>
          </div>
        </div>

        <div style={{marginBottom:14}}>
          <label style={{display:'block',fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.07em',color:C.ink4,marginBottom:6}}>Funding Amount (ZAR)</label>
          <input className="input" placeholder="e.g. 5000000" value={funding} onChange={e=>setFunding(e.target.value)}
            style={{width:'100%',padding:'10px 14px',fontSize:14,border:`1px solid ${C.border}`,borderRadius:8,background:C.surface,color:C.ink,outline:'none',fontFamily:'DM Sans,sans-serif'}} />
        </div>
        <div style={{marginBottom:20}}>
          <label style={{display:'block',fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.07em',color:C.ink4,marginBottom:6}}>Jobs to be Created</label>
          <input className="input" type="number" placeholder="e.g. 50" value={jobs} onChange={e=>setJobs(e.target.value)}
            style={{width:'100%',padding:'10px 14px',fontSize:14,border:`1px solid ${C.border}`,borderRadius:8,background:C.surface,color:C.ink,outline:'none',fontFamily:'DM Sans,sans-serif'}} />
        </div>

        {result && (
          <div style={{background:rating.bg,border:`1px solid ${rating.bdr}`,borderRadius:10,padding:16,marginBottom:20}}>
            <p style={{fontSize:12,color:C.ink4,margin:'0 0 4px'}}>Your cost per job</p>
            <p style={{fontFamily:'Playfair Display,serif',fontSize:32,fontWeight:700,color:rating.color,margin:0}}>{fmtZAR(Math.round(result.cpj),true)}</p>
            <p style={{fontSize:13,fontWeight:600,color:rating.color,margin:'4px 0 12px'}}>{rating.label}</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,borderTop:`1px solid ${rating.bdr}`,paddingTop:12}}>
              <div>
                <p style={{fontSize:11,color:C.ink4,margin:0}}>vs NEF average</p>
                <p style={{fontFamily:'DM Mono,monospace',fontWeight:700,fontSize:15,color:C.ink,margin:'2px 0 0'}}>{result.vsNEF.toFixed(1)}×</p>
              </div>
              <div>
                <p style={{fontSize:11,color:C.ink4,margin:0}}>vs IDC rate</p>
                <p style={{fontFamily:'DM Mono,monospace',fontWeight:700,fontSize:15,color:C.ink,margin:'2px 0 0'}}>{result.vsIDC.toFixed(2)}×</p>
              </div>
            </div>
          </div>
        )}

        <div style={{borderTop:`1px solid ${C.border}`,paddingTop:16}}>
          <p style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.07em',color:C.ink4,marginBottom:10}}>Benchmarks</p>
          {[
            {label:'Free State NEF (most efficient)',   value:fmtZAR(58075,true),             color:C.green},
            {label:'Gauteng NEF',                       value:fmtZAR(73650,true),             color:C.green},
            {label:'NEF National Average',              value:fmtZAR(NEF.costPerJob,true),    color:C.goldD},
            {label:'IDC 2024/25 (R16.3B disbursed)',   value:fmtZAR(IDC.costPerJobActual,true),color:C.red},
          ].map(b => (
            <div key={b.label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 0',borderBottom:`1px solid ${C.border}`}}>
              <span style={{fontSize:13,color:C.ink4}}>{b.label}</span>
              <span style={{fontFamily:'DM Mono,monospace',fontWeight:600,fontSize:13,color:b.color}}>{b.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── NEF analysis tab ──────────────────────────────────────────────────────────
function NEFAnalysis() {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:24}}>
      <SH icon={BarChart2} title="NEF Public Interest Analysis" subtitle="Parliamentary Question 705 (PQ705) · 392 companies · R3.596B disbursed" />
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:12}}>
        {[
          {label:'Funded Companies', value:'392',     sub:'Across 9 provinces', color:C.navy},
          {label:'Total Loans',      value:'R3.52B',  sub:'94.8% of funding',   color:C.goldD},
          {label:'Total Grants',     value:'R194.8M', sub:'5.2% of funding',    color:C.green},
          {label:'Avg Jobs/Company', value:'80.8',    sub:'Median: R5.55M',     color:C.ink5},
        ].map(s => (
          <div key={s.label} style={card({padding:'14px 16px'})}>
            <p style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.07em',color:C.ink4,margin:'0 0 6px'}}>{s.label}</p>
            <p style={{fontFamily:'Playfair Display,serif',fontSize:26,fontWeight:700,color:s.color,margin:0}}>{s.value}</p>
            <p style={{fontSize:11,color:C.ink4,margin:'4px 0 0'}}>{s.sub}</p>
          </div>
        ))}
      </div>
      <div>
        <SH icon={AlertTriangle} title="Equity & Concentration Analysis" subtitle="What the aggregate numbers hide" accent="red" />
        <EquityInsights />
      </div>
      <DealSizeSection />
    </div>
  )
}

// ── agsa tab ──────────────────────────────────────────────────────────────────
function AGSATab() {
  const OPINION_CONFIG = {
    clean:                { label:'Clean Audit',               bg:'#EEF7F2', bdr:'#A8D4BB', color:C.green,  dot:C.green  },
    unqualified_findings: { label:'Unqualified with findings', bg:'#F9F4E8', bdr:'#E2CFA0', color:C.goldD,  dot:C.gold   },
    qualified:            { label:'Qualified with findings',   bg:'#FFF4E8', bdr:'#F5C080', color:'#B45300', dot:'#E07800'},
    disclaimer:           { label:'Disclaimer',                bg:C.redBg,   bdr:C.redBdr,  color:C.red,    dot:C.red    },
  }

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <SH icon={Shield} title="AGSA Audit Outcomes 2024/25"
        subtitle="Auditor-General Tsakani Maluleke · Consolidated General Report released 26 March 2026" accent="navy" />

      {/* AG Quote */}
      <div style={{...card(),padding:'18px 20px',borderLeft:`4px solid ${C.navy}`,borderRadius:'0 12px 12px 0'}}>
        <p style={{fontFamily:'Playfair Display,serif',fontSize:'clamp(14px,3.5vw,17px)',color:C.ink,lineHeight:1.7,margin:'0 0 8px',fontStyle:'italic'}}>
          {AGSA_HEADLINE.quote}
        </p>
        <p style={{fontSize:12,color:C.ink4,margin:0}}>— AG Tsakani Maluleke, {AGSA_HEADLINE.releaseDate}</p>
      </div>

      {/* Headline numbers — 2×2 on mobile */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10}}>
        {[
          { label:'Total auditees',           value:'417',                      sub:'National & provincial entities', color:C.navy  },
          { label:'Clean audits',             value:`${AGSA_HEADLINE.cleanAudits} (${AGSA_HEADLINE.cleanAuditPct}%)`, sub:'Control only 12% of expenditure', color:C.green },
          { label:'Irregular expenditure',    value:fmtZAR(AGSA_HEADLINE.irregularExpenditure,true), sub:'2024/25 reported — likely understated', color:C.red },
          { label:'Material irregularities',  value:`${AGSA_HEADLINE.materialIrregularities} active`, sub:`R${(AGSA_HEADLINE.materialIrregularityLoss/1e9).toFixed(1)}B estimated losses at risk`, color:C.red },
          { label:'Fruitless & wasteful',     value:fmtZAR(AGSA_HEADLINE.fruitlessWasteful,true), sub:`Down from ${fmtZAR(AGSA_HEADLINE.fruitlessWastefulPriorYear,true)} prior year`, color:C.goldD },
          { label:'SOEs with going concern',  value:`${AGSA_HEADLINE.soeGoingConcern} SOEs`, sub:`${AGSA_HEADLINE.soeGoingConcernConsecutive} for 6+ consecutive years`, color:C.red },
          { label:'Fraud not investigated',   value:`${AGSA_HEADLINE.fraudAllegationsNotInvestigated}%`, sub:'Of auditees with fraud allegations', color:C.red },
          { label:'Disciplinary non-compliance', value:`${AGSA_HEADLINE.disciplinaryNonCompliance}%`, sub:'Up from 37% prior year', color:C.red },
        ].map(s => (
          <div key={s.label} style={card({padding:'14px 14px'})}>
            <p style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.07em',color:C.ink4,margin:'0 0 6px',lineHeight:1.3}}>{s.label}</p>
            <p style={{fontFamily:'Playfair Display,serif',fontSize:'clamp(16px,4vw,22px)',fontWeight:700,color:s.color,margin:0,lineHeight:1.1}}>{s.value}</p>
            <p style={{fontSize:11,color:C.ink4,margin:'4px 0 0',lineHeight:1.3}}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* The 88% paradox */}
      <div style={{...tinted(C.redBg,C.redBdr),padding:20}}>
        <div style={{display:'flex',alignItems:'flex-start',gap:10,marginBottom:12}}>
          <AlertTriangle size={16} style={{color:C.red,flexShrink:0,marginTop:1}} />
          <p style={{fontFamily:'Playfair Display,serif',fontWeight:700,fontSize:16,color:C.ink,margin:0}}>
            The 88% Problem
          </p>
        </div>
        <p style={{fontSize:14,color:C.ink5,lineHeight:1.7,margin:0}}>
          Of the 417 audited entities, <strong style={{color:C.green}}>151 received clean audits (36%)</strong> — but they control
          only <strong style={{color:C.green}}>12% of total government expenditure</strong>. The entities responsible for the
          remaining <strong style={{color:C.red}}>88% of public spending</strong> all have audit findings. This means
          South Africa's largest, highest-impact public institutions are the ones with the worst governance.
          The AG warned this creates "a misleading impression of progress."
        </p>
      </div>

      {/* SOE Scorecard */}
      <div style={card({overflow:'hidden'})}>
        <div style={{padding:'14px 16px',borderBottom:`1px solid ${C.border}`}}>
          <SH icon={BarChart2} title="SOE Audit Scorecard 2024/25"
            subtitle="19 state-owned enterprises audited — only 2 received clean audits" accent="navy" />
        </div>
        <div>
          {AGSA_SOE_SCORECARD.map((s,i) => {
            const cfg = OPINION_CONFIG[s.opinionCode]
            return (
              <div key={s.entity} style={{
                display:'flex',alignItems:'flex-start',gap:12,padding:'12px 16px',
                background:i%2===0?C.surface:C.s2,
                borderBottom:`1px solid ${C.border}`,
              }}>
                {/* Opinion dot */}
                <div style={{width:10,height:10,borderRadius:'50%',background:cfg.dot,flexShrink:0,marginTop:5}} />
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',flexWrap:'wrap',gap:8,marginBottom:3}}>
                    <span style={{fontWeight:600,fontSize:14,color:C.ink}}>{s.entity}</span>
                    <span style={{fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:99,
                      background:cfg.bg,border:`1px solid ${cfg.bdr}`,color:cfg.color,whiteSpace:'nowrap'}}>
                      {cfg.label}
                    </span>
                    <span style={{fontSize:11,color:C.ink4,padding:'2px 8px',borderRadius:99,
                      background:C.s3,border:`1px solid ${C.border}`}}>{s.sector}</span>
                  </div>
                  <p style={{fontSize:12,color:C.ink4,margin:0,lineHeight:1.4}}>{s.note}</p>
                  {s.irregularExp && (
                    <p style={{fontSize:12,fontWeight:600,color:C.red,margin:'4px 0 0'}}>
                      Irregular expenditure: {fmtZAR(s.irregularExp,true)}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <div style={{padding:'12px 16px',background:C.s3,borderTop:`1px solid ${C.border}`}}>
          <p style={{fontSize:11,color:C.ink4,margin:0,fontStyle:'italic'}}>
            Source: AGSA Consolidated General Report on National and Provincial Audit Outcomes 2024/25.
            The IDC — which ran a sponsored News24 piece claiming R26.6B in transformation funding — received
            an unqualified opinion with findings. The only 2 clean-audit SOEs are DBSA and Necsa.
          </p>
        </div>
      </div>

      {/* 5-year context */}
      <div style={card({overflow:'hidden'})}>
        <div style={{padding:'14px 16px',borderBottom:`1px solid ${C.border}`}}>
          <SH icon={FileText} title="5-Year Irregular Expenditure (Departments & SOEs)"
            subtitle="Cumulative irregular expenditure across government — AGSA Standing Committee briefing" accent="red" />
        </div>
        <div style={{padding:20}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:12,marginBottom:16}}>
            {[
              { label:'38 govt departments — irregular exp', value:fmtZAR(AGSA_FIVE_YEAR.departmentsIrregular.amount,true), color:C.red },
              { label:'27 SOEs — irregular exp',             value:fmtZAR(AGSA_FIVE_YEAR.soeIrregular.amount,true),         color:C.red },
              { label:'36 depts — fruitless & wasteful',    value:fmtZAR(AGSA_FIVE_YEAR.departmentsFruitless.amount,true),  color:C.goldD},
              { label:'27 SOEs — fruitless & wasteful',     value:fmtZAR(AGSA_FIVE_YEAR.soeFruitless.amount,true),          color:C.goldD},
              { label:'Total material financial loss',      value:fmtZAR(AGSA_FIVE_YEAR.totalMaterialLoss,true),            color:C.red },
            ].map(s => (
              <div key={s.label} style={{background:C.s3,border:`1px solid ${C.border}`,borderRadius:10,padding:'12px 14px'}}>
                <p style={{fontSize:11,color:C.ink4,margin:'0 0 4px',lineHeight:1.3}}>{s.label}</p>
                <p style={{fontFamily:'Playfair Display,serif',fontSize:20,fontWeight:700,color:s.color,margin:0}}>{s.value}</p>
              </div>
            ))}
          </div>
          <p style={{fontSize:12,color:C.ink4,fontStyle:'italic',margin:0,lineHeight:1.6}}>
            To contextualise: The NEF's entire cumulative disbursement (R3.59B) is smaller than the fruitless and wasteful
            expenditure of 27 SOEs over 5 years (R2.08B). The IDC's 2024/25 disbursements (R16.3B) would cover
            less than a quarter of the accumulated irregular expenditure at 27 SOEs (R69.35B).
          </p>
        </div>
      </div>

      {/* SETA snapshot */}
      <div style={card({overflow:'hidden'})}>
        <div style={{padding:'14px 16px',borderBottom:`1px solid ${C.border}`}}>
          <SH icon={Users} title="SETA Audit Snapshot"
            subtitle="Selected Sector Education & Training Authorities — AGSA findings" accent="gold" />
        </div>
        <div>
          {AGSA_SETA_SNAPSHOT.map((s,i) => {
            const cfg = OPINION_CONFIG[s.opinionCode]
            return (
              <div key={s.seta} style={{
                display:'flex',alignItems:'flex-start',gap:12,padding:'12px 16px',
                background:i%2===0?C.surface:C.s2,borderBottom:`1px solid ${C.border}`,
              }}>
                <div style={{width:10,height:10,borderRadius:'50%',background:cfg.dot,flexShrink:0,marginTop:5}} />
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',flexWrap:'wrap',gap:8,marginBottom:3}}>
                    <span style={{fontWeight:600,fontSize:14,color:C.ink}}>{s.seta}</span>
                    <span style={{fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:99,
                      background:cfg.bg,border:`1px solid ${cfg.bdr}`,color:cfg.color}}>
                      {cfg.label}
                    </span>
                    {s.performanceScore && (
                      <span style={{fontSize:11,color:C.ink4,padding:'2px 8px',borderRadius:99,
                        background:C.s3,border:`1px solid ${C.border}`}}>
                        {s.performanceScore}% performance score
                      </span>
                    )}
                  </div>
                  <p style={{fontSize:12,color:C.ink4,margin:0,lineHeight:1.4}}>{s.note}</p>
                  {s.fruitlessWasteful && (
                    <p style={{fontSize:12,fontWeight:600,color:C.red,margin:'4px 0 0'}}>
                      Fruitless & wasteful: {fmtZAR(s.fruitlessWasteful,true)}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <div style={{padding:'12px 16px',background:C.s3,borderTop:`1px solid ${C.border}`}}>
          <p style={{fontSize:11,color:C.ink4,margin:0,fontStyle:'italic'}}>
            Note: There are 21 SETAs in South Africa. All receive mandatory skills levy funding.
            Full SETA audit data for all 21 will be added as Phase 2 of FundingStatsZA.
            Source: AGSA education portfolio briefing to Parliament.
          </p>
        </div>
      </div>

      {/* Why this matters */}
      <div style={{...tinted(C.navyBg,C.navyBdr),padding:20,borderRadius:12}}>
        <div style={{display:'flex',alignItems:'flex-start',gap:10,marginBottom:12}}>
          <Info size={15} style={{color:C.navy,flexShrink:0,marginTop:1}} />
          <p style={{fontFamily:'Playfair Display,serif',fontWeight:700,fontSize:15,color:C.ink,margin:0}}>
            Why AGSA data belongs next to DFI funding data
          </p>
        </div>
        <p style={{fontSize:13,color:C.ink5,lineHeight:1.7,margin:0}}>
          The NEF and IDC deploy public money to fund businesses. The AGSA audits how those institutions
          govern that money. Showing both together answers the complete question: not just <em>"how much was deployed?"</em>
          but <em>"was it governed properly?"</em> The IDC claims to be transforming the economy while receiving
          an unqualified audit with findings. The DBSA — which also co-funds transformation — received a clean audit.
          That difference matters. It's the difference between a credible institution and a PR exercise with public funds.
        </p>
      </div>
    </div>
  )
}

// ── nyda tab ──────────────────────────────────────────────────────────────────
function NYDATab() {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <SH icon={Users} title="NYDA — National Youth Development Agency"
        subtitle="Annual Report 2023/24 · Audited by AGSA · Ages 18–35 · Grant range R1K–R250K" accent="gold" />

      {/* Going concern alert — most important fact */}
      <div style={{...tinted(C.redBg, C.redBdr), padding:'14px 16px', display:'flex', gap:10, alignItems:'flex-start'}}>
        <AlertTriangle size={15} style={{color:C.red, flexShrink:0, marginTop:1}} />
        <div>
          <p style={{fontSize:13, fontWeight:700, color:C.red, margin:'0 0 4px'}}>Going Concern Risk — Technical Insolvency</p>
          <p style={{fontSize:12, color:C.ink5, lineHeight:1.6, margin:0}}>
            The NYDA's total liabilities (<strong style={{color:C.ink}}>{fmtZAR(NYDA.totalLiabilities, true)}</strong>) exceed its total assets
            (<strong style={{color:C.ink}}>{fmtZAR(NYDA.totalAssets, true)}</strong>), leaving a net deficit of{' '}
            <strong style={{color:C.red}}>{fmtZAR(Math.abs(NYDA.netLiabilityDeficit), true)}</strong>.
            This is flagged as a going concern risk in the audited annual report —
            despite the agency meeting 100% of its 29 performance targets.
          </p>
        </div>
      </div>

      {/* KPI grid — 2×2 mobile */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10}}>
        {[
          {label:'Govt Grant Allocation',     value:fmtZAR(NYDA.governmentGrant,true),      sub:'Main funding from Presidency', color:C.navy},
          {label:'Partnership Funds Sourced', value:fmtZAR(NYDA.partnershipFunds,true),     sub:'Target was R250M — exceeded', color:C.green},
          {label:'Business Grants Disbursed', value:NYDA.businessGrantsDisbursed.toLocaleString(), sub:'Direct financial support to SMMEs', color:C.goldD},
          {label:'Youth Placed in Jobs',      value:NYDA.youthPlacedInJobs.toLocaleString(),sub:'Employment placement programmes', color:C.navy},
          {label:'Jobs Created / Sustained',  value:NYDA.jobsCreatedSustained.toLocaleString(), sub:'Entrepreneurship programme impact', color:C.green},
          {label:'Non-financial Support',     value:NYDA.youthSupportedNonFinancial.toLocaleString(), sub:'Training, workshops, mentorship', color:C.ink5},
          {label:'Irregular Expenditure',     value:fmtZAR(NYDA.irregularExpenditure,true), sub:'Under AGSA assessment', color:C.red},
          {label:'Performance Targets Met',   value:NYDA.kpisMet,                           sub:'All 29 KPIs achieved — 100%', color:C.green},
        ].map(s => (
          <div key={s.label} style={card({padding:'14px 14px'})}>
            <p style={{fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.07em', color:C.ink4, margin:'0 0 6px', lineHeight:1.3}}>{s.label}</p>
            <p style={{fontFamily:'Playfair Display,serif', fontSize:'clamp(16px,4vw,22px)', fontWeight:700, color:s.color, margin:0, lineHeight:1.1}}>{s.value}</p>
            <p style={{fontSize:11, color:C.ink4, margin:'4px 0 0', lineHeight:1.3}}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Cost per job comparison */}
      <div style={card({overflow:'hidden'})}>
        <div style={{padding:'14px 16px', background:C.goldBg, borderBottom:`1px solid ${C.border}`}}>
          <SH icon={Scale} title="Cost-per-Job Comparison — NEF vs IDC vs NYDA"
            subtitle="Using government grant allocation as numerator for each institution" accent="gold" />
        </div>
        <div style={{padding:20}}>
          <p style={{fontSize:14, color:C.ink5, lineHeight:1.7, marginBottom:16}}>
            NYDA's cost per job (<strong style={{color:C.green}}>{fmtZAR(NYDA_METRICS.costPerJobCreated,true)}</strong>) is significantly
            lower than the NEF average — though the comparison isn't perfect.
            NYDA supports micro-enterprises (street vendors, hairdressers, car washes) while
            NEF and IDC fund larger industrial deals. The mandate, scale, and job type differ.
            But the efficiency comparison is still worth making.
          </p>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:10, marginBottom:16}}>
            {[
              {label:'NYDA cost/job',  value:fmtZAR(NYDA_METRICS.costPerJobCreated,true), color:C.green, bg:C.greenBg, bdr:C.greenBdr, note:'Govt grant ÷ 7,319 jobs'},
              {label:'NEF cost/job',   value:fmtZAR(NEF.costPerJob,true),                 color:C.goldD, bg:C.goldBg,  bdr:C.goldBdr,  note:'Cumulative portfolio'},
              {label:'IDC cost/job',   value:fmtZAR(IDC.costPerJobActual,true),           color:C.red,   bg:C.redBg,   bdr:C.redBdr,   note:'R16.3B actual disbursed'},
            ].map(s => (
              <div key={s.label} style={{background:s.bg, border:`1px solid ${s.bdr}`, borderRadius:10, padding:'14px 12px', textAlign:'center'}}>
                <p style={{fontFamily:'Playfair Display,serif', fontSize:'clamp(16px,3.5vw,22px)', fontWeight:700, color:s.color, margin:0}}>{s.value}</p>
                <p style={{fontSize:12, fontWeight:600, color:s.color, margin:'4px 0 2px'}}>{s.label}</p>
                <p style={{fontSize:10, color:C.ink4, margin:0, lineHeight:1.3}}>{s.note}</p>
              </div>
            ))}
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:10, borderTop:`1px solid ${C.border}`, paddingTop:14}}>
            {[
              {label:'Cost per youth placed in employment', value:fmtZAR(NYDA_METRICS.costPerYouthPlaced,true), color:C.green},
              {label:'Cost per business grant issued',       value:fmtZAR(NYDA_METRICS.costPerGrant,true),      color:C.goldD},
            ].map(s => (
              <div key={s.label} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0'}}>
                <span style={{fontSize:13, color:C.ink4}}>{s.label}</span>
                <span style={{fontFamily:'DM Mono,monospace', fontWeight:700, fontSize:14, color:s.color}}>{s.value}</span>
              </div>
            ))}
          </div>
          <p style={{fontSize:11, color:C.ink4, fontStyle:'italic', margin:'12px 0 0', lineHeight:1.6, borderTop:`1px solid ${C.border}`, paddingTop:12}}>
            Caveat: NYDA supports micro-enterprises with grants from R1K–R250K. NEF and IDC fund larger businesses.
            Direct cost-per-job comparisons must account for the different nature and scale of employment created.
          </p>
        </div>
      </div>

      {/* Youth unemployment context */}
      <div style={{...tinted(C.navyBg, C.navyBdr), padding:20, borderRadius:12}}>
        <div style={{display:'flex', alignItems:'flex-start', gap:10, marginBottom:12}}>
          <Info size={15} style={{color:C.navy, flexShrink:0, marginTop:1}} />
          <p style={{fontFamily:'Playfair Display,serif', fontWeight:700, fontSize:15, color:C.ink, margin:0}}>
            Why this data matters — the youth unemployment crisis
          </p>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:10, marginBottom:12}}>
          {[
            {label:'Youth unemployment (15–24)', value:`${NYDA.youthUnemployment1524}%`, color:C.red},
            {label:'Youth unemployment (25–34)', value:`${NYDA.youthUnemployment2534}%`, color:C.goldD},
            {label:'NYDA target age group',       value:NYDA.targetAgeRange,              color:C.navy},
            {label:'Youth placed in jobs (2023/24)', value:NYDA.youthPlacedInJobs.toLocaleString(), color:C.green},
          ].map(s => (
            <div key={s.label} style={{background:'rgba(255,255,255,0.5)', borderRadius:8, padding:'10px 12px'}}>
              <p style={{fontFamily:'Playfair Display,serif', fontSize:20, fontWeight:700, color:s.color, margin:0}}>{s.value}</p>
              <p style={{fontSize:11, color:C.ink4, margin:'3px 0 0', lineHeight:1.3}}>{s.label}</p>
            </div>
          ))}
        </div>
        <p style={{fontSize:13, color:C.ink5, lineHeight:1.7, margin:0}}>
          At 59.6% unemployment for ages 15–24, the NYDA's mandate is arguably the most urgent in SA's DFI ecosystem.
          Yet its budget (R756.6M total revenue) is less than 5% of what the IDC disbursed in the same period.
          And unlike the IDC, the NYDA is technically insolvent — its liabilities exceed its assets by R78.6M.
        </p>
      </div>

      {/* Procurement equity */}
      <div style={card({overflow:'hidden'})}>
        <div style={{padding:'14px 16px', borderBottom:`1px solid ${C.border}`}}>
          <SH icon={Award} title="Procurement Equity — Targets vs Actual"
            subtitle="NYDA's own procurement — all targets exceeded" accent="green" />
        </div>
        <div style={{padding:20}}>
          {[
            {label:'Youth-owned entity spend',    target:30, actual:NYDA.spendYouthOwned,     color:C.green},
            {label:'Women-owned entity spend',    target:40, actual:NYDA.spendWomenOwned,     color:C.green},
            {label:'Disability-owned entity spend',target:5, actual:NYDA.spendDisabilityOwned,color:C.green},
          ].map(s => (
            <div key={s.label} style={{marginBottom:16}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6}}>
                <span style={{fontSize:13, color:C.ink4}}>{s.label}</span>
                <div style={{display:'flex', gap:10, alignItems:'center'}}>
                  <span style={{fontSize:11, color:C.ink4}}>Target: {s.target}%</span>
                  <span style={{fontFamily:'DM Mono,monospace', fontWeight:700, fontSize:14, color:s.color}}>{s.actual}%</span>
                </div>
              </div>
              <div style={{height:8, background:C.s3, borderRadius:4, overflow:'hidden'}}>
                <div style={{height:'100%', borderRadius:4, background:s.color, width:`${Math.min(s.actual,100)}%`, transition:'width 0.6s ease'}} />
              </div>
            </div>
          ))}
          <p style={{fontSize:11, color:C.ink4, fontStyle:'italic', margin:'8px 0 0'}}>
            NYDA exceeded all three equity procurement targets in 2023/24 — a standout result compared to the IDC's 51% decline in women entrepreneur funding.
          </p>
        </div>
      </div>

      {/* Audit + governance */}
      <div style={card({overflow:'hidden'})}>
        <div style={{padding:'14px 16px', background:C.goldBg, borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:10}}>
          <Shield size={15} style={{color:C.goldD}} />
          <p style={{fontFamily:'Playfair Display,serif', fontWeight:700, fontSize:15, color:C.ink, margin:0}}>Audit & Governance Summary</p>
        </div>
        <div style={{padding:'0 16px'}}>
          {[
            {label:'AGSA Audit Opinion 2023/24',   value:'Unqualified with findings', color:C.goldD},
            {label:'Irregular Expenditure',         value:fmtZAR(NYDA.irregularExpenditure,true)+' under assessment', color:C.red},
            {label:'Performance Targets (KPIs)',    value:'29/29 met (100%)', color:C.green},
            {label:'Going Concern Risk',            value:'Yes — liabilities exceed assets by R78.6M', color:C.red},
            {label:'Women-owned procurement spend', value:`${NYDA.spendWomenOwned}% (target: 40%)`, color:C.green},
            {label:'Youth-owned procurement spend', value:`${NYDA.spendYouthOwned}% (target: 30%)`, color:C.green},
          ].map(r => (
            <div key={r.label} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 0', borderBottom:`1px solid ${C.border}`, gap:12}}>
              <span style={{fontSize:13, color:C.ink4}}>{r.label}</span>
              <span style={{fontFamily:'DM Mono,monospace', fontWeight:600, fontSize:12, color:r.color, textAlign:'right', flexShrink:0, maxWidth:'55%'}}>{r.value}</span>
            </div>
          ))}
        </div>
        <div style={{padding:'12px 16px', background:C.s3}}>
          <p style={{fontSize:11, color:C.ink4, fontStyle:'italic', margin:0, lineHeight:1.5}}>
            Source: NYDA Annual Report 2023/24 (financial year ended 31 March 2024), audited by AGSA.
            The NYDA met 100% of its performance targets while simultaneously operating in technical insolvency.
            This contradiction — strong delivery metrics alongside financial distress — is the central governance challenge.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── tabs config ───────────────────────────────────────────────────────────────
const TABS = [
  {id:'comparison',   label:'NEF vs IDC',  icon:Scale     },
  {id:'nef',          label:'NEF Data',    icon:BarChart2  },
  {id:'provincial',   label:'Provincial',  icon:MapPin    },
  {id:'leaderboards', label:'Leaders',     icon:Award     },
  {id:'agsa',         label:'AGSA',        icon:Shield    },
  {id:'nyda',         label:'NYDA',        icon:Users     },
  {id:'calculator',   label:'Calculator',  icon:Calculator},
]

// ── app ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState('comparison')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn, {passive:true})
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Mobile-safe padding
  const px = 'max(16px, env(safe-area-inset-left))'

  return (
    <div style={{minHeight:'100vh',background:C.page}}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position:'fixed',top:0,left:0,right:0,zIndex:50,
        background:scrolled?'rgba(244,242,237,0.97)':C.page,
        backdropFilter:scrolled?'blur(12px)':'none',
        borderBottom:`1px solid ${scrolled?C.border:'transparent'}`,
        transition:'all 0.2s',
      }}>
        <div style={{maxWidth:1280,margin:'0 auto',padding:`0 16px`,display:'flex',alignItems:'center',justifyContent:'space-between',height:52}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:26,height:26,borderRadius:6,background:C.navy,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <BarChart2 size={13} color="#fff" />
            </div>
            <span style={{fontFamily:'Playfair Display,serif',fontWeight:700,fontSize:15,color:C.ink,whiteSpace:'nowrap'}}>
              FundingStats<span style={{color:C.gold}}>ZA</span>
            </span>
          </div>
          <a href="https://businesshustle.co.za" target="_blank" rel="noopener noreferrer"
            style={{fontSize:12,color:C.gold,textDecoration:'none',fontWeight:600,flexShrink:0}}>
            Business Hustle
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{paddingTop:80,paddingBottom:48,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:`radial-gradient(circle, ${C.border} 1px, transparent 1px)`,backgroundSize:'28px 28px',opacity:0.4}} />
        <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse 80% 50% at 50% 0%, rgba(27,58,92,0.05) 0%, transparent 70%)`}} />

        <div style={{maxWidth:860,margin:'0 auto',padding:'0 16px',position:'relative',textAlign:'center'}}>
          {/* Eyebrow */}
          <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'5px 14px',borderRadius:99,marginBottom:20,
            background:C.navyBg,border:`1px solid ${C.navyBdr}`,fontSize:11,fontWeight:600,color:C.navy,letterSpacing:'0.04em'}}>
            <Shield size={11} /> Independent · Non-Partisan · Fully Public
          </div>

          <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'clamp(30px,7vw,60px)',fontWeight:900,color:C.ink,lineHeight:1.1,marginBottom:16,textWrap:'balance'}}>
            South Africa's public funding,{' '}
            <span style={{background:`linear-gradient(135deg,${C.goldD},#C4A44A,${C.goldD})`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
              held accountable.
            </span>
          </h1>

          <p style={{fontSize:'clamp(14px,3.5vw,17px)',color:C.ink5,maxWidth:560,margin:'0 auto 28px',lineHeight:1.7}}>
            The IDC deployed <strong style={{color:C.ink}}>R16.3B</strong> in 2024/25.
            The NEF deployed <strong style={{color:C.ink}}>R3.59B</strong> cumulatively.
            The maths tells a story no press release will.
          </p>

          {/* Hero KPI strip — 2×2 on mobile, 4 across on desktop */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10,maxWidth:700,margin:'0 auto 24px'}}>
            {[
              {label:'NEF Jobs Created',           value:NEF.totalJobs,           prefix:'',  suffix:'',  color:C.navy},
              {label:'NEF Total Disbursed',         value:3.596,                  prefix:'R', suffix:'B', decimals:2, color:C.goldD},
              {label:'NEF Cost per Job',            value:NEF.costPerJob,          prefix:'R', suffix:'',  color:C.green},
              {label:'IDC Cost/Job (R16.3B actual)',value:IDC.costPerJobActual,    prefix:'R', suffix:'',  color:C.red},
            ].map(m => (
              <div key={m.label} style={card({padding:'14px 12px',textAlign:'left'})}>
                <p style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em',color:C.ink4,margin:'0 0 6px',lineHeight:1.3}}>{m.label}</p>
                <p style={{fontFamily:'Playfair Display,serif',fontSize:'clamp(18px,4.5vw,26px)',fontWeight:700,color:m.color,margin:0,lineHeight:1}}>
                  <Counter target={m.value} prefix={m.prefix} suffix={m.suffix} decimals={m.decimals||0} />
                </p>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div style={{display:'flex',flexWrap:'wrap',gap:10,justifyContent:'center'}}>
            <button onClick={()=>setTab('comparison')} style={{display:'inline-flex',alignItems:'center',gap:8,padding:'10px 20px',borderRadius:8,background:C.navy,color:'#fff',fontSize:13,fontWeight:600,border:'none',cursor:'pointer',fontFamily:'DM Sans,sans-serif'}}>
              <Scale size={14} /> Compare NEF vs IDC
            </button>
            <button onClick={()=>setTab('leaderboards')} style={{display:'inline-flex',alignItems:'center',gap:8,padding:'10px 20px',borderRadius:8,background:C.surface,color:C.ink5,fontSize:13,fontWeight:500,border:`1px solid ${C.border}`,cursor:'pointer',fontFamily:'DM Sans,sans-serif'}}>
              <Award size={14} /> Leaderboards
            </button>
            <a href="https://www.dtic.gov.za" target="_blank" rel="noopener noreferrer"
              style={{display:'inline-flex',alignItems:'center',gap:8,padding:'10px 20px',borderRadius:8,background:C.surface,color:C.ink5,fontSize:13,fontWeight:500,border:`1px solid ${C.border}`,textDecoration:'none',fontFamily:'DM Sans,sans-serif'}}>
              <ExternalLink size={13} /> Source Data
            </a>
          </div>
        </div>
      </section>

      {/* ── TABS ── */}
      <div style={{position:'sticky',top:52,zIndex:40,background:'rgba(244,242,237,0.97)',backdropFilter:'blur(12px)',borderBottom:`1px solid ${C.border}`}}>
        <div style={{maxWidth:1280,margin:'0 auto',padding:'0 16px',display:'flex',overflowX:'auto',WebkitOverflowScrolling:'touch',scrollbarWidth:'none',msOverflowStyle:'none'}}>
          {TABS.map(({id,label,icon:Icon}) => (
            <button key={id} onClick={()=>setTab(id)} style={{
              display:'flex',alignItems:'center',gap:6,
              padding:'12px 14px',fontSize:13,fontWeight:500,fontFamily:'DM Sans,sans-serif',
              whiteSpace:'nowrap',border:'none',background:'none',cursor:'pointer',
              borderBottom:`2px solid ${tab===id?C.navy:'transparent'}`,
              color:tab===id?C.navy:C.ink4,
              transition:'all 0.15s',flexShrink:0,
            }}>
              <Icon size={13} />{label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <main style={{maxWidth:1280,margin:'0 auto',padding:'28px 16px 72px'}}>
        {tab==='comparison'   && <><SH icon={Scale} title="NEF vs IDC — The Numbers" subtitle="Independent comparison · PQ705 and IDC Audited Annual Statements 2024/25" accent="navy" /><ComparisonPanel /></>}
        {tab==='nef'          && <NEFAnalysis />}
        {tab==='provincial'   && <><SH icon={MapPin} title="Provincial Breakdown" subtitle="All 9 provinces · NEF PQ705 data" /><ProvincialSection /></>}
        {tab==='leaderboards' && <><SH icon={Award} title="NEF Leaderboards" subtitle="Public accountability — who got what, and what it produced" /><Leaderboards /></>}
        {tab==='agsa'         && <AGSATab />}
        {tab==='nyda'         && <NYDATab />}
        {tab==='calculator'   && <><SH icon={Calculator} title="Cost-per-Job Calculator" subtitle="See how your project stacks up against public benchmarks" /><CPJCalculator /></>}
      </main>

      {/* ── SOURCES ── */}
      <section style={{borderTop:`1px solid ${C.border}`,padding:'40px 0',background:C.surface}}>
        <div style={{maxWidth:1280,margin:'0 auto',padding:'0 16px'}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
            <FileText size={14} style={{color:C.gold}} />
            <p style={{fontFamily:'Playfair Display,serif',fontWeight:700,fontSize:16,color:C.ink,margin:0}}>Data Sources</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:10,marginBottom:16}}>
            {META.sources.map(s => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                style={{display:'block',padding:14,background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,textDecoration:'none',transition:'border-color 0.15s'}}>
                <p style={{fontSize:12,fontWeight:600,color:C.ink,margin:'0 0 3px',lineHeight:1.3}}>{s.name}</p>
                <p style={{fontSize:11,color:C.ink4,margin:0}}>{s.org}</p>
                <ExternalLink size={11} style={{color:C.gold,marginTop:8,display:'block'}} />
              </a>
            ))}
          </div>
          <p style={{fontSize:12,color:C.ink4,maxWidth:640,lineHeight:1.7,margin:0}}>
            All data sourced from public parliamentary records, official annual reports, and government disclosures.
            FundingStatsZA is an independent civic data project with no political affiliation. Last updated: {META.lastUpdated}.
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{borderTop:`1px solid ${C.border}`,padding:'20px 16px',background:C.s3}}>
        <div style={{maxWidth:1280,margin:'0 auto',display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',gap:8}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:22,height:22,borderRadius:5,background:C.navy,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <BarChart2 size={11} color="#fff" />
            </div>
            <span style={{fontFamily:'Playfair Display,serif',fontWeight:700,fontSize:13,color:C.ink}}>
              FundingStats<span style={{color:C.gold}}>ZA</span>
            </span>
            <span style={{fontSize:12,color:C.ink4}}>· Free forever</span>
          </div>
          <div style={{fontSize:12,color:C.ink4}}>
            Built by{' '}
            <a href="https://businesshustle.co.za" target="_blank" rel="noopener noreferrer"
              style={{color:C.gold,fontWeight:600,textDecoration:'none'}}>Business Hustle</a>
            {' '}· PQ705 · IDC AR 2024/25
          </div>
        </div>
      </footer>
    </div>
  )
}
