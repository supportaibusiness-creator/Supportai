export const metadata = {
  title: "SupportAI — AI Customer Support",
  description:
    "Give your customers fast, helpful support around the clock with SupportAI.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
