import { useState } from 'react';
import { playSound } from '../utils/soundManager.js';

const ALL_COLORS = [
  {
    id: 'red',
    name: 'Red',
    hex: '#E31837',
    glowHex: 'rgba(227, 24, 55, 0.4)',
    bgCard: 'rgba(227, 24, 55, 0.04)',
    borderActive: 'rgba(227, 24, 55, 0.5)',
    gradient: 'linear-gradient(135deg, #FF4D6D 0%, #E31837 50%, #99001A 100%)',
    tagBg: 'rgba(227, 24, 55, 0.15)',
    tagText: '#FFA3B0',
    titleTag: 'Ruby Vanguard',
    icon: 'shield',
  },
  {
    id: 'yellow',
    name: 'Yellow',
    hex: '#FFD100',
    glowHex: 'rgba(255, 209, 0, 0.4)',
    bgCard: 'rgba(255, 209, 0, 0.04)',
    borderActive: 'rgba(255, 209, 0, 0.5)',
    gradient: 'linear-gradient(135deg, #FFE866 0%, #FFD100 50%, #B8860B 100%)',
    tagBg: 'rgba(255, 209, 0, 0.15)',
    tagText: '#FFE866',
    titleTag: 'Sun Amber Strategist',
    icon: 'casino',
  },
  {
    id: 'navy',
    name: 'Navy Blue',
    hex: '#4169E1',
    glowHex: 'rgba(65, 105, 225, 0.45)',
    bgCard: 'rgba(46, 43, 107, 0.12)',
    borderActive: 'rgba(65, 105, 225, 0.5)',
    gradient: 'linear-gradient(135deg, #6B8AFF 0%, #4169E1 50%, #1E1B4B 100%)',
    tagBg: 'rgba(65, 105, 225, 0.18)',
    tagText: '#A8C0FF',
    titleTag: 'Royal Cobalt Tactician',
    icon: 'military_tech',
  },
  {
    id: 'orange',
    name: 'Orange',
    hex: '#F36E21',
    glowHex: 'rgba(243, 110, 33, 0.5)',
    bgCard: 'rgba(243, 110, 33, 0.05)',
    borderActive: 'rgba(243, 110, 33, 0.6)',
    gradient: 'linear-gradient(135deg, #FF9248 0%, #F36E21 50%, #B84300 100%)',
    tagBg: 'rgba(243, 110, 33, 0.18)',
    tagText: '#FFBE93',
    titleTag: 'Solar Blaze Grandmaster',
    icon: 'emoji_events',
  },
];

export default function RegistrationScreen({ onContinue }) {
  const [playerCount, setPlayerCount] = useState(4);
  const [formData, setFormData] = useState(
    ALL_COLORS.map(c => ({ 
      color: c.name, 
      colorHex: c.hex, 
      name: '', 
      org: '', 
      phone: '' 
    }))
  );
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  const handlePlayerCountChange = (count) => {
    try { playSound('move'); } catch (_) {}
    setPlayerCount(count);
    // Clear errors beyond count
    setErrors(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(k => {
        const idx = parseInt(k.split('-')[0], 10);
        if (idx >= count) delete updated[k];
      });
      return updated;
    });
  };

  const handleColorChange = (index, newColorName) => {
    const selectedColorObj = ALL_COLORS.find(c => c.name === newColorName);
    if (!selectedColorObj) return;

    const existingIndex = formData.findIndex((p, i) => i < playerCount && i !== index && p.color === newColorName);
    const newFormData = [...formData];
    
    if (existingIndex !== -1) {
      const currentColorObj = ALL_COLORS.find(c => c.name === newFormData[index].color);
      newFormData[existingIndex].color = currentColorObj.name;
      newFormData[existingIndex].colorHex = currentColorObj.hex;
    }

    newFormData[index].color = selectedColorObj.name;
    newFormData[index].colorHex = selectedColorObj.hex;
    setFormData(newFormData);
  };

  const handleChange = (index, field, value) => {
    const newFormData = [...formData];
    newFormData[index][field] = value;
    setFormData(newFormData);

    if (errors[`${index}-${field}`]) {
      setErrors(prev => ({ ...prev, [`${index}-${field}`]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    let isValid = true;

    const activePlayers = formData.slice(0, playerCount);

    activePlayers.forEach((player, index) => {
      if (!player.name.trim()) {
        newErrors[`${index}-name`] = 'Full name is required';
        isValid = false;
      }
      if (!player.org.trim()) {
        newErrors[`${index}-org`] = 'Organisation is required';
        isValid = false;
      }
      if (!/^\d{10}$/.test(player.phone.trim())) {
        newErrors[`${index}-phone`] = 'Enter valid 10-digit number';
        isValid = false;
      }
    });

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    try { playSound('move'); } catch (_) {}

    const finalPlayers = activePlayers.map(p => ({
      color: p.color,
      name: p.name.trim(),
      org: p.org.trim(),
      phone: p.phone.trim(),
      position: 0,
      rank: null
    }));

    onContinue(finalPlayers);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 0%, #1a1642 0%, #0d0c1c 70%, #07060e 100%)',
      color: '#e4e0f7',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      paddingBottom: '4rem',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Background Ambient Orbs */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '15%',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(243, 110, 33, 0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
        filter: 'blur(60px)',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(0, 219, 233, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
        filter: 'blur(70px)',
        zIndex: 0
      }} />

      {/* Top Navigation Bar with NSE Logo and Slogan */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(19, 18, 34, 0.85)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '0.85rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
      }}>
        {/* NSE Logo & Game Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* NSE Logo in elevated clean container */}
          <div style={{
            backgroundColor: '#ffffff',
            padding: '6px 14px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <img 
              src="/nse-logo.png" 
              alt="NSE Logo" 
              style={{ height: '34px', width: 'auto', display: 'block', objectFit: 'contain' }} 
            />
          </div>

          <div>
            <span style={{ 
              fontFamily: "'Outfit', sans-serif", 
              fontWeight: 800, 
              fontSize: '1.35rem', 
              letterSpacing: '-0.02em',
              background: 'linear-gradient(90deg, #FFFFFF 0%, #E4E0F7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Invest Safe Ludo
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '1px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#F36E21', display: 'inline-block' }}></span>
              <span style={{ fontSize: '0.75rem', color: '#F36E21', fontWeight: 700, letterSpacing: '0.04em' }}>
                NSE Investor Awareness Initiative
              </span>
            </div>
          </div>
        </div>

        {/* NSE Slogan Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: 'linear-gradient(135deg, rgba(243, 110, 33, 0.15) 0%, rgba(46, 43, 107, 0.4) 100%)',
          padding: '0.55rem 1.25rem',
          borderRadius: '9999px',
          border: '1px solid rgba(243, 110, 33, 0.4)',
          boxShadow: '0 0 15px rgba(243, 110, 33, 0.2)'
        }}>
          <span className="material-symbols-outlined" style={{ color: '#F36E21', fontSize: '20px' }}>psychology</span>
          <span style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
            fontSize: '0.95rem',
            color: '#FFFFFF',
            letterSpacing: '0.02em'
          }}>
            "Soch Kar, Samajh Kar, Invest Kar"
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '2.5rem 1.5rem', position: 'relative', zIndex: 1 }}>
        
        {/* Header Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginBottom: '2.5rem'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#F36E21',
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
            background: 'rgba(243, 110, 33, 0.12)',
            padding: '0.35rem 0.95rem',
            borderRadius: '9999px',
            border: '1px solid rgba(243, 110, 33, 0.25)'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>sports_esports</span>
            <span>Player Registration</span>
          </div>

          <h1 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '2.75rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#FFFFFF',
            margin: '0 0 0.5rem 0',
            lineHeight: 1.15
          }}>
            Enter Player Details
          </h1>
          <p style={{
            color: '#A0AEC0',
            fontSize: '1.05rem',
            maxWidth: '640px',
            margin: '0 0 2rem 0',
            lineHeight: 1.5
          }}>
            Choose the number of players (2 to 4), customize token colors, and start learning safe investing habits.
          </p>

          {/* Player Count Selector */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#C3C0FF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Select Number of Players
            </span>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(13, 12, 28, 0.85)',
              padding: '6px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.6), 0 10px 25px rgba(0, 0, 0, 0.3)',
              gap: '6px'
            }}>
              {[2, 3, 4].map((count) => {
                const isSelected = playerCount === count;
                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => handlePlayerCountChange(count)}
                    style={{
                      padding: '0.65rem 1.65rem',
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '0.95rem',
                      fontWeight: isSelected ? 800 : 600,
                      borderRadius: '14px',
                      border: 'none',
                      backgroundColor: isSelected ? '#F36E21' : 'transparent',
                      backgroundImage: isSelected ? 'linear-gradient(135deg, #F36E21 0%, #FF8A3D 100%)' : 'none',
                      color: isSelected ? '#ffffff' : '#8E8AA7',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 0 20px rgba(243, 110, 33, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)' : 'none',
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem'
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                      {count === 2 ? 'group' : count === 3 ? 'groups' : 'diversity_3'}
                    </span>
                    <span>{count} Players</span>
                  </button>
                );
              })}
            </div>

            {/* Slogan Banner Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.45rem 1.25rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(31, 30, 47, 0.7)',
              border: '1px solid rgba(243, 110, 33, 0.25)',
              fontSize: '0.85rem',
              color: '#FFBE93',
              marginTop: '0.5rem'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#F36E21' }}>verified</span>
              <span style={{ fontWeight: 600 }}>Dodge The Scams · Trust The Safeguards · Race To Financial Freedom</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit}>
          {/* Dynamic Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: playerCount === 2 
              ? 'repeat(auto-fit, minmax(360px, 1fr))' 
              : playerCount === 3 
                ? 'repeat(auto-fit, minmax(320px, 1fr))' 
                : 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2.5rem'
          }}>
            {formData.slice(0, playerCount).map((player, index) => {
              const colorInfo = ALL_COLORS.find(c => c.name === player.color) || ALL_COLORS[0];
              const isHost = index === 0;

              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: 'rgba(26, 24, 52, 0.75)',
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${colorInfo.borderActive}`,
                    borderRadius: '20px',
                    padding: '1.5rem',
                    boxShadow: `0 20px 40px -10px rgba(5, 4, 15, 0.7), 0 0 25px -8px ${colorInfo.glowHex}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Card Top Illuminated Stripe */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: colorInfo.gradient
                  }} />

                  <div>
                    {/* Header: Player badge */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1.25rem'
                    }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '0.3rem 0.75rem',
                        borderRadius: '9999px',
                        backgroundColor: colorInfo.tagBg,
                        border: `1px solid ${colorInfo.borderActive}`,
                        color: colorInfo.tagText,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        fontFamily: "'Inter', sans-serif",
                        letterSpacing: '0.04em'
                      }}>
                        <span style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          backgroundColor: colorInfo.hex,
                          boxShadow: `0 0 6px ${colorInfo.hex}`
                        }} />
                        <span>Player {index + 1}</span>
                      </div>

                      <span
                        className="material-symbols-outlined"
                        style={{
                          color: isHost ? '#FBBF24' : '#10B981',
                          fontSize: '20px'
                        }}
                        title={isHost ? 'Player 1' : 'Player slot'}
                      >
                        {isHost ? 'military_tech' : 'check_circle'}
                      </span>
                    </div>

                    {/* Avatar & Token Hero Section */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.9rem',
                      padding: '0.85rem',
                      borderRadius: '16px',
                      backgroundColor: 'rgba(13, 12, 28, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      marginBottom: '1.5rem'
                    }}>
                      {/* 3D Circular Token */}
                      <div style={{
                        position: 'relative',
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        background: colorInfo.gradient,
                        padding: '2px',
                        boxShadow: `0 8px 18px ${colorInfo.glowHex}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <div style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          backgroundColor: '#0d0c1c',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `1px solid ${colorInfo.borderActive}`
                        }}>
                          <span
                            className="material-symbols-outlined"
                            style={{ color: colorInfo.hex, fontSize: '24px' }}
                          >
                            {colorInfo.icon}
                          </span>
                        </div>
                        <div style={{
                          position: 'absolute',
                          bottom: '-2px',
                          right: '-2px',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: colorInfo.gradient,
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          border: '2px solid #0d0c1c'
                        }}>
                          {index + 1}
                        </div>
                      </div>

                      {/* Name preview & role title */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          margin: 0,
                          fontFamily: "'Outfit', sans-serif",
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          color: '#ffffff',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {player.name.trim() ? player.name : `Player ${index + 1}`}
                        </p>
                        <p style={{
                          margin: '2px 0 0 0',
                          fontSize: '0.78rem',
                          color: colorInfo.tagText,
                          fontWeight: 500
                        }}>
                          {colorInfo.name} Token
                        </p>
                      </div>

                      {/* Quick Color Switcher Dropdown */}
                      <div>
                        <select
                          value={player.color}
                          onChange={(e) => handleColorChange(index, e.target.value)}
                          style={{
                            padding: '0.35rem 0.65rem',
                            borderRadius: '10px',
                            backgroundColor: 'rgba(26, 24, 52, 0.95)',
                            border: `1px solid ${colorInfo.borderActive}`,
                            color: '#ffffff',
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            outline: 'none'
                          }}
                        >
                          {ALL_COLORS.map(c => (
                            <option key={c.id} value={c.name} style={{ backgroundColor: '#131222', color: '#fff' }}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Inputs Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      
                      {/* Name Input */}
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: '#E4E0F7',
                          marginBottom: '0.35rem',
                          marginLeft: '2px'
                        }}>
                          Full Name *
                        </label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <span className="material-symbols-outlined" style={{
                            position: 'absolute',
                            left: '12px',
                            color: focusedField === `${index}-name` ? colorInfo.hex : '#9CA3AF',
                            fontSize: '18px',
                            pointerEvents: 'none',
                            transition: 'color 0.2s'
                          }}>
                            person
                          </span>
                          <input
                            type="text"
                            value={player.name}
                            onChange={(e) => handleChange(index, 'name', e.target.value)}
                            onFocus={() => setFocusedField(`${index}-name`)}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Enter player name"
                            style={{
                              width: '100%',
                              padding: '0.75rem 0.85rem 0.75rem 2.4rem',
                              backgroundColor: 'rgba(13, 12, 28, 0.85)',
                              border: errors[`${index}-name`] 
                                ? '1.5px solid #EF4444' 
                                : focusedField === `${index}-name` 
                                  ? `1.5px solid ${colorInfo.hex}` 
                                  : '1px solid rgba(255, 255, 255, 0.15)',
                              borderRadius: '12px',
                              color: '#ffffff',
                              fontSize: '0.95rem',
                              fontWeight: 500,
                              outline: 'none',
                              boxShadow: focusedField === `${index}-name` ? `0 0 12px ${colorInfo.glowHex}` : 'none',
                              transition: 'all 0.2s'
                            }}
                          />
                        </div>
                        {errors[`${index}-name`] && (
                          <span style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '4px', display: 'block', fontWeight: 600 }}>
                            {errors[`${index}-name`]}
                          </span>
                        )}
                      </div>

                      {/* Organisation Input */}
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: '#E4E0F7',
                          marginBottom: '0.35rem',
                          marginLeft: '2px'
                        }}>
                          Organisation / Club *
                        </label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <span className="material-symbols-outlined" style={{
                            position: 'absolute',
                            left: '12px',
                            color: focusedField === `${index}-org` ? colorInfo.hex : '#9CA3AF',
                            fontSize: '18px',
                            pointerEvents: 'none',
                            transition: 'color 0.2s'
                          }}>
                            business
                          </span>
                          <input
                            type="text"
                            value={player.org}
                            onChange={(e) => handleChange(index, 'org', e.target.value)}
                            onFocus={() => setFocusedField(`${index}-org`)}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Enter organisation"
                            style={{
                              width: '100%',
                              padding: '0.75rem 0.85rem 0.75rem 2.4rem',
                              backgroundColor: 'rgba(13, 12, 28, 0.85)',
                              border: errors[`${index}-org`] 
                                ? '1.5px solid #EF4444' 
                                : focusedField === `${index}-org` 
                                  ? `1.5px solid ${colorInfo.hex}` 
                                  : '1px solid rgba(255, 255, 255, 0.15)',
                              borderRadius: '12px',
                              color: '#ffffff',
                              fontSize: '0.95rem',
                              fontWeight: 500,
                              outline: 'none',
                              boxShadow: focusedField === `${index}-org` ? `0 0 12px ${colorInfo.glowHex}` : 'none',
                              transition: 'all 0.2s'
                            }}
                          />
                        </div>
                        {errors[`${index}-org`] && (
                          <span style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '4px', display: 'block', fontWeight: 600 }}>
                            {errors[`${index}-org`]}
                          </span>
                        )}
                      </div>

                      {/* Phone Input */}
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: '#E4E0F7',
                          marginBottom: '0.35rem',
                          marginLeft: '2px'
                        }}>
                          Phone Number (10 Digits) *
                        </label>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <span className="material-symbols-outlined" style={{
                            position: 'absolute',
                            left: '12px',
                            color: focusedField === `${index}-phone` ? colorInfo.hex : '#9CA3AF',
                            fontSize: '18px',
                            pointerEvents: 'none',
                            transition: 'color 0.2s'
                          }}>
                            call
                          </span>
                          <input
                            type="text"
                            maxLength={10}
                            value={player.phone}
                            onChange={(e) => handleChange(index, 'phone', e.target.value.replace(/\D/g, ''))}
                            onFocus={() => setFocusedField(`${index}-phone`)}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Enter 10-digit phone"
                            style={{
                              width: '100%',
                              padding: '0.75rem 0.85rem 0.75rem 2.4rem',
                              backgroundColor: 'rgba(13, 12, 28, 0.85)',
                              border: errors[`${index}-phone`] 
                                ? '1.5px solid #EF4444' 
                                : focusedField === `${index}-phone` 
                                  ? `1.5px solid ${colorInfo.hex}` 
                                  : '1px solid rgba(255, 255, 255, 0.15)',
                              borderRadius: '12px',
                              color: '#ffffff',
                              fontSize: '0.95rem',
                              fontWeight: 500,
                              outline: 'none',
                              boxShadow: focusedField === `${index}-phone` ? `0 0 12px ${colorInfo.glowHex}` : 'none',
                              transition: 'all 0.2s'
                            }}
                          />
                        </div>
                        {errors[`${index}-phone`] && (
                          <span style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '4px', display: 'block', fontWeight: 600 }}>
                            {errors[`${index}-phone`]}
                          </span>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* Card Bottom Swatch Status */}
                  <div style={{
                    marginTop: '1.5rem',
                    paddingTop: '0.85rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: colorInfo.hex,
                        boxShadow: `0 0 8px ${colorInfo.hex}`
                      }} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                        Color: {colorInfo.name}
                      </span>
                    </div>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: colorInfo.tagText,
                      backgroundColor: colorInfo.tagBg,
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>check</span>
                      Ready
                    </span>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Launch Action Bar */}
          <div style={{
            borderRadius: '24px',
            backgroundColor: 'rgba(26, 24, 52, 0.85)',
            backdropFilter: 'blur(25px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            padding: '1.5rem 2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px -5px rgba(243, 110, 33, 0.2)',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            flexWrap: 'wrap'
          }}>
            {/* Slogan & Count summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(13, 12, 28, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <span className="material-symbols-outlined" style={{ color: '#F36E21', fontSize: '22px' }}>groups</span>
                </div>
                <div>
                  <p style={{
                    margin: 0,
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    fontSize: '1.35rem',
                    color: '#ffffff',
                    lineHeight: 1
                  }}>
                    {playerCount} Players
                  </p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: '#8E8AA7' }}>
                    Registration Ready
                  </p>
                </div>
              </div>

              <div style={{ height: '36px', width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.5rem 1rem',
                borderRadius: '12px',
                backgroundColor: 'rgba(243, 110, 33, 0.12)',
                border: '1px solid rgba(243, 110, 33, 0.3)',
                color: '#FFBE93',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#F36E21' }}>lightbulb</span>
                <span>"Soch Kar, Samajh Kar, Invest Kar"</span>
              </div>
            </div>

            {/* Launch CTA */}
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #F36E21 0%, #FF8A3D 50%, #E35205 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '16px',
                padding: '1rem 2.75rem',
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.15rem',
                fontWeight: 800,
                letterSpacing: '-0.01em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '0 0 25px rgba(243, 110, 33, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                transition: 'all 0.2s ease',
                flexGrow: 0
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 0 35px rgba(243, 110, 33, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 0 25px rgba(243, 110, 33, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.4)';
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>play_circle</span>
              <span>Start Game ({playerCount} Players)</span>
            </button>
          </div>
        </form>

      </main>
    </div>
  );
}
