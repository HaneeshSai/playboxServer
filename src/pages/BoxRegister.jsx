import React, { useState } from "react";
import data from "../../data.json";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import toast from "react-hot-toast";

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
  const [formData, setFormData] = useState({
    ownersName: "",
    phone: "",
    email: "",
    placeName: "",
    address: "",
    price: "",
    sports: [],
    description: "",
    rules: "",
    refundPolicy: "",
    dimentions: "",
  });

  const [selectedSports, setSelectedSports] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOptions) => {
    setSelectedSports(selectedOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData.sports);
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

    if (selectedSports.length < 1)
      return toast.error("Select atleast one sport for your box.");
    console.log(selectedSports.map((e) => e.value));

    setFormData((prevState) => ({
      ...prevState,
      sports: selectedSports.map((e) => e.value),
    }));

    console.log(formData);

    toast.success("right");
  };

  return (
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
                <label htmlFor="">{e.label}</label>
                {e.type === "select" ? (
                  <Select
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    defaultValue={[data.SportTypesValues[0]]}
                    value={selectedSports}
                    name={e.name}
                    onChange={handleSelectChange}
                    isMulti
                    options={data.SportTypesValues}
                  />
                ) : e.type === "text" ? (
                  <input
                    className="w-full border outline-none border-slate-800 rounded px-2 py-1"
                    type={e.type}
                    value={formData[e.name]}
                    onChange={handleInputChange}
                    placeholder={e.placeHolder}
                    name={e.name}
                  />
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
            <button className="" onClick={handleSubmit}>
              Submit
            </button>
          </form>
        </div>
        <div className="flex-1">
          <div className="m-10 bg-white rounded-lg p-3">
            <h1 className="text-center text-xl font-semibold">Our Policy</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
