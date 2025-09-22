export function AppFooter() {
  return (
    <footer className="w-full border-t bg-card">
      <div className="container mx-auto flex h-16 items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} NextJS Starter. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
