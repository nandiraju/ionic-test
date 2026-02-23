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
import { camera, trash, images, add } from 'ionicons/icons';
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
  const [showAddAction, setShowAddAction] = useState(false);

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

  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200; // Good balance for readability vs size
        const MAX_HEIGHT = 1600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        // Compress to JPEG with 0.7 quality
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    });
  };

  const handleCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result as string;
        const compressed = await compressImage(result);
        setPreviewImage(compressed);
      };
      reader.readAsDataURL(file);
    }
    // Reset input so the same file (if needed) can be picked again
    event.target.value = '';
  };

  const triggerCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  const triggerGallery = () => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute('capture');
      fileInputRef.current.click();
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
      <IonContent className="ion-padding">

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
            <p>Tap the + icon to start.</p>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleCapture}
        />

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowAddAction(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonActionSheet
          isOpen={showAddAction}
          onDidDismiss={() => setShowAddAction(false)}
          header="Add Page"
          buttons={[
            {
              text: 'Take Photo',
              icon: camera,
              handler: triggerCamera,
            },
            {
              text: 'Upload from Gallery',
              icon: images,
              handler: triggerGallery,
            },
            {
              text: 'Cancel',
              role: 'cancel',
            },
          ]}
        />

        <IonModal isOpen={!!previewImage} onDidDismiss={() => setPreviewImage(null)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Preview Captured Page</IonTitle>
            </IonToolbar>
          </IonHeader>
          <div className="preview-modal-wrapper">
            <IonContent className="ion-padding">
              <div className="preview-container">
                {previewImage && <IonImg src={previewImage} />}
              </div>
            </IonContent>
            <div className="preview-footer">
              <IonGrid>
                <IonRow>
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
              </IonGrid>
            </div>
          </div>
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
