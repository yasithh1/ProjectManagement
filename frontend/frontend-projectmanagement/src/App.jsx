import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signin from "./pages/Signin";
import StaffSignin from "./pages/StaffSignin";
import HomePage from "./pages/HomePage";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Map from "./components/Map";
import SendOtp from "./pages/SendOtp";
import ChangePassword from "./pages/ChangePassword";
import SupplierSignin from "./pages/SupplierSignin";
import ProfilePage from "./components/ProfilePage";
import ManageLabors from "./pages/ManageLabors";
import ProposeLocation from "./pages/ProposeLocation";
import Contracts from "./pages/Contracts";
import LaborReport from "./pages/LaborReport";
import LaborRequests from "./pages/LaborRequest";
import LaborSalary from "./pages/Salary";
import Complains from "./pages/Complains";
import DesignDashboard from "./pages/DesignDashboard";
import Designs from "./pages/Designs";
import Assigments from "./pages/Assigments";
import ProjectDashboard from "./pages/ProjectDashboard";
import SupporterRequests from "./pages/SupporterRequests";
import AssignSupporters from "./pages/AssignSupporters";
import SendProcurementRequests from "./pages/SendProcurementRequests";
import ArrangeMeeting from "./pages/ArrangeMeeting";
import ManagerDesignDashboard from "./pages/ManagerDesignDashboard";
import ManagerProjectDashboard from "./pages/ManagerProjectDashboard";
import AssignProject from "./pages/AssignProject";
import ProjectReport from "./pages/ProjectReport";
import ContactSupplier from "./pages/ContactSupplier";
import Invoices from "./pages/Invoices"; 
import QualityCheck from "./pages/QualityCheck";
import Proposal from "./pages/Proposal";
import Locations from "./pages/Locations";
import AssignContracts from "./pages/AssignContracts";
import EnterOtp from "./pages/EnterOtp";
import ManageDesigns from "./pages/ManageDesigns";
import ManageComplains from "./pages/ManageComplains";
import SupplierRegisterSteps from "./pages/SupplierRegister";
import SupplierDashboard from "./pages/SupplierDashboard";
import ProjectAssignments from "./pages/ProjectAssigments";
import AdminDashboard from "./pages/AdminDashboard";
import LoginForm from "./pages/AdminLogin";
import ViewMeetings from "./pages/ViewMeetings";
import IRRCalculator from "./pages/IRRCalculator";
import ProjectResources from "./pages/ProjectResources";
import AssignLabors from "./pages/AssignLabors";
import LaborInvoice from "./pages/LaborInvoice";
import AssignSupporterTask from "./pages/AssignSupporterTask";
import SProfilePage  from "./pages/SProfilePage";
import SupervisorProjects from "./pages/SuppervisorProjects";


function App() {
  const [role, setRole] = useState(localStorage.getItem("role") || null);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sessionStorage.setItem("sessionActive", "true");
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!sessionStorage.getItem("sessionActive")) {
      localStorage.clear();
    }
  }, []);

  const handleSignOut = () => {
    localStorage.clear();
    sessionStorage.removeItem("sessionActive");
    setRole(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="app-container">
        {role && (
          <>
            <Navbar
              setRole={setRole}
              handleSignOut={handleSignOut}
            />
            <Sidebar
              role={role}
              isCollapsed={isSidebarCollapsed}
              toggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)}
            />
          </>
        )}

        <div className={`main-content ${isSidebarCollapsed ? "collapsed" : ""}`}>
          <Routes>
            <Route path="/admin"element={<LoginForm/>}/>
            <Route path="/admin-dashboard"element={<AdminDashboard/>}/>
            <Route path="/" element={<Signin />} />
            <Route path="/sign-in/supplier" element={<SupplierSignin />} />
            <Route
              path="/sign-in/staff"
              element={
                role ? (
                  <Navigate to="/home" />
                ) : (
                  <StaffSignin setRole={setRole} />
                )
              }
            />
            <Route
              path="/home"
              element={role ? <HomePage role={role} /> : <Navigate to="/" />}
            />
            <Route
              path="/home/map"
              element={role ? <Map role={role} /> : <Navigate to="/" />}
            />
            <Route path="/sign-up/supplier" element={<SupplierRegisterSteps/>}/>
            <Route path="/dashboard" element={<SupplierDashboard role={role} setRole={setRole} />} />
            <Route path="/home/map" element={role ? <Map /> : <Navigate to="/" />} />
            <Route path="/send-otp" element={<SendOtp />} />
            <Route path="/enter-otp" element={<EnterOtp/>}/>
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/home/manage-labors" element={<ManageLabors />} />
            <Route path="/home/propose-location" element={<ProposeLocation/>}/>
            <Route path="/home/contracts" element={<Contracts/>}/>
            <Route path="/home/labor-report" element={<LaborReport/>}/>
            <Route path="/home/labor-requests" element={<LaborRequests/>}/>
            <Route path="/home/salary"element={<LaborSalary/>}/>
            <Route path="/home/complains" element={<Complains/>}/>
            <Route path="/home/design-dashboard" element={<DesignDashboard/>}/>
            <Route path="/home/designs" element={<Designs/>}/>
            <Route path="/home/assignments" element={<Assigments/>}/>
            <Route path="/home/Complains" element={<Complains/>}/>
            <Route path="/home/project-dashboard" element={<ProjectDashboard/>}/>
            <Route path="/home/supporter-request" element={<SupporterRequests/>}/>
            <Route path="/home/assign-supporter" element={<AssignSupporters/>}/>
            <Route path="/home/send-procurement-request" element={<SendProcurementRequests/>}/>
            <Route path="/home/manage-designs" element={<ManageDesigns/>}/>
            <Route path="/home/arrange-meeting" element={<ArrangeMeeting/>}/>
            <Route path="/home/manager-design-dashboard" element={<ManagerDesignDashboard/>}/>
            <Route path="/home/manager-project-dashboard" element={<ManagerProjectDashboard/>}/>
            <Route path="/dashboard/invoice" element={<Invoices/>}/>
            <Route path="/home/quality-check" element={<QualityCheck/>}/>
            <Route path="/home/assign-project" element={<AssignProject/>}/>
            <Route path="/home/project-report"element={<ProjectReport/>}/>
            <Route path="/home/contact-supplier" element={<ContactSupplier/>}/>
            <Route path="/home/proposals"element={<Proposal/>}/>
            <Route path="/home/locations"element={<Locations/>}/>
            <Route path="/home/manage-contracts" element={<AssignContracts/>}/>
            <Route path="/home/manage-complain" element={<ManageComplains/>}/>
            <Route path="/home/project-assignments" element={<ProjectAssignments/>}/>
            <Route path="/home/view-meeting"element={<ViewMeetings/>}/>
            <Route path="/home/irr-calculator"element={<IRRCalculator/>}/>
            <Route path="/home/project-resources"element={<ProjectResources/>}/>
            <Route path="/dashboard/invoice"element={<Invoices/>}/>
            <Route path="/home/assign-labors"element={<AssignLabors/>}/>
            <Route path="/home/invoices"element={<LaborInvoice/>}/>
            <Route path="/home/manage-supporter"element={<AssignSupporterTask/>}/>
            <Route path="/Sprofile"element={<SProfilePage/>}/>
            <Route path="/home/project-details"element={<SupervisorProjects/>}/>



          </Routes>
        </div>
      </div>
    </Router>

  );
}

export default App;
