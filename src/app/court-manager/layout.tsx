import PageShell from "@/components/layout/PageShell";

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageShell disableFooter mainClassName="bg-[#F8F9FA]">
      <div className="flex min-h-screen flex-col bg-[#F8F9FA]">
        <main className="flex-1">{children}</main>
      </div>
    </PageShell>
  );
}
