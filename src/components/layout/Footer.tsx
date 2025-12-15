export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground space-y-1">
        <p className="text-balance">
        This site is an educational prototype for use at <a href="https://www.utep.edu/science/indio/" target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >Indio Mountains Research Station (IMRS)</a> and is not officially affiliated with <a href="https://www.utep.edu/" rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors" target="_blank">UTEP</a>.
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