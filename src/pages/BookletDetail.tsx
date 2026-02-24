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
  useIonAlert,
} from '@ionic/react';
import { 
  camera, 
  trash, 
  images, 
  add, 
  moon, 
  sunny, 
  chevronBack, 
  eye 
} from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';
import { useBooklets } from '../contexts/BookletContext';
import { Camera } from 'lucide-react';
import './BookletDetail.css';

const BookletDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getBooklet, addPageToBooklet, deletePage } = useBooklets();
  const booklet = getBooklet(id);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [presentAlert] = useIonAlert();
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showAddAction, setShowAddAction] = useState(false);
  const [isDark, setIsDark] = useState(document.body.classList.contains('ion-palette-dark'));
  const history = useHistory();

  const toggleDarkMode = () => {
    const isDarkNow = document.body.classList.toggle('ion-palette-dark');
    setIsDark(isDarkNow);
  };

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
    <IonPage className="cosmos-theme">
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': 'transparent' }}>
          <IonButtons slot="start">
            <IonButton onClick={() => history.push('/dashboard')} className="back-btn">
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

        {/* Booklet Title Section */}
        <div className="booklet-info-section">
          <h1>{booklet.name}</h1>
          <p>{booklet.pages.length} Pages • Medicine Registry</p>
        </div>

        {/* Captured Pages Grid */}
        <div className="section-label">CAPTURED PAGES</div>
        
        <IonGrid className="ion-no-padding">
          <IonRow>
            {booklet.pages.length === 0 ? (
              <IonCol size="12">
                <div className="cosmos-empty-state">
                  <div className="icon-container">
                    <Camera size={48} />
                  </div>
                  <h2>No Pages Captured</h2>
                  <p>Start building your booklet by taking photos of medical documents or uploading from your gallery.</p>
                </div>
              </IonCol>
            ) : (
              booklet.pages.map((page) => (
                <IonCol size="6" size-md="4" size-lg="3" size-xl="2" key={page.id} className="ion-padding-tiny">
                  <div className="cosmos-card page-card">
                    <div className="page-img-container" onClick={() => setSelectedPageId(page.id)}>
                      <IonImg src={page.image} />
                      <div className="page-overlay">
                        <IonIcon icon={eye} />
                      </div>
                    </div>
                    <div className="page-card-actions">
                      <IonButton 
                        fill="clear" 
                        color="danger" 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          presentAlert({
                            header: 'Delete Image?',
                            message: 'Are you sure you want to remove this captured page? This cannot be undone.',
                            buttons: [
                              { text: 'Cancel', role: 'cancel' },
                              {
                                text: 'Delete',
                                role: 'destructive',
                                handler: () => {
                                  deletePage(id, page.id);
                                }
                              }
                            ]
                          });
                        }}
                      >
                        <IonIcon slot="icon-only" icon={trash} />
                      </IonButton>
                      <span className="page-label">Page {booklet.pages.indexOf(page) + 1}</span>
                    </div>
                  </div>
                </IonCol>
              ))
            )}
          </IonRow>
        </IonGrid>

        <IonFab vertical="bottom" horizontal="end" slot="fixed" className="vibrant-fab">
          <IonFabButton onClick={() => setShowAddAction(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleCapture}
        />

        <IonActionSheet
          isOpen={showAddAction}
          onDidDismiss={() => setShowAddAction(false)}
          header="Add Page"
          className="cosmos-action-sheet"
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

        {/* Full Image Preview Modal */}
        <IonModal 
          isOpen={selectedPageId !== null} 
          onDidDismiss={() => setSelectedPageId(null)}
          className="preview-modal"
        >
          <div className="preview-container">
            <IonHeader className="ion-no-border">
              <IonToolbar style={{ '--background': 'transparent' }}>
                <IonButtons slot="end">
                  <IonButton onClick={() => setSelectedPageId(null)} color="light">
                    Close
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding" style={{ '--background': 'black' }}>
              <div className="full-preview-img">
                <IonImg src={booklet.pages.find(p => p.id === selectedPageId)?.image} />
              </div>
            </IonContent>
          </div>
        </IonModal>

        {/* Capture Preview Modal */}
        <IonModal 
          isOpen={previewImage !== null} 
          onDidDismiss={() => setPreviewImage(null)}
          className="preview-modal cosmos-modal"
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Confirm Page</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setPreviewImage(null)}>Cancel</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <div className="preview-img-wrapper">
              <IonImg src={previewImage || ''} />
            </div>
          </IonContent>
          <div className="preview-footer-cosmos ion-padding">
            <IonRow>
              <IonCol size="6">
                <IonButton expand="block" fill="outline" onClick={() => {
                  setPreviewImage(null);
                  triggerCamera();
                }}>Retake</IonButton>
              </IonCol>
              <IonCol size="6">
                <IonButton expand="block" className="vibrant-btn" onClick={acceptCapture}>Accept</IonButton>
              </IonCol>
            </IonRow>
          </div>
        </IonModal>

      </IonContent>
    </IonPage>
  );
};

export default BookletDetail;
