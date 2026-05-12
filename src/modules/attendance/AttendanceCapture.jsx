import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import API from "../../api/axios";

// Add this helper function to calculate distance on frontend
const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371e3; // Earth's radius in meters
  
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);
  
  const a = Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
};

// Your office coordinates (same as backend)
const OFFICE_LOCATION = {
  latitude: 18.605573256150308,
  longitude: 73.78439712030278  // Replace with your office lng
};
const ALLOWED_RADIUS = 500; // 500 meters

const AttendanceCapture = ({ onClose }) => {
  const webcamRef = useRef(null);
  const [location, setLocation] = useState({
    latitude: "",
    longitude: "",
  });
  const [locationError, setLocationError] = useState(null);
  const [isWithinRange, setIsWithinRange] = useState(false);
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCamera, setShowCamera] = useState(true);
  const [captureMode, setCaptureMode] = useState(null);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          
          setLocation({
            latitude: userLat,
            longitude: userLng,
          });
          
          // Check if within 500m
          const dist = getDistanceInMeters(
            OFFICE_LOCATION.latitude,
            OFFICE_LOCATION.longitude,
            userLat,
            userLng
          );
          
          setDistance(Math.round(dist));
          
          if (dist <= ALLOWED_RADIUS) {
            setIsWithinRange(true);
            setLocationError(null);
          } else {
            setIsWithinRange(false);
            setLocationError(`You are ${Math.round(dist)}m away from office. Must be within 500m to mark attendance.`);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("Unable to get your location. Please enable location access.");
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser");
    }

    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await API.get("/attendance/my-attendance");
      setAttendance(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const capturePicture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setShowCamera(false);
  };

  const retakePicture = () => {
    setCapturedImage(null);
    setShowCamera(true);
  };

  const dataURLToBlob = (dataURL) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  // Check location before punch in/out
  const checkLocationAndProceed = async (action, handler) => {
    if (!isWithinRange) {
      alert(`Location check failed! ${locationError || `You are ${distance}m away from office. Only 500m allowed.`}`);
      return false;
    }
    
    if (!capturedImage) {
      alert("Please capture your selfie first");
      return false;
    }
    
    await handler();
    return true;
  };

  const handlePunchIn = async () => {
    await checkLocationAndProceed("in", async () => {
      setCaptureMode("in");
      try {
        setLoading(true);
        
        const imageBlob = dataURLToBlob(capturedImage);
        const formData = new FormData();
        formData.append("selfie", imageBlob, "selfie.jpg");
        formData.append("latitude", location.latitude);
        formData.append("longitude", location.longitude);

        const response = await API.post("/attendance/punch-in", formData);
        alert(response.data.message);
        fetchAttendance();
        
        setTimeout(() => {
          onClose();
        }, 1500);
      } catch (error) {
        console.error("Punch In Error:", error);
        alert(error.response?.data?.message || "Failed to punch in");
      } finally {
        setLoading(false);
        setCaptureMode(null);
      }
    });
  };

  const handlePunchOut = async () => {
    await checkLocationAndProceed("out", async () => {
      setCaptureMode("out");
      try {
        setLoading(true);
        
        const imageBlob = dataURLToBlob(capturedImage);
        const formData = new FormData();
        formData.append("selfie", imageBlob, "selfie.jpg");
        formData.append("latitude", location.latitude);
        formData.append("longitude", location.longitude);

        const response = await API.put("/attendance/punch-out", formData);
        alert(response.data.message);
        fetchAttendance();
        
        setTimeout(() => {
          onClose();
        }, 1500);
      } catch (error) {
        console.error("Punch Out Error:", error);
        alert(error.response?.data?.message || "Failed to punch out");
      } finally {
        setLoading(false);
        setCaptureMode(null);
      }
    });
  };

  const today = attendance[0];
  const hasPunchedIn = today?.punch_in;
  const hasPunchedOut = today?.punch_out;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* LEFT - Camera Section */}
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-[#1e3a8a] mb-4">
            {showCamera ? "Capture Selfie" : "Captured Selfie"}
          </h3>

          {showCamera ? (
            <div className="space-y-4">
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="rounded-2xl w-full"
                mirrored={true}
                screenshotQuality={0.8}
              />
              <button
                onClick={capturePicture}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition"
              >
                📸 Capture Picture
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <img src={capturedImage} alt="Captured" className="rounded-2xl w-full" />
              <div className="flex gap-3">
                <button
                  onClick={retakePicture}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl font-semibold transition"
                >
                  🔄 Retake
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Location Info with Warning */}
        <div className={`rounded-2xl p-6 ${isWithinRange ? 'bg-green-50' : 'bg-red-50'}`}>
          <h3 className="text-xl font-bold text-[#1e3a8a] mb-4">📍 Current Location</h3>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-semibold">Latitude:</span> {location.latitude || "Fetching..."}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Longitude:</span> {location.longitude || "Fetching..."}
            </p>
            {distance !== null && (
              <p className={`font-semibold ${isWithinRange ? 'text-green-600' : 'text-red-600'}`}>
                Distance from office: {distance} meters {isWithinRange ? '✅' : '❌'}
              </p>
            )}
            {locationError && (
              <p className="text-red-600 text-sm mt-2">
                ⚠️ {locationError}
              </p>
            )}
            {!isWithinRange && distance !== null && (
              <p className="text-red-600 text-sm mt-2">
                ⚠️ You must be within 500 meters of the office to mark attendance!
              </p>
            )}
            {location.latitude && location.longitude && (
              <a
                href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm hover:underline inline-block mt-2"
              >
                View on Google Maps →
              </a>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT - Attendance Actions & Status */}
      <div className="space-y-6">
        {/* Action Buttons */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-[#1e3a8a] mb-4">Attendance Actions</h3>
          <div className="flex gap-4">
            <button
              onClick={handlePunchIn}
              disabled={loading || hasPunchedIn || !isWithinRange}
              className={`flex-1 py-4 rounded-2xl text-lg font-semibold transition ${
                hasPunchedIn || !isWithinRange
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading && captureMode === "in" ? "Processing..." : "✅ Punch In"}
            </button>

            <button
              onClick={handlePunchOut}
              disabled={loading || !hasPunchedIn || hasPunchedOut || !isWithinRange}
              className={`flex-1 py-4 rounded-2xl text-lg font-semibold transition ${
                !hasPunchedIn || hasPunchedOut || !isWithinRange
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              {loading && captureMode === "out" ? "Processing..." : "⏹️ Punch Out"}
            </button>
          </div>
          {!isWithinRange && (
            <p className="text-red-600 text-sm mt-3 text-center font-semibold">
              ⚠️ Cannot mark attendance - you're outside the 500m allowed radius!
            </p>
          )}
          {hasPunchedIn && !hasPunchedOut && isWithinRange && (
            <p className="text-yellow-600 text-sm mt-3 text-center">
              You have punched in. Don't forget to punch out before leaving!
            </p>
          )}
          {hasPunchedOut && (
            <p className="text-green-600 text-sm mt-3 text-center">
              ✓ Attendance completed for today
            </p>
          )}
        </div>

        {/* Today's Status */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-[#1e3a8a] mb-4">📊 Today's Attendance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="font-semibold text-gray-700">Punch In:</span>
              <span className="text-gray-900">
                {today?.punch_in ? new Date(today.punch_in).toLocaleTimeString() : "Not marked"}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="font-semibold text-gray-700">Punch Out:</span>
              <span className="text-gray-900">
                {today?.punch_out ? new Date(today.punch_out).toLocaleTimeString() : "Not marked"}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="font-semibold text-gray-700">Work Hours:</span>
              <span className="text-gray-900">{today?.work_hours || "-"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">Status:</span>
              <span
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  today?.status === "present"
                    ? "bg-green-500 text-white"
                    : today?.status === "half-day"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-400 text-white"
                }`}
              >
                {today?.status || "Not Marked"}
              </span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-blue-800 mb-3">📋 Instructions</h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li>• You must be within 500 meters of the office to mark attendance</li>
            <li>• Capture a clear selfie before punching in/out</li>
            <li>• Make sure your location is enabled</li>
            <li>• Punch in when you start your work day</li>
            <li>• Punch out when you finish your work day</li>
            <li>• You can only punch in once per day</li>
            <li>• You can only punch out after punching in</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCapture;