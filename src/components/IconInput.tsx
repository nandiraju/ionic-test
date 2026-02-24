import React from 'react';
import { IonItem, IonIcon, IonInput, IonTextarea } from '@ionic/react';
import './IconInput.css';

interface IconInputProps {
  icon: string;
  placeholder: string;
  value: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'password';
  textarea?: boolean;
  rows?: number;
  onInput: (value: string) => void;
  maxlength?: number;
  counter?: boolean;
}

const IconInput: React.FC<IconInputProps> = ({ 
  icon, 
  placeholder, 
  value, 
  type = 'text', 
  textarea = false,
  rows = 3,
  onInput,
  maxlength,
  counter
}) => {
  return (
    <IonItem className="icon-input-item" lines="none">
      <IonIcon slot="start" icon={icon} className="input-icon-outline" />
      {textarea ? (
        <IonTextarea
          value={value}
          placeholder={placeholder}
          rows={rows}
          onIonInput={(e) => onInput(e.detail.value!)}
          maxlength={maxlength}
          counter={counter}
        />
      ) : (
        <IonInput
          type={type}
          value={value}
          placeholder={placeholder}
          onIonInput={(e) => onInput(e.detail.value!)}
          maxlength={maxlength}
          counter={counter}
        />
      )}
    </IonItem>
  );
};

export default IconInput;
