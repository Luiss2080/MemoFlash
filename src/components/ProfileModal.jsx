import { Modal } from './Modal';
import { useState } from 'react';
import { User, Save } from 'lucide-react';

const AVATARS = ['👽', '👻', '🤖', '👾', '🚀', '⭐', '🔥', '👑'];

export function ProfileModal({ isOpen, onClose, profile, setProfile }) {
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar);

  const handleSave = () => {
    setProfile({ name, avatar });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Perfil">
      <div className="profile-edit">
        <div className="form-group">
          <label><User size={16}/> Nombre de Jugador</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            className="styled-input w-full"
            maxLength={12}
          />
        </div>
        <div className="form-group mt-4">
          <label>Elige tu Avatar</label>
          <div className="avatar-grid mt-2">
            {AVATARS.map(a => (
              <button 
                key={a} 
                className={`avatar-btn ${avatar === a ? 'selected' : ''}`}
                onClick={() => setAvatar(a)}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
        <button className="btn-primary flex-center w-full mt-6" onClick={handleSave} style={{width: '100%'}}>
          <Save size={18}/> Guardar Perfil
        </button>
      </div>
    </Modal>
  );
}
