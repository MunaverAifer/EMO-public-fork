"use client";

import Link from "next/link";
import { HiMenu } from "react-icons/hi";
import styles from "./Navbar.module.css";
import Login from "../Login/Login";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById } from "@/app/constants/features/user";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const userDetails = useSelector((state) => state.user.value);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch()
  const router = useRouter()

  const [showLogin, setShowLogin] = useState(false)
  const [user, setUser] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const toggleShowLogin = () => setShowLogin(!showLogin)
  const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);

  const handleRedux = async () => {
    const token = localStorage.getItem("studentToken");
    if (token) {
      setUser(true);
      dispatch(fetchUserById());
    }
  };

  const userLogout = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("Name");
    window.location.reload();
  };

  useEffect(() => {
    handleRedux();
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className={`navbar navbar-expand-md fixed-top bg-white py-2 px-md-4 ${styles.navbar}`}>
        <div className="container-fluid">
          <Link href="/" className="navbar-brand d-flex align-items-center">
            <img
              className={styles.logo}
              src="/emo-logo.png" alt="emo" />
          </Link>

          <div className="d-md-none d-flex gap-1 ms-auto align-items-center">
            <a href="#pricing"><button
              className={`${styles.freeTrialBtn}`}
            >Start Free Trial</button></a>
            {user ? (
              <div className={styles.userDropdown} ref={dropdownRef}>
                <button className={styles.userBtn} onClick={toggleUserDropdown}>
                  {userDetails.name} &nbsp;
                  {userDropdownOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </button>
                {userDropdownOpen && (
                  <ul className={styles.dropdownMenu}>
                    <li><button className={styles.logoutBtn}>Logout</button></li>
                  </ul>
                )}
              </div>
            ) : (
              <button className={styles.loginBtn} onClick={toggleShowLogin}>Log in</button>
            )}
            <button
              className={`${styles.togglerIcon} ms-2`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <HiMenu size={30} />
            </button>
          </div>

          <div className="collapse navbar-collapse justify-content-center text-end" id="navbarNav">
            <ul className="navbar-nav py-md-0 py-3 me-md-0 me-3 gap-3">
              <li className="nav-item">
                <Link href="#features" className={styles.navLink}>Features</Link>
              </li>
              <li className="nav-item">
                <Link href="#pricing" className={styles.navLink}>Pricing</Link>
              </li>
              <li className="nav-item">
                <Link href="#about" className={styles.navLink}>About</Link>
              </li>
            </ul>
          </div>

          <div className="d-none d-md-flex">
            <a href="#pricing"><button
              className={`${styles.freeTrialBtn} me-1`}
            >Start Free Trial</button></a>
          </div>
          {user && userDetails ? (
            <div className={styles.userDropdown} ref={dropdownRef}>
              <button className={styles.userBtn} onClick={toggleUserDropdown}>
                {userDetails.name} &nbsp;
                {userDropdownOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </button>
              {userDropdownOpen && (
                <ul className={styles.dropdownMenu}>
                  <li onClick={userLogout}>
                    <button className={styles.logoutBtn}>Logout</button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <button className={`${styles.loginBtn} d-none d-md-inline`} onClick={toggleShowLogin}>
              Log in
            </button>
          )}

        </div>
      </nav>

      {showLogin && <Login handleClose={toggleShowLogin} />}
    </>
  );
}
