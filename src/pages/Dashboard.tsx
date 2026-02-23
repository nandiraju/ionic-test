import React, { useState } from 'react';
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
} from '@ionic/react';
import { add, moon, sunny, book, trash } from 'ionicons/icons';
import { useBooklets } from '../contexts/BookletContext';
import { useHistory } from 'react-router-dom';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { booklets, addBooklet, deleteBooklet } = useBooklets();
  const [showModal, setShowModal] = useState(false);
  const [newBookletName, setNewBookletName] = useState('');
  const [isDark, setIsDark] = useState(document.body.classList.contains('ion-palette-dark'));
  const history = useHistory();

  const toggleDarkMode = () => {
    const isDarkNow = document.body.classList.toggle('ion-palette-dark');
    setIsDark(isDarkNow);
  };

  const handleCreate = () => {
    if (newBookletName.trim()) {
      const id = addBooklet(newBookletName);
      setNewBookletName('');
      setShowModal(false);
      history.push(`/booklet/${id}`);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Medical Booklets</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={toggleDarkMode}>
              <IonIcon slot="icon-only" icon={isDark ? sunny : moon} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">

        {booklets.length === 0 ? (
          <div className="empty-state">
            <p>No booklets yet. Tap + to create one.</p>
          </div>
        ) : (
          <IonList>
            {booklets.map((booklet) => (
              <IonItemSliding key={booklet.id}>
                <IonItem routerLink={`/booklet/${booklet.id}`} detail={true}>
                  <IonLabel>
                    <h2>{booklet.name}</h2>
                    <p>{new Date(booklet.createdAt).toLocaleDateString()}</p>
                  </IonLabel>
                  <IonBadge slot="end" color="secondary">
                    {booklet.pages.length} Pages
                  </IonBadge>
                </IonItem>
                <IonItemOptions side="end">
                  <IonItemOption color="danger" onClick={() => deleteBooklet(booklet.id)}>
                    <IonIcon slot="icon-only" icon={trash} />
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            ))}
          </IonList>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} initialBreakpoint={0.5} breakpoints={[0, 0.5, 0.75]}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Create New Booklet</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonItem className="ion-margin-bottom custom-input-item">
              <IonIcon slot="start" icon={book} color="primary" />
              <IonLabel position="stacked">Booklet Name</IonLabel>
              <IonInput
                placeholder="e.g. Health Records 2024"
                value={newBookletName}
                onIonInput={(e) => setNewBookletName(e.detail.value!)}
                maxlength={40}
                counter={true}
              />
            </IonItem>
            <div className="ion-margin-top">
              <IonButton expand="block" onClick={handleCreate} disabled={!newBookletName.trim()}>
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
