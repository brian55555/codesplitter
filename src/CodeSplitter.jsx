import { useState } from "react";
import JSZip from "jszip";

export default function CodeSplitter() {
  const [inputCode, setInputCode] = useState("");
  const [files, setFiles] = useState([]);
  const [isProcessed, setIsProcessed] = useState(false);
  const [isZipReady, setIsZipReady] = useState(false);
  const [zipUrl, setZipUrl] = useState("");

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setInputCode(e.target.result);
    };
    reader.readAsText(file);
  };

  // Parse the input code and split it into files
  const processCode = () => {
    if (!inputCode.trim()) return;

    // Regular expression to find file headers in the format "### path/to/file.ext"
    const fileRegex = /^###\s+([\w\/\.-]+)\s*$/gm;

    // Find all file headers
    const matches = [...inputCode.matchAll(fileRegex)];

    // If no valid headers found
    if (matches.length === 0) {
      alert(
        'No valid file headers found. Headers should be in the format "### path/to/file.ext"',
      );
      return;
    }

    const fileList = [];

    // Process each file
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const path = match[1];
      const startIndex = match.index + match[0].length;

      // Find the end index (either the next file header or the end of input)
      const endIndex =
        i < matches.length - 1 ? matches[i + 1].index : inputCode.length;

      // Extract the file content
      const content = inputCode.substring(startIndex, endIndex).trim();

      fileList.push({
        path,
        content,
      });
    }

    setFiles(fileList);
    setIsProcessed(true);
  };

  // Create a zip file containing all the files
  const createZip = async () => {
    const zip = new JSZip();

    // Add each file to the zip
    files.forEach((file) => {
      // Split the path to determine directories
      const pathParts = file.path.split("/");
      const fileName = pathParts.pop();
      let currentFolder = zip;

      // Create nested folders if needed
      if (pathParts.length > 0) {
        for (const folderName of pathParts) {
          if (!currentFolder.folder(folderName)) {
            currentFolder = currentFolder.folder(folderName);
          } else {
            currentFolder = currentFolder.folder(folderName);
          }
        }
      }

      // Add the file to the appropriate folder
      currentFolder.file(fileName, file.content);
    });

    // Generate the zip file
    const zipBlob = await zip.generateAsync({ type: "blob" });

    // Create a download URL
    const url = URL.createObjectURL(zipBlob);
    setZipUrl(url);
    setIsZipReady(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Code Splitter</h1>
      <p className="text-center text-gray-600">
        Split a single file containing multiple scripts into separate files
        based on headers in the format{" "}
        <code className="bg-gray-100 p-1 rounded">### path/to/file.ext</code>
      </p>

      {!isProcessed ? (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <textarea
              className="w-full h-64 p-2 font-mono text-sm border border-gray-300 rounded"
              placeholder="Paste your code here with headers like '### src/App.tsx'..."
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-center">
            <span className="text-gray-500">OR</span>
          </div>

          <div className="flex justify-center">
            <label className="cursor-pointer bg-gray-100 py-2 px-4 rounded hover:bg-gray-200">
              <span>Upload a text file</span>
              <input
                type="file"
                accept=".txt"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          <div className="flex justify-center">
            <button
              className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
              onClick={processCode}
              disabled={!inputCode.trim()}
            >
              Process
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Processed Files ({files.length})
          </h2>

          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Path
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content Preview
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {files.map((file, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                      {file.path}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-h-24 overflow-hidden">
                        {file.content.substring(0, 100)}
                        {file.content.length > 100 ? "..." : ""}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center space-x-4">
            {!isZipReady ? (
              <button
                className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600"
                onClick={createZip}
              >
                Create ZIP
              </button>
            ) : (
              <a
                href={zipUrl}
                download="split_files.zip"
                className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600"
              >
                Download ZIP
              </a>
            )}

            <button
              className="bg-gray-300 text-gray-800 py-2 px-6 rounded hover:bg-gray-400"
              onClick={() => {
                setInputCode("");
                setFiles([]);
                setIsProcessed(false);
                setIsZipReady(false);
                if (zipUrl) URL.revokeObjectURL(zipUrl);
              }}
            >
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
