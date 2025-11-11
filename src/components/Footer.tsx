export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground space-y-1">
        <p>
          Prototype — For educational use at IMRS. This website is not officially affiliated with UTEP.
        </p>
        <p>
          © {year} · {' '}
          <a
            href="https://github.com/missatrox44/imrs"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            GitHub
          </a>{' '}
          ·{' '}
          <a
            href="https://sarabaqla.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            sarabaqla.dev
          </a>
        </p>
      </div>
    </footer>
  );
};