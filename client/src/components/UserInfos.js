import { useEffect, useState } from "react";
import InfosParagraph from "./InfosParagraph";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";




function UserInfos () {
    const [user, setUser] = useState(null); 

    const navigate = useNavigate();


    useEffect(() => {
        async function fetchInfos() {
            try {
                const response = await fetch('/api/fetchInfos');

                if(response.status === 200) {
                    const myUser = await response.json();

                    setUser(myUser);
                }
                else if (response.status === 500) {
                    throw Error("An internal error occurred!");
                }
                else if(response.status === 401) {
                    navigate('/login');
                }
            } catch (error) {
                console.log(error);
                window.location.reload();
            }
        }

        fetchInfos();

    }, [navigate]);


    const handleLogout = async () => {
        try {
            const response = await fetch("/api/logout");

            if(response.status === 200) {
                navigate("/login");
            }
            if(response.status === 500) {
                throw new Error("Internal server error");
            }
        } catch (error) {
            console.error(error);
            window.location.reload();
        }
    }

    return (
        <div className="mx-auto mt-16 w-11/12 lg:w-3/4 flex flex-col">
            {!user && <div className="my-10 mx-auto">
                <Loader color="#000" size={40} />
            </div>}
            {user && <><div className="flex flex-col lg:flex-row items-center justify-center">
                <img className="w-44 h-44 rounded-full" src={`users/${user?.fileName?? "unknown.png"}`} alt="profile" />
                <h1 className="text-center text-xl lg:text-3xl my-4">Welcome, {user.username?? ""}! Your information is kept here with the utmost security🔐!</h1>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 justify-items-center my-5">
                <InfosParagraph field="Name" value={user?.name?? ""} />
                <InfosParagraph field="Email" value={user?.email?? ""} />
                <InfosParagraph field="Phone" value={user?.phone?? ""} />
                <InfosParagraph field="Address" value={user?.address?? ""} />
                <InfosParagraph field="Gender" value={user?.sex?? ""} />
                <InfosParagraph field="Date of Birth" value={user?.dateOfBirth?? ""} />
            </div>
            <button className="rounded-lg p-2 mx-auto my-4 min-w-28 hover:bg-gray-900 lg:text-base text-white bg-black" onClick={handleLogout} type="button">Logout</button></>}
        </div>
    )
}



export default UserInfos;