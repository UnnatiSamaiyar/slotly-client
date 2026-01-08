import { Card, CardContent } from "../ui/card";
import { SectionTitle } from "../shared/SectionTitle";

const testimonials = [
  {
    name: "Samantha Lee",
    company: "Designify",
    quote: "Slotly has completely changed how I schedule meetings — it's fast, reliable, and simple.",
  },
  {
    name: "John Doe",
    company: "Cloudify",
    quote: "Our team saves hours every week thanks to Slotly’s automation tools.",
  },
];

export function Testimonials() {
  return (
    <section className="w-full py-24 bg-gray-50 text-center">
      <div className="container mx-auto px-6">
        <SectionTitle
          title="Trusted by professionals"
          subtitle="See how Slotly is transforming teams and workflows."
        />
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {testimonials.map((t, i) => (
            <Card key={i} className="p-6 shadow-sm">
              <CardContent>
                <p className="italic text-gray-700 mb-4">“{t.quote}”</p>
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-gray-500">{t.company}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
