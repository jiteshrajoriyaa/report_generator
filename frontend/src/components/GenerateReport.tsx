import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BACKEND_URL } from "@/lib/config";

export default function GenerateReport() {
    const [sessionId, setSessionId] = useState("");
    const [loading, setLoading] = useState(false);
    const [filename, setFilename] = useState("");
    const [statusMessage, setStatusMessage] = useState("");

    const handleGenerate = async () => {
        if (!sessionId) {
            setStatusMessage("Please enter a session ID.");
            return;
        }

        setLoading(true);
        setFilename("");
        setStatusMessage("");

        try {
            const res = await fetch(`${BACKEND_URL}/generate-report?session_id=session_${sessionId}`);
            const data = await res.json();

            if (data.success) {
                setFilename(data.filename);
                setStatusMessage("PDF generated successfully!");
            } else {
                setStatusMessage(`Failed to generate PDF: ${data.message}`);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setStatusMessage(`Error: ${err.message}`);
            } else {
                setStatusMessage("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20">
            <Card>
                <CardHeader>
                    <CardTitle>Generate PDF Report</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        placeholder="Enter Session ID"
                        value={sessionId}
                        onChange={(e) => setSessionId(e.target.value)}
                    />

                    <Button
                        onClick={handleGenerate}
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? "Generating..." : "Generate PDF"}
                    </Button>

                    {statusMessage && (
                        <p className="text-center text-gray-700">{statusMessage}</p>
                    )}

                    {filename && (
                        <a
                            href={`http://localhost:3000/reports/${filename}`}
                            download={`${filename}`}
                            className="block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        >
                            Download PDF
                        </a>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
