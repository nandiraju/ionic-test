import React, { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal,
  IonButton,
  IonInput,
  IonItemDivider,
  IonButtons,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonImg,
} from "@ionic/react";
import { add, moon, sunny, bookOutline, trash, chevronBack } from "ionicons/icons";
import { useBooklets } from "../contexts/BookletContext";
import { useUser } from "../contexts/UserContext";
import { useHistory } from "react-router-dom";
import { Library } from 'lucide-react';
import IconInput from "../components/IconInput";
import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const { booklets, addBooklet, deleteBooklet } = useBooklets();
  const { profile } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [newBookletName, setNewBookletName] = useState("");
  const [isDark, setIsDark] = useState(true); // Default to dark for this aesthetic
  const history = useHistory();

  const toggleDarkMode = () => {
    const isDarkNow = document.body.classList.toggle("ion-palette-dark");
    setIsDark(isDarkNow);
  };

  const handleCreate = () => {
    if (newBookletName.trim()) {
      const id = addBooklet(newBookletName);
      setNewBookletName("");
      setShowModal(false);
      history.push(`/booklet/${id}`);
    }
  };

  return (
    <IonPage className="cosmos-theme">
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': 'transparent' }}>
          <IonButtons slot="start">
            <IonButton onClick={() => history.push('/home')} className="back-btn">
              <IonIcon slot="icon-only" icon={chevronBack} />
            </IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={toggleDarkMode} className="theme-toggle-btn">
              <IonIcon slot="icon-only" icon={isDark ? sunny : moon} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding app-container" scrollY={true}>

        {/* Greeting Section */}
        <div className="greeting-section">
          <h1>What's up, {profile.firstName || 'User'}!</h1>
        </div>

        {/* Booklets List Toggle Section */}
        <div className="section-label">YOUR BOOKLETS</div>

        {booklets.length === 0 ? (
          <div className="cosmos-empty-state">
            <div className="icon-container">
              <Library size={48} />
            </div>
            <h2>No Booklets Found</h2>
            <p>Your collection is currently empty. Tap the button below to start organizing your medical records.</p>
          </div>
        ) : (
          <div className="booklet-list">
            {booklets.map((booklet) => (
              <IonItemSliding key={booklet.id} className="booklet-sliding-item">
                <IonItem
                  routerLink={`/booklet/${booklet.id}`}
                  detail={false}
                  lines="none"
                  className="booklet-list-item"
                >
                  <div className="item-status-icon">
                    <IonIcon icon={bookOutline} />
                  </div>
                  <IonLabel>
                    <h2>{booklet.name}</h2>
                    <p>
                      {booklet.pages.length} Pages •{" "}
                      {new Date(booklet.createdAt).toLocaleDateString()}
                    </p>
                  </IonLabel>
                </IonItem>
                <IonItemOptions side="end">
                  <IonItemOption
                    color="danger"
                    onClick={() => deleteBooklet(booklet.id)}
                  >
                    <IonIcon slot="icon-only" icon={trash} />
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            ))}
          </div>
        )}

        <IonFab
          vertical="bottom"
          horizontal="end"
          slot="fixed"
          className="vibrant-fab"
        >
          <IonFabButton onClick={() => setShowModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonModal
          isOpen={showModal}
          onDidDismiss={() => setShowModal(false)}
          initialBreakpoint={0.5}
          breakpoints={[0, 0.5, 0.75]}
          className="cosmos-modal"
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Create New Booklet</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <div className="cosmos-form-container">
              <IconInput
                icon={bookOutline}
                placeholder="Booklet Name (e.g. Health Records 2024)"
                value={newBookletName}
                onInput={(v) => setNewBookletName(v)}
                maxlength={40}
                counter={true}
              />
            </div>
            
            <div className="ion-margin-top ion-padding-bottom">
              <IonButton
                expand="block"
                onClick={handleCreate}
                disabled={!newBookletName.trim()}
                className="vibrant-btn"
              >
                Create Booklet
              </IonButton>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
