import { Coffee } from "lucide-react";

interface BuyMeCoffeeButtonProps {
  className?: string;
}

export function BuyMeCoffeeButton({ className = "" }: BuyMeCoffeeButtonProps) {
  return (
    <a
      href="https://buymeacoffee.com/pravaah"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg transition-colors ${className}`}
    >
      <Coffee size={16} className="mr-2" />
      Buy me a coffee
    </a>
  );
}