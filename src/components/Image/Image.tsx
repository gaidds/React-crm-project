import {FC} from 'react';
import './styles.css';
import { ImageProps } from './types';

const Image: FC<ImageProps> = ({ src, alt}) => {
  return (
    <div className="image-container">
      <img
        src={src}
        alt={alt}
        className="profile-image"
      />
    </div>
  );
};

export default Image;
