import React, { useState, useRef } from "react";
import { Button, Image } from "react-bootstrap";
import Webcam from "react-webcam";
import ReCAPTCHA from "react-google-recaptcha";

const UserImage = () => {
  const [image, setImage] = useState("/sky.png");
  const [file, setFile] = useState(null);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Trạng thái cho biết ảnh đang được tải
  const [showWebcam, setShowWebcam] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const fileInputRef = useRef(null);
  const webcamRef = useRef(null);
  const recaptchaRef = useRef(null);

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        setFile(file);
        setImageUploaded(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const capturedFile = new File([blob], "webcam-image.jpg", {
          type: "image/jpeg",
        });
        setFile(capturedFile);
        setImageUploaded(true);
        setShowWebcam(false);
      });
  };

  const handleCaptcha = (value) => {
    console.log("Captcha value:", value);
    if (value) {
      uploadImage();
    } else {
      alert("CAPTCHA verification failed. Please try again.");
    }
  };

  const handleContinue = () => {
    if (!file) {
      alert("Vui lòng chọn ảnh trước khi tiếp tục!");
      return;
    }
    setShowCaptcha(true);
  };

  const uploadImage = async () => {
    setIsLoading(true); // Bắt đầu hiển thị ảnh loading
    setShowCaptcha(false); // Hide CAPTCHA after successful validation
    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", "Your image caption");

    try {
      const response = await fetch(
        "https://api.blueforestphathoachandung.com/run-url",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Get JSON response containing the URL
      const data = await response.json();
      console.log("Image upload response data:", data); // Log the data to the console
      setImage(data.url);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Lỗi khi tải ảnh lên: " + error.message);
    } finally {
      setIsLoading(false); // Dừng hiển thị ảnh loading
    }
  };

  return (
    <>
      <div className="image-container">
        <img src="/square.png" className="border-image" width="580px" />
        <img src="/Hoa.png" className="hoa-1" width="50px" />
        <img src="/Hoa.png" className="hoa-2" width="100px" />
        {showWebcam ? (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              height={"100%"}
              width={"100%"}
              screenshotFormat="image/jpeg"
              className="webcam-view"
            />
            <Button variant="primary" onClick={capture}>
              Chụp ảnh
            </Button>
            <Button variant="secondary" onClick={() => setShowWebcam(false)}>
              Đóng Camera
            </Button>
          </>
        ) : (
          <>
            <Image
              className="img-preview"
              src={isLoading ? "/loading_screen.png" : image}
            />
            {!imageUploaded && !isLoading && (
              <div className="button-overlay">
                <Button
                  className="btn-upload-image"
                  variant="primary"
                  onClick={() => setShowWebcam(true)}
                >
                  Chụp chân dung
                </Button>
                <span>Hoặc</span>
                <Button
                  className="btn-upload-image"
                  variant="secondary"
                  onClick={handleFileSelect}
                >
                  Tải lên từ máy
                </Button>
              </div>
            )}
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
      </div>
      <div className="main-btn-continue">
        <Button className="btn-continue" onClick={handleContinue}>
          Tiếp tục
        </Button>
      </div>
      {showCaptcha && (
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey="6LdxTwEqAAAAACO2k2y3CdLtJFxAlIoOp1ec6T_N"
          onChange={handleCaptcha}
          onExpired={() => setShowCaptcha(false)}
        />
      )}
    </>
  );
};

export default UserImage;
