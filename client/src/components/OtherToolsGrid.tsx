import React from "react";
import { Link } from "wouter";

interface OtherTool {
  name: string;
  path: string;
  description: string;
  iconBg: string;
  faIcon: string;
  category: string;
  comingSoon?: boolean;
}

interface OtherToolsGridProps {
  tools: OtherTool[];
}

export function OtherToolsGrid({ tools }: OtherToolsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 max-w-lg mx-auto">
      {tools.map((tool) => (
        <div key={tool.path} className="relative">
          {tool.comingSoon ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 opacity-75 cursor-not-allowed">
              <div className="flex items-center">
                <div className={`w-14 h-14 ${tool.iconBg} rounded-xl flex items-center justify-center text-white text-xl mr-5`} role="img" aria-label={`${tool.name} tool`}>
                  <i className={tool.faIcon} aria-hidden="true"></i>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">{tool.name}</h3>
                  <p className="text-gray-400 dark:text-gray-500 leading-relaxed">{tool.description}</p>
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                  Coming Soon
                </span>
              </div>
            </div>
          ) : (
            <Link href={tool.path}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 cursor-pointer group">
                <div className="flex items-center">
                  <div className={`w-14 h-14 ${tool.iconBg} rounded-xl flex items-center justify-center text-white text-xl mr-5`} role="img" aria-label={`${tool.name} tool`}>
                    <i className={tool.faIcon} aria-hidden="true"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{tool.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{tool.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}