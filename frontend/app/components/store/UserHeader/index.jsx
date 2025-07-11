import { ROLES } from "../../../constants";
import { Link } from "react-router-dom";
import { CgMenuRightAlt } from "react-icons/cg";
import { IoMdClose } from "react-icons/io";
import Dropdown from "../Others/DropDown";
import UserHeaderHelper from "./helper";

const UserHeader = (props) => {
    const {
        authenticated,
        user,
        signOut,
        isMenuOpen,
        toggleMenu,
        links,
        doLogout
    } = props;

    if (authenticated && user && ['ROLE MEMBER'].includes(user.role)) {
        return (
            <>
            <UserHeaderHelper {...props} />
            </>
        )
    } else {
    return (
    <>
           <div className="nav d-lg-flex align-self-end header-lg">
              <ul>
                <li>
                  <Link to="/events">Discover Events</Link>
                </li>

                <li>
                  <Link to="/gallery">Gallery</Link>
                </li>

                <li>
                  <Link to="/organizer-signup">Organizers</Link>
                </li>

                <li>
                  <Link to="/shop">Shop</Link>
                </li>
                <li>
                  <Dropdown type={"hover"} parent={"Pages"}>
                    <Link to={"/about"}>About Us</Link>
                    <Link to={"/terms"}>Terms & Conditions</Link>
                    <Link to={"/privacy"}>Privacy Policy</Link>
                    <Link to={"/faq"}>FAQs</Link>
                  </Dropdown>
                </li>
                <li>
                  <Link target={"_blank"} to="https://chat.whatsapp.com/BITMxQSwpFT5x8zjX0v6z2">Join the chat room</Link>
                </li>
                <li>
                  <Link to="mailto:contact@thelinkhangout.com">Contact Us</Link>
                </li>
              </ul>
            </div>
              <div className="buttons header-lg-buttons">
                <Link to="/login" className="button">
                  Log In
                </Link>
                <Link to="/organizer-signup" className="button--secondary">
                  Create event
                </Link>
              </div>

















            <div className="menu-toggle" onClick={toggleMenu}>
              <CgMenuRightAlt color={"white"} size={30}/>
            </div>

            <div className={`header-menu-mobile  ${isMenuOpen ? "show" : " "}`}>
              <div
                className={`menu-toggle  ${isMenuOpen ? "active" : " "}`}
                onClick={toggleMenu}>
                <IoMdClose color={"white"} size={30}/>
              </div>
              <div className="nav">
                <ul>
                <li>
                  <Link onClick={toggleMenu} to="/">Home</Link>
                </li>
                <li>
                  <Link onClick={toggleMenu} to="/events">Discover Events</Link>
                </li>

                <li>
                  <Link onClick={toggleMenu} to="/gallery">Gallery</Link>
                </li>

                <li>
                  <Link onClick={toggleMenu} to="/organizer-signup">Organizers</Link>
                </li>

                <li>
                  <Link onClick={toggleMenu} to="/shop">Shop</Link>
                </li>

                <li>
                  <Dropdown parent={"Pages"}>
                    <Link onClick={toggleMenu} to={"/about"}>About Us</Link>
                    <Link onClick={toggleMenu} to={"/terms"}>Terms & Conditions</Link>
                    <Link onClick={toggleMenu} to={"/privacy"}>Privacy Policy</Link>
                    <Link onClick={toggleMenu} to={"/faq"}>FAQs</Link>
                  </Dropdown>
                </li>

                <li>
                  <Link onClick={toggleMenu} target={"_blank"} to="https://chat.whatsapp.com/BITMxQSwpFT5x8zjX0v6z2">Join the chat room</Link>
                </li>

                <li>
                  <Link onClick={toggleMenu} to="mailto:contact@thelinkhangout.com">Contact Us</Link>
                </li>

                </ul>
              </div>
              <div className="buttons">
                <Link onClick={toggleMenu} to="/login" className="button">
                  Log In
                </Link>
                <Link onClick={toggleMenu} to="/organizer-signup" className="button--secondary">
                  Create event
                </Link>
              </div>
            </div>
    </>
    )
}
}

export default UserHeader;
