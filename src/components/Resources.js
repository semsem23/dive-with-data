import React from "react";
import { DownloadIcon } from "lucide-react";

const Resources = () => {
  const resources = [
    {
      title: "Exported Data",
      description: "Download the full dataset used for analysis, including details on places of worship and diversity metrics.",
      fileName: "exported_data.json",
      path: "/dive-with-data/exported_data.json",
    },
    {
      title: "Documentation",
      description: "Explore the technical documentation and methodologies used in our analysis.",
      fileName: "documentation.pdf",
      path: "/dive-with-data/assets/files/documentation.pdf",
    },

  ];

  const handleDownload = (resource) => {
    const link = document.createElement("a");
    link.href = resource.path;
    link.download = resource.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="resources-page">
      {/* Page Header */}
      <h1>Resources</h1>
      <p className="resources-intro">
        Explore and download the resources below to learn more about the dataset, our methods, and how to integrate with our tools.
      </p>

      {/* Resources Grid */}
      <div className="resources-grid">
        {resources.map((resource, index) => (
          <div
            key={index}
            className="resources-section"
          >
            {/* Card Header */}
            <h2>{resource.title}</h2>

            {/* Card Content */}
            <div className="resources-section-body">
              <p>{resource.description}</p>
              {/* Download Button */}
              <button
                onClick={() => handleDownload(resource)}
                className="download-button"
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
