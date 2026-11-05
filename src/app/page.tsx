import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
  FileSearch,
  Layers2,
  ScanLine,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import InvestigationForm from "@/src/features/investigations/components/investigation-form";

export default function Home() {
  return (
    <div className="app-shell">
      <aside className="navigation-rail" aria-label="Workspace navigation">
        <Link href="/" className="rail-logo" aria-label="Txnigma home">
          <ScanLine size={23} strokeWidth={2.1} />
        </Link>
        <nav>
          <a
            href="#investigation"
            className="rail-link active"
            aria-label="Investigation workspace"
            title="Investigation workspace"
          >
            <FileSearch size={21} />
          </a>
          <a
            href="#sample-cases"
            className="rail-link"
            aria-label="Sample cases"
            title="Sample cases"
          >
            <Layers2 size={21} />
          </a>
          <a
            href="#how-it-works"
            className="rail-link"
            aria-label="How it works"
            title="How it works"
          >
            <Sparkles size={21} />
          </a>
        </nav>
        <span className="rail-bottom" title="Synthetic data workspace">
          <ShieldCheck size={20} />
        </span>
      </aside>
      <main className="workspace">
        <header className="brand-bar">
          <Link className="brand" href="/">
            txnigma<span className="brand-period">.</span>
          </Link>
          <span className="workspace-label">
            Payment intelligence <span>/</span> Investigation workspace
          </span>
          <span className="demo-tag">
            <span className="live-dot" />
            Sandbox environment
          </span>
        </header>
        <section className="intro" aria-labelledby="workspace-title">
          <div className="intro-copy">
            <div className="eyebrow">
              <span />A LITTLE CLARITY GOES A LONG WAY
            </div>
            <h1 id="workspace-title">
              Every payment has a story.
              <br />
              <span>Let’s make sense of yours.</span>
            </h1>
            <p>
              Turn a confusing charge into a clear starting point.
              <br className="desktop-break" /> Explore possible causes, missing
              evidence, and what to do next.
            </p>
            <a className="intro-link" href="#description">
              Start an investigation <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="clarity-art" aria-hidden="true">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="art-orbit orbit-three" />
            <div className="art-node node-one">
              <ArrowDownLeft size={19} />
            </div>
            <div className="art-node node-two">
              <ArrowUpRight size={19} />
            </div>
            <div className="art-sheet">
              <div className="art-sheet-top">
                <ScanLine size={22} />
                <span>FOLLOW THE SIGNAL</span>
              </div>
              <div className="art-line" />
              <div className="art-line short" />
              <div className="art-sheet-bottom">
                <span className="art-dot" />
                From questions to next steps
                <ArrowUpRight size={14} />
              </div>
            </div>
            <div className="art-caption">
              <span />
              Clarity, one clue at a time.
            </div>
          </div>
        </section>
        <div className="workspace-section-heading" id="investigation">
          <div>
            <span className="section-eyebrow">YOUR WORKSPACE</span>
            <h2>A fresh perspective on your payment.</h2>
          </div>
          <span className="workspace-note">
            <ShieldCheck size={15} />
            Synthetic reports only
          </span>
        </div>
        <InvestigationForm />
        <section
          id="how-it-works"
          className="method-strip"
          aria-label="How investigations work"
        >
          <div className="method-intro">
            <span className="section-eyebrow">A CLEARER WAY THROUGH</span>
            <h2>
              Less guesswork.
              <br />
              Better questions.
            </h2>
          </div>
          <div>
            <span className="method-number">01</span>
            <h3>Share what happened</h3>
            <p>
              A description is enough to get started. Include an ID or amount if
              you have one.
            </p>
          </div>
          <div>
            <span className="method-number">02</span>
            <h3>Explore the possibilities</h3>
            <p>
              Separate reported observations from hypotheses and see what
              evidence is missing.
            </p>
          </div>
          <div>
            <span className="method-number">03</span>
            <h3>Know what to check next</h3>
            <p>
              Get practical investigation steps to verify against your payment
              records.
            </p>
          </div>
        </section>
        <footer className="workspace-footer">
          <span>
            txnigma<span className="brand-period">.</span>
            <span className="footer-tagline">
              Every transaction tells a story.
            </span>
          </span>
          <span>AI-assisted analysis. Human judgment.</span>
        </footer>
      </main>
    </div>
  );
}
