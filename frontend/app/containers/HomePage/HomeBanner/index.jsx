import React from 'react';

const HomeBanner = (props) => {
    const { media = "/uploads/videos/purple.mp4" } = props;

    const isVideo = (url) => {
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
        const lowerCaseUrl = url.toLowerCase();
        return videoExtensions.some(ext => lowerCaseUrl.endsWith(ext));
    };

    return (
        <div className="homeBanner">
            <div className="videoContainer">
                {isVideo(media) ? (
                    <video autoPlay muted playsInline loop>
                        <source src={media} type="video/mp4"></source>
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <img src={media} alt="Banner" className="bannerImage" />
                )}
            </div>
        </div>
    )
}

export default HomeBanner;