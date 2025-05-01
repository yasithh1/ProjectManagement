import React from 'react';
import { useNavigate } from 'react-router-dom';
import Tile from '../components/Tile';

function HomePage({ role }) {
  const navigate = useNavigate();
  const tiles = getTilesByRole(role);

  const handleClick = (tile) => {
    switch (tile.name) {
      case 'Registration':
        navigate('/home/registration');
        break;
      case 'Update':
        navigate('/home/update');
        break;
      case 'Remove':
        navigate('/home/remove');
        break;
      case 'Propose Location':
        navigate('/home/propose-location');
        break;
      case 'Map':
        navigate('/home/map');
        break;
      case 'Locations':
        navigate('/home/locations');
        break;
      case 'Proposals':
        navigate('/home/proposals');
        break;
      case 'Contracts':
        navigate('/home/contracts');
        break;
      case 'Salary':
        navigate('/home/salary');
        break;
      case 'Requests':
        navigate('/home/labor-requests');
        break;
      case 'Labor Report':
        navigate('/home/labor-report');
        break;
      case 'Manage Labor':
        navigate('/home/manage-labors');
        break;
      case 'Design Dashboard':
        navigate('/home/design-dashboard');
        break;
      case 'Designs':
        navigate('/home/designs');
        break;
      case 'Assignments':
        navigate('/home/assignments');
        break;
      case 'Complains':
        navigate('/home/Complains');
        break;
      case 'Project Dashboard':
        navigate('/home/project-dashboard');
        break;
      case 'Supporter Requests':
        navigate('/home/supporter-request');
        break;
      case 'Assign Supporters':
        navigate('/home/assign-supporter');
        break;
      case 'Send Procurement Request':
        navigate('/home/send-procurement-request');
        break;
      case 'Manage Designs':
        navigate('/home/manage-designs');
        break;
      case 'Arrange Meeting':
        navigate('/home/arrange-meeting');
        break;
      case 'Assign Designs':
        navigate('/home/assign-designs');
        break;
      case 'Manager Design Dashboard':
        navigate('/home/manager-design-dashboard');
        break;
      case 'Manager Project Dashboard':
        navigate('/home/manager-project-dashboard');
        break;
      case 'Invoices':
        navigate('/home/invoices');
        break;
      case 'Quality Check':
        navigate('/home/quality-check');
        break;
      case 'Assign Projects':
        navigate('/home/assign-project');
        break;
      case 'Project Report':
        navigate('/home/project-report');
        break;
      case 'Design Report':
        navigate('/home/design-report');
        break;
      case 'Contact Supplier':
        navigate('/home/contact-supplier');
        break;
      case 'Manage Complain':
        navigate('/home/manage-complain');
        break;
      case 'Manage Contracts':
        navigate('/home/manage-contracts');
        break;
      case 'View Meetings':
        navigate('/home/view-meeting');
        break;
      case 'IRR Calculator':
        navigate('/home/irr-calculator');
        break;
      case 'Project Resources':
        navigate('/home/project-resources');
      break;
      case 'Manage Supporter':
        navigate('/home/manage-supporter');
      break; 
      case 'Project Details':
        navigate('/home/project-details');
      break;
      default:
        console.error('Unknown tile name:', tile.name);
    }
  };

  return (
    <div className="home-container">
      <div className="tiles-container">
        {tiles.map((tile, index) => (
          <Tile key={index} tile={tile} onClick={() => handleClick(tile)} />
        ))}
      </div>
    </div>
  );
}

// Define tiles based on role
function getTilesByRole(role) {
  switch (role) {
    case 'admin':
      return [
        { name: 'View Meetings', icon: 'event', color: '#90caf9' },
        { name: 'Registration', icon: 'person_add', color: '#a5d6a7' },
        { name: 'Update', icon: 'sync', color: '#ffecb3' },
        { name: 'Remove', icon: 'delete_forever', color: '#ef9a9a' }
      ];
    case 'propertyTeam':
      return [
        { name: 'View Meetings', icon: 'event', color: '#90caf9' },
        { name: 'Propose Location', icon: 'place', color: '#ffe082' },
        { name: 'Map', icon: 'public', color: '#81d4fa' }
      ];
    case 'lawyer':
      return [
        { name: 'View Meetings', icon: 'event', color: '#90caf9' },
        { name: 'Map', icon: 'gavel', color: '#b0bec5' }
      ];
    case 'propertyManager':
      return [
        { name: 'Map', icon: 'location_on', color: '#b39ddb' },
        { name: 'Locations', icon: 'business', color: '#90caf9' },
        { name: 'View Meetings', icon: 'event', color: '#90caf9' },
        { name: 'Proposals', icon: 'description', color: '#c5e1a5' },
        { name: 'Contracts', icon: 'receipt', color: '#ce93d8' }
      ];
    case 'procurementManager':
      return [
        { name: 'View Meetings', icon: 'event', color: '#90caf9' },
        { name: 'Manage Labor', icon: 'supervisor_account', color: '#81d4fa' },
        { name: 'Assign Labor', icon: 'assignment_ind', color: '#ffe082' },
        { name: 'Salary', icon: 'attach_money', color: '#a5d6a7' },
        { name: 'Labor Requests', icon: 'question_answer', color: '#ffccbc' },
        { name: 'Labor Report', icon: 'assessment', color: '#ce93d8' },
        { name: 'Invoices', icon: 'receipt', color: '#ffcc80' }
      ];
    case 'designer':
      return [
        { name: 'View Meetings', icon: 'event', color: '#90caf9' },
        { name: 'Design Dashboard', icon: 'dashboard', color: '#ffcc80' },
        { name: 'Designs', icon: 'palette', color: '#81d4fa' },
        { name: 'Assignments', icon: 'assignment', color: '#ffecb3' },
        { name: 'Map', icon: 'map', color: '#c5e1a5' },
        { name: 'Complains', icon: 'report_problem', color: '#ef9a9a' }
      ];
    case 'engineer':
      return [
        { name: 'View Meetings', icon: 'event', color: '#90caf9' },
        { name: 'Project Dashboard', icon: 'build', color: '#81d4fa' },
        { name: 'Assignments', icon: 'assignment_turned_in', color: '#ffecb3' },
        { name: 'Contact Supplier', icon: 'contact_phone', color: '#ffcc80' },
        { name: 'Complains', icon: 'warning', color: '#ef9a9a' },
        { name: 'Supporter Requests', icon: 'send', color: '#a5d6a7' },
        { name: 'Assign Supporters', icon: 'person_add', color: '#b39ddb' },
        { name: 'Project Resources', icon: 'resource', color: '#ffcc81' },
        { name: 'Manage Supporter', icon: 'manage', color: '#ffcc82' },
        { name: 'Send Procurement Request', icon: 'send', color: '#81d4fa' }
      ];
    case 'designManager':
      return [
        { name: 'View Meetings', icon: 'event', color: '#90caf9' },
        { name: 'Manager Design Dashboard', icon: 'dashboard_customize', color: '#b39ddb' },
        { name: 'Manage Designs', icon: 'layers', color: '#ffe082' },
        { name: 'Arrange Meeting', icon: 'event', color: '#a5d6a7' },
        { name: 'Design Report', icon: 'bar_chart', color: '#81d4fa' },
        { name: 'Manage Complain', icon: 'feedback', color: '#ef9a9a' },
        { name: 'IRR Calculator', icon: 'calculate', color: '#ffcc80' },
        { name: 'Manage Contracts', icon: 'feedback', color: '#ffcc80' }
      ];
    case 'projectManager':
      return [
        { name: 'View Meetings', icon: 'event', color: '#90caf9' },
        { name: 'Manager Project Dashboard', icon: 'dashboard', color: '#81d4fa' },
        { name: 'Quality Check', icon: 'check_circle', color: '#a5d6a7' },
        { name: 'Assign Projects', icon: 'assignment', color: '#ce93d8' },
        { name: 'Manage Complain', icon: 'report', color: '#ef9a9a' },
        { name: 'Project Reports', icon: 'bar_chart', color: '#ffecb3' },
        { name: 'IRR Calculator', icon: 'calculate', color: '#ffcc80' },
        { name: 'Project Details', icon: 'details', color: '#ffcc79' },
        { name: 'Map', icon: 'public', color: '#b39ddb' }
      ];
    default:
      return [];
  }
}

export default HomePage;
