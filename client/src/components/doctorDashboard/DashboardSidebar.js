import logo from "../../assets/img/landingPage/logo1.png";
import dashboard from "../../assets/img/dashboard/home.png";
import reports from "../../assets/img/dashboard/report2_pbl.png";
import patient_history from "../../assets/img/dashboard/patient_history.jpeg";
import patient_profile from "../../assets/img/dashboard/patient2_pbl.png";
import logoutimg from "../../assets/img/dashboard/logout.png";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
const DashboardSidebar = (props) => {
  const navigate = useNavigate();
  const logout = async () => {
    const res = await fetch("/logout");
    props.settoastCondition({
      status: "success",
      message: "Logged out Successfully!!!",
    });
    props.setToastShow(true);
    navigate("/");
  };

  const [Toggle, setToggle] = useState("Dashboard");
  return (
    <div className="h-screen overflow-y-hidden w-screen grid grid-cols-12">
      <div className="side_bar bg-white shadow col-span-2">
        <div className="flex m-2 mt-4  ">
                    <div className="logo m-auto">
            <Link to="/">
              <img src={logo} className="w-60 h-16" alt="logo"></img>
            </Link>

            
          </div>
        </div>
        <nav>
          <Link
            to="/doctor/dashboard"
            onClick={() => setToggle("Dashboard")}
            className={
              Toggle === "Dashboard" ? "text-gray-900" : "text-gray-400"
            }
          >
            <div className="flex m-2 mt-8 ">
              <div className="w-6 ml-4  ">
                <img src={dashboard} alt="dashbord"></img>
              </div>
              <div className="text-lg font-bold ml-4">
                <h1>Home</h1>
              </div>
            </div>
          </Link>

          <Link
            to="/doctor/addDiagno"
            onClick={() => setToggle("Reports")}
            className={Toggle === "Reports" ? "text-gray-900" : "text-gray-400"}
          >
            <div className="flex m-2 mt-6  ">
              <div className="w-6 ml-4  ">
                <img src={reports} alt="report"></img>
              </div>
              <div className="text-lg font-bold ml-4">
                <h1>Add New Diagnosis</h1>
              </div>
            </div>
          </Link>

          <div className="p-4">
            <h1 className=" font-bold text-xl mt-4">Main menu</h1>
            <div className="grid grid-rows-2 gap-4 font-bold  mt-4">
              <Link
                to="/doctor/profile"
                onClick={() => setToggle("Patient_profile")}
                className={
                  Toggle === "Patient_profile"
                    ? "text-gray-900"
                    : "text-gray-400"
                }
              >
                <div className="flex p-2">
                  <img
                    src={patient_profile}
                    className="w-6"
                    alt="profile"
                  ></img>
                  <h1 className="text-lg ml-4">My Profile</h1>
                </div>
              </Link>
            </div>
          </div>
        </nav>

        <div 
          // className=" w-2/5  "
        >
          <button className="mx-auto mt-56 py-1 px-2 text-white bg-blue-500  rounded font-semibold shadow-sm hover:text-blue-500 border border-blue-500  hover:bg-white font-bold  flex items-center" onClick={logout}>
            <img src={logoutimg} className="h-4 px-2" alt="logout"></img>Logout
          </button>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default DashboardSidebar;
