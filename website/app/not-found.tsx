import Link from "next/link";
import { Nav } from "@/components/layout/Nav";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="container-site flex min-h-screen items-center justify-center">
        <div className="w-full max-w-lg">
          <div className="term">
            <div className="term__bar" aria-hidden="true">
              <div className="term__dots">
                <span className="term__dot" />
                <span className="term__dot" />
                <span className="term__dot" />
              </div>
              <span className="term__title">zsh</span>
            </div>
            <div className="term__body">
              <div>
                <span className="term__prompt">❯ </span>
                <span className="tone-ink">open this-page</span>
              </div>
              <div>
                <span className="tone-yellow">
                  zsh: command not found: this-page
                </span>
              </div>
              <div>
                <span className="tone-comment"># 404 — nothing lives here</span>
              </div>
              <div>
                <span className="term__prompt">❯ </span>
                <span className="caret" data-idle="true" aria-hidden="true" />
              </div>
            </div>
          </div>
          <p className="mt-6 text-center">
            <Link href="/" className="link-accent font-medium">
              cd ~ (back home)
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
