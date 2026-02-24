import React, { useState } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonButton, 
  IonIcon, 
  IonText,
  IonButtons,
  IonHeader,
  IonToolbar,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { LayoutGrid, User, ArrowRight, Moon, Sun } from 'lucide-react';
import './Home.css';

const Home: React.FC = () => {
  const history = useHistory();
  const { profile } = useUser();
  const [isDark, setIsDark] = useState(document.body.classList.contains('ion-palette-dark'));

  const toggleDarkMode = () => {
    const isDarkNow = document.body.classList.toggle('ion-palette-dark');
    setIsDark(isDarkNow);
  };

  return (
    <IonPage className="cosmos-theme">
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <div className="home-top-header">
            <div className="branding">
              <IonText className="brand-name">&nbsp;&nbsp;Patient Booklet</IonText>
            </div>
            <IonButtons>
              <IonButton onClick={toggleDarkMode} className="theme-toggle-home">
                {isDark ? <Sun size={24} /> : <Moon size={24} />}
              </IonButton>
            </IonButtons>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="welcome-container" fullscreen>
        <div className="welcome-content">

          <div className="hero-text">
            <h1>{profile.firstName ? `Hello, ${profile.firstName}` : 'Your health'},<br /><span>organized.</span></h1>
            <p>A premium clinical experience for managing your medical booklets and health records with ease.</p>
          </div>

          <div className="action-grid">
            <div className="action-card" onClick={() => history.push('/profile')}>
              <div className="icon-wrapper secondary">
                <User size={32} />
              </div>
              <div className="card-info">
                <h3>Your Profile</h3>
                <p>Manage account settings</p>
              </div>
              <ArrowRight className="chevron" size={20} />
            </div>

            <div className="action-card" onClick={() => history.push('/dashboard')}>
              <div className="icon-wrapper primary">
                <LayoutGrid size={32} />
              </div>
              <div className="card-info">
                <h3>Image Collection</h3>
                <p>View and manage your booklets</p>
              </div>
              <ArrowRight className="chevron" size={20} />
            </div>
          </div>

          <div className="footer-button">
            <IonButton expand="block" className="get-started-btn" onClick={() => history.push('/dashboard')}>
              Get Started
            </IonButton>
          </div>
        </div>
        
        {/* Background elements */}
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
