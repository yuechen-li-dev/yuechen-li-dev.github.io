import { AetherisDocs } from "./aetheris/AetherisDocs";

export function App() {
  if (window.location.pathname.startsWith("/aetheris")) return <AetherisDocs />;
  return (
    <main className="site-home">
      <p className="eyebrow">yuechen-li-dev</p>
      <h1>Engineering software, written precisely.</h1>
      <p>The public Aetheris Preview 1 manual is now available.</p>
      <a className="home-link" href="/aetheris/">
        Read the Aetheris manual →
      </a>
    </main>
  );
}
