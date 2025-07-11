import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { CgMenuRightAlt } from 'react-icons/cg';
import { IoMdClose } from 'react-icons/io';

const UserHeaderHelper = (props) => {
    const { links, doLogout, toggleMenu, isMenuOpen } = props;

    return (
        <>
            <div className="nav d-lg-flex align-self-end header-lg">
              <ul>
                {
                    links && links.map((link, index) => {
                        const PREFIX = link.prefix ? link.prefix : '';
                        return (
                            <li key={index}>
                                <NavLink
                                    to={PREFIX + link.to}
                                >
                                    {link.name}
                                </NavLink>
                            </li>
                        )
                    })
                }
                <li>
                    <Link target={"_blank"} to="https://chat.whatsapp.com/BITMxQSwpFT5x8zjX0v6z2">Join the chat room</Link>
                </li>
                </ul>
            </div>

              <div className="buttons header-lg-buttons">
                <div className="logout-button">
                  <Link to="/" className="button " onClick={doLogout}>
                    Logout
                  </Link>
                </div>
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
                {
                    links && links.map((link, index) => {
                        const PREFIX = link.prefix ? link.prefix : '';
                        return (
                            <li key={index}>
                                <NavLink
                                    to={PREFIX + link.to}
                                    onClick={toggleMenu}
                                >
                                    {link.name}
                                </NavLink>
                            </li>
                        )
                    })
                }
                <li>
                    <Link target={"_blank"} to="https://chat.whatsapp.com/BITMxQSwpFT5x8zjX0v6z2">Join the chat room</Link>
                </li>
            
                </ul>
              </div>

              <div className="buttons">
                <div className="logout-button">
                  <Link to="/" className="button " onClick={() => { doLogout(); toggleMenu()}}>
                    Logout
                  </Link>
                </div>
              </div>
            </div>
        </>
    )
}

export default UserHeaderHelper
