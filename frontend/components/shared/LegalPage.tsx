import PageHero from "@/components/shared/PageHero";

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

/** Long-form text page with a sticky contents list on large screens. */
export default function LegalPage({
  title,
  crumb,
  updated,
  intro,
  sections,
}: {
  title: string;
  crumb: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  const id = (heading: string) => heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  return (
    <main>
      <PageHero crumb={crumb} title={title} intro={intro} />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-4">
        <nav aria-label="On this page" className="hidden lg:block">
          <div className="sticky top-28 rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">On this page</p>
            <ol className="mt-3 space-y-1 text-sm">
              {sections.map((s, i) => (
                <li key={s.heading}>
                  <a href={`#${id(s.heading)}`} className="inline-flex min-h-9 items-center text-gray-600 hover:text-primary">
                    {i + 1}. {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <article className="lg:col-span-3">
          <p className="text-sm text-gray-500">Last updated: {updated}</p>
          <div className="mt-6 space-y-10">
            {sections.map((s, i) => (
              <section key={s.heading} id={id(s.heading)} className="scroll-mt-28">
                <h2 className="text-2xl font-bold text-gray-900">
                  {i + 1}. {s.heading}
                </h2>
                <div className="mt-3 space-y-3 leading-relaxed text-gray-600">
                  {s.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      </div>
    </main>
  );
}
