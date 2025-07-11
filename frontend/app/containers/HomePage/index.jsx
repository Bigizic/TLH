import React from "react";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";
import actions from "../../actions";
import HeroBanner from "../../components/store/HeroBanner/HeroBanner";
import BrandSection from "../../components/store/BrandSection/BrandSection";
import DevicePage from "../../components/store/DevicePage/DevicePage";
import AllFeatures from "../../components/store/AllFeatures/AllFeatures";
import Benefits from "../../components/store/Benefits/Benefits";
import GettingMsg from "../../components/store/GettingMsg/GettingMsg";
import Setup from "../../components/store/Setup/Setup";
import PButton from "../../components/Common/HtmlTags/PrimaryButton/PButton";
import SButton from "../../components/Common/HtmlTags/SecondaryButton/SButton";
import HomeBanner from "./HomeBanner";
import { API_URL } from "../../constants";

const event1 = "./assets/events/event_1.jpeg";
const event2 = "./assets/events/event_2.jpeg";
const event3 = "./assets/events/event_3.jpeg";
const event4 = "./assets/events/event_4.jpeg";

class Home extends React.PureComponent {
  componentDidMount() {
    this.props.fetchHomeMedia();
  }
  render () {
  const { authenticated, homeMedia } = this.props;
  if (authenticated) return <Navigate to='/dashboard' />;

  let video, images = null
  const eventImages = [event1, event3, event2, event4];

  if (homeMedia && homeMedia.length > 0) {
    const defaultMedia = homeMedia.find(media => media.default === true);

    if (defaultMedia) {
      video = defaultMedia.mediaUrl;
    }
    
    images = homeMedia
      .filter(media => {
        if (video && media.mediaUrl === video) {
          return false;
        }
        return media.mediaUrl
      })
      .map(media => API_URL + media.mediaUrl);
  }

  return (
    <>
    <HomeBanner media={video}/>
      <HeroBanner
        heading="Discover The Link Hangouts Experience"
        desc="We are a vibrant lifestyle company based in Lagos, Nigeria, dedicated to curating and orchestrating exceptional events, parties, and hangouts that bring people together to create lasting memories."
        //bannerImage={images && images.length > 3 ? images : eventImages}
        bannerImage={eventImages}
        PButton={<PButton link={"/events"} content="Discover Events" />}
        SButton={<SButton link={"/gallery"} content="See Gallery" />}
        className={"border-10"}
      />

      <BrandSection />
      <DevicePage />
      {/*<Conference />*/}
      <AllFeatures />
      <Benefits />
      <GettingMsg />
      <Setup />
    </>
  );
}
};

const mapStateToProps = (state) => {
  return {
    homeMedia: state.media.homeMedia,
    authenticated: state.authentication.authenticated,
  };
};

export default connect(mapStateToProps, actions)(Home);
