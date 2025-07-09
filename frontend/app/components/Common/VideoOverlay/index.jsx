import React, { useState, useRef } from 'react';
import ResolveImage from '../../store/ResolveImage';
import { API_URL } from '../../../constants';
import './style.css';

const VideoOverlay = ({ videoUrl }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setShowOverlay(true);
      } else {
        videoRef.current.play();
        setShowOverlay(false);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setShowOverlay(true);
  };

  return (
    <div className="video-overlay-container">
      <video
        ref={videoRef}
        src={ResolveImage(API_URL + videoUrl)}
        preload="metadata"
        className="gallery-item-video"
        muted
        loop
        playsInline // Crucial for inline playback on iOS
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleVideoEnded}
      >
        Your browser does not support the video tag.
      </video>

      {showOverlay && (
        <div className="video-overlay-backdrop" onClick={togglePlay}>
          <img src="/black_logo.png" alt="Play Video" className="video-overlay-img" />
          <div className="video-play-button">
            <svg
              className="play-logo"
              width={30}
              height={30}
              viewBox="-0.5 0 7 7"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink">
              <g
                id="Page-1"
                stroke="none"
                strokeWidth={1}
                fill="none"
                fillRule="evenodd">
                <g
                  id="Dribbble-Light-Preview"
                  transform="translate(-347.000000, -3766.000000)"
                  fill="#fff">
                  <g
                    id="icons"
                    transform="translate(56.000000, 160.000000)">
                    <path
                      d="M296.494737,3608.57322 L292.500752,3606.14219 C291.83208,3605.73542 291,3606.25002 291,3607.06891 L291,3611.93095 C291,3612.7509 291.83208,3613.26444 292.500752,3612.85767 L296.494737,3610.42771 C297.168421,3610.01774 297.168421,3608.98319 296.494737,3608.57322"
                      id="play-[#1003]"
                    />
                  </g>
                </g>
              </g>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoOverlay;