import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import profile from "../../assets/img/landingPage/profile.png";
import doctor from "../../assets/img/landingPage/doctor.png";
import patient from "../../assets/img/landingPage/patient1.png";
import ReactLoading from "react-loading";

const ethers = require("ethers")

export default function Login(props) {
  const navigate = useNavigate();
  const [Loading, setLoading] = useState(false);
  const [Toggle, setToggle] = useState("Patient");
  const [error, setError] = useState("");
  const [data, setData] = useState({ userID: "", password: "", metaAccount: ""});
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const [metaAccount, setMetaAccount] = useState(''); // meta mask account
  const [userMgmtContract, setUserMgmtContract] = useState(null);
  const [fileMgmtContract, setFileMgmtContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  

  useEffect(() => {
    const auth = async () => {
      const res = await fetch("/auth");
      const data = await res.json();
      if (data.msg === "Doctor Login Found") {
        navigate("/doctor/dashboard");
      }
      if (data.msg === "Hospital Login Found") {
        navigate("/admin/dashboard");
      }
      if (data.msg === "Patient Login Found") {
        navigate("/patient/dashboard");
      }
    };
    auth();
  }, []);

  const handlePatientLogin = async (abhaID, password, metaAccount) => {
    setLoading(true);
    console.log("Pressed Login")
    try {
      data.userID = abhaID;
      data.password = ethers.utils.formatBytes32String(password);
      data.metaAccount = metaAccount;
      data.role = "Patient";
      console.log(data);

      const res = await userMgmtContract.loginPatient(data.password);
      console.log(res);

      if (res.errors) {
        setLoading(false);
        props.settoastCondition({
          status: "error",
          message: "Please Enter all fields correctly!",
        });
        props.setToastShow(true);
      } 
      else {
        setLoading(false);
        props.settoastCondition({
          status: "success",
          message: "Logged in Successfully!",
        });
        props.setToastShow(true);
        navigate("/patient/dashboard");
      }

		} catch (error) {
        setLoading(false);
        console.log(error.data.data.reason);
        window.alert(error.data.data.reason);
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 400
			) {
				setError(error.response.data.message);
			}
		}
  };

  const handleDoctorLabHospitalLogin = async (email, password, metaAccount, path, role) => {
    setLoading(true);
    console.log("Pressed Login")
    try {
      data.userID = email;
      data.password = ethers.utils.formatBytes32String(password);
      data.metaAccount = metaAccount;
      data.role = role;
      console.log(data);
      
      var res = null;
      switch (role) {
        case "Doctor":
          res = await userMgmtContract.loginDoctor(data.password);
          break;
        case "Hospital":
          res = await userMgmtContract.loginHospital(data.password);
          break;
        case "Lab":
          res = await userMgmtContract.loginLab(data.password);
          break;
      }

      console.log(res);

      if (res.errors) {
        setLoading(false);
        props.settoastCondition({
          status: "error",
          message: "Please Enter all fields correctly!",
        });
        props.setToastShow(true);
      } 
      else {
        setLoading(false);
        props.settoastCondition({
          status: "success",
          message: "Logged in Successfully!",
        });
        props.setToastShow(true);
        navigate(path);
      }

		} catch (error) {
        setLoading(false);
        console.log(error.data.data.reason);
        window.alert(error.data.data.reason);
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 400
			) {
				setError(error.response.data.message);
			}
		}
  };

  const handleAdminLogin = async (email, password, metaAccount, path, role) => {
    setLoading(true);
    setLoading(false);
    props.settoastCondition({
      status: "success",
      message: "Logged in Successfully!",
    });
    props.setToastShow(true);
    navigate(path);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    switch (Toggle) {
      case "Patient":
        handlePatientLogin(username, password, metaAccount);
        break;
      case "Doctor":
        handleDoctorLabHospitalLogin(username, password, metaAccount, "/doctor/dashboard", Toggle);
        break;
      case "Hospital":
        handleDoctorLabHospitalLogin(username, password, metaAccount, "/hospital/dashboard", Toggle);
        break;
      case "Lab":
        handleDoctorLabHospitalLogin(username, password, metaAccount, "/lab/dashboard", Toggle);
        break;
      case "Admin":
        handleAdminLogin(username, password, metaAccount, "/admin/dashboard", Toggle);
        break;
      default:
        break;
    }
  };
  
  const getAccount = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    if(provider){
      try {
        if(metaAccount != ''){
          setMetaAccount('');
          console.log("Meta Mask Account Removed", metaAccount);
        }
        else{
          
          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });
  
          window.ethereum.on("accountsChanged", () => {
            window.location.reload();
          });

          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const address = await signer.getAddress();

          const fileAbi = require("../../components/landingPage/contracts/FileManagement.json");
          const userAbi = require("../../components/landingPage/contracts/UserManagement.json");
          let userMgmtContractAddress = "0xA2cB172f07cfd5a50eB5e13Ec87d60CfdB682D05";
          let fileMgmtContractAddress = "0x79c3Ae6486b7acE1B225c2CFf4ce6178A4471ce9";

          const userMgmtContract = new ethers.Contract(
            userMgmtContractAddress,
            userAbi,
            signer
          );

          const fileMgmtContract = new ethers.Contract(
            fileMgmtContractAddress,
            fileAbi,
            signer
          );

          setFileMgmtContract(fileMgmtContract);
          setUserMgmtContract(userMgmtContract);
          setProvider(provider);
          const res = await userMgmtContract.retrive();
          setMetaAccount(res);
          console.log(address);
          console.log(userMgmtContract);
          console.log(fileMgmtContract);

        }
      } catch (err) {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          console.log('Please connect to MetaMask.');
        } else {
          console.error(err);
        }
      }
    }
    else{
      console.error("Metamask is not installed");
    }
  };

  return (
    <div className="bg-white flex flex-col justify-items-center items-center py-1 px-4 rounded shadow-xl lg:w-3/4 w-full my-7 ml-auto ">
      <h1 className="text-4xl font-bold text-primary py-1">
        Login
      </h1>
      <div className="flex bg-blue-100 w-fit justify-between rounded mt-4">
        <button
          className={
            Toggle === "Patient"
              ? "py-2 px-6 text-lg  font-semibold cursor-pointer rounded bg-blue-400"
              : "py-2 px-6 text-lg  font-medium text-primary cursor-pointer rounded"
          }
          onClick={() => {
            setToggle("Patient");
            setUsername("");
            setPassword("");
            setUsernameError("");
            setPasswordError("");
          }}
        >
          Patient
        </button>
        <button
          onClick={() => {
            setToggle("Doctor");
            setUsername("");
            setPassword("");
            setUsernameError("");
            setPasswordError("");
          }}
          className={
            Toggle === "Doctor"
              ? "py-2 px-6 text-lg  font-semibold cursor-pointer rounded bg-blue-400"
              : "py-2 px-6 text-lg  font-medium text-primary cursor-pointer rounded"
          }
        >
          Doctor
        </button>
        
        <button
          onClick={() => {
            setToggle("Lab");
            setUsername("");
            setPassword("");
            setUsernameError("");
            setPasswordError("");
          }}
          className={
            Toggle === "Lab"
              ? "py-2 px-6 text-lg  font-semibold cursor-pointer rounded bg-blue-400"
              : "py-2 px-6 text-lg  font-medium text-primary cursor-pointer rounded"
          }
        >
          Lab
        </button>

        <button
          onClick={() => {
            setToggle("Hospital");
            setUsername("");
            setPassword("");
            setUsernameError("");
            setPasswordError("");
          }}
          className={
            Toggle === "Hospital"
              ? "py-2 px-6 text-lg  font-semibold cursor-pointer rounded bg-blue-400"
              : "py-2 px-6 text-lg  font-medium text-primary cursor-pointer rounded"
          }
        >
          Hospital
        </button>

        <button
          onClick={() => {
            setToggle("Admin");
            setUsername("");
            setPassword("");
            setUsernameError("");
            setPasswordError("");
          }}
          className={
            Toggle === "Admin"
              ? "py-2 px-6 text-lg  font-semibold cursor-pointer rounded bg-blue-400"
              : "py-2 px-6 text-lg  font-medium text-primary cursor-pointer rounded"
          }
        >
          Admin
        </button>

      </div>

      <div>
        {Toggle === "Patient" ? (
          <img className="h-20 my-6 border-2" src={patient} alt="Patient Image" />
        ) : Toggle === "Doctor" ? (
          <img className="h-20 my-6 border-2" src={doctor} alt="Doctor Image" />
        ) : (
          <img className="h-20 my-6 border-2" src={profile} alt="Default Image" />
        )}
      </div>

      <form className="flex flex-col w-full px-8" onSubmit={handleLogin}>
        <label htmlFor="email" className=" pt-1 pb-1 text-lg font-bold">
          {Toggle === "Patient" ? "Abha ID" : "Email"}
        </label>
        <input
          type = {Toggle === "Patient" ? "text" : "email"}
          name="username"
          id="username"
          className=" px-3 py-2 bg-blue-100 rounded outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <span className="text-sm text-red-400">{usernameError}</span>
        <label
          htmlFor="password"
          className=" pt-6 pb-1 text-lg font-bold"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          className=" px-3 py-2 bg-blue-100 rounded outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <span className="text-sm text-red-400">{passwordError}</span>

        <div className="pt-4">
          <input
            onClick={getAccount}
              className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-blue-400 checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-blue-400 checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-blue-400 checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-blue-400 dark:checked:after:bg-blue-400 dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckDefault02"
              required
           />
          <label
              className="inline-block pl-[0.15rem] hover:cursor-pointer text-semibold"
              htmlFor="flexSwitchCheckDefault"
          >Connect to MetaMask Wallet</label>
           {metaAccount}
      </div>

        {Loading ? (
          <div className="flex justify-center items-center py-3">
            <ReactLoading
              type={"bubbles"}
              color={"color"}
              height={"10%"}
              width={"10%"}
            />
          </div>
        ) : (
          <button
            type="submit"
            className="text-lg mt-3  bg-blue-400 py-1 px-3 rounded font-semibold  shadow-sm hover:bg-blue-100"
          >
            Login
          </button>
        )}
      </form>
      <h1 className=" text-base pt-3">
        New User? <Link to="/Register" className="text-green-400">Register here</Link>
      </h1>
    </div>
  );
}
