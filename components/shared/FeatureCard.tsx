import { Card, CardHeader, CardContent } from "../ui/card";
import { LucideIcon } from "lucide-react";

export function FeatureCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
}) {
  return (
    <Card className="hover:shadow-lg transition-all">
      <CardHeader className="flex flex-col items-center">
        <Icon className="w-10 h-10 text-blue-600 mb-3" />
        <h3 className="text-xl font-semibold">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 text-sm">{desc}</p>
      </CardContent>
    </Card>
  );
}
