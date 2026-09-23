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
  CheckCircle2,
  ClipboardList,
  CreditCard,
  Download,
  FileBarChart,
  FileText,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Package,
  Plus,
  Receipt,
  Save,
  Search,
  Settings,
  Sprout,
  Truck,
  UserRound,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { jsPDF } from "jspdf";

type View = "overview" | "transactions" | "expenses" | "sales" | "cash-flow" | "projects" | "reports";

type NavItem = {
  id: View;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string;
};

type InvoiceRecord = {
  id: string;
  client: string;
  description: string;
  date: string;
  dueDate: string;
  amount: number;
  paid: number;
  status: "Paid" | "Partially paid" | "Unpaid" | "Overdue";
};

type PaymentRecord = {
  id: string;
  invoiceId: string;
  amount: number;
  date: string;
  method: string;
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

const startingInvoices: InvoiceRecord[] = [
  { id: "INV-2048", client: "Mhlabeni Growers", description: "Dragon fruit cultivar supply", date: "23 Sep 2026", dueDate: "23 Oct 2026", amount: 18450, paid: 18450, status: "Paid" },
  { id: "INV-2044", client: "Limpopo Fresh Markets", description: "Wholesale plant stock", date: "21 Sep 2026", dueDate: "21 Oct 2026", amount: 9640, paid: 0, status: "Overdue" },
  { id: "INV-2042", client: "Karoo Citrus Estate", description: "Cross-border logistics and inputs", date: "19 Sep 2026", dueDate: "19 Oct 2026", amount: 27200, paid: 0, status: "Unpaid" },
];

function downloadInvoicePdf(invoice: InvoiceRecord) {
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const green = [47, 165, 34] as [number, number, number];
  const ink = [42, 58, 63] as [number, number, number];
  const muted = [116, 132, 136] as [number, number, number];
  const line = [221, 230, 230] as [number, number, number];
  const balance = invoice.amount - invoice.paid;
  pdf.setFillColor(...green); pdf.rect(0, 0, 210, 10, "F");
  pdf.setTextColor(...ink); pdf.setFont("helvetica", "bold"); pdf.setFontSize(22); pdf.text("ProAgriSA", 18, 29);
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(9); pdf.setTextColor(...muted); pdf.text("GRADE MASTER ACCOUNTING", 18, 35);
  pdf.setTextColor(...ink); pdf.setFont("helvetica", "bold"); pdf.setFontSize(24); pdf.text("INVOICE", 192, 29, { align: "right" });
  pdf.setFontSize(10); pdf.setTextColor(...muted); pdf.text(invoice.id, 192, 36, { align: "right" }); pdf.text(`Issued ${invoice.date}`, 192, 42, { align: "right" }); pdf.text(`Due ${invoice.dueDate}`, 192, 48, { align: "right" });
  pdf.setDrawColor(...line); pdf.line(18, 59, 192, 59);
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(9); pdf.setTextColor(...muted); pdf.text("BILL TO", 18, 72);
  pdf.setTextColor(...ink); pdf.setFontSize(13); pdf.text(invoice.client, 18, 80); pdf.setFont("helvetica", "normal"); pdf.setFontSize(10); pdf.setTextColor(...muted); pdf.text("Agricultural trade account", 18, 87);
  pdf.setFillColor(247, 250, 249); pdf.roundedRect(18, 104, 174, 17, 2, 2, "F"); pdf.setTextColor(...muted); pdf.setFont("helvetica", "bold"); pdf.setFontSize(9); pdf.text("DESCRIPTION", 24, 114); pdf.text("AMOUNT", 184, 114, { align: "right" });
  pdf.setTextColor(...ink); pdf.setFont("helvetica", "normal"); pdf.setFontSize(11); pdf.text(invoice.description, 24, 137); pdf.text(`ZAR ${invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 184, 137, { align: "right" });
  pdf.setDrawColor(...line); pdf.line(18, 146, 192, 146); pdf.setFont("helvetica", "bold"); pdf.setFontSize(10); pdf.text("TOTAL", 125, 160); pdf.setFontSize(17); pdf.setTextColor(...green); pdf.text(`ZAR ${invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 192, 160, { align: "right" });
  pdf.setTextColor(...muted); pdf.setFont("helvetica", "normal"); pdf.setFontSize(10); pdf.text(`Paid: ZAR ${invoice.paid.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 192, 171, { align: "right" }); pdf.text(`Balance due: ZAR ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 192, 178, { align: "right" });
  pdf.setDrawColor(...line); pdf.line(18, 246, 192, 246); pdf.setFontSize(9); pdf.text("Thank you for supporting ProAgriSA agricultural trade.", 18, 257); pdf.text("Generated from Grade Master Accounting", 18, 264);
  pdf.save(`${invoice.id}-${invoice.client.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.pdf`);
}

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

function InvoiceModal({ onClose, onCreate }: { onClose: () => void; onCreate: (invoice: InvoiceRecord) => void }) {
  const [client, setClient] = useState("");
  const [description, setDescription] = useState("Agricultural products and services");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("2026-10-23");
  const [error, setError] = useState("");
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const numericAmount = Number(amount);
    if (!client.trim() || !numericAmount || numericAmount <= 0) { setError("Add a client and a valid invoice amount to continue."); return; }
    onCreate({ id: `INV-${2050 + Math.floor(Math.random() * 40)}`, client: client.trim(), description: description.trim() || "Agricultural products and services", date: "23 Sep 2026", dueDate: dueDate ? new Date(`${dueDate}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "23 Oct 2026", amount: numericAmount, paid: 0, status: "Unpaid" });
  };
  return <div className="modal-backdrop" onClick={onClose}><form className="workflow-modal" onClick={(event) => event.stopPropagation()} onSubmit={submit}><div className="modal-title"><div><span className="eyebrow muted">SALES WORKFLOW</span><h2>Create invoice</h2><p>Issue a professional invoice and track payment against it.</p></div><button type="button" className="icon-ghost" onClick={onClose}><X size={17} /></button></div><div className="form-grid"><label>Client<input autoFocus value={client} onChange={(event) => setClient(event.target.value)} placeholder="e.g. Mhlabeni Growers" /></label><label>Invoice amount<input type="number" min="1" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" /></label><label className="wide">Description<input value={description} onChange={(event) => setDescription(event.target.value)} /></label><label>Due date<input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></label><label>Tax treatment<select defaultValue="exclusive"><option value="exclusive">VAT exclusive</option><option value="inclusive">VAT inclusive</option><option value="zero">Zero-rated</option></select></label></div>{error && <p className="form-error">{error}</p>}<div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button"><Save size={16} /> Create invoice</button></div></form></div>;
}

function PaymentModal({ invoice, onClose, onRecord }: { invoice: InvoiceRecord; onClose: () => void; onRecord: (payment: PaymentRecord) => void }) {
  const balance = invoice.amount - invoice.paid;
  const [amount, setAmount] = useState(String(balance));
  const [method, setMethod] = useState("EFT / bank transfer");
  const [error, setError] = useState("");
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0 || numericAmount > balance) { setError(`Enter an amount between ZAR 0.01 and ZAR ${balance.toLocaleString()}.`); return; }
    onRecord({ id: `PAY-${Date.now()}`, invoiceId: invoice.id, amount: numericAmount, date: "23 Sep 2026", method });
  };
  return <div className="modal-backdrop" onClick={onClose}><form className="workflow-modal payment-modal" onClick={(event) => event.stopPropagation()} onSubmit={submit}><div className="modal-title"><div><span className="eyebrow muted">RECEIVABLES</span><h2>Record payment</h2><p>{invoice.id} · {invoice.client}</p></div><button type="button" className="icon-ghost" onClick={onClose}><X size={17} /></button></div><div className="payment-balance"><span>Remaining balance</span><strong>ZAR {balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></div><div className="form-grid"><label>Payment amount<input autoFocus type="number" min="0.01" max={balance} step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} /></label><label>Payment method<select value={method} onChange={(event) => setMethod(event.target.value)}><option>EFT / bank transfer</option><option>Cash</option><option>Credit card</option><option>Direct deposit</option></select></label></div>{error && <p className="form-error">{error}</p>}<div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button"><CheckCircle2 size={16} /> Record payment</button></div></form></div>;
}

function Overview({ onNew, invoices, onRecordPayment }: { onNew: () => void; invoices: InvoiceRecord[]; onRecordPayment: (invoice: InvoiceRecord) => void }) {
  const unpaid = invoices.filter((invoice) => invoice.amount > invoice.paid);
  const outstanding = unpaid.reduce((sum, invoice) => sum + invoice.amount - invoice.paid, 0);
  const paidLast30 = invoices.reduce((sum, invoice) => sum + invoice.paid, 0);
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
        <article className="panel invoices-panel"><div className="panel-title"><div><span className="eyebrow muted">RECEIVABLES</span><h2>Invoices</h2></div><button className="link-button" onClick={onNew}>New invoice <Plus size={14} /></button></div><div className="invoice-summary"><div><span>Unpaid · Current balance</span><strong>ZAR {outstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong><div className="progress"><i style={{ width: `${Math.min(100, Math.max(12, outstanding / 900))}%` }} /></div><small><b>{unpaid.length}</b> open invoice{unpaid.length === 1 ? "" : "s"}</small></div><div><span>Paid · Recorded this month</span><strong>ZAR {paidLast30.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong><div className="progress"><i className="green-progress" style={{ width: `${Math.min(100, Math.max(18, paidLast30 / 300))}%` }} /></div><small><b>{invoices.filter((invoice) => invoice.status === "Paid").length}</b> settled</small></div></div><div className="dashboard-invoice-list">{invoices.slice(0, 3).map((invoice) => <div className="dashboard-invoice" key={invoice.id}><div><b>{invoice.id}</b><span>{invoice.client}</span></div><div className="dashboard-invoice-right"><strong>{invoice.amount > invoice.paid ? `ZAR ${(invoice.amount - invoice.paid).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "Paid"}</strong><div className="invoice-actions">{invoice.amount > invoice.paid && <button onClick={() => onRecordPayment(invoice)}>Record payment</button>}<button className="download-link" onClick={() => downloadInvoicePdf(invoice)} title={`Download ${invoice.id} PDF`}><Download size={12} /> PDF</button></div></div></div>)}</div></article>
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
  const [isInvoiceOpen, setInvoiceOpen] = useState(false);
  const [paymentInvoice, setPaymentInvoice] = useState<InvoiceRecord | null>(null);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(startingInvoices);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [period, setPeriod] = useState("This month");
  const currentLabel = useMemo(() => navItems.find((item) => item.id === activeView)?.label || "Business overview", [activeView]);
  const navigate = (view: View) => { setActiveView(view); setMenuOpen(false); window.history.pushState({}, "", view === "overview" ? "/" : `/${view}`); };
  const createInvoice = (invoice: InvoiceRecord) => { setInvoices((current) => [invoice, ...current]); setInvoiceOpen(false); setActiveView("sales"); window.history.pushState({}, "", "/sales"); };
  const recordPayment = (payment: PaymentRecord) => {
    setPayments((current) => [payment, ...current]);
    setInvoices((current) => current.map((invoice) => {
      if (invoice.id !== payment.invoiceId) return invoice;
      const paid = invoice.paid + payment.amount;
      return { ...invoice, paid, status: paid >= invoice.amount ? "Paid" : "Partially paid" };
    }));
    setPaymentInvoice(null);
  };
  useEffect(() => {
    const handlePopState = () => setActiveView(viewFromPath(window.location.pathname));
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return <div className="app-shell">
    <aside className={`sidebar ${isMenuOpen ? "open" : ""}`}><div className="sidebar-top"><button className="brand-button" onClick={() => navigate("overview")}><span className="brand-icon"><Sprout size={19} /></span><span><strong>ProAgriSA</strong><small>GRADE MASTER</small></span></button><button className="close-menu" onClick={() => setMenuOpen(false)}><X size={18} /></button><button className="new-button" onClick={() => setNewOpen(true)}><Plus size={17} /> New</button></div><div className="side-section-label">Business overview</div><nav className="sidebar-nav">{navItems.map(({ id, label, icon: Icon, badge }) => <button key={id} className={`nav-item ${activeView === id ? "active" : ""}`} onClick={() => navigate(id)}><Icon size={17} /><span>{label}</span>{badge && <em>{badge}</em>}{id === "cash-flow" && <span className="nav-dot" />}</button>)}</nav><div className="sidebar-footer"><button className="nav-item"><CircleHelp size={17} /><span>Help centre</span><ChevronRight className="push-right" size={15} /></button><div className="profile"><div className="profile-avatar">GM</div><div><b>Grade Master</b><span>Owner account</span></div><button aria-label="Account settings"><Settings size={15} /></button></div></div></aside>
    {isMenuOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
    <header className="topbar"><div className="topbar-left"><button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu size={20} /></button><div className="breadcrumbs"><span>Company</span><ChevronRight size={14} /><strong>{currentLabel}</strong></div></div><div className="topbar-actions"><button className="top-search" onClick={() => setSearchOpen(true)}><Search size={16} /><span>Search</span><kbd>⌘ K</kbd></button><button className="top-icon" aria-label="Notifications"><Bell size={18} /><i /></button><button className="avatar">GM</button></div></header>
    <main className="content"><div className="content-inner">{activeView === "overview" ? <Overview onNew={() => setInvoiceOpen(true)} invoices={invoices} onRecordPayment={setPaymentInvoice} /> : <ListView view={activeView} onNew={() => setInvoiceOpen(true)} />}</div></main>
    <footer className="footer"><span>ProAgriSA Grade Master Accounting</span><span>Secure workspace · Last synced just now</span></footer>
    {isNewOpen && <div className="modal-backdrop" onClick={() => setNewOpen(false)}><div className="new-modal" onClick={(event) => event.stopPropagation()}><div className="modal-title"><div><span className="eyebrow muted">QUICK ACTION</span><h2>Create something new</h2></div><button className="icon-ghost" onClick={() => setNewOpen(false)}><X size={17} /></button></div><div className="new-options"><button onClick={() => { setNewOpen(false); navigate("sales"); }}><Receipt size={20} /><span><b>Invoice</b><small>Bill a client for products or services</small></span><ChevronRight size={16} /></button><button onClick={() => { setNewOpen(false); navigate("transactions"); }}><CreditCard size={20} /><span><b>Expense</b><small>Record a business cost or payment</small></span><ChevronRight size={16} /></button><button onClick={() => { setNewOpen(false); navigate("projects"); }}><Truck size={20} /><span><b>Delivery project</b><small>Track a route, farm, or order</small></span><ChevronRight size={16} /></button></div></div></div>}
    {isSearchOpen && <div className="modal-backdrop" onClick={() => setSearchOpen(false)}><div className="search-modal" onClick={(event) => event.stopPropagation()}><div className="search-modal-input"><Search size={18} /><input autoFocus placeholder="Search clients, invoices, reports..." /><kbd>ESC</kbd></div><p>Try “unpaid invoices” or “Mhlabeni Growers”</p></div></div>}
    {isInvoiceOpen && <InvoiceModal onClose={() => setInvoiceOpen(false)} onCreate={createInvoice} />}
    {paymentInvoice && <PaymentModal invoice={paymentInvoice} onClose={() => setPaymentInvoice(null)} onRecord={recordPayment} />}
    {period && <button className="period-control" onClick={() => setPeriod(period === "This month" ? "Last month" : "This month")} aria-label="Change reporting period"><CalendarDays size={14} /> {period} <ChevronDown size={13} /></button>}
  </div>;
}
