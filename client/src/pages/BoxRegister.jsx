import React, { useState } from "react";
import data from "../../data.json";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

//owners name, phone, email, place name, full address, price/hour, images, supported sports(cricket, football, baskteball badminton), place description, amenities, rules, refunds and cancellation.

const formInputs = [
  {
    label: "Enter Owners Name",
    placeHolder: "Owners name",
    type: "text",
    name: "ownersName",
  },
  {
    label: "Enter Phone Number",
    placeHolder: "Phone",
    type: "text",
    name: "phone",
  },

  {
    label: "Enter Email",
    placeHolder: "Email",
    type: "text",
    name: "email",
  },
  {
    label: "Enter Place Name",
    placeHolder: "Place Name",
    type: "text",
    name: "placeName",
  },
  {
    label: "Enter Area Name",
    placeHolder: "Tirmulghiri",
    type: "text",
    name: "area",
  },
  {
    label: "Enter City",
    placeHolder: "Hyderabad",
    type: "text",
    name: "city",
  },
  {
    label: "Enter State",
    placeHolder: "Telangana",
    type: "text",
    name: "state",
  },
  {
    label: "Enter Full Address of your box",
    placeHolder: "Address",
    type: "text",
    name: "address",
  },
  {
    label: "Enter Price per hour",
    placeHolder: "Price",
    type: "text",
    name: "price",
  },
  {
    label: "Dimentions of Box (in yards)",
    placeHolder: "400x600",
    type: "text",
    name: "dimentions",
  },
  {
    label: "Open Timings",
    placeHolder: "6am - 10pm",
    type: "text",
    name: "timings",
  },
  {
    label: "Select Supported Sports",
    placeHolder: "",
    type: "select",
    name: "sports",
  },
  {
    label: "Enter Description for your box",
    placeHolder: "Description",
    type: "textarea",
    name: "description",
  },
  {
    label: "Enter Rules",
    placeHolder: "Rules",
    type: "textarea",
    name: "rules",
  },
  {
    label: "Enter Your Refund and Cancellation Policy",
    placeHolder: "Policy",
    type: "textarea",
    name: "refundPolicy",
  },
];

const animatedComponents = makeAnimated();
export default function BoxRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ownersName: "",
    phone: "",
    email: "",
    placeName: "",
    city: "",
    state: "",
    address: "",
    price: "",
    sports: [],
    description: "",
    rules: "",
    refundPolicy: "",
    dimentions: "",
    timings: "",
  });
  const [showGoToOwner, setShowGoToOwner] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOptions) => {
    setFormData((prevData) => ({
      ...prevData,
      sports: selectedOptions,
    }));
    return;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // return;
    if (formData.ownersName.length <= 2)
      return toast.error("Enter a valid name");
    if (formData.phone.length !== 10)
      return toast.error("Enter a valid Phone Number");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return toast.error("Invalid Email Error");
    if (formData.placeName.length < 5)
      return toast.error("Place name should be atleast 5 characters");
    if (formData.address.length < 5) return toast.error("Invalid Box Address");
    if (!/^\d+$/.test(formData.price)) return toast.error("Invalid Price");
    if (formData.dimentions.length < 5)
      return toast.error(
        "Please make sure that the dimentions are in AxB format"
      );

    if (formData.sports.length < 1)
      return toast.error("Select atleast one sport for your box.");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}box/registerbox`,
        { token: Cookies.get("token"), data: formData }
      );
      toast.success(response.data.message);
      setShowGoToOwner(true);
    } catch (error) {
      console.log(error);
      toast.error("Internal Server Error");
    }
  };

  return (
    <>
      {showGoToOwner && (
        <div className="fixed top-20 flex justify-center pt-36 bg-[#00000043] h-full w-full">
          <div className="bg-white rounded-xl h-32 gap-4 px-5 flex flex-col items-center py-7">
            <p>Your Box was Successfully Registered to our platform</p>
            <button
              onClick={() => navigate("/owner/portal")}
              className="bg-[#FF6B35] font-medium px-7 text-white py-1"
            >
              Go to Owners Portal
            </button>
          </div>
        </div>
      )}
      <div className="mx-24 py-14">
        <h1 className="text-2xl font-semibold ">
          Hello! Fill out the form to Register your Box
        </h1>
        <div className="flex gap-2">
          <div className="flex-1 mt-5">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-start gap-3"
            >
              {formInputs.map((e, i) => (
                <div key={i} className="flex flex-col items-start gap-1 w-full">
                  <label htmlFor="" className="text-lg font-medium">
                    {e.label}
                  </label>
                  {e.type === "select" ? (
                    <Select
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      defaultValue={[data.SportTypesValues[0]]}
                      value={formData.sports}
                      name={e.name}
                      onChange={handleSelectChange}
                      isMulti
                      options={data.SportTypesValues}
                    />
                  ) : e.type === "text" ? (
                    <div className="w-full">
                      <input
                        className="w-full border outline-none border-slate-800 rounded px-2 py-1"
                        type={e.type}
                        value={formData[e.name]}
                        onChange={handleInputChange}
                        placeholder={e.placeHolder}
                        name={e.name}
                      />
                      {e.name === "timings" ? (
                        <p className="text-sm text-red-500 font-medium">
                          Enter 12am - 12am if open for 24 hours.
                        </p>
                      ) : null}
                    </div>
                  ) : (
                    <textarea
                      name={e.name}
                      placeholder={e.placeHolder}
                      value={formData[e.name]}
                      onChange={handleInputChange}
                      id=""
                      className="w-full border border-slate-800 rounded px-2 py-1 outline-none resize-none"
                      rows="10"
                    ></textarea>
                  )}
                </div>
              ))}
              <div className="">
                <button
                  className="px-10 py-1 bg-[#FF6B35] mx-[40%] text-xl text-white rounded"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
          <div className="flex-1">
            <div className="m-10 bg-white rounded-lg p-3">
              <h1 className="text-center text-xl font-semibold">Our Policy</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
