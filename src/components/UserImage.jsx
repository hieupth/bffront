import React, { useState, useRef } from "react";
import { Button, Image, Row, Col } from "react-bootstrap";
import Webcam from "react-webcam";
import ReCAPTCHA from "react-google-recaptcha";

const UserImage = () => {
  let caption = ''
  // let step = 0
  const [image, setImage] = useState("/trans.png");
  const [file, setFile] = useState(null);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Trạng thái cho biết ảnh đang được tải
  const [showWebcam, setShowWebcam] = useState(false);
  const fileInputRef = useRef(null);
  const webcamRef = useRef(null);
  const [step, setStep] = useState(1);
  const [sloganBtnVisible, setSloganBtnVisible] = useState(false)
  // const [caption, setCaption] = useState('')

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
        setStep(2);
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
        setStep(2);
        setImageUploaded(true);
        setShowWebcam(false);
      });
  };

  const handleContinue = () => {
    if (!file) {
      alert("Vui lòng chọn hoặc chụp ảnh trước khi tiếp tục!");
      return;
    }
    uploadImage();
    // setShowCaptcha(true);
  };

  const uploadImage = async () => {
    setStep(3);
    setIsLoading(true); // Bắt đầu hiển thị ảnh loading
    // setShowCaptcha(false); // Hide CAPTCHA after successful validation
    const formData = new FormData();
    formData.append("file", file);
    // formData.append("caption", caption);
    let uri = ''
    if (caption.length > 0) {
      uri = '?caption=' + caption
    }

    try {
      const response = await fetch(
        "https://api.blueforestphathoachandung.com/run-url" + uri,
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
      alert('Không thể nhận diện khuôn mặt. Hãy thử lại ảnh khác.');
    } finally {
      setIsLoading(false); // Dừng hiển thị ảnh loading
    }
  };

  const downloadImage = async () => {
    if (!image) {
      alert("Vui lòng chọn ảnh trước khi tải xuống!");
      return;
    }
    // Tạo một yêu cầu fetch để lấy ảnh từ URL
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      // Tạo một thẻ <a> tạm thời và thực hiện việc tải xuống
      const link = document.createElement("a");
      link.href = url;
      link.download = "downloaded-image.jpg"; // Tên file có thể đặt theo yêu cầu
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Xóa URL tạm thời
    } catch (error) {
      console.error("Không thể tải ảnh:", error);
      alert("Lỗi khi tải ảnh xuống: " + error.message);
    }
  };

  const handleShareOnFacebook = () => {
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      image
    )}`;
    window.open(facebookShareUrl, "_blank");
  };

  return (
    <>
      <Row className="image-area">
        {showWebcam ? (
          <>
          <div className="image-container text-align-center">
            <img src="/square4flower.png" className="border-image" alt="img1"/>
            <Webcam
              audio={false}
              ref={webcamRef}
              mirrored={true}
              videoConstraints={{facingMode: 'user'}}
              screenshotFormat="image/jpeg"
              className="webcam-view"
            />
            <div className="button-overlay text-align-center">
              <Button className="btn-upload-image" variant="primary" onClick={capture}>Chụp ảnh</Button>
              <Button className="btn-upload-image" variant="secondary" onClick={() => setShowWebcam(false)}>Đóng Camera</Button>
            </div>
          </div>
          </>
        ) : (
          <>
          <div className="image-container text-align-center">
            <img src="/square4flower.png" className="border-image" alt="img1"/>
            <Image className="img-preview" src={isLoading ? "/loading_screen.png" : image}/>
          {!imageUploaded && !isLoading || step == 1 ? (
            <div className="button-overlay text-align-center">
              <Button className="btn-upload-image" variant="primary" onClick={() => setShowWebcam(true)}>Chụp chân dung</Button>
              {/* <span>Hoặc</span> */}
              <Button className="btn-upload-image" variant="secondary" onClick={handleFileSelect}>Tải lên từ máy</Button>
            </div>
          ):(<></>)}
          </div>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
      </Row>
      <Row className="button-container">
        {step == 2 ? (
          <>
            <Row><button className="btn-slogan" onClick={() => {
              window.location.reload(false);
              setStep(1);
            }}>Thử lại</button></Row>
            <Row><button className="btn-continue" onClick={handleContinue}>Tiếp tục</button></Row>
          </>
          ) : (
          <>
          {step == 3 && !isLoading ? (
            <>
              <Row>
                <input className={sloganBtnVisible ? 'text-caption': 'text-caption-full'} type="text" placeholder="Nhập thông điệp khác (0/50)" maxLength="50" 
                onChange={(e) => {
                  caption = e.target.value;
                  setSloganBtnVisible(e.target.value.length > 0);
                }}
                ></input>
                {sloganBtnVisible && (
                  <button className="text-caption-btn btn-continue" onClick={() => {
                    handleContinue();
                    setSloganBtnVisible(false);
                  }}>OK</button>
                )}
              </Row>
              <Row><button className="btn-continue" onClick={() => {
                caption = ''; 
                handleContinue();
                setSloganBtnVisible(false);
              }}>Đổi thông điệp</button></Row>
              <Row>
                <Col className="col-6" style={{paddingRight: '5px', paddingLeft: '0px', margin: '0px !important'}}>
                  <button className="btn-slogan" onClick={downloadImage}>Tải ảnh</button>
                </Col>
                <Col className="col-6" style={{paddingLeft: '5px', paddingRight: '0px', margin: '0px !important'}}>
                  <button onClick={handleShareOnFacebook} className="btn-slogan">Chia sẻ</button>
                </Col>
              </Row>
              <Row>
                <p className="text-caution">Nhấn và giữ ảnh để tải về máy</p>
              </Row>
            </>
          ) : (<></>)}
          </>)}
      </Row>
    </>
  );
};

export default UserImage;
