import React from 'react';
import '../style/Sidebar.css';
import emailIcon from '../assets/email.jpg';

function Sidebar({ isCollapsed, toggleSidebar }) {
  const role = localStorage.getItem('role');

  // Explicitly declare all role-based links
  const roleLinks = {
    admin: [
      { name: 'Register', icon: 'person_add', href: '/home/registration' },
      { name: 'Update', icon: 'sync', href: '/home/update' },
      { name: 'View Meetings', icon: 'event', href: '/home/view-meeting' },
      { name: 'Remove', icon: 'delete_forever', href: '/home/remove' },
    ],
    propertyTeam: [
      { name: 'View Meetings', icon: 'event', href: '/home/view-meeting' },
      { name: 'Propose Location', icon: 'place', href: '/home/propose-location' },
      { name: 'Map', icon: 'public', href: '/home/map' },
    ],
    lawyer: [
      { name: 'View Meetings', icon: 'event', href: '/home/view-meeting' },

      { name: 'Map', icon: 'gavel', href: '/home/map' },
    ],
    propertyManager: [
      { name: 'View Meetings', icon: 'event', href: '/home/view-meeting' },
      { name: 'Map', icon: 'location_on', href: '/home/map' },
      { name: 'Locations', icon: 'business', href: '/home/locations' },
      { name: 'Proposals', icon: 'description', href: '/home/proposals' },
      { name: 'Contracts', icon: 'receipt', href: '/home/contracts' },
    ],
    procurementManager: [
      { name: 'View Meetings', icon: 'event', href: '/home/view-meeting' },
      { name: 'Manage Labor', icon: 'supervisor_account', href: '/home/manage-labors' },
      { name: 'Assign Labor', icon: 'assignment_ind', href: '/home/assign-labors' },
      { name: 'Salary', icon: 'attach_money', href: '/home/Salary' },
      { name: 'Requests', icon: 'question_answer', href: '/home/requests' },
      { name: 'Report', icon: 'assessment', href: '/home/labor-report' },
      { name: 'Invoices', icon: 'assessment', href: '/home/invoices' },
    ],
    designer: [
      { name: 'View Meetings', icon: 'event', href: '/home/view-meeting' },
      { name: 'Design Dashboard', icon: 'dashboard', href: '/home/design-dashboard' },
      { name: 'Designs', icon: 'palette', href: '/home/designs' },
      { name: 'Assignments', icon: 'assignment', href: '/home/assignments' },
      { name: 'Map', icon: 'map', href: '/home/map' },
      { name: 'Complains', icon: 'report_problem', href: '/home/complains' },
    ],
    engineer: [
      { name: 'View Meetings', icon: 'event', href: '/home/view-meeting' },
      { name: 'Project Dashboard', icon: 'build', href: '/home/project-dashboard' },
      { name: 'Assignments', icon: 'assignment_turned_in', href: '/home/project-assignments' },
      { name: 'Contact Supplier', icon: 'contact_phone', href: '/home/contact-supplier' },
      { name: 'Complains', icon: 'warning', href: '/home/complains' },
      { name: 'Requests', icon: 'send', href: '/home/supporter-request' },
      { name: 'Assign Supporters', icon: 'person_add', href: '/home/assign-supporter' },
      { name: 'Send Procurement Request', icon: 'send', href: '/home/send-procurement-request' },
      { name: 'Manage Supporter', icon: 'manage', href: '/home/manage-supporter' },

    ],
    designManager: [
      { name: 'View Meetings', icon: 'event', href: '/home/view-meeting' },
      { name: 'IRR Calculator', icon: 'calculate', href: '/home/irr-calculator' },
      { name: 'Design Dashboard', icon: 'dashboard_customize', href: '/home/design-dashboard' },
      { name: 'Manage Designs', icon: 'layers', href: '/home/manage-designs' },
      { name: 'Arrange Meeting', icon: 'event', href: '/home/arrange-meeting' },
      { name: 'Report', icon: 'bar_chart', href: '/home/report' },
      { name: 'Contracts', icon: 'receipt', href: '/home/manage-contracts' },
      { name: 'Manage Complain', icon: 'feedback', href: '/home/manage-complain' },
      
    ],
    projectManager: [
      { name: 'View Meetings', icon: 'event', href: '/home/view-meeting' },
      { name: 'IRR Calculator', icon: 'calculate', href: '/home/irr-calculator' },
      { name: 'Project Dashboard', icon: 'dashboard', href: '/home/project-dashboard' },
      { name: 'Quality Check', icon: 'check_circle', href: '/home/quality-check' },
      { name: 'Assign Projects', icon: 'assignment', href: '/home/assign-projects' },
      { name: 'Manage Complain', icon: 'feedback', href: '/home/manage-complain' },
      { name: 'Reports', icon: 'bar_chart', href: '/home/reports' },
      { name: 'Map', icon: 'public', href: '/home/map' },
    ],
    supplier: [
      { name: 'Dashboard', icon : 'home', href: '/dashboard'},
      { name: 'Supplier Contracts', icon: 'dashboard', href: '/dashboard/supplier-contracts' },
      { name: 'Upload Items', icon: 'receipt', href: '/dashboard/invoices' },
      { name: 'View Reviews', icon: 'check_circle', href: '/dashboard/quality-check' },
      
      { name: 'suppliment Invoice', icon: 'report', href: '/dashboard/invoice' },

    ],
  };

  // Get the links for the current role or an empty array
  const links = roleLinks[role] || [];

  return (
    <div className={`sidebar-container ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="logo-section">
        <img src={emailIcon} alt="Logo" className="logo" />
        {!isCollapsed && <h4 className="app-name">Keels</h4>}
      </div>

      <button onClick={toggleSidebar} className="toggle-btn">
        <span className="material-icons">{isCollapsed ? 'menu_open' : 'menu'}</span>
      </button>

      <div className="sidebar">
        <a href="/home" data-tooltip="Dashboard">
          <span className="material-icons">home</span>
          {!isCollapsed && <h3 className="item-label">Home</h3>}
        </a>

        {/* Dynamically render role-specific links */}
        {links.map((link, index) => (
          <a key={index} href={link.href} data-tooltip={link.name}>
            <span className="material-icons">{link.icon}</span>
            {!isCollapsed && <h3 className="item-label">{link.name}</h3>}
          </a>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
