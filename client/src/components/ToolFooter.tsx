import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function ToolFooter() {
  const tools = [
    { name: "Merge PDF", path: "/merge", color: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800" },
    { name: "Split PDF", path: "/split", color: "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800" },
    { name: "Reorder Pages", path: "/reorder", color: "bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-800" },
    { name: "Delete Pages", path: "/delete", color: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800" },
    { name: "Rotate PDF", path: "/rotate", color: "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-800" },
    { name: "Page Numbers", path: "/page-numbers", color: "bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-800" },
  ];

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Need More PDF Tools?</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Explore our complete suite of PDF manipulation tools</p>
          <div className="flex flex-wrap justify-center gap-3">
            {tools.map((tool) => (
              <Button
                key={tool.path}
                variant="ghost"
                size="sm"
                asChild
                className={`${tool.color} transition-colors`}
              >
                <Link href={tool.path}>
                  {tool.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
