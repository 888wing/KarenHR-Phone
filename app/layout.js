import './globals.css'

export const metadata = {
  title: 'Karen AI - Interview Coach',
  description: 'Your sassy, smart interview coach',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="max-w-md mx-auto min-h-screen overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  )
}