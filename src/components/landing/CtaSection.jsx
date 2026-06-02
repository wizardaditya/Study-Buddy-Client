import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";

export default function CtaSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <div className="relative p-12 rounded-3xl bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Ready to start building?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Join 10,000+ students mastering Robotics, IoT & AI. Your journey starts with one click.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild variant="gradient" size="lg" className="text-base px-10 h-12">
                <Link to={ROUTES.REGISTER}>
                  Create Free Account <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-8 h-12">
                <Link to={ROUTES.PRICING}>See Plans</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required · Free forever plan available
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
