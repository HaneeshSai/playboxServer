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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center">
            <p className="mb-4">Your Box was Successfully Registered to our platform</p>
            <button
              onClick={() => navigate("/owner/portal")}
              className="bg-[#FF6B35] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#FF6B35]/90 transition-colors"
            >
              Go to Owner's Portal
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-8">
          Hello! Fill out the form to Register your Box
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {formInputs.map((input, index) => (
                <div key={index} className="space-y-2">
                  <label className="text-lg font-medium block">
                    {input.label}
                  </label>
                  {input.type === "select" ? (
                    <Select
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      defaultValue={[data.SportTypesValues[0]]}
                      value={formData.sports}
                      name={input.name}
                      onChange={handleSelectChange}
                      isMulti
                      options={data.SportTypesValues}
                      className="w-full"
                    />
                  ) : input.type === "text" ? (
                    <div className="w-full">
                      <input
                        className="w-full px-3 py-2 border border-slate-800 rounded outline-none"
                        type={input.type}
                        value={formData[input.name]}
                        onChange={handleInputChange}
                        placeholder={input.placeHolder}
                        name={input.name}
                      />
                      {input.name === "timings" && (
                        <p className="text-sm text-red-500 font-medium mt-1">
                          Enter 12am - 12am if open for 24 hours.
                        </p>
                      )}
                    </div>
                  ) : (
                    <textarea
                      name={input.name}
                      placeholder={input.placeHolder}
                      value={formData[input.name]}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-800 rounded outline-none resize-none"
                      rows="6"
                    />
                  )}
                </div>
              ))}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-2 bg-[#FF6B35] text-white text-lg rounded-lg hover:bg-[#FF6B35]/90 transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>

          <div className="lg:pl-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-center">Our Policy</h2>
              {/* Add policy content here */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
