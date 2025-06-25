
import Header from "@/components/Header";
import Events from "@/components/Events";
import Footer from "@/components/Footer";

const EventsPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Events />
      </main>
      <Footer />
    </div>
  );
};

export default EventsPage;
