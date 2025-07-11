import React from "react";
import "./style.css";
import { getCurrentUserDetail } from "../../../../../Backend/auth";
import { getRegistrationStatus, formatDateRange, formatReadableDate } from "./functions";
import { useNavigate } from "react-router-dom";
import ResolveImage from "../ResolveImage";
import { API_URL } from "../../../constants";
import { Link } from "react-router-dom";

const Card = ({ event, type = "event" }) => {
  const navigate = useNavigate();
  const currentUser = getCurrentUserDetail() ?? null;
  const userID = currentUser ? currentUser.id : null;

  if (type === "gallery") {
    return (
      <div className="card-wrapper" userid={userID}>
        <div className="card-body">
          <img loading="lazy" src={ResolveImage(API_URL + event.bannerUrl)} alt={event.name} width={100} height={100} />
          <h3 className="card-title">{event.name}</h3>
          <p className="card-desc">{formatReadableDate(event.date)}</p>
        </div>
        <button
          className="card-button"
          onClick={() => navigate(`/gallery/${event.slug}`)}
        >
          View Gallery
        </button>
      </div>
    );
  }

  // Default: Event Card
  return (
    <Link to={`/event/${event.slug}`}>
    <div className="card-wrapper" userid={userID}>
      <div className="card-body">
        <img
          src={ResolveImage(`${API_URL}${event.imageUrls[0]}` || '')}
          alt="Event"
          width={100}
          height={100}
          loading="lazy"
        />
        <h3 className="card-title">{event.name}</h3>
        <p className="card-desc">{event.desc}</p>
        <p>Date: {formatDateRange(event.startDate, event.endDate)}</p>
      </div>

      <button
        className={`card-button ${getRegistrationStatus(
          event.startDate,
          event.endDate
        )}`}
        onClick={
          getRegistrationStatus(event.startDate, event.endDate) === "now"
            ? () => null
            : null
        }
      >
        {getRegistrationStatus(event.startDate, event.endDate) === "closed"
          ? "Sold out"
          : getRegistrationStatus(event.startDate, event.endDate) === "soon"
          ? "Coming Soon"
          : "Get a ticket"}
      </button>
    </div>
    </Link>
  );
};

export default Card;
