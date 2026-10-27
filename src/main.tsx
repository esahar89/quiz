import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { installStaticHostApiFallback } from './utils/apiFallback.ts';

installStaticHostApiFallback();

createRoot(document.getElementById('root')!).render(<App />);
