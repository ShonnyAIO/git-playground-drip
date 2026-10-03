import { createRoot } from 'react-dom/client';
import '../index.css';
import Lab from './Lab.jsx';

document.documentElement.setAttribute('data-theme', 'dark');
createRoot(document.getElementById('root')).render(<Lab />);
