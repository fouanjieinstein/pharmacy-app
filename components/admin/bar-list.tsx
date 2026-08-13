import { Card, CardBody } from "@/components/ui/card";

export function BarList({
  title,
  items,
  valueFormatter,
}: {
  title: string;
  items: { label: string; value: number }[];
  valueFormatter?: (v: number) => string;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <Card>
      <CardBody>
        <h3 className="font-display mb-5 text-base text-brand-navy-900">{title}</h3>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.label}>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium text-brand-navy-900">{item.label}</span>
                <span className="text-brand-gray-500">{valueFormatter ? valueFormatter(item.value) : item.value}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-brand-gray-100">
                <div
                  className="h-full rounded-full bg-brand-emerald-600"
                  style={{ width: `${(item.value / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
