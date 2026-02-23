import React, { useRef, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonFab,
  IonFabButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonButton,
  IonModal,
  IonActionSheet,
} from '@ionic/react';
import { camera, trash } from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';
import { useBooklets } from '../contexts/BookletContext';
import './BookletDetail.css';

const BookletDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getBooklet, addPageToBooklet, deletePage } = useBooklets();
  const booklet = getBooklet(id);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  if (!booklet) {
    return (
      <IonPage>
        <IonContent>
          <div className="empty-state">
            <p>Booklet not found.</p>
            <IonButton routerLink="/dashboard">Back to Dashboard</IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const handleCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const acceptCapture = () => {
    if (previewImage) {
      addPageToBooklet(id, previewImage);
      setPreviewImage(null);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/dashboard" />
          </IonButtons>
          <IonTitle>{booklet.name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{booklet.name}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonGrid>
          <IonRow>
            {booklet.pages.map((page) => (
              <IonCol size="6" sizeMd="4" sizeLg="3" key={page.id}>
                <IonCard className="page-card" onClick={() => setSelectedPageId(page.id)}>
                  <IonImg src={page.image} />
                  <div className="page-number">{page.order + 1}</div>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        {booklet.pages.length === 0 && (
          <div className="empty-state">
            <p>No pages captured yet.</p>
            <p>Tap the camera icon to start.</p>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleCapture}
        />

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => fileInputRef.current?.click()}>
            <IonIcon icon={camera} />
          </IonFabButton>
        </IonFab>

        <IonModal isOpen={!!previewImage} onDidDismiss={() => setPreviewImage(null)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Preview Captured Page</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <div className="preview-container">
              {previewImage && <IonImg src={previewImage} />}
            </div>
            <IonRow className="ion-margin-top">
              <IonCol size="6">
                <IonButton expand="block" color="medium" onClick={() => setPreviewImage(null)}>
                  Retake
                </IonButton>
              </IonCol>
              <IonCol size="6">
                <IonButton expand="block" color="success" onClick={acceptCapture}>
                  Accept
                </IonButton>
              </IonCol>
            </IonRow>
          </IonContent>
        </IonModal>

        <IonActionSheet
          isOpen={!!selectedPageId}
          onDidDismiss={() => setSelectedPageId(null)}
          header="Page Options"
          buttons={[
            {
              text: 'Delete Page',
              role: 'destructive',
              icon: trash,
              handler: () => {
                if (selectedPageId) {
                  deletePage(id, selectedPageId);
                }
              },
            },
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                setSelectedPageId(null);
              },
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default BookletDetail;
