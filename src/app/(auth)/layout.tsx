export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] px-4 py-8 sm:px-6 sm:py-12">
      {children}
    </div>
  )
}
