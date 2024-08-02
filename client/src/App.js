import { Routes, Route } from "react-router-dom";
import Form from "./components/Form";
import UserInfos from "./components/UserInfos";




function App() {
  return (
    <div className="text-sm lg:text-lg flex flex-col items-center mt-16">
      <Routes>
        <Route path="/" element={<UserInfos />} />
        <Route path="/login" element={<Form type="login" />} />
        <Route path="/register" element={<Form type="signup" />} />
      </Routes>
    </div>
  );
}

export default App;
