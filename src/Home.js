import Services from "./Services";
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const navArray = [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'Contact-us', path: '/contact' },
        { name: 'Support', path: '/support' }
    ];

    // Function to create navigation items with onClick events
    const navFunc = () => {
        return navArray.map((element, index) => (
            <li key={index} onClick={() => navigate(element.path)} style={{ cursor: 'pointer', margin: '5px' }}>
                {element.name}
            </li>
        ));
    };

    return (
        <div>
            <nav>
                <ul id="nav" style={{ display: 'flex', listStyle: 'none', gap: '15px' }}>
                    {navFunc()}
                </ul>
            </nav>
        </div>
    );
}

export default Home;
