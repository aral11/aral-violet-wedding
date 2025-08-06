import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { photosApi, guestsApi, handleApiError } from "@/lib/api";

export default function Debug() {
  const [localStorageData, setLocalStorageData] = useState<any>({});
  const [apiStatus, setApiStatus] = useState<any>({});

  useEffect(() => {
    // Load localStorage data
    const photos = localStorage.getItem("wedding_photos");
    const guests = localStorage.getItem("wedding_guests");
    const flow = localStorage.getItem("wedding_flow");
    const invitation = localStorage.getItem("wedding_invitation_pdf");

    setLocalStorageData({
      photos: photos ? JSON.parse(photos) : null,
      guests: guests ? JSON.parse(guests) : null,
      flow: flow ? JSON.parse(flow) : null,
      invitation: invitation || null,
    });
  }, []);

  const testAPI = async () => {
    const results: any = {};

    try {
      const photos = await photosApi.getAll();
      results.photos = {
        success: true,
        data: photos,
        count: photos?.length || 0,
      };
    } catch (error) {
      results.photos = { success: false, error: handleApiError(error) };
    }

    try {
      const guests = await guestsApi.getAll();
      results.guests = {
        success: true,
        data: guests,
        count: guests?.length || 0,
      };
    } catch (error) {
      results.guests = { success: false, error: handleApiError(error) };
    }

    setApiStatus(results);
  };

  const clearLocalStorage = () => {
    localStorage.removeItem("wedding_photos");
    localStorage.removeItem("wedding_guests");
    localStorage.removeItem("wedding_flow");
    localStorage.removeItem("wedding_invitation_pdf");
    window.location.reload();
  };

  const addTestPhoto = () => {
    const testPhoto =
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='200' height='200' fill='%23f0f0f0'/><text x='100' y='100' text-anchor='middle' dy='0.3em'>Test Photo</text></svg>";
    const photos = JSON.parse(localStorage.getItem("wedding_photos") || "[]");
    photos.push(testPhoto);
    localStorage.setItem("wedding_photos", JSON.stringify(photos));
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">
          Wedding Website Debug
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>LocalStorage Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <strong>Photos:</strong>{" "}
                  {localStorageData.photos
                    ? `${localStorageData.photos.length} items`
                    : "Empty"}
                </div>
                <div>
                  <strong>Guests:</strong>{" "}
                  {localStorageData.guests
                    ? `${localStorageData.guests.length} items`
                    : "Empty"}
                </div>
                <div>
                  <strong>Wedding Flow:</strong>{" "}
                  {localStorageData.flow
                    ? `${localStorageData.flow.length} items`
                    : "Empty"}
                </div>
                <div>
                  <strong>Invitation:</strong>{" "}
                  {localStorageData.invitation ? "Available" : "Empty"}
                </div>
                <div className="space-x-2">
                  <Button onClick={addTestPhoto} size="sm">
                    Add Test Photo
                  </Button>
                  <Button
                    onClick={clearLocalStorage}
                    variant="destructive"
                    size="sm"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button onClick={testAPI}>Test API Endpoints</Button>
                {apiStatus.photos && (
                  <div>
                    <strong>Photos API:</strong>{" "}
                    {apiStatus.photos.success
                      ? `✅ Success (${apiStatus.photos.count} items)`
                      : `❌ Failed: ${apiStatus.photos.error}`}
                  </div>
                )}
                {apiStatus.guests && (
                  <div>
                    <strong>Guests API:</strong>{" "}
                    {apiStatus.guests.success
                      ? `✅ Success (${apiStatus.guests.count} items)`
                      : `❌ Failed: ${apiStatus.guests.error}`}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Raw Data</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify({ localStorageData, apiStatus }, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
