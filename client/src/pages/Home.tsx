import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  CreditCard,
  FileBarChart,
  FileText,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Package,
  Plus,
  Receipt,
  Search,
  Settings,
  Sprout,
  Truck,
  UserRound,
  Users,
  WalletCards,
  X,
} from "lucide-react";

type View = "overview" | "transactions" | "expenses" | "sales" | "cash-flow" | "projects" | "reports";

type NavItem = {
  id: View;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string;
};

const navItems: NavItem[] = [
  { id: "overview", label: "Business overview", icon: LayoutDashboard },
  { id: "transactions", label: "Transactions", icon: ClipboardList, badge: "12" },
  { id: "expenses", label: "Expenses", icon: WalletCards },
  { id: "sales", label: "Sales", icon: Receipt },
  { id: "cash-flow", label: "Cash Flow", icon: ArrowUpRight },
  { id: "projects", label: "Projects", icon: Package },
  { id: "reports", label: "Reports", icon: FileBarChart },
];

function viewFromPath(pathname: string): View {
  const candidate = pathname.replace(/^\//, "") as View;
  return navItems.some((item) => item.id === candidate) ? candidate : "overview";
}

const revenueBars = [
  { label: "Feb", incoming: 58, outgoing: 40 },
  { label: "Mar", incoming: 78, outgoing: 52 },
  { label: "Apr", incoming: 86, outgoing: 61 },
  { label: "May", incoming: 92, outgoing: 49 },
];

const activity = [
  { title: "Invoice INV-2048 paid", detail: "Mhlabeni Growers · ZAR 18,450", time: "18 min ago", tone: "green" },
  { title: "New quote accepted", detail: "Kalahari Produce Co. · QT-1032", time: "2 hours ago", tone: "blue" },
  { title: "Fuel expense imported", detail: "N4 Logistics · ZAR 2,840", time: "Yesterday", tone: "amber" },
];

const salesRows = [
  { client: "Mhlabeni Growers", document: "INV-2048", date: "23 Sep 2026", status: "Paid", amount: "ZAR 18,450" },
  { client: "Kalahari Produce Co.", document: "QT-1032", date: "22 Sep 2026", status: "Accepted", amount: "ZAR 42,800" },
  { client: "Limpopo Fresh Markets", document: "INV-2044", date: "21 Sep 2026", status: "Overdue", amount: "ZAR 9,640" },
  { client: "Karoo Citrus Estate", document: "INV-2042", date: "19 Sep 2026", status: "Paid", amount: "ZAR 27,200" },
];

function StatCard({ title, amount, caption, accent, children }: { title: string; amount: string; caption: string; accent: string; children: React.ReactNode }) {
  return (
    <article className="stat-card">
      <div className="card-heading"><span>{title}</span><button className="icon-ghost" aria-label={`More ${title} options`}><MoreHorizontal size={17} /></button></div>
      <div className="stat-amount">{amount}</div>
      <div className="stat-caption">{caption}</div>
      <div className={`stat-visual ${accent}`}>{children}</div>
    </article>
  );
}

function RevenueChart() {
  return (
    <div className="revenue-chart" aria-label="Cash flow bar chart">
      <div className="chart-grid"><span>ZAR 25K</span><span>ZAR 20K</span><span>ZAR 15K</span><span>ZAR 10K</span><span>ZAR 5K</span><span>ZAR 0K</span></div>
      <div className="bar-area">
        {revenueBars.map((bar) => (
          <div className="bar-group" key={bar.label}>
            <div className="bars">
              <div className="bar incoming" style={{ height: `${bar.incoming}%` }} />
              <div className="bar outgoing" style={{ height: `${bar.outgoing}%` }} />
            </div>
            <span>{bar.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExpenseDonut() {
  return (
    <div className="donut-layout">
      <div className="donut" aria-label="Expense distribution chart"><div className="donut-hole"><strong>46%</strong><span>Fuel & logistics</span></div></div>
      <div className="donut-legend">
        <div><i className="dot teal" /><span>Fuel & logistics</span><b>ZAR 6,500</b></div>
        <div><i className="dot blue" /><span>Farm inputs</span><b>ZAR 5,250</b></div>
        <div><i className="dot green" /><span>Meals & client care</span><b>ZAR 1,250</b></div>
        <div><i className="dot gray" /><span>Other</span><b>ZAR 1,000</b></div>
      </div>
    </div>
  );
}

function ProfitBars() {
  return (
    <div className="profit-bars">
      <div className="profit-row"><div><b>ZAR 22,000</b><span>Income</span></div><div className="review-bar"><span className="solid green-fill" /><span className="striped green-stripe" /></div><small>2 to review</small></div>
      <div className="profit-row"><div><b>ZAR 14,000</b><span>Expenses</span></div><div className="review-bar"><span className="solid teal-fill" /><span className="striped teal-stripe" /></div><small>8 to review</small></div>
    </div>
  );
}

function SalesLine() {
  return (
    <div className="line-chart" aria-label="Sales line chart">
      <div className="line-grid"><span>ZAR 25K</span><span>ZAR 20K</span><span>ZAR 15K</span><span>ZAR 10K</span><span>ZAR 5K</span><span>ZAR 0K</span></div>
      <svg viewBox="0 0 390 150" preserveAspectRatio="none" role="img" aria-label="Sales trend increasing then stabilizing">
        <path d="M2 130 L56 116 L110 96 L164 104 L218 70 L272 27 L326 72 L388 48" fill="none" stroke="#3cab2b" strokeWidth="3" strokeLinecap="round" />
        {["2,130", "56,116", "110,96", "164,104", "218,70", "272,27", "326,72", "388,48"].map((point) => { const [cx, cy] = point.split(","); return <circle key={point} cx={cx} cy={cy} r="4" fill="#fff" stroke="#3cab2b" strokeWidth="2" />; })}
      </svg>
    </div>
  );
}

function Overview({ onNew }: { onNew: () => void }) {
  return (
    <>
      <section className="welcome-row">
        <div><div className="eyebrow"><Sprout size={14} /> AGRICULTURAL BUSINESS HUB</div><h1>Good afternoon, Grade Master.</h1><p>Here’s your business overview for 23 September 2026.</p></div>
        <button className="primary-button" onClick={onNew}><Plus size={17} /> New transaction</button>
      </section>
      <section className="metric-grid">
        <StatCard title="Cash flow" amount="ZAR 16K" caption="Current cash balance" accent="cash-accent"><RevenueChart /></StatCard>
        <StatCard title="Expenses" amount="ZAR 14K" caption="Business spending · Last month" accent="expense-accent"><ExpenseDonut /></StatCard>
        <StatCard title="Profit and loss" amount="ZAR 8K" caption="Net income for September" accent="profit-accent"><ProfitBars /></StatCard>
      </section>
      <section className="lower-grid">
        <article className="panel invoices-panel"><div className="panel-title"><div><span className="eyebrow muted">RECEIVABLES</span><h2>Invoices</h2></div><button className="link-button">View all <ArrowUpRight size={14} /></button></div><div className="invoice-summary"><div><span>Unpaid · Last 365 days</span><strong>ZAR 5,281.52</strong><div className="progress"><i style={{ width: "32%" }} /></div><small><b>ZAR 1,525.50</b> overdue</small></div><div><span>Paid · Last 30 days</span><strong>ZAR 3,692.22</strong><div className="progress"><i className="green-progress" style={{ width: "78%" }} /></div><small><b>ZAR 2,062.52</b> deposited</small></div></div></article>
        <article className="panel sales-panel"><div className="panel-title"><div><span className="eyebrow muted">PERFORMANCE</span><h2>Sales</h2></div><select defaultValue="week" aria-label="Sales period"><option value="week">This week</option><option value="month">This month</option></select></div><div className="sales-total"><strong>ZAR 3.5K</strong><span>Total profit</span></div><SalesLine /></article>
        <article className="panel bank-panel"><div className="panel-title"><div><span className="eyebrow muted">CONNECTED ACCOUNTS</span><h2>Bank accounts</h2></div><button className="icon-ghost"><Settings size={16} /></button></div><div className="account-row"><div><span className="account-name">CHECKING</span><p>Bank balance in QuickBooks</p></div><div className="account-amount"><b>ZAR 12,435.65</b><span>Updated 4 days ago</span></div></div><div className="account-row"><div><span className="account-name">CREDIT CARD</span><p>Bank balance in QuickBooks</p></div><div className="account-amount"><b>-ZAR 3,435.65</b><span>Updated yesterday</span></div></div></article>
      </section>
      <section className="bottom-grid"><article className="panel activity-panel"><div className="panel-title"><div><span className="eyebrow muted">RECENT ACTIVITY</span><h2>What’s happening</h2></div><button className="icon-ghost" aria-label="Activity options"><MoreHorizontal size={17} /></button></div><div className="activity-list">{activity.map((item) => <div className="activity-item" key={item.title}><span className={`activity-icon ${item.tone}`}><Receipt size={14} /></span><div><b>{item.title}</b><span>{item.detail}</span></div><time>{item.time}</time></div>)}</div></article><article className="panel quick-panel"><span className="eyebrow muted">SHORTCUTS</span><h2>Keep moving</h2><div className="shortcut-grid"><button onClick={onNew}><Receipt size={18} /><span>Send invoice</span><ArrowUpRight size={14} /></button><button><Users size={18} /><span>Add client</span><ArrowUpRight size={14} /></button><button><Truck size={18} /><span>Track delivery</span><ArrowUpRight size={14} /></button><button><BookOpen size={18} /><span>Open knowledge base</span><ArrowUpRight size={14} /></button></div></article></section>
    </>
  );
}

function ListView({ view, onNew }: { view: View; onNew: () => void }) {
  const title = view === "transactions" ? "Transactions" : view === "expenses" ? "Expenses" : view === "sales" ? "Sales" : view === "cash-flow" ? "Cash Flow" : view === "projects" ? "Projects" : "Reports";
  const subtitle = view === "transactions" ? "Review money in, money out, and account activity." : view === "expenses" ? "Keep business spending categorized and under control." : view === "sales" ? "Track quotes, invoices, and customer revenue." : view === "cash-flow" ? "See what is coming in and going out of the business." : view === "projects" ? "Stay on top of farms, deliveries, and active work." : "Business performance reports for your next decision.";
  return <section className="list-page"><div className="page-header"><div><div className="eyebrow"><FileBarChart size={14} /> WORKSPACE</div><h1>{title}</h1><p>{subtitle}</p></div><button className="primary-button" onClick={onNew}><Plus size={17} /> New {view === "expenses" ? "expense" : view === "projects" ? "project" : "transaction"}</button></div><div className="toolbar"><div className="search-field"><Search size={16} /><input placeholder={`Search ${title.toLowerCase()}`} /></div><button className="secondary-button"><CalendarDays size={15} /> This month <ChevronDown size={14} /></button><button className="secondary-button">Filter <ChevronDown size={14} /></button></div><div className="table-card"><div className="table-head"><span>{title} overview</span><span>{view === "reports" ? "Last updated today" : "12 items"}</span></div><div className="table-wrap"><table><thead><tr><th>{view === "sales" ? "Customer" : "Description"}</th><th>Reference</th><th>Date</th><th>Status</th><th className="align-right">Amount</th></tr></thead><tbody>{salesRows.map((row) => <tr key={row.document}><td><strong>{view === "expenses" ? "N4 Logistics fuel & route costs" : row.client}</strong><small>{view === "expenses" ? "Vehicle operations" : "Agricultural trade account"}</small></td><td>{row.document}</td><td>{row.date}</td><td><span className={`status ${row.status.toLowerCase()}`}>{row.status}</span></td><td className="align-right"><strong>{view === "expenses" ? "- ZAR 2,840" : row.amount}</strong></td></tr>)}</tbody></table></div></div></section>;
}

export default function Home() {
  const [activeView, setActiveView] = useState<View>(() => viewFromPath(window.location.pathname));
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isNewOpen, setNewOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [period, setPeriod] = useState("This month");
  const currentLabel = useMemo(() => navItems.find((item) => item.id === activeView)?.label || "Business overview", [activeView]);
  const navigate = (view: View) => { setActiveView(view); setMenuOpen(false); window.history.pushState({}, "", view === "overview" ? "/" : `/${view}`); };
  useEffect(() => {
    const handlePopState = () => setActiveView(viewFromPath(window.location.pathname));
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return <div className="app-shell">
    <aside className={`sidebar ${isMenuOpen ? "open" : ""}`}><div className="sidebar-top"><button className="brand-button" onClick={() => navigate("overview")}><span className="brand-icon"><Sprout size={19} /></span><span><strong>ProAgriSA</strong><small>GRADE MASTER</small></span></button><button className="close-menu" onClick={() => setMenuOpen(false)}><X size={18} /></button><button className="new-button" onClick={() => setNewOpen(true)}><Plus size={17} /> New</button></div><div className="side-section-label">Business overview</div><nav className="sidebar-nav">{navItems.map(({ id, label, icon: Icon, badge }) => <button key={id} className={`nav-item ${activeView === id ? "active" : ""}`} onClick={() => navigate(id)}><Icon size={17} /><span>{label}</span>{badge && <em>{badge}</em>}{id === "cash-flow" && <span className="nav-dot" />}</button>)}</nav><div className="sidebar-footer"><button className="nav-item"><CircleHelp size={17} /><span>Help centre</span><ChevronRight className="push-right" size={15} /></button><div className="profile"><div className="profile-avatar">GM</div><div><b>Grade Master</b><span>Owner account</span></div><button aria-label="Account settings"><Settings size={15} /></button></div></div></aside>
    {isMenuOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
    <header className="topbar"><div className="topbar-left"><button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu size={20} /></button><div className="breadcrumbs"><span>Company</span><ChevronRight size={14} /><strong>{currentLabel}</strong></div></div><div className="topbar-actions"><button className="top-search" onClick={() => setSearchOpen(true)}><Search size={16} /><span>Search</span><kbd>⌘ K</kbd></button><button className="top-icon" aria-label="Notifications"><Bell size={18} /><i /></button><button className="avatar">GM</button></div></header>
    <main className="content"><div className="content-inner">{activeView === "overview" ? <Overview onNew={() => setNewOpen(true)} /> : <ListView view={activeView} onNew={() => setNewOpen(true)} />}</div></main>
    <footer className="footer"><span>ProAgriSA Grade Master Accounting</span><span>Secure workspace · Last synced just now</span></footer>
    {isNewOpen && <div className="modal-backdrop" onClick={() => setNewOpen(false)}><div className="new-modal" onClick={(event) => event.stopPropagation()}><div className="modal-title"><div><span className="eyebrow muted">QUICK ACTION</span><h2>Create something new</h2></div><button className="icon-ghost" onClick={() => setNewOpen(false)}><X size={17} /></button></div><div className="new-options"><button onClick={() => { setNewOpen(false); navigate("sales"); }}><Receipt size={20} /><span><b>Invoice</b><small>Bill a client for products or services</small></span><ChevronRight size={16} /></button><button onClick={() => { setNewOpen(false); navigate("transactions"); }}><CreditCard size={20} /><span><b>Expense</b><small>Record a business cost or payment</small></span><ChevronRight size={16} /></button><button onClick={() => { setNewOpen(false); navigate("projects"); }}><Truck size={20} /><span><b>Delivery project</b><small>Track a route, farm, or order</small></span><ChevronRight size={16} /></button></div></div></div>}
    {isSearchOpen && <div className="modal-backdrop" onClick={() => setSearchOpen(false)}><div className="search-modal" onClick={(event) => event.stopPropagation()}><div className="search-modal-input"><Search size={18} /><input autoFocus placeholder="Search clients, invoices, reports..." /><kbd>ESC</kbd></div><p>Try “unpaid invoices” or “Mhlabeni Growers”</p></div></div>}
    {period && <button className="period-control" onClick={() => setPeriod(period === "This month" ? "Last month" : "This month")} aria-label="Change reporting period"><CalendarDays size={14} /> {period} <ChevronDown size={13} /></button>}
  </div>;
}
