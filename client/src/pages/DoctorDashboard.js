import doctor_profile from "../assets/img/dashboard/doctor2.png";
import reports from "../assets/img/dashboard/report2_pbl.png";
import search from "../assets/img/dashboard/search2.png";
import Footer from "../components/landingPage/Footer";
import eye from "../assets/img/dashboard/eye.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { UserContractObj, FileContractObj, MetaAccountObj } from "../GlobalData/GlobalContext";
import add_pre_logo from "../assets/img/dashboard/add_prescription_logo.png";
import { Table, Input, Button, Select } from 'antd';
const ethers = require("ethers")
const { Option } = Select;

const DoctorDashboard = (props) => {
  const { userMgmtContract, setUserMgmtContract } = UserContractObj();
  const { fileMgmtContract, setFileMgmtContract } = FileContractObj();
  const [Loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [dob, setDob] = useState("");
  const { metaAccount, setMetaAccount } = MetaAccountObj(); // meta mask account
  const [prescriptions, setPrescriptions] = useState([{}]);
  const [patient, setPatient] = useState({
    username: "tom",
    passwordHash: "tom123",
    name: {
      firstName: "tom",
      middleName: "Brady",
      lastName: "Nolan",
    },
    dob: "05/03/1975",
    mobile: "1234567890",
    email: "sdks",
    adharCard: "1676253",
    abhaId: "7154121",
    bloodGroup: "A+",
    patAddress: {
      building: "aksj",
      city: "msknxjs",
      taluka: "sndjs",
      district: "sxjsx",
      state: "snxjs",
      pincode: "12345",
    },
    contactPerson: {
      name: {
        firstName: "djcnjd",
        middleName: "dnjf",
        lastName: "dmckcnj",
      },
      mobile: "9837919102",
      email: "dif@gmail.com",
      relation: "jndjs",
      conAddress: {
        building: "bhdbc",
        city: "nhxbd",
        taluka: "snhbdh",
        district: "dncbd",
        state: "dnjcnhd",
        pincode: "dncdbh",
      },
    },
  });
  const [doctor, setDoctor] = useState({
    name: {
      firstName: "",
      middleName: "",
      lastName: "",
    },
    emergencyno: "",
    dob: "",
    mobile: "",
    email: "",
    adharCard: "",
    bloodGroup: "",
    education: "",
    address: {
      building: "",
      city: "",
      taluka: "",
      district: "",
      state: "",
      pincode: "",
    },
    specialization: {},
    password: "",
    username: ""
  });

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Contact',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: 'Blood Group',
      dataIndex: 'bloodgroup',
      key: 'bloodgroup',
    },
    {
      title: 'Date Of Birth',
      dataIndex: 'dob',
      key: 'dob',
    },
    {
      title: 'Record Type',
      dataIndex: 'recordType',
      key: 'recordType',
      render: (text, record) => (
        <Select
          value={text}
          style={{ width: 150 }}
          onChange={(value) => handleStatusChange(record.key, value)}
        >
         <Option value="" >Lab Reports</Option>
          <Option value="labReports">Lab Reports</Option>
          <Option value="prescriptionReports">Diagnostics Reports</Option>
          <Option value="dischargeReports">Discharge Reports</Option>
          <Option value="prescriptionReports">Prescription Reports</Option>
        </Select>
      ),
    },
    {
      title: 'Consent',
      dataIndex: 'consent',
      key: 'consent',
      render: (text, record) => (
        <Button className="bg-blue-400 hover:bg-white border border-blue-400" onClick={() => handleConsentClick(record.key)}>Request Consent</Button>
      ),
    },
  ];

  const patientData = [{
    firstName:'abc',
    lastName: 'def',
    contact: '9378273527',
    bloodgroup: 'O+',
    dob: '05/04/1998'
  },]

  const handleConsentClick = (key) => {
    // Do something with the clicked row's key
    console.log(`Button clicked for row with key: ${key}`);
  };

  const handleStatusChange = (key, value) => {
    // Do something with the selected status value
    console.log(`Status changed to ${value} for row with key: ${key}`);
  };

  const convertDatetoString = (dateString) => {
    let date = new Date(dateString);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    async function getdoctor() {
      const data = await userMgmtContract.getDoctorInfo();
      console.log(data);
      var doctortObj = JSON.parse(data);
      setDoctor(doctortObj);
    }

    async function getpatient() {
      const data = await userMgmtContract.getPatientObjs();
      console.log(data);
      var patientObj = JSON.parse(data);
      setPatient(patientObj);
    }

    getdoctor();
    getpatient();
  }, [dob]);

  const searchPatient = async (e) => {
    e.preventDefault();
    if (props.healthID.length === 12) {
      setLoading(true);
      const res = await fetch(`/searchpatient/${props.healthID}`);
      const data = await res.json();

      if (data.AuthError) {
        setLoading(false);
        props.settoastCondition({
          status: "info",
          message: "Please Login to proceed!!!",
        });
        props.setToastShow(true);
        navigate("/");
      } else if (data.error) {
        setLoading(false);
        props.settoastCondition({
          status: "error",
          message: "This HealthID doesn't exits!!!",
        });
        props.setToastShow(true);
      } else {
        setPatient(data.patient);
        if (data.patient.prescriptions) {
          setPrescriptions(data.patient.prescriptions.reverse());
        }
        setDob(convertDatetoString(patient.dob));
        setLoading(false);
      }
    } else {
      props.settoastCondition({
        status: "warning",
        message: "Please Enter 12 Digit HealthID !!!",
      });
      props.setToastShow(true);
    }
  };
  const [typeOfFile, setTypeOfFile] = useState("");
  const [reqAccessDetails, setReqAccessDetails] = useState({
    doctor: metaAccount,
    doctorName: "Dr. " + doctor.name.firstName + " " + doctor.name.lastName,
    hospital: doctor.org,
    speciality: doctor.specialization.special,
    typeofFile: "",
  });

  const handleReqAcess = async (e) => {
    e.preventDefault();
    try {
      const reqAcessDetailsData = reqAccessDetails;
      reqAcessDetailsData.typeofFile = typeOfFile;
      const reqData = JSON.stringify(reqAcessDetailsData);
      console.log("reqAcess data sent: ", reqData)
      const data = await fileMgmtContract.reqAccess(metaAccount, reqData);
      if (data.errors) {
        props.settoastCondition({
          status: "error",
          message: "Failed to send Access Request., check network!",
        });
        console.log(data.errors)
        props.setToastShow(true);
      }
      else {
        props.settoastCondition({
          status: "success",
          message: "Request Acess Sent Successfully!",
        });
        props.setToastShow(true);
        navigate("/doctor/dashboard");
      }
    } catch (error) {
      props.settoastCondition({
        status: "error",
        message: "Failed to send Access Request.",
      });
      props.setToastShow(true);
    }
  }

  return (
    <div className="full-body col-span-10 h-screen">
      <div className="body-without-footer   bg-bgprimary ">
        <div className="main    m-2  ">
          {/* dashboard today start */}
          <div className="">
            <div className="flex  h-12 m-2 bg-bgprimary rounded mt-4 ">
              <div>
                <h1 className="text-2xl  font-bold p-2 ">
                  My Dashboard
                </h1>
              </div>

              <div className="flex ml-20  h-10   ">
                <input
                  placeholder="Search"
                  className="w-96 rounded ml-4 text-xl   pl-4 border focus:outline-none "
                ></input>
                <div className="bg-white pl-2 rounded ">
                  <img src={search} className=" h-6 mt-2  " alt="search"></img>
                </div>
              </div>

              <Link to="/doctor/profile">
                <div className="flex bg-white rounded shadow  px-4  ml-60 h-14 ">
                  <img
                    src={doctor_profile}
                    className="w-12 p-1 rounded-2xl"
                    alt="profile"
                  ></img>
                  <div className="grid grid-rows-2 ml-4 gap-2  mb-4">
                    <div className="font-bold  text-base">
                      <h1 className="">
                        {`Dr. ${doctor.name.firstName} ${doctor.name.lastName}`}
                      </h1>
                    </div>
                    <div className="">

                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          {/* dashboard today end */}

          <form
            onSubmit={searchPatient}
            className="grid grid-cols-9 bg-white rounded p-4 ml-12 mr-8 mt-4 shadow"
          >
            <div className="grid col-start-1 col-span-3">
              <h1 className="text-xl  font-bold p-2 ">
                Search Patient By Health Id :
              </h1>
            </div>
            <div className=" grid col-span-3">
              <input
                placeholder="Health ID"
                className="bg-blue-100 rounded border-2 text-xl   pl-4  focus:outline-none"
                type="number"
                value={props.healthID}
                onChange={(e) => {
                  props.setHealthID(e.target.value);
                }}
              ></input>
            </div>
            {Loading ? (
              <div className="grid col-start-8  h-10 ml-4">
                <ReactLoading
                  type={"bubbles"}
                  color={""}
                  height={"45%"}
                  width={"45%"}
                />
              </div>
            ) : (
              <div className=" grid col-start-8  h-10 ml-4  bg-blue-400  rounded font-semibold  shadow-sm hover:bg-blue-100  ">
                <div className="flex py-2 px-4 items-center ">
                  <img src={search} className=" h-4  " alt="search"></img>
                  <button className="ml-2 flex  rounded font-semibold  shadow-sm hover:bg-blue-100   ">
                    Search
                  </button>
                </div>
              </div>
            )}
            <div className="grid col-start-9  h-10 ml-4  bg-blue-400  rounded font-semibold  shadow-sm hover:bg-blue-100  ">
              <div className="flex py-2 px-4 items-center ">
                <div
                  className="ml-2 flex cursor-pointer rounded font-semibold  shadow-sm hover:bg-blue-100 "
                  onClick={() => {
                    props.setHealthID("");
                  }}
                >
                  Remove
                </div>
              </div>
            </div>
          </form>


          <div className=" m-4  ">
            <div className="flex justify-between m-8">
              <div className="font-bold text-xl ml-4">
                <h1>Patient Dashboard</h1>
              </div>
              <Link to="/doctor/addDiagno">
                <div className=" flex  bg-blue-400 pl-0 pr-3 py-1 items-center justify-items-center  rounded font-semibold  shadow-sm hover:bg-blue-100   ">
                  <img
                    src={add_pre_logo}
                    className="h-3 mx-3"
                    alt="adddiagno"
                  ></img>

                  <button className="font-semibold">Add New Diagnosis</button>
                </div>
              </Link>
            </div>
            <div>
              <Table
                columns={columns}
                dataSource={patientData}
                rowKey="id"
                bordered
                pagination={true} // Optional: If you want to disable pagination
              />
            </div>
            {/*<div className="bg-white m-4 rounded-lg ">
                <div className="grid grid-rows-2 p-6 gap-2 shadow">
                  <div className="grid grid-cols-4 font-bold  border-b-2">
                    <div>
                      <h1>Date</h1>
                    </div>
                    <div>
                      <h1>Doctor Name</h1>
                    </div>
                    <div>
                      <h1>Diagnosis</h1>
                    </div>
                    <div>
                      <h1>Prescription</h1>
                    </div>
                  </div>

                  {prescriptions.length > 0 ? (
                    prescriptions.slice(1, 3).map((prescription) => {
                      return (
                        <div className="grid grid-cols-4">
                          <div>
                            <h1>
                              {convertDatetoString(prescription.createdAt)}
                            </h1>
                          </div>
                          <div className="flex">
                            <h1>Dr. </h1>
                            <h1>{prescription.doctor}</h1>
                          </div>
                          <div>
                            <h1>{prescription.diagnosis}</h1>
                          </div>
                          <Link
                            to="/doctor/prescription"
                            onClick={() =>
                              props.setPrescriptionID(prescription._id)
                            }
                          >
                            <div className=" flex  justify-center bg-blue-400 py-1 px-3 rounded font-semibold  shadow-sm hover:bg-blue-100 w-2/5   ">
                              <img
                                src={eye}
                                className="h-4 my-auto"
                                alt="preview"
                              ></img>
                              <button className="font-bold ml-2">
                                Preview{" "}
                              </button>
                            </div>
                          </Link>
                        </div>
                      );
                    })
                  ) : (
                    <div className="mx-auto mt-3">No Records Found...</div>
                  )}
                </div>
              </div>
                  */}
          </div>
        </div>
      </div>
      {/*<div className="mt-94 mb-0">
        <Footer></Footer>
          </div>*/}
    </div>
  );
};

export default DoctorDashboard;
