import {
  ChangeEvent,
  FC,
  useEffect,
  useState,
  ReactElement,
  isValidElement,
  cloneElement,
} from 'react';
import { ImgUploaderProps } from './types';
import { MdCloudUpload } from 'react-icons/md';
import { MdCancel } from 'react-icons/md';
import './styles.css';

const ImgUploader: FC<ImgUploaderProps> = ({
  id,
  name,
  onChange,
  defaultValue,
  externalError,
  customWidget,
}) => {
  const [imgUrl, setImgUrl] = useState<string>(defaultValue || '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.cloudinary) {
      const myWidget = window.cloudinary.createUploadWidget(
        {
          cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME as string,
          uploadPreset: process.env
            .REACT_APP_CLOUDINARY_UPLOAD_PRESET as string,
          sources: ['local', 'url', 'camera', 'image_search'],
          cropping: true,
          croppingAspectRatio: 1,
          croppingCoordinatesMode: 'custom',
          croppingValidateDimensions: true,
          showAdvancedOptions: true,
          multiple: false,
          defaultSource: 'local',
        },
        (error: any, result: any) => {
          if (error) {
            setError('Failed to upload image. Please try again.');
            console.error('Upload Widget Error:', error);
            return;
          }

          if (result && result.event === 'success') {
            const imageUrl = result.info.secure_url;
            setImgUrl(imageUrl);
            setError(null);
            onChange({
              target: { id, name, value: imageUrl },
            } as ChangeEvent<HTMLInputElement>);
            myWidget.close();
          }
        }
      );

      const uploadButton = document.getElementById('upload_widget');

      const handleClick = () => {
        setError(null);
        myWidget.open();
      };

      uploadButton?.addEventListener('click', handleClick);

      return () => {
        uploadButton?.removeEventListener('click', handleClick);
      };
    } else {
      setError('Cloudinary widget is unavailable. Please try again later.');
    }
  }, [onChange]);

  const handleCancel = () => {
    setImgUrl(defaultValue || '');
    setError(null);
    onChange({
      target: { id, name, value: defaultValue || '' },
    } as ChangeEvent<HTMLInputElement>);
  };

  const isCancelDisabled = imgUrl === defaultValue || imgUrl === '';

  if (customWidget) {
    return <div id="upload_widget">{customWidget}</div>;
  }

  return (
    <div>
      <div
        className={`img-uploader-container ${
          (error || externalError) && 'img-uploader-container-error'
        }`}
      >
        <div className="upload-img-section">
          <input
            name={name}
            id={id}
            className="img-uploader-input"
            value={imgUrl}
            readOnly
          />
          {imgUrl ? (
            <img className="upload-img-view" src={imgUrl} alt="Uploaded" />
          ) : (
            <MdCloudUpload className="upload-img-icon" />
          )}

          <span id="upload_widget" className="click-to-upload-img">
            Click to upload img
          </span>
        </div>
        <MdCancel
          onClick={handleCancel}
          className={`cancel-uploaded-img-btn ${
            isCancelDisabled && 'cancel-uploaded-img-btn-disabled'
          }`}
        />
      </div>
      {error && <div className="img-uploader-error-message">{error}</div>}
      {externalError && !error && (
        <div className="img-uploader-error-message">{externalError}</div>
      )}
    </div>
  );
};

export default ImgUploader;
