import Footer from "@/components/home/footer/Footer";
import Navbar from "@/components/home/navbar/Navbar";

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
        <div>
            <Navbar />
            {children}
            <Footer />
        </div>
    );
  }