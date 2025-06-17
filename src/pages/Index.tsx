
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bot, MessageCircle, BarChart3, Users, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">SoloSolver AI</h1>
            </div>
            <nav className="flex items-center gap-4">
              <Link to="/user">
                <Button variant="outline">User Dashboard</Button>
              </Link>
              <Link to="/admin">
                <Button variant="outline">Admin</Button>
              </Link>
              <Link to="/chat">
                <Button>Try AI Assistant</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Complaint Resolution
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Revolutionize your customer service with our dual-LLM architecture featuring 
            Gemini 2.5 Flash orchestration and fine-tuned Gemma 3-4B classification for 
            instant, intelligent complaint resolution.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/chat">
              <Button size="lg" className="px-8 py-3">
                <MessageCircle className="h-5 w-5 mr-2" />
                Start Conversation
              </Button>
            </Link>
            <Link to="/user">
              <Button size="lg" variant="outline" className="px-8 py-3">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Advanced AI Features
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Bot className="h-10 w-10 text-blue-600 mb-4" />
              <h4 className="text-xl font-semibold mb-2">Dual-LLM Architecture</h4>
              <p className="text-gray-600">
                Gemini 2.5 Flash orchestrates conversations while fine-tuned Gemma 3-4B 
                provides specialized 8-label multi-task classification for precise analysis.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <BarChart3 className="h-10 w-10 text-green-600 mb-4" />
              <h4 className="text-xl font-semibold mb-2">Smart Classification</h4>
              <p className="text-gray-600">
                Instantly categorizes complaints into 11 types with sentiment analysis, 
                aggression detection, and automated decision recommendations.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Users className="h-10 w-10 text-purple-600 mb-4" />
              <h4 className="text-xl font-semibold mb-2">User History Analysis</h4>
              <p className="text-gray-600">
                Leverages transaction history and user profiles for personalized responses 
                and context-aware complaint resolution strategies.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Shield className="h-10 w-10 text-red-600 mb-4" />
              <h4 className="text-xl font-semibold mb-2">Policy Integration</h4>
              <p className="text-gray-600">
                ChromaDB-powered policy retrieval ensures responses align with company 
                guidelines and regulatory requirements.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Zap className="h-10 w-10 text-yellow-600 mb-4" />
              <h4 className="text-xl font-semibent mb-2">Real-time Processing</h4>
              <p className="text-gray-600">
                Supabase Edge Functions provide millisecond response times with 
                scalable cloud infrastructure and real-time database updates.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <MessageCircle className="h-10 w-10 text-indigo-600 mb-4" />
              <h4 className="text-xl font-semibold mb-2">Multi-turn Conversations</h4>
              <p className="text-gray-600">
                Maintains conversation context across multiple exchanges for natural, 
                human-like customer service interactions.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Customer Service?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Experience the future of AI-powered complaint resolution with SoloSolver.
          </p>
          <Link to="/chat">
            <Button size="lg" variant="secondary" className="px-8 py-3">
              Start Your First Conversation
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Bot className="h-6 w-6" />
            <span className="text-lg font-semibold">SoloSolver AI</span>
          </div>
          <p className="text-gray-400">
            Advanced AI complaint resolution system powered by Gemini and Gemma models.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
