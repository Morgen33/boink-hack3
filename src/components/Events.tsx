
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, MapPin, Users, Clock, Heart } from "lucide-react";

const Events = () => {
  const events = [
    {
      id: 1,
      title: "Web3 Coffee & Connect",
      date: "Dec 28, 2024",
      time: "2:00 PM - 4:00 PM",
      location: "Crypto Café, San Francisco",
      attendees: 24,
      maxAttendees: 30,
      description: "Casual meetup for crypto enthusiasts to connect over coffee and discuss the latest in Web3.",
      image: "/placeholder.svg",
      tags: ["Casual", "Networking", "Coffee"]
    },
    {
      id: 2,
      title: "Bonk Community Speed Dating",
      date: "Dec 30, 2024",
      time: "7:00 PM - 10:00 PM",
      location: "Tech Hub, Austin",
      attendees: 18,
      maxAttendees: 20,
      description: "Fun speed dating event exclusively for verified Bonk community members.",
      image: "/placeholder.svg",
      tags: ["Dating", "Speed Dating", "Bonk"]
    },
    {
      id: 3,
      title: "DeFi & Dinner",
      date: "Jan 3, 2025",
      time: "6:30 PM - 9:30 PM",
      location: "Blockchain Bistro, NYC",
      attendees: 12,
      maxAttendees: 16,
      description: "Intimate dinner for DeFi builders and enthusiasts to network and share experiences.",
      image: "/placeholder.svg",
      tags: ["Dinner", "DeFi", "Networking"]
    },
    {
      id: 4,
      title: "Crypto Game Night",
      date: "Jan 5, 2025",
      time: "7:00 PM - 11:00 PM",
      location: "GameSpace, Los Angeles",
      attendees: 32,
      maxAttendees: 40,
      description: "Fun game night with crypto-themed games and prizes. Perfect for breaking the ice!",
      image: "/placeholder.svg",
      tags: ["Games", "Fun", "Social"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Hero Section */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Community Events
            </h1>
          </div>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join fellow crypto enthusiasts and Bonk community members at exclusive events. 
            Build meaningful connections in person while exploring the world of Web3 together.
          </p>
          <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
            Host an Event
          </Button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white/80 backdrop-blur-sm border border-gray-200/50">
                <div className="aspect-video bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                  <Heart className="w-12 h-12 text-purple-400" />
                </div>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl font-semibold text-gray-800">
                      {event.title}
                    </CardTitle>
                    <div className="flex gap-1">
                      {event.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-600">
                      <CalendarDays className="w-4 h-4 mr-2" />
                      <span className="text-sm">{event.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {event.attendees}/{event.maxAttendees} attending
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      size="sm"
                    >
                      Join Event
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-purple-200 text-purple-600 hover:bg-purple-50"
                    >
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Want to Host Your Own Event?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Create memorable experiences for the Boink community. Whether it's a casual meetup 
            or a structured networking event, we'll help you bring people together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              Host an Event
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              Event Guidelines
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
