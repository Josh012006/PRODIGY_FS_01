import { Link, useNavigate } from "react-router-dom";
import Input from "./Input";

import { useState } from "react";





// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'

// Import the Image EXIF Orientation and Image Preview plugins
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import ErrorAlert from "./ErrorAlert";
import Loader from "./Loader";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)





function Form ({type}) {


    const [file, setFile] = useState(null);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const navigate = useNavigate();




    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setError("");
            setLoading(true);

            const formData = new FormData(e.target);

            if(type === "login") {
                const response = await fetch("/api/login", {
                    method: "POST",
                    body: formData
                });

                if(response.status === 404) {
                    setError("User not found");
                    setLoading(false);
                    return;
                }
                else if(response.status === 500) {
                    throw new Error("An error occured while logging in. Please try again later.");
                }
                else if(response.status === 200) {
                    console.log("User logged in successfully");
                    setLoading(false);
                    navigate("/");
                    return;
                }
            }
            else {

                if(formData.get("password") !== formData.get("confirmPassword")) {
                    setError("Passwords do not match");
                    setLoading(false);
                    return;
                }
                
                
                formData.append("picture", file[0]);
                console.log(file[0]);

                const date = `${formData.get("day")}/${formData.get("month")}/${formData.get("year")}`;
                formData.set("dateOfBirth", date);

                const response = await fetch("/api/register", {
                    method: "POST",
                    body: formData
                });
                
                if(response.status === 409) {
                    setError("User already exists");
                    setLoading(false);
                    return;
                }
                else if(response.status === 500) {
                    throw new Error("An error occured while registering. Please try again later.");
                }
                else if(response.status === 201) {
                    console.log("User registered successfully");
                    setLoading(false);
                    navigate("/");
                    return;
                }
            }

        } catch (error) {
            setLoading(false);
            console.log(error);
            setError("An error occured while submitting the form. Please try again later.");
            return;
        }
    }


    return (
        <>
            <h1 className="text-center text-xl lg:text-3xl font-bold my-5">{(type === "login")? "Login to your account" : "Create a new account"}</h1>
            {error && <ErrorAlert>{error}</ErrorAlert>}
            {loading && <Loader color="#000" size={40} />}
            <form id="myForm" className="mx-auto flex flex-col my-5 w-11/12 lg:w-1/4 " onSubmit = {handleSubmit} encType="multipart/form-data">
                {(type === "signup") && <>
                    <Input id="username" type="text" placeholder="Username" label="Username" />
                    <Input id="name" type="text" placeholder="John Doe" label="Name" />
                    <br />
                </>}
                <Input id="email" type="email" placeholder="example@gmail.com" label="Email" />
                <Input id="password" type="password" placeholder="Password" label="Password" />
                {(type === "signup") && <>
                    <Input id="confirmPassword" type="password" placeholder="Confirm password" label="Password Confirmation" />
                    <br />
                    <Input id="phone" type="tel" placeholder="0221-12-345-67-89" label="Phone Number" />
                    <Input id="address" type="text" placeholder="Address" label="Address" />
                    <Input id="sex" type="text" placeholder="Male for example" label="Gender" />
                    <label className="my-2 font-bold">Date of Birth</label>
                    <div className="grid grid-cols-4 gap-4 items-center p-2">
                        <Input className="col-span-1" id="day" type="number" placeholder="DD" min={1} max={31} />
                        <Input className="col-span-1" id="month" type="number" placeholder="MM" min={1} max={12} />
                        <Input className="col-span-2" id="year" type="number" placeholder="YYYY" max={new Date().getUTCFullYear()} />
                    </div>
                    <br />
                    <label className="my-2 font-bold">Profile Picture</label>
                    <FilePond
                        files={file}
                        onupdatefiles={(fileItems) => {
                            setFile(fileItems.map((fileItem) => fileItem.file));
                        }}
                        allowMultiple={false}
                        maxFiles={1}
                        required
                        name="file" /* sets the file input name, it's filepond by default */
                        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                    />
                </>}

                <button className="rounded-lg p-2 mx-auto my-4 min-w-28 hover:bg-gray-900 lg:text-base text-white bg-black" form="myForm" type="submit">Submit</button>
                <p>{(type === "login")? "Don't have an account yet?" : "Already have an account?"} <Link onClick={() => {setError('')}} to={(type === "login")? "/register" : "/login"} className="text-blue-800">{(type === "login")? "Sign up!" : "Login!"}</Link></p>
            </form>
        </>
    )
}



export default Form;