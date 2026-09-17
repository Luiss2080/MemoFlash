import { Modal } from './Modal';
import { useState } from 'react';
import { User, Save } from 'lucide-react';
import { getDict } from '../utils/i18n';

const AVATARS = ['👽', '👻', '🤖', '👾', '🚀', '⭐', '🔥', '👑'];

export function ProfileModal({ isOpen, onClose, profile, setProfile, lang }) {
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar);
  const t = getDict(lang);

  const handleSave = () => {
    setProfile({ name, avatar });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.profile}>
      <div className="profile-edit">
        <div className="form-group">
          <label><User size={16}/> {t.player_name}</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            className="styled-input w-full"
            maxLength={12}
          />
        </div>
        <div className="form-group mt-4">
          <label>{t.choose_avatar}</label>
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
        <button className="btn-primary flex-center w-full mt-6" onClick={handleSave}>
          <Save size={18}/> {t.save_profile}
        </button>
      </div>
    </Modal>
  );
}
