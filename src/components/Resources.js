import React from "react";
import { Card, CardContent, CardHeader } from "./card";
import { Button } from "./button";
import { DownloadIcon } from "lucide-react"; // Ensure this package is installed

const Resources = () => {
  const resources = [
    {
      title: "Exported Data",
      description: "Download the full dataset used for analysis, including details on places of worship and diversity metrics.",
      fileName: "exported_data.json",
    },
    {
      title: "Documentation",
      description: "Explore the technical documentation and methodologies used in our analysis.",
      fileName: "documentation.pdf",
    },

  ];

  const handleDownload = (fileName) => {
    const fileUrl = `/assets/files/${fileName}`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="resources-page">
      {/* Page Header */}
      <h1 className="text-center font-bold text-4xl mb-8 text-blue-800">
        Resources
      </h1>
      <p className="text-center text-lg text-gray-700 mb-8">
        Explore and download the resources below to learn more about the dataset, our methods, and how to integrate with our tools.
      </p>
  
      {/* Resources Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {resources.map((resource, index) => (
          <div
            key={index}
            className="resources-section shadow-lg rounded-lg border border-gray-200"
          >
            {/* Card Header */}
            <h2 className="text-lg font-semibold bg-gray-100 p-4 rounded-t-lg text-blue-800 border-b border-gray-200">
              {resource.title}
            </h2>
  
            {/* Card Content */}
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">
                {resource.description}
              </p>
              {/* Download Button */}
              <button
                onClick={() => handleDownload(resource.fileName)}
                className="download-button flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              >
                <DownloadIcon className="w-4 h-4 download-icon" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default Resources;
