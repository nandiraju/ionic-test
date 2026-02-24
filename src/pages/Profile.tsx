import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonList,
  IonTextarea,
  IonToast,
} from '@ionic/react';
import { chevronBack, saveOutline, personOutline, mailOutline, callOutline, locationOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import IconInput from '../components/IconInput';
import './Profile.css';

const Profile: React.FC = () => {
  const history = useHistory();
  const { profile, updateProfile } = useUser();
  const [formData, setFormData] = useState(profile);
  const [showToast, setShowToast] = useState(false);

  const handleSave = () => {
    updateProfile(formData);
    setShowToast(true);
  };

  return (
    <IonPage className="cosmos-theme">
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': 'transparent' }}>
          <IonButtons slot="start">
            <IonButton onClick={() => history.goBack()} className="back-btn">
              <IonIcon slot="icon-only" icon={chevronBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>Patient Profile</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave} className="vibrant-text-btn">
              Save
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding app-container" scrollY={true}>
        <div className="profile-header">
          <div className="profile-avatar-large">
            <div className="avatar-inner">
              {formData.firstName ? formData.firstName[0].toUpperCase() : 'U'}
            </div>
          </div>
          <h1>Personal Details</h1>
          <p>This information helps us organize your medical records.</p>
        </div>

        <div className="cosmos-form-container">
          <div className="section-label">NAME</div>
          <IconInput
            icon={personOutline}
            placeholder="First Name"
            value={formData.firstName}
            onInput={(v) => setFormData({ ...formData, firstName: v })}
          />

          <IconInput
            icon={personOutline}
            placeholder="Last Name"
            value={formData.lastName}
            onInput={(v) => setFormData({ ...formData, lastName: v })}
          />

          <div className="section-label">CONTACT</div>
          <IconInput
            icon={mailOutline}
            placeholder="Email Address"
            type="email"
            value={formData.email}
            onInput={(v) => setFormData({ ...formData, email: v })}
          />

          <IconInput
            icon={callOutline}
            placeholder="Phone Number"
            type="tel"
            value={formData.phone}
            onInput={(v) => setFormData({ ...formData, phone: v })}
          />

          <div className="section-label">LOCATION</div>
          <IconInput
            icon={locationOutline}
            placeholder="Home Address"
            textarea={true}
            rows={4}
            value={formData.address}
            onInput={(v) => setFormData({ ...formData, address: v })}
          />
        </div>

        <div className="ion-margin-top ion-padding-bottom">
          <IonButton expand="block" className="vibrant-btn" onClick={handleSave}>
            <IonIcon slot="start" icon={saveOutline} />
            Save Profile
          </IonButton>
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Profile updated successfully!"
          duration={2000}
          color="success"
          className="cosmos-toast"
        />
      </IonContent>
    </IonPage>
  );
};

export default Profile;
